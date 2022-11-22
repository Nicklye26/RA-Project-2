import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import "./App.css";

const MESSAGE_FOLDER_NAME = "messages";

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

  return messages.map((message) => (
    <Card key={message.key}>
      <Card.Img
        className="storage-image"
        src={message.val.imageLink}
        alt="image"
      />
      <Card.Text>
        {message.val.block}, {message.val.streetName}, {message.val.floorLevel};{" "}
        {message.val.floorArea} sqm
      </Card.Text>
      <Card.Text>
        {message.val.createdAt}: {message.val.remainingLease} years left | $
        {message.val.resalePrice}
      </Card.Text>
    </Card>
  ));
};

export default TransFeed;
