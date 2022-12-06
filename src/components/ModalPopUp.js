import React from "react";
import Card from "react-bootstrap/Card";
import { Button, Modal } from "react-bootstrap";
import "./ModalPopUp.css";

const ModalPopUp = ({ state, modal, closeModal, mapLink, errorMessage }) => {
  return (
    <Modal className="modal" show={modal} onHide={closeModal}>
      <Modal.Header className="modal-header">
        Details of the Transaction
        <Button className="close" onClick={closeModal}></Button>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Card.Img className="storage-image" src={state.imageLink} alt="image" />
        <Card.Text>
          Blk {state.block}, {state.streetName}
        </Card.Text>
        <Card.Text> {state.remainingLease} years left </Card.Text>
        <Card.Img src={mapLink} alt="image" />
        {errorMessage ? `${errorMessage}` : null}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button className="close" color="primary" onClick={closeModal}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopUp;
