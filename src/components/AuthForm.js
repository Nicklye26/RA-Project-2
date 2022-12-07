import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const AuthForm = (props) => {
  // const [displayName, setDisplayName] = useState("");
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

  // const handleUserNameInputChange = (e) => {
  //   setDisplayName(e.target.value);
  // };

  const closeAuthForm = () => {
    // setDisplayName("");
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
    <div>
      <h1>Sales of HDB Flats</h1>
      <p>{errorMessage ? `${errorMessage}` : null}</p>
      {/* to work on username later */}
      {/* <label>
        <input
          type="text"
          name="username"
          value={displayName}
          onChange={handleUserNameInputChange}
          placeholder="Username"
        />
      </label> */}

      <label>
        <input
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
          type="password"
          name="passwordInput"
          value={passwordInput}
          onChange={handlePasswordInputChange}
          minLength={6}
          placeholder="Password"
        />
      </label>
      <br />
      <Button onClick={handleSubmit}>{isNewUser ? "Sign Up" : "Log In"}</Button>
      <br />
      <Button variant="link" onClick={toggleNewOrReturningAuth}>
        {isNewUser
          ? "Have an account? Log In"
          : "Don't have an account? Sign Up"}
      </Button>
    </div>
  );
};

export default AuthForm;
