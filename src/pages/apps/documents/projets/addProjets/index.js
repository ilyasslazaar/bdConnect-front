import React from "react";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import { ValidatedInput } from "components/FormFields/Input";
import StateButton from "components/StateButton";

const required = value =>
  value || typeof value === "number" ? undefined : "error.required";

const validate = values => {
  const errors = {};
  if (values.name && values.name.length !== 3) {
    errors.name = "error.name-to-short";
  }
  return errors;
};

const AddProjetsCmp = ({
  toggleModal,
  handleSubmit,
  errorAdding,
  isLoadingAdding,
  msgError
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id={"projets.Add-Projets"} />
      </ModalHeader>
      <ModalBody className="pb-0">
        <Field
          name="name"
          component={ValidatedInput}
          type="text"
          label="Name"
          validate={required}
        />
        <Field
          className="mt-4 mb-4"
          name="prefix"
          component={ValidatedInput}
          type="text"
          label="Prefix"
          validate={required}
        />
        {errorAdding && (
          <div className="d-block text-danger text-center">
            <IntlMessages id={msgError} />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="Cancel" />
        </Button>
        <StateButton
          id="successButton"
          color="primary"
          type="submit"
          isLoading={isLoadingAdding}
        >
          <IntlMessages id="Submit" />
        </StateButton>
      </ModalFooter>
    </form>
  );
};

export const AddProjets = reduxForm({
  form: "AddProjets",
  validate
})(AddProjetsCmp);
