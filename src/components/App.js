import "./App.css";
import AuthForm from "./AuthForm.js";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Composer from "./Composer.js";
import TransFeed from "./TransFeed.js";
import { auth } from "../firebase";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
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
  const [loggedInUser, setLoggedInUser] = useState();
  const [state, setState] = useState(defaultState);
  const [addMode, setAddMode] = useState(true);
  const [isUpdateAlertVisible, setUpdateAlertVisible] = useState(false);
  const [isDeleteAlertVisible, setDeleteAlertVisible] = useState(false);

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
      <Link to="authform" className="Home-Create-Sign-In-Link">
        Create Account Or Sign In
      </Link>
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
      isUpdateAlertVisible={isUpdateAlertVisible}
      setUpdateAlertVisible={setUpdateAlertVisible}
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
        isDeleteAlertVisible={isDeleteAlertVisible}
        setDeleteAlertVisible={setDeleteAlertVisible}
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
      <div className="Nav-Bar">
        <Navbar className="Nav-Bar-Side" position="top" variant="dark">
          <Navbar.Brand>
            <img
              src={require("../assets/Sales-of-Flats-Logo-500.png")}
              className="Navbar-Logo"
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
      </div>

      <header className="Right-Column">
        <Routes>
          <Route path="/" element={composerAndTransFeed} />
          <Route path="authform" element={<AuthForm />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
