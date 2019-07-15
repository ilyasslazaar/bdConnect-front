import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Button } from "reactstrap";
import { NavLink } from "react-router-dom";

import IntlMessages from "util/IntlMessages";
import StateButton from "components/StateButton";
import { ValidatedInput } from "components/FormFields/Input";
import { ValidatedTextarea } from "../../../../components/FormFields/Textarea";
import { renderDelay } from "./renderDelay";

const boxCmp = props => {
  const { isBoxEdited, handleSubmit, dirty, saveState } = props;

  return (
    <form
      onSubmit={handleSubmit(values => {
        props.onSubmit(values);
        props.initialize(values);
      })}
    >
      {!isBoxEdited && dirty && (
        <span className="d-block mb-2 text-info">
          <IntlMessages id="Metadata not saved" />
        </span>
      )}
      <p className="text-muted text-small mb-0">Location seized</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="locationSeized"
        component={ValidatedInput}
        type="text"
        disabled={!isBoxEdited}
      />
      <p className="text-muted text-small mb-0">Date seized</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="dateSeized"
        component={ValidatedInput}
        type="text"
        disabled={!isBoxEdited}
      />

      <p className="text-muted text-small mb-0">Time seized</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="timeSeized"
        component={ValidatedInput}
        type="text"
        disabled={!isBoxEdited}
      />

      <p className="text-muted text-small mb-0">Seized By</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="seizedBy"
        component={ValidatedInput}
        type="text"
        disabled={!isBoxEdited}
      />

      <p className="text-muted text-small mb-0">Notes</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0 form-control"
        name="notes"
        component={ValidatedTextarea}
        disabled={!isBoxEdited}
      />
      {!isBoxEdited && (
        <NavLink to="/app/documents/missings">
          <Button outline color="primary" className="mb-2">
            <i className="simple-icon-docs" />
            <IntlMessages id="Missings Pages" />
          </Button>
        </NavLink>
      )}
      {isBoxEdited && (
        <Fragment>
          {saveState.error && (
            <div className="d-block text-danger">
              <IntlMessages id={saveState.error} />
            </div>
          )}
          <StateButton
            id="successButton"
            color="primary"
            type="submit"
            isLoading={saveState.loading}
          >
            <IntlMessages id="Save" />
          </StateButton>
        </Fragment>
      )}
    </form>
  );
};
const mapStateToProps = state => {
  const { appData } = state;
  return {
    initialValues: appData.boxs.metadata.boxMetadata
  };
};

export const Box = connect(mapStateToProps)(
  renderDelay(
    reduxForm({
      form: "boxMetadata"
    })(boxCmp)
  )
);
