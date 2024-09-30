// src/pages/RegisterPage.js
import React, { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";
import quizLogo from "../assets/img/quiz.svg";

import background from "../assets/img/question_background.png";

const RegisterPage = ({ setAuthenticated, setUserData }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Registering");
      const data = await register(username, email, password, isAdmin);
      localStorage.setItem("token", data.token);
      setUserData({ type: data.userType, username: data.username });
      console.log({ type: data.userType, username: data.username });
      setAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="row justify-content-center m-0"
      style={{
        minHeight: "100vh",
        backgroundColor: "#EDEDED",
      }}
    >
      <div className="row col-7 justify-content-center align-self-center">
        <div className="col-md-6">
          <div
            className="card shadow"
            stye={{ borderStyle: "solid", borderWidth: "5px" }}
          >
            <div className="card-head">
              <h2 className="card-title text-center mb-4 p-2 mt-2">
                Quiz and Assessment Tool
              </h2>
              <hr></hr>
            </div>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isAdmin">
                    Register as Admin
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
                {error && (
                  <div className="mt-3 alert alert-danger">{error}</div>
                )}
              </form>
              <p className="mt-3 text-center">
                Already have an account? <a href="/">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
