import React from "react";
import { Button, Toast, Row, Col } from "react-bootstrap";

const AutoHideToast = (showToast, closeToast, msgToUser) => {
  return (
    <div>
      <Toast onClose={closeToast} show={showToast} delay={5000} autohide>
        <Toast.Header>
          <strong className="me-auto">Bootstrap</strong>
          <small></small>
        </Toast.Header>
        <Toast.Body>{msgToUser}</Toast.Body>
      </Toast>
    </div>
  );
};

export default AutoHideToast;
