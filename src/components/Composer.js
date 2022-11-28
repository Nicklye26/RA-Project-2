import React, { useState } from "react";
import { push, ref as databaseRef, set, update } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../firebase";
import { defaultState } from "./App";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_KEY = "messages";
const IMAGES_FOLDER_NAME = "images";

const Composer = ({ loggedInUser, state, setState }) => {
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState("");

  const handleTextInputChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleFileInputChange = (event) => {
    setFileInputFile(event.target.files[0]);
    setFileInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Data validation for the textboxes
    if (!state.block) return;
    if (!state.streetName) return;
    if (state.floorArea === 0 || state.resalePrice === 0) return;
    if (state.floorArea > 300 || state.floorArea < 0)
      return alert("Floor Area is non-negative and at most 300sqm!");
    if (state.yearLeaseStart > 2017 || state.yearLeaseStart < 1980)
      return alert("Year Lease Start can only be from 1980 to 2017!");
    if (state.resalePrice > 2000000 || state.resalePrice < 0)
      return alert("Resale Price is non-negative and at most $2,000,000");

    let uid = state.key;
    if (uid) {
      const messageListRef = databaseRef(database, MESSAGE_KEY);
      const updates = {};
      updates[uid] = {
        block: state.block,
        streetName: state.streetName,
        floorLevel: state.floorLevel,
        floorArea: parseInt(state.floorArea),
        resalePrice: parseInt(state.resalePrice),
        yearLeaseStart: parseInt(state.yearLeaseStart),
        remainingLease: 99 - (new Date().getFullYear() - state.yearLeaseStart),
      };
      // Reset input fields after submit
      setState(defaultState);

      return update(messageListRef, updates);
    }

    // Store images in an images folder in Firebase Storage
    if (!fileInputFile) return alert("Please upload an image");
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const messageListRef = databaseRef(database, MESSAGE_KEY);
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
          imageLink: downloadUrl,
          imageName: fileInputFile.name,
          createdAt: new Date().toLocaleDateString("en-GB"),
          authorEmail: loggedInUser.email,
          block: state.block,
          streetName: state.streetName,
          floorLevel: state.floorLevel,
          floorArea: parseInt(state.floorArea),
          resalePrice: parseInt(state.resalePrice),
          yearLeaseStart: parseInt(state.yearLeaseStart),
          remainingLease:
            99 - (new Date().getFullYear() - state.yearLeaseStart),
        });
        // Reset input fields after submit
        setFileInputFile(null);
        setFileInputValue("");
        setState(defaultState);
      });
    });
  };

  return (
    <>
      <p>{loggedInUser ? loggedInUser.email : null}</p>
      <form>
        <div className="inputBoxes">
          <label className="labelClass">Block No: </label>
          <input
            className="boxClass"
            name="block"
            type="text"
            maxLength="4"
            value={state.block}
            onChange={handleTextInputChange}
          />
          <label className="labelClass">Street Name: </label>
          <input
            className="boxClass"
            name="streetName"
            type="text"
            value={state.streetName}
            onChange={handleTextInputChange}
          />
          <label className="labelClass"> Floor Level: </label>
          <select
            name="floorLevel"
            value={state.floorLevel}
            onChange={handleTextInputChange}
          >
            <option value="1 to 4" name="floorLevel">
              1 to 4
            </option>
            <option value="5 to 7" name="floorLevel">
              5 to 7
            </option>
            <option value="8 to 11" name="floorLevel">
              8 to 11
            </option>
            <option value="12 and above" name="floorLevel">
              12 and above
            </option>
          </select>
          <label className="labelClass">Floor Area (sqm): </label>
          <input
            className="boxClass"
            name="floorArea"
            type="number"
            min="0"
            max="300"
            value={state.floorArea}
            onChange={handleTextInputChange}
          />
          <label className="labelClass">Year Lease Start: </label>
          <input
            className="boxClass"
            name="yearLeaseStart"
            type="number"
            min="1980"
            max="2017"
            value={state.yearLeaseStart}
            onChange={handleTextInputChange}
            placeholder="example: 1990"
          />
          <label className="labelClass">Resale Price (SGD): </label>
          <input
            className="boxClass"
            name="resalePrice"
            type="number"
            min="0"
            max="2000000"
            value={state.resalePrice}
            onChange={handleTextInputChange}
          />
          <input
            type="file"
            value={fileInputValue}
            multiple
            onChange={handleFileInputChange}
          />
        </div>
        <button onClick={handleSubmit}>Create</button>
      </form>
    </>
  );
};

export default Composer;
