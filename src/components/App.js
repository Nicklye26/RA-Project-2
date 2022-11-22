import "./App.css";
import AuthForm from "./AuthForm.js";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Composer from "./Composer.js";
import TransFeed from "./TransFeed.js";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  // Code to use later for checking whether user is logged in
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, saved logged-in user to state
        setLoggedInUser(user);
        return;
      }

      // User is signed out
      setLoggedInUser(null);
    });
  }, []);

  const loginButton = (
    <div>
      {" "}
      <Link to="authform">Create Account Or Sign In</Link> <br />{" "}
    </div>
  );
  const authForm = <AuthForm />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const composerAndTransFeed = (
    <div>
      {loggedInUser ? composer : loginButton}
      <br />
      <TransFeed />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={composerAndTransFeed} />
          <Route path="authform" element={authForm} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
