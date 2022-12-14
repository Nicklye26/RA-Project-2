import "./App.css";
import AuthForm from "./AuthForm.js";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Composer from "./Composer.js";
import TransFeed from "./TransFeed.js";
import { auth } from "../firebase";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export const defaultState = {
  block: "",
  streetName: "",
  floorLevel: "1 to 4",
  floorArea: 0,
  yearLeaseStart: 1990,
  resalePrice: 0,
  imageName: "",
};

function App() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [state, setState] = useState(defaultState);
  const [addMode, setAddMode] = useState(true);
  const [isDeleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const navigate = useNavigate();

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
    <>
      <div>
        <Link to="authform" className="Home-Create-Sign-In-Link">
          Create Account Or Sign In
        </Link>
      </div>
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
    </>
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

  const transactionTable = (
    <TransFeed
      loggedInUser={loggedInUser}
      state={state}
      setState={setState}
      addMode={addMode}
      setAddMode={setAddMode}
      isDeleteAlertVisible={isDeleteAlertVisible}
      setDeleteAlertVisible={setDeleteAlertVisible}
    />
  );

  const composerAndTransFeed = (
    <div>{loggedInUser ? transactionTable : loginButton}</div>
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

  const createPost = () => {
    navigate("/create");
  };

  return (
    <div className="App">
      <div className="Nav-Bar">
        <Navbar className="Nav-Bar-Side" position="top" variant="dark">
          <Navbar.Brand>
            <Link to="/">
              <img
                src={require("../assets/Sales-of-Flats-Logo-500.png")}
                className="Navbar-Logo"
                alt="Website-Logo"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {loggedInUser && loggedInUser.email ? (
                <Nav className="justify-content-end">
                  Signed in as:
                  <NavDropdown title={loggedInUser && loggedInUser.email}>
                    <NavDropdown.Item onClick={() => createPost()}>
                      <h1 className="Navbar-Dropdown">Create</h1>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => logOutUser()}>
                      <h1 className="Navbar-Dropdown">Logout</h1>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              ) : null}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <main className="Routes-Wrapper">
        <Routes>
          <Route path="/" element={composerAndTransFeed} />
          <Route path="authform" element={<AuthForm />} />
          <Route path="table" element={transactionTable} />
          <Route path="create" element={composer} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
