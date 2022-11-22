import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Composer from "./Composer.js";
import TransFeed from "./TransFeed.js";

function App() {
  // Code to use later for checking whether user is logged in
  // const [loggedInUser, setLoggedInUser] = useState();

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, saved logged-in user to state
  //       setLoggedInUser(user);
  //       return;
  //     }

  //     // User is signed out
  //     setLoggedInUser(null);
  //   });
  // }, []);

  const composerAndTransFeed = (
    <div>
      <Composer />
      <br />
      <TransFeed />
    </div>
  );

  const composer = <Composer />;
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={composerAndTransFeed} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
