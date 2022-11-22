import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = (props) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
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
  };

     const setErrorState = (error) => {
       setErrorMessage(error.message);
     };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailInputValue || !passwordInputValue) return;

    
 
    if (isNewUser) {
      createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(false);
  };

  return (
    <div>
      <h1>Sales of HDB Flats</h1>
      <p>{errorMessage ? `${errorMessage}` : null}</p>
      <form>
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
        <button onClick={handleSubmit}>
          {isNewUser ? "Sign Up" : "Log In"}
        </button>
        <br />
        <button variant="link" onClick={toggleNewOrReturningAuth}>
          {isNewUser
            ? "Have an account? Log In"
            : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
