import React from "react";
import Select from "react-select";
import cs from "classnames";
import CustomSelectInput from "components/CustomSelectInput";
import { FormFields } from "components/FormFields";

export const ValidatedSelected = props => {
  const {
    input,
    meta: { touched, error },
    className,
    label,
    ...rest
  } = props;
  return (
    <FormFields {...props}>
      <Select
        onChange={e => input.onChange(e)} //TODO update this line
        components={{ Input: CustomSelectInput }}
        className={cs("react-select", { "is-invalid": touched && error })}
        classNamePrefix="react-select"
        {...rest}
      />
    </FormFields>
  );
};
