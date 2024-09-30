import React from "react";
import { useNavigate } from "react-router-dom";
import { verifyTokenAPI } from "../api/api";

export function checkNotLoggedIn() {
  const authenticated = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!authenticated) {
    navigate("/");
  }
}

export function checkLoggedIn() {
  const authenticated = localStorage.getItem("token");
  const navigate = useNavigate();
  if (authenticated) {
    navigate("/");
  }
}

export const verifyToken = async ({
  setUserData,
  setVerified,
  setAuthenticated,
}) => {
  const token = localStorage.getItem("token");
  try {
    const data = token && (await verifyTokenAPI(token));
    console.log(data);
    if (data?.userType) {
      setUserData({ type: data.userType, username: data.username });
      setAuthenticated(true);
      console.log("Authenticated");
    }
  } catch (error) {
    localStorage.clear();
  }
  setVerified(true);
};
