import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getQuestionsAPI, updateQuestion, addQuestion } from "../api/api";
import { checkCode, getQuiz, userAnswer, submitQuiz } from "../api/api";
// import { ToastContainer, toast } from "react-toastify";
import ScoreModal from "../components/ScoreModal";

const QuestionCard = ({
  question,
  quizCode,
  userQuizId,
  setUserQuizId,
  index,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = async (optionId) => {
    let updatedSelectedOptions = [...selectedOptions];
    if (question.questionType === "MULTIPLE") {
      if (selectedOptions.includes(optionId)) {
        updatedSelectedOptions = updatedSelectedOptions.filter(
          (id) => id !== optionId
        );
      } else {
        updatedSelectedOptions.push(optionId);
      }
    } else {
      updatedSelectedOptions = [optionId];
    }

    setSelectedOptions(updatedSelectedOptions);

    // Save the answer to the backend
    try {
      const data = {
        questionId: question.id,
        optionIds: updatedSelectedOptions,
        userQuizId,
        quizCode,
      };
      console.log("Posting Answer", data);
      const res = await userAnswer(data);
      console.log(res);
      if (!userQuizId) {
        setUserQuizId(res.userQuizId);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  return (
    <div className="card col-12 mb-4">
      <div className="card-head mt-3" style={{ position: "relative" }}>
        <h5 style={{ marginLeft: "1rem" }}>Question {index + 1}</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <p className="m-0 mb-3">{question.questionText}</p>
          <Form>
            {question.options?.map((option, index) => (
              <Form.Check
                key={index}
                type={
                  question.questionType === "MULTIPLE" ? "checkbox" : "radio"
                }
                label={option.optionText}
                name={`question-${question.id}`}
                id={`option-${option.id}`}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
            ))}
          </Form>
        </div>
      </div>
    </div>
  );
};
export default function QuizAdmin(props) {
  const location = useLocation();
  const { quizCode } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [userQuizId, setUserQuizId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [score, setScore] = useState(0);

  const { logout, userData, authenticated } = props;
  const navigate = useNavigate();

  const getQuestions = async () => {
    const data = await getQuiz(quizCode);
    setQuiz(data);
    console.log(quiz);
  };

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
    getQuestions();
  }, [quizCode]);

  const onLogout = (ev) => {
    logout();
  };

  const onBack = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const data = { quizCode, userQuizId };
      const res = await submitQuiz(data);
      setScore(res.score);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#EDEDED",
        position: "relative",
      }}
    >
      <div className="row p-1 justify-content-center">
        {/* NavBar start */}
        <div
          id="navbar"
          className="col-12 row  align-items-center bg-white shadow"
          style={{ position: "sticky", top: 0, zIndex: 3 }}
        >
          <h1 className="col-1 ml-1">
            <span className="fw-bold ml-1"></span>
            <a href="/">Quiz</a>
          </h1>
          <div className="col-3 text-center row align-items-end">
            <h6 className="col-2 mt-2">
              <a href="/">Home</a>
            </h6>
            <h6 className="col-2">About</h6>
          </div>
          <div className="col-8 justify-content-end row">
            <button className="btn btn-danger col-1" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
        {/* Navbar end */}

        {/* Main Content start */}
        <div className="col-10 mt-3 row justify-content-center">
          {/* <h1 className="mt-5 text-center">New Quiz</h1> */}
          <div className="col-12 row mt-4">
            <div
              className="container mt-4 row justify-content-between align-items-center mb-3"
              style={{ position: "relative" }}
            >
              <h2
                className="col-12 text-center"
                style={{ position: "relative" }}
              >
                {quiz?.title}
                {quiz?.assignmentType === "ANYONE_WITH_CODE" ? (
                  <span
                    className="badge bg-primary"
                    style={{ position: "absolute", right: 300 }}
                  >
                    Code: {quiz.shareableCode}
                  </span>
                ) : (
                  <></>
                )}
              </h2>
              <button
                className="btn btn-primary  rounded-5"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "3rem",
                }}
                onClick={onBack}
              >
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <p className="text-center">{quiz?.description}</p>
            </div>
          </div>
          <div className="row justify-content-center gap-3">
            {quiz?.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                index={index}
                question={question}
                quizCode={quizCode}
                userQuizId={userQuizId}
                setUserQuizId={setUserQuizId}
              />
            ))}
            <button
              className="btn btn-success m-5 col-2"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        {/* Main Content end*/}
      </div>
      <ScoreModal
        show={showModal}
        handleClose={handleCloseModal}
        score={score}
      />
    </div>
  );
}

// const QuestionCard = (props) => {
//   const [question, setQuestion] = useState(props.question);
//   const [edit, setEdit] = useState(question.isEdit);
//   const [questionText, setQuestionText] = useState(props.question.questionText);
//   const [options, setOptions] = useState(props.question.options);

//   const onEdit = (ev) => {
//     setEdit(true);
//   };

//   useEffect(() => {
//     if (options.length === 0 || options[options.length - 1].optionText !== "") {
//       setOptions((prevValue) => [
//         ...prevValue,
//         {
//           questionId: question.quizId,
//           optionText: "",
//           isCorrect: false,
//           isEdit: true,
//         },
//       ]);
//     }
//     if (options[options.length - 2]?.optionText === "") {
//       setOptions((prevValue) => prevValue.slice(0, -1));
//     }
//   }, [options]);

//   const onSave = async (ev) => {
//     setEdit(false);
//     const data = {
//       questionText: questionText,
//       questionType: "multiple-choice",
//       quizId: question.quizId,
//     };
//     if (question?.id) {
//       // Updating
//       console.log("Updating");
//       data.options = [];
//       data.questionId = question.id;
//       options.map((value, index) => {
//         console.log(value);
//         if (value.optionText !== "") {
//           if (value?.id) {
//             data.options.push({
//               optionText: value.optionText,
//               isCorrect: value.isCorrect,
//               id: value.id,
//             });
//           } else {
//             data.options.push({
//               optionText: value.optionText,
//               isCorrect: value.isCorrect,
//             });
//           }
//         }
//       });
//       console.log(await updateQuestion(data));
//       toast(`Question ${question.index + 1} updated`);
//     } else {
//       // Creating
//       console.log("Creaing");
//       data.options = [];
//       options.map((value, index) => {
//         console.log(value);
//         if (value.optionText !== "") {
//           data.options.push({
//             optionText: value.optionText,
//             isCorrect: value.isCorrect,
//           });
//         }
//       });
//       const res = await addQuestion(data);
//       //   setQuestion((prevValue) => {
//       //     const temp = prevValue;
//       //     temp[index].questionId = res.id;
//       //     return temp;
//       //   });
//       toast(`Question ${question.index + 1} added`);
//     }
//   };

//   return (
//     <div className="card col-12">
//       <ToastContainer position="bottom-right" />

//       <div className="card-head mt-3" style={{ position: "relative" }}>
//         <h5 style={{ marginLeft: "1rem" }}>Question {question.index + 1}</h5>
//       </div>
//       <div className="card-body">
//         <div className="row">
//           <p className="m-0 mb-3">{questionText}</p>
//           {options?.map((value, index) => {
//             return <></>;
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };
