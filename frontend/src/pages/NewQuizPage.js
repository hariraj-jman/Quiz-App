import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../api/api";

export default function NewQuizPage(props) {
  const { logout, userData, authenticated } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignmentType, setAssignmentType] = useState("ANYONE_WITH_CODE");
  const navigate = useNavigate(); // Updated hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quiz = await createQuiz({ title, description, assignmentType });
      navigate(`/quiz/${quiz.id}`, { state: { quiz } });
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, []);

  const onLogout = (ev) => {
    logout();
  };

  const onNewQuiz = (ev) => {
    console.log("New Quiz");
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
            <span className="fw-bold ml-1"></span>Quiz
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
          {/* <h1 className="mt-5 text-center">New Quiz</h1> */}
          <div className="col-12 row mt-4">
            <div className="container mt-4">
              <h2>Create a Quiz</h2>
              <div className="card p-3">
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter quiz title"
                    />
                  </Form.Group>
                  <Form.Group controlId="description" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter quiz description"
                    />
                  </Form.Group>
                  <Form.Group controlId="assignmentType" className="mt-3">
                    <Form.Label>Assignment Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={assignmentType}
                      onChange={(e) => setAssignmentType(e.target.value)}
                    >
                      <option value="ANYONE_WITH_CODE">Anyone with Code</option>
                      <option value="SPECIFIC_EMAILS">Specific Emails</option>
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Create Quiz
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content end*/}
      </div>
    </div>
  );
}
