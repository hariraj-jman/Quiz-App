import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizAdmin } from "../api/api";

const QuizCard = (props) => {
  const { data } = props;

  const navigate = useNavigate();
  const handleMoreInfo = () => {
    console.log("HHHH", data);
    navigate(`/quiz/${data.id}`, { state: { quiz: data } });
  };

  return (
    <div className="col-3" key={data.id} style={{ height: "20rem" }}>
      <div className="card shadow h-100">
        <div className="card-body row justify-content-center">
          <h5 className="card-title col-12 text-center mt-2 mb-4">
            {data.title}
          </h5>
          <p className="text-center text-muted">
            {data.description.length >= 120
              ? data.description.slice(0, 120) + "..."
              : data.description}
          </p>
          <div>
            <table class="table">
              <tbody>
                <tr>
                  <td>No of Questions</td>
                  <td>{data.numberOfQuestions}</td>
                </tr>
                <tr>
                  <td>No of Responses</td>
                  <td>{data.numberOfResponses}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-primary col-10 row btn-sm justify-content-center"
            onClick={handleMoreInfo}
          >
            <p className="m-0">
              More info <i class="fa-solid fa-arrow-right"></i>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminHomePage(props) {
  const { logout, userData } = props;
  const [quizzes, setQuizzes] = useState();

  const getQuiz = async () => {
    const data = await getQuizAdmin({});
    setQuizzes(data);
  };

  useEffect(() => {
    getQuiz();
  }, []);

  const navigate = useNavigate();

  const onLogout = (ev) => {
    logout();
  };

  const onNewQuiz = (ev) => {
    navigate("/create");
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
            <div className="col-2" style={{ height: "20rem" }}>
              <div
                className="card shadow h-100"
                onClick={onNewQuiz}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body row justify-content-center">
                  <div className="row justify-content-center">
                    <div className="col-12 text-center align-self-end">
                      <i className="display-4 fa-solid fa-plus col-5 align-bottom"></i>
                    </div>
                    <p className="card-text col-12 text-center text-blue">
                      New Quiz
                    </p>
                  </div>
                </div>
              </div>
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
