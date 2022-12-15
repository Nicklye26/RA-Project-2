import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = (props) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const closeAuthForm = () => {
    setEmailInput("");
    setPasswordInput("");
    setIsNewUser(true);
    setErrorMessage("");
    navigate("/");
  };

  const setErrorState = (error) => {
    setErrorMessage(error.message);
  };

  const handleSubmit = (event) => {
    console.log("button");

    if (!emailInput || !passwordInput) return;

    if (isNewUser) {
      return createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      return signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <>
      <div className="Auth-Form-Container">
        <div className="Auth-Form-Wrapper">
          <img
            src={require("../assets/Sales-of-Flats-Logo-Black-500.png")}
            className="Auth-Form-Logo"
            alt="AuthForm-Logo"
          />
          <p>{errorMessage ? `${errorMessage}` : null}</p>

          <label className="Auth-Form-Label">
            <input
              className="Auth-Form-Input"
              type="email"
              name="emailInput"
              value={emailInput}
              onChange={handleEmailInputChange}
              placeholder="Email"
            />
          </label>
          <br />
          <label>
            <input
              className="Auth-Form-Input"
              type="password"
              name="passwordInput"
              value={passwordInput}
              onChange={handlePasswordInputChange}
              minLength={6}
              placeholder="Password"
            />
          </label>
          <br />
          <button className="Sign-In-Log-In-Button" onClick={handleSubmit}>
            {isNewUser ? "Sign Up" : "Log In"}
          </button>
        </div>
        <div className="Toggle-Option-Container">
          <button
            className="Toggle-New-Or-Returning"
            onClick={toggleNewOrReturningAuth}
          >
            {isNewUser
              ? "Have an account? Log In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
