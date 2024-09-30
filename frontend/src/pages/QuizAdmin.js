import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { getQuestionsAPI, updateQuestion, addQuestion } from "../api/api";
import { createQuiz, getStatsAPI } from "../api/api";
// import { ToastContainer, toast } from "react-toastify";

const Option = (props) => {
  const { index, edit, setOptions, options } = props;

  const onChange = (ev) => {
    setOptions((prevValue) => {
      const temp = prevValue;
      temp[index].optionText = ev.target.value;
      return [...temp];
    });
  };

  const onCorrectChange = (ev) => {
    setOptions((prevValue) => {
      const temp = prevValue.map((option, i) => ({
        ...option,
        isCorrect: i === index ? ev.target.checked : false,
      }));
      return [...temp];
    });
  };

  if (options[index].optionText === "" && !edit) {
    return null;
  }

  return (
    <>
      {edit ? (
        <>
          <div className="row m-2 align-items-center">
            <span className="mt-2" style={{ width: "3rem" }}>
              {index + 1}.{" "}
            </span>
            <div className="col-5">
              <input
                type="text"
                className="col-3 form-control"
                id={`question{quiz.id}`}
                aria-describedby="emailHelp"
                value={options[index].optionText}
                onChange={onChange}
                placeholder="Enter Option"
              />
            </div>
            {options[index].optionText && (
              <>
                <div className="form-check col-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={index}
                    checked={options[index].isCorrect}
                    onChange={onCorrectChange}
                    id={index}
                  />
                  <label className="form-check-label" htmlFor={index}>
                    Correct
                  </label>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="rounded m-1" key={index}>
          <span>{index + 1}. </span>
          {options[index].optionText}
          {options[index].isCorrect && (
            <span
              className="text-white bg-success rounded p-1"
              style={{ marginLeft: "1rem" }}
            >
              Correct
            </span>
          )}
        </p>
      )}
    </>
  );
};

const QuestionCard = (props) => {
  const [question, setQuestion] = useState(props.question);
  const [edit, setEdit] = useState(question.isEdit);
  const [questionText, setQuestionText] = useState(props.question.questionText);
  const [options, setOptions] = useState(props.question.options);

  const onEdit = (ev) => {
    setEdit(true);
  };

  useEffect(() => {
    if (options.length === 0 || options[options.length - 1].optionText !== "") {
      setOptions((prevValue) => [
        ...prevValue,
        {
          questionId: question.quizId,
          optionText: "",
          isCorrect: false,
          isEdit: true,
        },
      ]);
    }
    if (options[options.length - 2]?.optionText === "") {
      setOptions((prevValue) => prevValue.slice(0, -1));
    }
  }, [options]);

  const onSave = async (ev) => {
    setEdit(false);
    const data = {
      questionText: questionText,
      questionType: "multiple-choice",
      quizId: question.quizId,
    };
    if (question?.id) {
      // Updating
      console.log("Updating");
      data.options = [];
      data.questionId = question.id;
      options.map((value, index) => {
        console.log(value);
        if (value.optionText !== "") {
          if (value?.id) {
            data.options.push({
              optionText: value.optionText,
              isCorrect: value.isCorrect,
              id: value.id,
            });
          } else {
            data.options.push({
              optionText: value.optionText,
              isCorrect: value.isCorrect,
            });
          }
        }
      });
      console.log(await updateQuestion(data));
      // toast(`Question ${question.index + 1} updated`);
    } else {
      // Creating
      console.log("Creaing");
      data.options = [];
      options.map((value, index) => {
        console.log(value);
        if (value.optionText !== "") {
          data.options.push({
            optionText: value.optionText,
            isCorrect: value.isCorrect,
          });
        }
      });
      const res = await addQuestion(data);
      //   setQuestion((prevValue) => {
      //     const temp = prevValue;
      //     temp[index].questionId = res.id;
      //     return temp;
      //   });
      // toast(`Question ${question.index + 1} added`);
    }
  };

  return (
    <div className="card col-12">
      {/* <ToastContainer position="bottom-right" /> */}

      <div className="card-head mt-3" style={{ position: "relative" }}>
        <h5 style={{ marginLeft: "1rem" }}>Question {question.index + 1}</h5>
        {edit ? (
          <button
            className="btn btn-success rounded-5"
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={onSave}
          >
            <i class="fa-regular fa-floppy-disk"></i>
          </button>
        ) : (
          <button
            className="btn btn-primary rounded-5"
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={onEdit}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
        )}
      </div>
      <div className="card-body">
        <div className="row">
          {edit ? (
            <>
              <form className="row">
                <div class="col-12 mb-3">
                  {/* <label className="col-2 m-0">Question</label> */}
                  <input
                    type="text"
                    class="col-3 form-control"
                    id="question{quiz.id}"
                    value={questionText}
                    onChange={(ev) => {
                      setQuestionText(ev.target.value);
                    }}
                    aria-describedby="emailHelp"
                    placeholder="Enter Question"
                  />
                </div>
                {options?.map((value, index) => {
                  return (
                    <Option
                      index={index}
                      edit={edit}
                      setOptions={setOptions}
                      options={options}
                    />
                  );
                })}
              </form>
            </>
          ) : (
            <>
              <p className="m-0 mb-3">{questionText}</p>
              <div className="row" style={{ marginLeft: "1rem" }}>
                {options?.map((value, index) => {
                  return (
                    <Option
                      index={index}
                      edit={edit}
                      options={options}
                      setOptions={setOptions}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function QuizAdmin(props) {
  const location = useLocation();
  const { quiz } = location.state;
  const { logout, userData, authenticated } = props;
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [assignmentType, setAssignmentType] = useState(quiz.assignmentType);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuiz({ title, description, assignmentType });
      navigate("/admin"); // Updated navigation method
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const getStats = async () => {
    const res = await getStatsAPI(quiz.id);
    setStats(res);
    console.log(stats);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(quiz.shareableCode)
      .then(() => {
        // setCopySuccess("Code copied to clipboard!");
        // toast("Code copied to clipboard!");
      })
      .catch((err) => {
        // setCopySuccess("Failed to copy code.");
        console.error("Failed to copy: ", err);
      });
  };

  const getQuestions = async () => {
    const data = await getQuestionsAPI(quiz.id);
    setQuestions(data);
  };

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
    getQuestions();
    getStats();
  }, []);

  const onAddQuestion = () => {
    const question = {
      questiontext: "",
      questionType: "multiple-choice",
      quizId: quiz.id,
      index: questions.length,
      options: [],
      isEdit: true,
    };
    setQuestions((prevValue) => [...prevValue, question]);
  };

  const addQuestion = () => {
    const question = {
      index: questions.length,
      questionText: "",
      options: [],
    };
    setQuestions((prevValue) => {
      return [...prevValue, question];
    });
  };

  const onLogout = (ev) => {
    logout();
  };

  const onNewQuiz = (ev) => {
    console.log("New Quiz");
  };

  const onBack = (ev) => {
    navigate("/");
  };

  const onEdit = (ev) => {
    navigate(`/edit/${quiz.id}`, { state: { quiz } });
  };

  const countCorrectAnswers = (data) => {
    console.log(data);
    return data?.filter((answer) => answer.isCorrect).length;
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
            <a href="/">
              <span className="fw-bold ml-1"></span>Quiz
            </a>
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
              className="container mt-4 row justify-content-center align-items-center mb-3"
              style={{ position: "relative" }}
            >
              <h2
                className="col-12 text-center"
                style={{ position: "relative" }}
              >
                {quiz.title}
              </h2>
              <button
                className="btn btn-primary  rounded-5"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "3rem",
                }}
                onClick={onEdit}
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
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
              <p className="text-center">{quiz.description}</p>
              {quiz.assignmentType === "ANYONE_WITH_CODE" ? (
                <h4 className="bg-primary col-2 p-1 text-center rounded text-white">
                  Code: {quiz.shareableCode}
                  <button className="btn btn-primary" onClick={copyToClipboard}>
                    <i className="fa-solid fa-copy"></i>
                  </button>
                </h4>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="row justify-content-center gap-3">
            {stats ? (
              <>
                <h4>Statistics</h4>
                <div className="card">
                  <div className="card-body row gap-2 justify-content-center mt-2">
                    <h6
                      className="bg-primary p-1 rounded text-white text-center"
                      style={{ width: "13rem" }}
                    >
                      No of Responses: {stats?.length}
                    </h6>
                    <h6
                      className="bg-primary p-1 rounded text-white text-center"
                      style={{ width: "13rem" }}
                    >
                      No of Questions: {questions.length}
                    </h6>
                    <div
                      className="row gap-2 mt-2 mb-2"
                      style={{ marginLeft: "1rem" }}
                    >
                      {stats?.map((value, index) => {
                        const correct = countCorrectAnswers(value.answers);
                        return (
                          <div className="card col-2">
                            <h5 className="text-center m-3">
                              {value.username[0].toUpperCase() +
                                value.username.slice(1)}
                            </h5>
                            <div>
                              <div className="m-3">
                                <table className="table p-0">
                                  <tbody>
                                    <tr>
                                      <td>Correct</td>
                                      <td>{correct}</td>
                                    </tr>
                                    <tr>
                                      <td>Incorrect</td>
                                      <td>{value.answers.length - correct}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {questions.length > 1 ? (
              <h4>Questions</h4>
            ) : (
              <p className="text-center m-0 text-muted">
                Please click the button below to add questions
              </p>
            )}
            {questions?.map((value, index) => {
              value.index = index;
              return <QuestionCard question={value} key={index} />;
            })}
          </div>
          <button className="btn btn-primary m-5 col-2" onClick={onAddQuestion}>
            Add Question
          </button>
        </div>
        {/* Main Content end*/}
      </div>
    </div>
  );
}
