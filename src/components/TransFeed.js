import React, { useEffect, useState } from "react";
// import Card from "react-bootstrap/Card";
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
import "../components/Transfeed.css";
// import AuthForm from "./AuthForm";

const MESSAGE_FOLDER_NAME = "messages";

// Click on post to link to full details of post
// const handleSubmit = () => {
//   const authForm = <AuthForm />
//   <Link to="authForm"></Link>
// }

const TransFeed = ({ state, setState }) => {
  const [messages, setMessages] = useState([]);

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
    state = record.val;
    setState(state);
    state.key = record.key;
  };

  const removeData = (message) => {
    remove(databaseRef(database, `messages/${message.key}`))
      .then(() => {
        alert("your post is removed!");
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
    <div className="Transfeed-Table">
      <div className="Flex-Row-Titles">
        <div className="Block-Row">
          <h3>Block</h3>
        </div>
        <div className="Street-Name">
          <h3>Street Name</h3>
        </div>
        <div className="Floor-Level">
          <h3>Floor Level</h3>
        </div>
        <div className="Floor-Area">
          <h3>Floor Area</h3>
        </div>
        <div className="Remaining-Lease">
          <h3>Remaining Lease</h3>
        </div>
        <div className="Resale-Price">
          <h3>Resale Price</h3>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>

      {messages.map((message, val) => (
        <div className="Flex-Row" key={val}>
          <div className="Block-Row">{message.val.block}</div>
          <div className="Street-Name">{message.val.streetName}</div>
          <div className="Floor-Level">{message.val.floorLevel}</div>
          <div className="Floor-Area">{message.val.floorArea}</div>
          <div className="Remaining-Lease">{message.val.remainingLease}</div>
          <div className="Resale-Price">{message.val.resalePrice}</div>
          <button className="box" onClick={() => updateData(message)}>
            {" "}
            Edit
          </button>
          <button className="box" onClick={() => removeData(message)}>
            delete
          </button>
          <button className="box">+</button>
        </div>
      ))}
    </div>
  );
};

export default TransFeed;

// original
//   return messages.map((message) => (
//     <Card key={message.key}>
//       <Card.Img
//         className="storage-image"
//         src={message.val.imageLink}
//         alt="image"
//       />
//       <Card.Text>
//         {message.val.block}, {message.val.streetName}, {message.val.floorLevel};{" "}
//         {message.val.floorArea} sqm
//       </Card.Text>
//       <Card.Text>
//         {message.val.createdAt}: {message.val.remainingLease} years left | $
//         {message.val.resalePrice}
//       </Card.Text>
//     </Card>
//   ));
// };
