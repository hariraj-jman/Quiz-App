import React from "react";
import { Modal, Button } from "react-bootstrap";

function ScoreModal({ show, handleClose, score }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Score</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>You scored: {score} points</h4>
        {/* Add more details here if needed */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ScoreModal;
