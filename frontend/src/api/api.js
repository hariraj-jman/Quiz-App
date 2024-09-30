// src/api/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // Your FastAPI URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => localStorage.getItem("token");

export const login = async (email, password) => {
  const response = await api.post("auth/login/", { email, password });
  return response.data;
};

export const createEmployee = async (employee) => {
  console.log("Token : ", getToken());
  const response = await api.post("employees/", employee, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const register = async (username, email, password, isAdmin) => {
  console.log("Registering : ", username, email, password, isAdmin);
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
    isAdmin,
  });
  return response.data;
};

export const verifyTokenAPI = async (token) => {
  const response = await api.post("/auth/verify", { token });
  return response.data;
};

export const createQuiz = async (data) => {
  const response = await api.post("/quizzes", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getQuizAdmin = async (data) => {
  const response = await api.post("/quizzes/quiz", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getQuestionsAPI = async (id) => {
  const response = await api.get(`/quizzes/quiz/${id}/questions`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateQuestion = async (data) => {
  const response = await api.post(
    `quizzes/question/${data.questionId}/edit`,
    data,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

export const addQuestion = async (data) => {
  const response = await api.post(`quizzes/${data.quizId}/add`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const checkCode = async (token) => {
  try {
    const response = await api.post(
      `quizzes/code`,
      { quizCode: token },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    return false;
  }
};

export const getQuiz = async (quizCode) => {
  console.log("Quiz Code : ", quizCode);
  try {
    const response = await api.get(`/quizzes/quiz/${quizCode}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const userAnswer = async (data) => {
  try {
    const res = await api.post(`/quizzes/answer`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const submitQuiz = async (data) => {
  try {
    const res = await api.post(`/quizzes/${data.quizCode}/submit`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getStatsAPI = async (quizId) => {
  try {
    const res = await api.get(`quizzes/quiz/${quizId}/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    console.log("Stats", res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
