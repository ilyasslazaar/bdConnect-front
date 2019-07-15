import React from "react";
import { connect } from "react-redux";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import { ValidatedInput } from "components/FormFields/Input";
import { ValidatedSelected } from "components/FormFields/Select";
import StateButton from "components/StateButton";

const required = value =>
  value || typeof value === "number" ? undefined : "error.required";

const validate = values => {
  const errors = {};
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "error.invalide Email";
  }
  if (values.password && values.password.length < 6) {
    errors.password = "error.password-to-short";
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "error.pwd-not-match";
  }
  return errors;
};

const AddUserCmp = ({
  initialValues,
  toggleModal,
  handleSubmit,
  roles,
  errorAddingUser,
  isLoadingAddingUser,
  msgError
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader toggle={toggleModal}>
        <IntlMessages
          id={initialValues.username ? "user.Edit-User" : "user.Add-User"}
        />
      </ModalHeader>
      <ModalBody className="pb-0">
        <Field name="id" component="input" type="hidden" />
        <Field
          name="firstName"
          component={ValidatedInput}
          type="text"
          label="First Name"
          validate={required}
        />
        <Field
          className="mt-4"
          name="lastName"
          component={ValidatedInput}
          type="text"
          label="Last Name"
          validate={required}
        />
        <Field
          className="mt-4"
          name="username"
          component={ValidatedInput}
          type="text"
          label="Username"
          validate={required}
        />
        <Field
          className="mt-4"
          name="email"
          component={ValidatedInput}
          type="email"
          label="Email"
          validate={required}
        />
        <Field
          className="mt-4"
          name="password"
          component={ValidatedInput}
          type="password"
          label="Password"
          validate={required}
          autoComplete="new-password"
        />
        <Field
          className="mt-4"
          name="confirmPassword"
          component={ValidatedInput}
          type="password"
          label="confirm-password"
          validate={required}
        />
        <Field
          className="mt-4 mb-4"
          name="role"
          component={ValidatedSelected}
          label="user.role"
          validate={required}
          getOptionLabel={i => i.name}
          getOptionValue={i => i.id}
          options={roles}
        />
        {errorAddingUser && (
          <div className="d-block text-danger text-center">
            {msgError ? (
              msgError
            ) : (
              <IntlMessages id={"errors.error-adding-user"} />
            )}
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
          isLoading={isLoadingAddingUser}
        >
          <IntlMessages id="Submit" />
        </StateButton>
      </ModalFooter>
    </form>
  );
};

const mapStateToProps = state => {
  const { appData } = state;
  return {
    initialValues: appData.users.editedUser,
    roles: appData.users.roles
  };
};
export const AddUser = connect(mapStateToProps)(
  reduxForm({
    form: "addUser",
    validate
  })(AddUserCmp)
);
