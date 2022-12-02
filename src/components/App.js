import "./App.css";
import AuthForm from "./AuthForm.js";
// import ShowImage from "./ShowImage.js";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Composer from "./Composer.js";
import TransFeed from "./TransFeed.js";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export const defaultState = {
  block: "",
  streetName: "",
  floorLevel: "1 to 4",
  floorArea: "",
  yearLeaseStart: "",
  resalePrice: "",
};

function App() {
  // Code to use later for checking whether user is logged in
  const [loggedInUser, setLoggedInUser] = useState();
  const [state, setState] = useState(defaultState);
  const [addMode, setAddMode] = useState(true);

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

  const composer = (
    <Composer
      loggedInUser={loggedInUser}
      state={state}
      setState={setState}
      addMode={addMode}
      setAddMode={setAddMode}
    />
  );
  const composerAndTransFeed = (
    <div>
      {loggedInUser ? composer : loginButton}
      <br />
      <TransFeed
        state={state}
        setState={setState}
        addMode={addMode}
        setAddMode={setAddMode}
      />
    </div>
  );

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Nav>
          {" "}
          <img
            src={require("../assets/Sales-of-Flats-Logo.png")}
            alt="Website-Logo"
          />
          <p>goodbye world</p>
          {/* <p>{loggedInUser}</p> */}
        </Nav>
        <Nav>
          <NavDropdown title="username">
            <NavDropdown.Item onClick={() => setLoggedInUser(null)}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <header className="App-header">
        <Routes>
          <Route path="/" element={composerAndTransFeed} />
          <Route path="authform" element={<AuthForm />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
