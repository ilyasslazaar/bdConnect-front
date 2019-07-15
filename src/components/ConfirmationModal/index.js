import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import IntlMessages from "util/IntlMessages";

export const ConfirmationModal = ({
  isOpen,
  toggle,
  title,
  content,
  onConfirmClick
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <IntlMessages id={title} />
      </ModalHeader>
      <ModalBody>
        <IntlMessages id={content} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onConfirmClick}>
          <IntlMessages id="Confirm" />
        </Button>
        <Button color="secondary" onClick={toggle}>
          <IntlMessages id="Cancel" />
        </Button>
      </ModalFooter>
    </Modal>
  );
};
