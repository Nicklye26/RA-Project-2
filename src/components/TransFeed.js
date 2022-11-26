import React, { useEffect, useState } from "react";
// import Card from "react-bootstrap/Card";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import "./App.css";
import "../components/Transfeed.css";
// import AuthForm from "./AuthForm";

const MESSAGE_FOLDER_NAME = "messages";

// Click on post to link to full details of post
// const handleSubmit = () => {
//   const authForm = <AuthForm />
//   <Link to="authForm"></Link>
// }

const TransFeed = () => {
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
  }, []);

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

  return (
    <div className="Transfeed-Table">
      <div className="Flex-Row">
        <div className="Block-Row">
          <h3>Block</h3>
        </div>
        <div className="Street-Name">
          <h3>Street Name</h3>
        </div>
        <div className="Floor Level">
          <h3>Floor Level</h3>
        </div>
        <div className="Floor Area">
          <h3>Floor Area</h3>
        </div>
        <div className="Remaining Lease">
          <h3>Remaining Lease</h3>
        </div>
        <div className="Resale Price">
          <h3>Resale Price</h3>
        </div>
      </div>

      {messages.map((message, val) => (
        <div className="Flex-Row" key={val}>
          <div className="Block-Row">{message.val.block}</div>
          <div className="Street-Name">{message.val.streetName}</div>
          <div className="Floor Level">{message.val.floorLevel}</div>
          <div className="Floor Area">{message.val.floorArea}</div>
          <div className="Remaining Lease">{message.val.remainingLease}</div>
          <div className="Resale Price">{message.val.resalePrice}</div>
        </div>
      ))}
    </div>
  );
};

export default TransFeed;
