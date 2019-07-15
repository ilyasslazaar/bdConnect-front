import React from "react";
import cs from "classnames";
import { FormFields } from "..";
import TextareaAutosize from "react-autosize-textarea";

export const ValidatedTextarea = props => {
  const {
    input,
    inputClassName,
    disabled,
    meta: { touched, error }
  } = props;

  return (
    <FormFields {...props}>
      <TextareaAutosize
        disabled={disabled}
        {...input}
        className={cs(inputClassName, { "is-invalid": touched && error })}
      />
    </FormFields>
  );
};
