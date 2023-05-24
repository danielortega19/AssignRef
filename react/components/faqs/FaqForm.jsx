import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import lookUpService from "services/lookUpService";
import { useEffect } from "react";
import formikVak from "./formikVal";
import "./faq.css";
import faqServices from "../../services/faqServices";
import toastr from "toastr";
import { useLocation, useParams } from "react-router-dom";
import TitleHeader from "components/general/TitleHeader";
function FaqForm() {
  const _logger = debug.extend("faqForm");
  const { state } = useLocation();
  const { questionId } = useParams();

  _logger("this is the param", questionId);
  _logger("location", state);
  const [faqs, setFaqs] = useState({
    question: "",
    answer: "",
    categoryId: "",
    sortOrder: 0,
  });
  const [faqId, setFaqId] = useState();
  const [category, setCategory] = useState();
  const lookUpTables = ["FAQCategory"];

  useEffect(() => {
    if (state?.type === "FAQDATA" && state.payload) {
      let data = state.payload;

      setFaqs((prevState) => {
        const copyState = { ...prevState };
        copyState.answer = data.answer;
        copyState.categoryId = data.category.id;
        copyState.question = data.question;

        return copyState;
      });
    }

    setFaqId(() => questionId);
    lookUpService.lookUp(lookUpTables).then(lookUpSuccess).catch(lookUpError);
  }, []);

  const lookUpSuccess = (response) => {
    let data = response.item.faqCategory;
    function mapOptions(obj) {
      return (
        <option key={obj.id} value={obj.id}>
          {obj.name}
        </option>
      );
    }

    setCategory(() => data.map(mapOptions));
  };

  const lookUpError = (err) => {
    _logger("lookUpError", err);
    toastr["error"]("An unespected error occured", "FAQ Categories");
  };

  const handleSubmit = (values) => {
    if (faqId) {
      faqServices
        .update(values, faqId)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    } else {
      faqServices.add(values).then(onAddSuccess).catch(onAddError);
    }
  };

  const onUpdateSuccess = (response) => {
    _logger("onUpdateSuccess", response);
    toastr["success"]("Updated Successfully", "FAQ Question");
  };

  const onUpdateError = () => {
    toastr["error"]("Please try again", "An Error Occurred");
  };

  const onAddSuccess = (response) => {
    _logger("onAddSuccess", response);
    toastr["success"]("Added Successfully", "FAQ Question");
  };

  const onAddError = (err) => {
    _logger("onAddError", err);
    toastr["error"]("Please try again", "An Error Occurred");
  };

  return (
    <React.Fragment>
      <TitleHeader
        title="Faq Form"
        buttonText="Return to FAQs"
        buttonLink="/admin/faqs"
      />
      <div className="container mt-3 p-5 card">
        <Formik
          enableReinitialize={true}
          initialValues={faqs}
          validationSchema={formikVak}
          onSubmit={handleSubmit}
        >
          <div>
            {!faqId && (
              <h1 className="my-4 font-weight-bold-display-4">
                Add an FAQ Question
              </h1>
            )}
            {faqId && (
              <h1 className="my-4 font-weight-bold-display-4">
                Update FAQ Question
              </h1>
            )}
            <Form>
              <div className="form-group">
                <label className="mt-2" htmlFor="question">
                  Question
                </label>
                <Field
                  className="form-control shadow-none"
                  aria-autocomplete="off"
                  component="textarea"
                  rows="2"
                  name="question"
                />
                <ErrorMessage
                  name="question"
                  component="div"
                  className="hasError"
                />
              </div>

              <div className="form-group">
                <label className="mt-2" htmlFor="answer">
                  Answer
                </label>
                <Field
                  className="form-control shadow-none"
                  aria-autocomplete="off"
                  component="textarea"
                  rows="5"
                  name="answer"
                />
                <ErrorMessage
                  name="answer"
                  component="div"
                  className="hasError"
                />
              </div>

              <div className="form-group">
                <label className="mt-2" htmlFor="categoryId">
                  Category
                </label>
                <Field
                  className="form-control shadow-none"
                  aria-autocomplete="off"
                  as="select"
                  name="categoryId"
                >
                  <option value=""> --Select a Category-- </option>
                  {category}
                </Field>
                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="hasError"
                />
              </div>
              {!faqId && (
                <button type="submit" className="btn btn-dark mt-3">
                  Add
                </button>
              )}
              {faqId && (
                <button type="submit" className="btn btn-dark mt-3">
                  Update
                </button>
              )}
            </Form>
          </div>
        </Formik>
      </div>
    </React.Fragment>
  );
}

export default FaqForm;
