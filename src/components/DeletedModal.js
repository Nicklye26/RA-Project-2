import React from "react";
import { Modal } from "react-bootstrap";
import "./DeletedModal.css";

const DeletedModal = ({ modal }) => {
  return (
    <Modal className="modal" show={modal} size="l">
      {/* <Modal.Header className="modal-header">
        Details of the Transaction
      </Modal.Header> */}
      <Modal.Body className="modal-body">
        <h1>Your post has been deleted</h1>
      </Modal.Body>
    </Modal>
  );
};

export default DeletedModal;
