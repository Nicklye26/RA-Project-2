import React, { useEffect, useState } from "react";
// import Card from "react-bootstrap/Card";
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

  // table format
  // cannot use table to display, but using it now temporarily
  return (
    <tbody>
      <tr>
        <th>Block</th>
        <th>Street Name</th>
        <th>Floor Level</th>
        <th>Floor Area</th>
        <th>Remaining Lease</th>
        <th>Resale Price</th>
      </tr>
      {messages.map((message, val) => (
        <tr key={val}>
          <td>{message.val.block}</td>
          <td>{message.val.streetName}</td>
          <td>{message.val.floorLevel}</td>
          <td>{message.val.floorArea}</td>
          <td>{message.val.remainingLease}</td>
          <td>{message.val.resalePrice}</td>
        </tr>
      ))}
    </tbody>
  );
};

// table format using div
//   return (
//     <div>
//       <div>
//         <div>Block</div>
//         <div>Street Name</div>
//         <div>Floor Level</div>
//         <div>Floor Area</div>
//         <div>Remaining Lease</div>
//         <div>Resale Price</div>
//       </div>
//       {messages.map((message, val) => (
//         <div key={val}>
//           <div>{message.val.block}</div>
//           <div>{message.val.streetName}</div>
//           <div>{message.val.floorLevel}</div>
//           <div>{message.val.floorArea}</div>
//           <div>{message.val.remainingLease}</div>
//           <div>{message.val.resalePrice}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

export default TransFeed;
