import React, { useEffect, useState } from "react";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref as databaseRef,
  remove,
} from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../firebase";
import "./App.css";
import "./Transfeed.css";
import ModalPopUp from "./ModalPopUp";
// import AuthForm from "./AuthForm";
import { defaultState } from "./App";
import axios from "axios";
import { Button } from "react-bootstrap";

const MESSAGE_FOLDER_NAME = "messages";

// Click on post to link to full details of post
// const handleSubmit = () => {
//   const authForm = <AuthForm />
//   <Link to="authForm"></Link>
// }

const TransFeed = ({
  loggedInUser,
  state,
  setState,
  addMode,
  setAddMode,
  isDeleteAlertVisible,
  setDeleteAlertVisible,
}) => {
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);
  const [mapLink, setMapLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = (record) => {
    state = record.val;
    setState(state);
    setModal(true);
    //if (!state.block || !state.streetName) return;
    getOneMap(state.block + " " + state.streetName);
  };

  const closeModal = () => {
    setModal(false);
    setState(defaultState);
    setMapLink("");
    setErrorMessage("");
  };

  const getOneMap = (address) => {
    axios
      .get(
        `https://developers.onemap.sg/commonapi/search?searchVal=${address}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
      )
      .then((response) => {
        const { data } = response;
        const locationData = data.results[0];
        let zoom = 17;
        let width = 400;
        let height = 512;
        //console.log("Latitude: ", locationData.LATITUDE);
        //console.log("Longitude: ", locationData.LONGITUDE);
        setMapLink(
          `https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=original&lat=${locationData.LATITUDE}&lng=${locationData.LONGITUDE}&zoom=${zoom}&width=${width}&height=${height}&points=[${locationData.LATITUDE},${locationData.LONGITUDE},"175,50,0","A"]`
        );
      })
      .catch((error) => setErrorMessage(error.message));
  };

  useEffect(() => {
    const messageRef = databaseRef(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child

    onChildAdded(messageRef, (data) => {
      setMessages((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
    onChildChanged(messageRef, (data) => {
      setMessages((prevState) =>
        prevState.map((item) =>
          item.key === data.key ? { key: data.key, val: data.val() } : item
        )
      );
    });

    onChildRemoved(messageRef, (data) => {
      setMessages((prevState) =>
        prevState.filter((message) => message.key !== data.key)
      );
    });
  }, []);

  const updateData = (record) => {
    // populate the textboxes; change to Edit mode and scroll to top of page
    state = record.val;
    setState(state);
    state.key = record.key;
    setAddMode(!addMode);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const removeData = (message) => {
    let answer = window.confirm("Are you sure you wish to delete?");
    if (!answer) return;

    remove(databaseRef(database, `messages/${message.key}`))
      .then(() => {
        //alert("Your post is removed!");
        setDeleteAlertVisible(true);
        setTimeout(() => {
          setDeleteAlertVisible(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });

    const imageToDelete = storageRef(
      storage,
      `images/${message.val.imageName}`
    );
    deleteObject(imageToDelete)
      .then(() => {
        // success
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {isDeleteAlertVisible && (
        <div className="alert-container">
          + <div className="alert-inner">Your post is deleted!</div>
        </div>
      )}
      <div className="Transfeed-Section">
        <div className="Transfeed-Table">
          <div className="Flex-Row-Titles">
            <div className="Block-Row">
              <h1 className="Title-Text">Block</h1>
            </div>
            <div className="Street-Name">
              <h1 className="Title-Text">Street Name</h1>
            </div>
            <div className="Floor-Level">
              <h1 className="Title-Text">Floor Level</h1>
            </div>
            <div className="Floor-Area">
              <h1 className="Title-Text">Floor Area (sqm)</h1>
            </div>
            <div className="Remaining-Lease">
              <h1 className="Title-Text">Remaining Lease (years)</h1>
            </div>
            <div className="Resale-Price">
              <h1 className="Title-Text">Resale Price (SGD)</h1>
            </div>
            {loggedInUser ? <div className="box"></div> : null}
            {loggedInUser ? <div className="box"></div> : null}
            <div className="box"></div>
          </div>

          {messages.map((message, val) => (
            <div className="Flex-Row" key={val}>
              <div className="Block-Row">{message.val.block}</div>
              <div className="Street-Name">{message.val.streetName}</div>
              <div className="Floor-Level">{message.val.floorLevel}</div>
              <div className="Floor-Area">{message.val.floorArea}</div>
              <div className="Remaining-Lease">
                {message.val.remainingLease}
              </div>
              <div className="Resale-Price">{message.val.resalePrice}</div>
              {loggedInUser ? (
                <Button
                  className="box"
                  onClick={() => updateData(message)}
                  disabled={message.val.authorEmail !== loggedInUser.email}
                >
                  Edit
                </Button>
              ) : null}
              {loggedInUser ? (
                <Button
                  className="box"
                  onClick={() => removeData(message)}
                  disabled={message.val.authorEmail !== loggedInUser.email}
                >
                  Delete
                </Button>
              ) : null}
              <Button className="box" onClick={() => openModal(message)}>
                More Info
              </Button>
            </div>
          ))}
        </div>
        <ModalPopUp
          state={state}
          modal={modal}
          closeModal={closeModal}
          mapLink={mapLink}
          errorMessage={errorMessage}
        />
      </div>
    </>
  );
};

export default TransFeed;
