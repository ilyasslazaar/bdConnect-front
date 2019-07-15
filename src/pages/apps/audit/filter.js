import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import IntlMessages from "util/IntlMessages";
import { Row, Button, Label, FormGroup } from "reactstrap";
import { ValidatedAutocomplete } from "components/FormFields/Autocomplete";
import { ValidatedInput } from "components/FormFields/Input";

import { Colxx, Separator } from "components/CustomBootstrap";
import { getAutoCompleteUsers } from "redux/users/apis";
import { getAutoCompleteBox } from "redux/boxs/apis";
import { getAutoCompleteTeams } from "redux/teams/apis";
import { logger } from "util/Logger";

import { connect } from "react-redux";

const onLoadUserOptions = async (query, callback) => {
  try {
    const response = await getAutoCompleteUsers(query);
    callback(response.data.result || []);
  } catch (error) {
    logger("error getting Users", error);
  }
};

const onLoadTeamsOptions = async (query, callback) => {
  try {
    const response = await getAutoCompleteTeams(query);
    callback(response.data.result || []);
  } catch (error) {
    logger("error getting Teams", error);
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

class FilterCmp extends Component {
  render() {
    const { handleSubmit, onClose, className } = this.props;
    return (
      <Colxx xxs="12" className={"mt-4 " + className}>
        <form onSubmit={handleSubmit}>
          <Row>
            <Colxx xs={12} sm={6} md={4}>
              <Label className="font-weight-bold">
                <IntlMessages id={"Action types"} />
              </Label>
              <FormGroup className="mb-0">
                <Label>
                  <Field
                    name="actionType"
                    component={"input"}
                    type="radio"
                    value="ALL"
                  />
                  <IntlMessages id={"Show all action types"} />
                </Label>
              </FormGroup>
              <FormGroup className="mb-0">
                <Label>
                  <Field
                    name="actionType"
                    component={"input"}
                    type="radio"
                    value="ACTIVE"
                  />
                  <IntlMessages id={"Show only passive actions"} />
                </Label>
              </FormGroup>
              <FormGroup className="mb-0">
                <Label>
                  <Field
                    name="actionType"
                    component={"input"}
                    type="radio"
                    value="PASSIVE"
                  />
                  <IntlMessages id={"Show only passive actions"} />
                </Label>
              </FormGroup>
            </Colxx>
            <Colxx xs={12} sm={6} md={4}>
              <Field
                className="mb-3"
                name="dateFrom"
                label="Start Date"
                component={ValidatedInput}
                labelClassName="mb-0"
                type="date"
              />
              <Field
                className="mb-3"
                name="dateTo"
                label="End Date"
                component={ValidatedInput}
                labelClassName="mb-0"
                type="date"
              />
            </Colxx>
            <Colxx xs={12} sm={6} md={4}>
              <Field
                className="mb-3"
                name="userName"
                label="User"
                component={ValidatedAutocomplete}
                noOptionsMessage={() => "Type to search users ..."}
                labelClassName="mb-0"
                isSearchable
                loadOptions={onLoadUserOptions}
                getOptionLabel={i => i.username}
                getOptionValue={i => i.id}
                cacheOptions
              />
              <Field
                className="mb-3"
                name="teamId"
                label="Team"
                component={ValidatedAutocomplete}
                noOptionsMessage={() => "Type to search users ..."}
                labelClassName="mb-0"
                isSearchable
                loadOptions={onLoadTeamsOptions}
                getOptionLabel={i => i.name}
                getOptionValue={i => i.id}
                cacheOptions
              />
              <Field
                className="mb-3"
                name="boxeId"
                label="Box"
                component={ValidatedAutocomplete}
                noOptionsMessage={() => "Type to search users ..."}
                labelClassName="mb-0"
                isSearchable
                loadOptions={onLoadBoxOptions}
                getOptionLabel={i => i.number}
                getOptionValue={i => i.id}
                cacheOptions
              />
            </Colxx>
          </Row>
          <div className="text-right">
            <Button
              outline
              color="secondary"
              className="ml-2 mb-2"
              onClick={onClose}
            >
              <i className="simple-icon-close" /> <IntlMessages id="Close" />
            </Button>
            <Button color="primary" className="ml-2 mb-2" type="submit">
              <i className="simple-icon-docs" />{" "}
              <IntlMessages id="menu.search" />
            </Button>
          </div>
        </form>
        <Separator className="mb-3" />
      </Colxx>
    );
  }
}

export const Filter = connect(null)(
  reduxForm({
    form: "auditSearch"
  })(FilterCmp)
);
