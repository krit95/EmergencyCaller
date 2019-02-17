import React from "react";
import * as Constants from "../Constants"
import { Button,Modal } from 'react-bootstrap';

export class ConfirmationModal extends React.Component {
    render() {
      return (
        <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-lg" dialogClassName="confirmation-modal">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{this.props.heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{this.props.message}</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Confirm</Button>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }