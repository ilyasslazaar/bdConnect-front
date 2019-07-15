import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import StateButton from "components/StateButton";
import { ValidatedInput } from "components/FormFields/Input";
import { renderDelay } from "./renderDelay";

const VideoCmp = props => {
  const { isEdited, handleSubmit, dirty, saveState } = props;

  return (
    <form onSubmit={handleSubmit}>
      {!isEdited && dirty && (
        <span className="d-block mb-2 text-info">
          <IntlMessages id="Metadata not saved" />
        </span>
      )}
      <p className="text-muted text-small mb-0">Original Url</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="originalUrl"
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

      <p className="text-muted text-small mb-0">Upload Date</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="uploadDate"
        component={ValidatedInput}
        type="date"
        disabled={!isEdited}
      />

      <p className="text-muted text-small mb-0">Username</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="username"
        component={ValidatedInput}
        type="text"
        disabled={!isEdited}
      />

      <p className="text-muted text-small mb-0">Youtube Id</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="youtubeId"
        component={ValidatedInput}
        type="text"
        disabled={!isEdited}
      />

      <p className="text-muted text-small mb-0">Youtube Title</p>
      <Field
        className="mb-3"
        inputClassName="pl-0 pr-0"
        name="youtubeTitle"
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

export const Video = connect(mapStateToProps)(
  renderDelay(
    reduxForm({
      form: "documentMetadata"
    })(VideoCmp)
  )
);
