// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import "react-toastify/dist/ReactToastify.css";

import Col from "react-bootstrap/Col";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminHomePage from "./pages/AdminHomePage";
import UserHomePage from "./pages/UserHomePage";
import NewQuizPage from "./pages/NewQuizPage";
import NotFound from "./pages/NotFound";
import QuizAdmin from "./pages/QuizAdmin";
import UserQuizPage from "./pages/UserQuizPage";

import "./assets/styles/styles.css";
import { verifyToken } from "./utils/utils";

function App() {
  const [authenticated, setAuthenticated] = useState();
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState();
  const [currParam, setcurrParam] = useState();

  const logout = () => {
    setAuthenticated(false);
    localStorage.clear();
    setUserData(false);
  };

  useEffect(() => {
    verifyToken({ setUserData, setVerified, setAuthenticated }); // Needs to be done. (Just a Placeholder)
  }, []);

  if (verified) {
    if (!authenticated) {
      return (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <LoginPage
                  setAuthenticated={setAuthenticated}
                  authenticated={authenticated}
                  setUserData={setUserData}
                />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterPage
                  setAuthenticated={setAuthenticated}
                  authenticated={authenticated}
                  setUserData={setUserData}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      );
    } else {
      return (
        <Router>
          <Routes>
            {userData?.type === "admin" ? (
              <>
                <Route
                  path="/"
                  element={
                    <AdminHomePage logout={logout} userData={userData} />
                  }
                />
                <Route
                  path="/quiz/:quizId"
                  element={
                    <QuizAdmin
                      logout={logout}
                      userData={userData}
                      authenticated={authenticated}
                    />
                  }
                />
                <Route
                  path="/create"
                  element={
                    <NewQuizPage
                      logout={logout}
                      userData={userData}
                      authenticated={authenticated}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <UserHomePage
                      setAuthenticated={setAuthenticated}
                      authenticated={authenticated}
                      logout={logout}
                      userData={userData}
                    />
                  }
                />
                <Route
                  path="/quiz/:quizCode"
                  element={
                    <UserQuizPage
                      setAuthenticated={setAuthenticated}
                      authenticated={authenticated}
                      logout={logout}
                      userData={userData}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </Router>
      );
    }
  }

  return (
    <div
      className="row justify-content-center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div className="align-self-center spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default App;
