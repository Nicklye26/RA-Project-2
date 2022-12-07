import "./App.css";
import AuthForm from "./AuthForm.js";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Composer from "./Composer.js";
import TransFeed from "./TransFeed.js";
import { auth } from "../firebase";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Button } from "react-bootstrap";

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
      console.log("onAuthStateChanged", user);
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
      <Button>
        <Link to="authform">Create Account Or Sign In</Link>
      </Button>
      <br />
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
        loggedInUser={loggedInUser}
        state={state}
        setState={setState}
        addMode={addMode}
        setAddMode={setAddMode}
      />
    </div>
  );

  const logOutUser = () => {
    console.log("hello hello");
    console.log(loggedInUser.email);
    const authentication = getAuth();
    console.log(authentication);
    signOut(authentication)
      .then(() => {
        setLoggedInUser(null);
        console.log("successful log out", loggedInUser);
        console.log(loggedInUser);
        //sign out success
      })
      .catch((error) => {
        console.log(error);
        // error
      });
  };

  return (
    <div className="App" id="home">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          <img
            src={require("../assets/Sales-of-Flats-Logo.png")}
            alt="Website-Logo"
          />
        </Navbar.Brand>
        {loggedInUser && loggedInUser.email ? (
          <Nav>
            <NavDropdown title={loggedInUser && loggedInUser.email}>
              <NavDropdown.Item onClick={() => logOutUser()}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : null}
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
