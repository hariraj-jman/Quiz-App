import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCode } from "../api/api";
// import { ToastContainer, toast } from "react-toastify";

export default function UserHomePage(props) {
  const { logout, userData } = props;
  const [quizzes, setQuizzes] = useState();
  const [quizCode, setQuizCode] = useState();
  const [error, setError] = useState("");

  const getQuiz = async () => {
    // const data = await getQuizAdmin({});
    // setQuizzes(data);
  };

  useEffect(() => {
    // getQuiz();
    // console.log("UserData : ", userData);
  }, []);

  const navigate = useNavigate();

  const onLogout = (ev) => {
    logout();
  };

  const onStartQuiz = async () => {
    console.log(quizCode);
    const res = await checkCode(quizCode);
    console.log("res", res);
    setError("");
    if (!res.valid || res.alreadyTaken) {
      if (res.alreadyTaken) {
        setError("Quiz already taken.");
      } else {
        setError("Quiz Code not Found");
      }
    } else {
      setError("");
      const data = { code: quizCode };
      navigate(`/quiz/${quizCode}`, { state: data });
    }
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
      {/* <ToastContainer position="bottom-right" /> */}
      <div className="row p-1 justify-content-center">
        {/* NavBar start */}
        <div
          id="navbar"
          className="col-12 row  align-items-center bg-white shadow"
          style={{ position: "sticky", top: 0, zIndex: 3 }}
        >
          <h1 className="col-1 ml-1">
            <span className="fw-bold ml-1"></span>
            <a href="#">Quiz</a>
          </h1>
          <div className="col-3 text-center row align-items-end">
            <h6 className="col-2 mt-2">Home</h6>
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
        <div className="col-10 mt-3 row">
          {userData?.username ? (
            <h1 className="mt-5">
              Welcome,{" "}
              {userData.username[0].toUpperCase() + userData.username.slice(1)}
            </h1>
          ) : (
            <></>
          )}

          <div className="col-12 row mt-4 gap-3 justify-content-center">
            <h3 className="text-center">Start quiz by entering code</h3>
            <div className="col-4">
              {error && <div className="mt-3 alert alert-danger">{error}</div>}
              <input
                type="text"
                class="col-3 form-control"
                id="quizCode"
                aria-describedby="QuizCodeHelp"
                value={quizCode}
                onChange={(ev) => {
                  setQuizCode(ev.target.value);
                }}
                placeholder="Enter Quiz Code"
              />
            </div>
            <div className="col-12 row justify-content-center ">
              <button className="btn btn-primary col-1" onClick={onStartQuiz}>
                Start Quiz
              </button>
            </div>

            {/* QuizList */}
            {quizzes?.map((value, index) => {
              console.log(index, value);
              return <QuizCard data={value} />;
            })}
            {/* QuizList End */}
          </div>
        </div>
        {/* Main Content end*/}
      </div>
    </div>
  );
}
