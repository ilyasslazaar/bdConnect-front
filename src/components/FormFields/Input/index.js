import React from "react";
import { Input } from "reactstrap";
import cs from "classnames";
import { FormFields } from "..";

export const ValidatedInput = props => {
  const {
    input,
    type,
    inputClassName,
    disabled,
    autoComplete,
    meta: { touched, error }
  } = props;

  return (
    <FormFields {...props}>
      <Input
        disabled={disabled}
        {...input}
        type={type}
        autoComplete={autoComplete}
        className={cs(inputClassName, { "is-invalid": touched && error })}
      />
    </FormFields>
  );
};
