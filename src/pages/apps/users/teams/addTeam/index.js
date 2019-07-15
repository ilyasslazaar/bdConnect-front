import React from "react";
import { connect } from "react-redux";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Field, reduxForm } from "redux-form";

import IntlMessages from "util/IntlMessages";
import { ValidatedInput } from "components/FormFields/Input";
import StateButton from "components/StateButton";
import { ValidatedAutocomplete } from "components/FormFields/Autocomplete";
import { getAutoCompleteUsers } from "redux/users/apis";
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
const AddTeamCmp = ({
  toggleModal,
  handleSubmit,
  errorAdding,
  isLoadingAdding,
  msgError,
  ...props
}) => {
  console.log(props.initialValues.users);

  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id={"teams.Add-Teams"} />
      </ModalHeader>
      <ModalBody className="pb-0">
        <Field name="id" component="input" type="hidden" />
        <Field
          name="name"
          component={ValidatedInput}
          type="text"
          label="Name"
          validate={required}
        />
        <Field
          className="mt-4"
          name="authorizedIps"
          component={ValidatedInput}
          type="text"
          label="Authorized Ips"
          validate={required}
        />
        <Field
          className="mt-4 mb-4"
          name="users"
          component={ValidatedAutocomplete}
          noOptionsMessage={() => "Type to search users ..."}
          type="text"
          label="Users"
          isMulti
          isSearchable
          loadOptions={onLoadUserOptions}
          getOptionLabel={i =>
            i.lastName + " " + i.firstName + " (" + i.username + ")"
          }
          getOptionValue={i => i.id}
          cacheOptions
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

const mapStateToProps = state => {
  const { appData } = state;
  return {
    initialValues: appData.teams.editedTeam
  };
};
export const AddTeams = connect(mapStateToProps)(
  reduxForm({
    form: "addTeams"
  })(AddTeamCmp)
);
