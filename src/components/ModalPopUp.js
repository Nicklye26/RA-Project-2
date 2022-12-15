import React from "react";
import Card from "react-bootstrap/Card";
import { Modal } from "react-bootstrap";
import "./ModalPopUp.css";

const ModalPopUp = ({ state, modal, closeModal, mapLink, errorMessage }) => {
  return (
    <Modal className="modal" show={modal} onHide={closeModal} size="xl">
      <Modal.Header className="modal-header">
        Details of the Transaction
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="Modal-Left-Wrapper">
          <Card.Img
            className="storage-image"
            src={state.imageLink}
            alt="image"
          />
          <br />
          <div className="Details-Transaction-Wrapper">
            <h1 className="Card-Text-Title">Address: </h1>
            <h2 className="Card-Text-Text">
              Blk {state.block}, {state.streetName}
            </h2>
            <h1 className="Card-Text-Title">Floor Level: </h1>
            <h2 className="Card-Text-Text">{state.floorLevel}</h2>
            <h1 className="Card-Text-Title">Resale Price: </h1>
            <h2 className="Card-Text-Text">${state.resalePrice}</h2>
            <h1 className="Card-Text-Title">Remaining Lease Left: </h1>
            <h2 className="Card-Text-Text">
              {state.remainingLease} years left
            </h2>
            <h1 className="Card-Text-Title">Sold by: </h1>
            <h2 className="Card-Text-Text">{state.authorEmail}</h2>
            <h1 className="Card-Text-Title">Created on: </h1>
            <h2 className="Card-Text-Text">{state.createdAt}</h2>
          </div>
        </div>
        <div className="Modal-Right-Wrapper">
          <Card.Img src={mapLink} alt="image" />
        </div>
        {errorMessage ? `${errorMessage}` : null}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button className="Close-Modal" onClick={closeModal}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopUp;
