import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import StateButton from "components/StateButton";
import { ValidatedInput } from "components/FormFields/Input";
import { renderDelay } from "./renderDelay";

const documentCmp = props => {
  const { isEdited, handleSubmit, dirty, saveState } = props;

  return (
    <form
      onSubmit={handleSubmit(values => {
        props.onSubmit(values);
        props.initialize(values);
      })}
    >
      {!isEdited && dirty && (
        <span className="d-block mb-2 text-info">
          <IntlMessages id="Metadata not saved" />
        </span>
      )}
      <p className="text-muted text-small mb-0">CC</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="cc"
        component={ValidatedInput}
        type="text"
        disabled={!isEdited}
      />
      <p className="text-muted text-small mb-0">From</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="from"
        component={ValidatedInput}
        type="text"
        disabled={!isEdited}
      />

      <p className="text-muted text-small mb-0">Summary</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="summary"
        component={ValidatedInput}
        type="text"
        disabled={!isEdited}
      />

      <p className="text-muted text-small mb-0">To</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="to"
        component={ValidatedInput}
        type="text"
        disabled={!isEdited}
      />

      {isEdited && (
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
    initialValues: appData.docs.metadata.documentMetadata
  };
};

export const Document = connect(mapStateToProps)(
  renderDelay(
    reduxForm({
      form: "documentMetadata"
    })(documentCmp)
  )
);
