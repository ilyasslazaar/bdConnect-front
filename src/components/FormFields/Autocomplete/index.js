import React from "react";
import Select from "react-select/lib/Async";
import cs from "classnames";
import { FormFields } from "components/FormFields";

export const ValidatedAutocomplete = props => {
  const {
    input,
    meta: { touched, error },
    className,
    label,
    inputClassName,
    noOptionsMessage,
    ...rest
  } = props;
  return (
    <FormFields {...props}>
      <Select
        className={cs("react-select", inputClassName, {
          "is-invalid": touched && error
        })}
        classNamePrefix="react-select"
        value={input.value}
        onChange={value => input.onChange(value)}
        noOptionsMessage={noOptionsMessage}
        {...rest}
      />
    </FormFields>
  );
};
