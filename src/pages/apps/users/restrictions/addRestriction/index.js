import React from "react";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import { ValidatedAutocomplete } from "components/FormFields/Autocomplete";
import StateButton from "components/StateButton";
import { getAutoCompleteUsers } from "redux/users/apis";
import { getAutoCompleteBox } from "redux/boxs/apis";
import { logger } from "util/Logger";

const required = value =>
  value || typeof value === "number" ? undefined : "error.required";

const onLoadUserOptions = async (query, callback) => {
  try {
    const response = await getAutoCompleteUsers(query);
    callback(response.data.result || []);
  } catch (error) {
    logger("error getting Users", error);
  }
};

const onLoadBoxOptions = async (query, callback) => {
  try {
    const response = await getAutoCompleteBox(query);
    callback(response.data.result || []);
  } catch (error) {
    logger("error getting Boxs", error);
  }
};

const AddRestrictionCmp = ({
  toggleModal,
  handleSubmit,
  errorAdding,
  isLoadingAdding,
  msgError
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id={"restrictions.Add-Restrictions"} />
      </ModalHeader>
      <ModalBody className="pb-0">
        <Field
          name="userName"
          component={ValidatedAutocomplete}
          noOptionsMessage={() => "Type to search users ..."}
          type="text"
          label="Username"
          validate={required}
          isSearchable
          loadOptions={onLoadUserOptions}
          getOptionLabel={i =>
            i.lastName + " " + i.firstName + " (" + i.username + ")"
          }
          getOptionValue={i => i.id}
          cacheOptions
        />
        <Field
          className="mt-4 mb-4"
          name="boxName"
          label="Box Name"
          component={ValidatedAutocomplete}
          noOptionsMessage={() => "Type to search boxs ..."}
          labelClassName="mb-0"
          isSearchable
          loadOptions={onLoadBoxOptions}
          getOptionLabel={i => i.number}
          getOptionValue={i => i.id}
          cacheOptions
          validate={required}
        />
        {errorAdding && (
          <div className="d-block text-danger text-center">
            <IntlMessages id={msgError} />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="Cancel" />
        </Button>
        <StateButton
          id="successButton"
          color="primary"
          type="submit"
          isLoading={isLoadingAdding}
        >
          <IntlMessages id="Submit" />
        </StateButton>
      </ModalFooter>
    </form>
  );
};

export const AddRestriction = reduxForm({
  form: "AddRestriction"
})(AddRestrictionCmp);
