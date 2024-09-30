// src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import quizLogo from "../assets/img/quiz.svg";

import background from "../assets/img/question_background.png";

const LoginPage = ({ setAuthenticated, authenticated, setUserData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, userType, username } = await login(email, password);
      localStorage.setItem("token", token);
      setUserData({ type: userType, username: username });
      setAuthenticated(true);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const checkLoggedIn = () => {
    if (authenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

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
                {/* <img src={quizLogo} alt="Quiz Logo" width="200" height="200" /> */}
                Quiz and Assessment Tool
              </h2>
              <hr></hr>
            </div>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your Email"
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
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
                {error && (
                  <div className="mt-3 alert alert-danger">{error}</div>
                )}
              </form>
              <p className="mt-3 text-center">
                Don't have an account? <a href="/register">Register here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
