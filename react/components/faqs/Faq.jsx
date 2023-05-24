import React, { useState, useCallback, useEffect } from "react";
import faqService from "../../services/faqServices";
import debug from "sabio-debug";
import SingleFaq from "./SingleFaq";
import { useNavigate } from "react-router-dom";
import lookUpService from "services/lookUpService";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import "./faq.css";
import toastr from "toastr";
import TitleHeader from "components/general/TitleHeader";

function Faq({ currentUser }) {
  const _logger = debug.extend("faq");
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({
    questionsList: [],
    questionsComponent: [],
    show: true,
    filteredList: [],
    hasAdmin: false,
    filterCategory: [],
  });
  const lookUpTables = ["FAQCategory"];
  const [categories, setCategories] = useState({
    categoryList: [],
    categoryComponent: [],
  });

  useEffect(() => {
    if (currentUser.roles.includes("Admin")) {
      setQuestionData((prevState) => {
        const setData = { ...prevState };
        setData.hasAdmin = true;
        return setData;
      });
    }

    faqService.getAll().then(onGetAllSuccess).catch(onGetAllError);
  }, [currentUser.id]);

  // debugger;
  useEffect(() => {
    lookUpService
      .lookUp(lookUpTables)
      .then(onGetCategoriesSuccess)
      .catch(onGetCategoriesError);
  }, []);

  const filterCategories = (event) => {
    let id = event.target.id;
    _logger("A", id);

    function filterCat(obj) {
      let result = false;
      if (obj.category.id === Number(id)) {
        result = true;
      }
      return result;
    }

    if (id === "0") {
      _logger("B", id);

      setQuestionData((prevState) => {
        const newData = { ...prevState };
        newData.show = true;
        newData.questionsComponent = newData.questionsList.map(mapList);
        return newData;
      });
    } else {
      _logger("C", id);

      setQuestionData((prevState) => {
        let newData = { ...prevState };
        let list = newData.questionsList;
        let filteredCategory = list.filter(filterCat);
        newData.questionsComponent = filteredCategory.map(mapList);
        newData.show = false;
        _logger("state of questions", questionData);
        return newData;
      });
    }
  };

  const onGetCategoriesSuccess = (response) => {
    _logger("onGetCategoriesSuccess", response);
    let category = response.item.faqCategory;

    function mapCategories(obj) {
      return (
        <button
          onClick={filterCategories}
          key={obj.id}
          id={obj.id}
          className="btn btn-outline-secondary m-2 btn-sm"
        >
          {obj.name}
        </button>
      );
    }

    setCategories((prevState) => {
      let copyState = { ...prevState };
      copyState.categoryList = category;
      copyState.categoryComponent = category.map(mapCategories);
      return copyState;
    });
  };

  const onGetCategoriesError = (err) => {
    _logger("onGetCategoriesError", err);
    toastr["error"]("An error occurred. Please try again.", "FAQ Catergories");
  };

  const onGetAllSuccess = (response) => {
    _logger("onGetAllSuccess", response);
    const data = response.items;
    setQuestionData((prevState) => {
      const copyState = { ...prevState };

      copyState.questionsList = data;
      copyState.questionsComponent = data.map(mapList);
      return copyState;
    });
  };

  const onGetAllError = (err) => {
    _logger("onGetAllError", err);
    toastr["error"]("An error occurred. Please try again.", "FAQ Questions");
  };

  const editQuestion = (data) => {
    _logger(data.id);
    const stateToSend = { type: "FAQDATA", payload: data };
    navigate(`/faqs/faqform/${data.id}`, {
      state: stateToSend,
    });
  };

  const sweeAlert = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const onDeleteQuestion = useCallback((data) => {
    sweeAlert
      .fire({
        title: "Are you sure you want to delete this question?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const handler = deleteSuccesshandler(data.id);
          faqService.remove(data.id).then(handler).catch(onDeleteError);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "This question is safe",
            "error"
          );
        }
      });
  });

  const deleteSuccesshandler = (idToDelete) => {
    setQuestionData((prevState) => {
      const pd = { ...prevState };
      pd.questionsList = [...pd.questionsList];

      const indexOf = pd.questionsList.findIndex((question) => {
        let result = false;

        if (question.id === idToDelete) {
          result = true;
        }

        return result;
      });

      if (indexOf >= 0) {
        pd.questionsList.splice(indexOf, 1);
        pd.questionsComponent = pd.questionsList.map(mapList);
      }

      return pd;
    });
    sweeAlert.fire("Deleted!", "This question has been deleted.", "success");
  };

  const onDeleteError = (err) => {
    _logger("onDeleteError", err);
  };

  const mapList = (aQues) => {
    return (
      <SingleFaq
        currentUser={currentUser}
        hasAdmin={questionData.hasAdmin}
        faq={aQues}
        key={aQues.id}
        onQuesClick={editQuestion}
        onDeleteQues={onDeleteQuestion}
      />
    );
  };

  return (
    <React.Fragment>
      {questionData.hasAdmin && (
        <>
          <TitleHeader
            title="FAQs"
            buttonText="Add FAQ"
            buttonLink="/faqs/faqform"
          />
          <div className="card p-5 w-75 faq-Admin">
            <div className="faqlist-Admin">
              <div className="d-flex flex-wrap">
                <button
                  onClick={filterCategories}
                  key={0}
                  id="0"
                  className="btn btn-outline-secondary m-2"
                >
                  All
                </button>
                {categories.categoryComponent}
              </div>
              <h1 className="mt-5">Most frequently asked questions</h1>
              <p>
                Here are the most frequently asked questions you may check
                before getting started
              </p>
              {questionData.show && questionData.questionsComponent}
              {!questionData.show && questionData.questionsComponent}
            </div>
          </div>
        </>
      )}
      {!questionData.hasAdmin && (
        <div className="card p-5 w-75 faq-Admin">
          <div className="faqlist">
            <div className="d-flex flex-wrap">
              <button
                onClick={filterCategories}
                key={0}
                id="0"
                className="btn btn-outline-secondary m-2"
              >
                All
              </button>
              {categories.categoryComponent}
            </div>
            <h1 className="mt-5">Most frequently asked questions</h1>
            <p>
              Here are the most frequently asked questions you may check before
              getting started
            </p>
            {questionData.show && questionData.questionsComponent}
            {!questionData.show && questionData.questionsComponent}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Faq;

Faq.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
