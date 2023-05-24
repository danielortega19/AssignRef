import React from "react";
import { Accordion } from "react-bootstrap";
import PropTypes from "prop-types";
import Icon from "@mdi/react";
import { mdiDeleteCircle } from "@mdi/js";
import { mdiPencil } from "@mdi/js";
import debug from "sabio-debug";

function SingleFaq(props) {
  const _logger = debug.extend("faq");
  const faq = props.faq;
  const editQuestion = () => {
    props.onQuesClick(faq);
  };
  const deleteQuestion = () => {
    props.onDeleteQues(faq);
  };

  _logger(props, "this is the single faq page");

  return (
    <React.Fragment>
      <Accordion alwaysOpen className="mt-1">
        <Accordion.Item eventKey={faq.id}>
          <Accordion.Header>{faq.question}</Accordion.Header>
          <Accordion.Body>
            {faq.answer}
            {props.currentUser.roles.includes("Admin") && (
              <div className="d-flex justify-content-sm-end flex-wrap">
                <button className="btn btn-dark btn-sm" onClick={editQuestion}>
                  <Icon path={mdiPencil} size={1} />
                </button>
                <button
                  className="btn btn-danger mx-2 btn-sm"
                  onClick={deleteQuestion}
                >
                  <Icon
                    path={mdiDeleteCircle}
                    onClick={deleteQuestion}
                    size={1}
                  />
                </button>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </React.Fragment>
  );
}

export default SingleFaq;

SingleFaq.propTypes = {
  faq: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }),
  onQuesClick: PropTypes.func.isRequired,
  onDeleteQues: PropTypes.func.isRequired,
  hasAdmin: PropTypes.bool.isRequired,

  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
