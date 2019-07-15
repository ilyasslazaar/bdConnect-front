import React from "react";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import { ValidatedInput } from "components/FormFields/Input";
import StateButton from "components/StateButton";

const required = value =>
  value || typeof value === "number" ? undefined : "error.required";

const LoginFormCmp = ({ handleSubmit, showError, isLoading }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field
        className="mt-4"
        name="username"
        component={ValidatedInput}
        type="text"
        label="Username"
        validate={required}
      />
      <Field
        className="mt-4 mb-4"
        name="password"
        component={ValidatedInput}
        type="password"
        label="Password"
        validate={required}
      />
      {showError && (
        <div className="d-block text-danger text-center mb-2">
          <IntlMessages id="users.error-authentification" />
        </div>
      )}
      <div className="text-center">
        <StateButton
          id="successButton"
          color="primary"
          type="submit"
          className="btn-shadow"
          size="lg"
          isLoading={isLoading}
        >
          <IntlMessages id="user.login-button" />
        </StateButton>
      </div>
    </form>
  );
};

export const LoginForm = reduxForm({
  form: "loginForm"
})(LoginFormCmp);
