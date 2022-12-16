import React from "react";
import { Modal } from "react-bootstrap";
import "./DeletedModal.css";

const DeletedModal = ({ modal }) => {
  return (
    <Modal className="modal" show={modal} size="l">
      <Modal.Body className="modal-body">
        <h1>Your post has been deleted</h1>
      </Modal.Body>
    </Modal>
  );
};

export default DeletedModal;
