import React from "react";
import { Button } from "reactstrap";
import classnames from "classnames";

class StateButton extends React.Component {
  render() {
    const { children, isLoading, className, ...rest } = this.props;
    return (
      <span>
        <Button
          className={`btn-multiple-state  ${className}  ${classnames({
            "show-spinner": isLoading
          })}`}
          disabled={isLoading}
          {...rest}
        >
          <span className="spinner d-inline-block">
            <span className="bounce1" />
            <span className="bounce2" />
            <span className="bounce3" />
          </span>
          <span className="icon success">
            <i className="simple-icon-check" />
          </span>
          <span className="icon fail">
            <i className="simple-icon-exclamation" />
          </span>
          <span className="label">{children}</span>
        </Button>
      </span>
    );
  }
}

export default StateButton;
