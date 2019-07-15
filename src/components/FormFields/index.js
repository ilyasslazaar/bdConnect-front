import React from "react";
import { Label } from "reactstrap";
import IntlMessages from "util/IntlMessages";

export const FormFields = ({
  children,
  label,
  name,
  className,
  labelClassName,
  meta: { touched, error, warning }
}) => (
  <div className={className}>
    {label && (
      <Label htmlFor={name} className={labelClassName}>
        <IntlMessages id={label} />
      </Label>
    )}
    {children}
    {touched &&
      ((error && (
        <span className="text-danger">
          <IntlMessages id={error} />
        </span>
      )) ||
        (warning && <span className="text-danger">{warning}</span>))}
  </div>
);
