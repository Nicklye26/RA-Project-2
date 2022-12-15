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
import DeletedModal from "./DeletedModal";
import { defaultState } from "./App";
import axios from "axios";
// import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MESSAGE_FOLDER_NAME = "messages";

const TransFeed = ({ loggedInUser, state, setState, addMode, setAddMode }) => {
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteBtnModal, setDeleteBtnModal] = useState(false);
  // const [deleteConfirmation , setDeleteConfirmation] = useState(false)
  const [mapLink, setMapLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
    navigate("/create?mode=edit");
  };

  const removeData = (message) => {
    let answer = window.confirm("Are you sure you wish to delete?");
    if (!answer) return;

    remove(databaseRef(database, `messages/${message.key}`))
      .then(() => {
        //alert("Your post is removed!");
        // setDeleteConfirmation(true)
        setDeleteBtnModal(true);
        setTimeout(() => {
          setDeleteBtnModal(false);
        }, 2500);
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
      <div className="Transfeed-Section">
        <div className="Notes-Container">
          <h1 className="Notes-Title">Table of transaction</h1>
          <h2 className="Notes-Title-2">Resale of HDB</h2>
          <br />
          <div className="Notes-Wrapper">
            <h3>Notes</h3>
            <ul>
              1. The approximate floor area includes any recess area purchased,
              space adding item under HDB's upgrading programmes, roof terrace,
              etc.
            </ul>
            <ul>
              2. The transactions exclude resale transactions that may not
              reflect the full market price such as resale between relatives and
              resale of part shares.
            </ul>
            <ul>
              3. Resale prices should be taken as indicative only as the resale
              prices agreed between buyers and sellers are dependent on many
              factors.
            </ul>
            <ul>
              4. Remaining lease is the number of years, months and days left
              before the lease expires. The information is computed as at the
              resale flat application and has been rounded up to the nearest
              month for the purpose of CPF monies usage and HDB loan
              application.
            </ul>
          </div>
        </div>
        <br />
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
            <div className="Button-Wrapper">
              {loggedInUser ? <div className="box"></div> : null}
              {loggedInUser ? <div className="box"></div> : null}
              <div className="box"></div>
            </div>
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
              <div className="Button-Wrapper">
                {loggedInUser &&
                message.val.authorEmail === loggedInUser.email ? (
                  <button
                    className="Btn-Edit"
                    onClick={() => updateData(message)}
                  >
                    <img
                      src={require("../assets/Button-edit.png")}
                      className="Btn-Image"
                      alt="edit-button"
                    />
                  </button>
                ) : null}
                {loggedInUser &&
                message.val.authorEmail === loggedInUser.email ? (
                  <button
                    className="Btn-Trash"
                    onClick={() => removeData(message)}
                  >
                    <img
                      src={require("../assets/Button-trash.png")}
                      className="Btn-Image"
                      alt="trash-button"
                    />
                  </button>
                ) : null}
                <button
                  variant="info"
                  className="More-Info-Btn"
                  onClick={() => openModal(message)}
                >
                  <img
                    src={require("../assets/Button-info.png")}
                    className="Btn-Image"
                    alt="info-button"
                  />
                </button>
              </div>
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
        <DeletedModal modal={deleteBtnModal} />
      </div>
    </>
  );
};

export default TransFeed;
