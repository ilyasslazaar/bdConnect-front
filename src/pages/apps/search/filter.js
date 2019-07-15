import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import { Field, reduxForm } from "redux-form";
import {
  Row,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Button,
  FormGroup,
  Label
} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ValidatedInput } from "components/FormFields/Input";

import { Colxx, Separator } from "components/CustomBootstrap";
import { connect } from "react-redux";

const tabs = ["BASIC", "SPECIFIC", "ADVANCED"];
class FilterCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFirstTab: "1"
    };
    this.props.change("searchType", tabs[0]);
  }
  changeTab = (e, index) => {
    e.preventDefault();
    this.setState({ activeFirstTab: index });
    this.props.change("searchType", tabs[index - 1]);
  };
  render() {
    const { handleSubmit, onClose, className } = this.props;
    return (
      <Colxx xxs="12" className={className}>
        <form onSubmit={handleSubmit}>
          <Nav tabs className="separator-tabs ml-0 mb-5">
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeFirstTab === "1",
                  "nav-link": true
                })}
                onClick={e => this.changeTab(e, "1")}
                to=" "
              >
                <IntlMessages id="search.basic-search" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeFirstTab === "2",
                  "nav-link": true
                })}
                onClick={e => this.changeTab(e, "2")}
                to=" "
              >
                <IntlMessages id="search.specific-search" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeFirstTab === "3",
                  "nav-link": true
                })}
                onClick={e => this.changeTab(e, "3")}
                to="#"
              >
                <IntlMessages id="search.advanced-search" />
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeFirstTab}>
            <TabPane tabId="1">
              <Row>
                <Colxx xs={12} sm={6} md={4}>
                  <Field name="searchType" component={"input"} type="hidden" />
                  <Field
                    className="mb-3"
                    name="term"
                    label="Search term"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={4}>
                  <Field
                    className="mb-3"
                    name="startDate"
                    label="Start Date"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="date"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={4}>
                  <Field
                    className="mb-3"
                    name="endDate"
                    label="End Date"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="date"
                  />
                </Colxx>
                <Colxx xs={12}>
                  <FormGroup className="mb-0">
                    <Label>
                      <Field
                        name="fuzzyActivated"
                        component={"input"}
                        type="checkbox"
                      />
                      <IntlMessages
                        id={
                          "Activate fuzzy search (search for terms that are similar to, but not exactly like our search term)"
                        }
                      />
                    </Label>
                  </FormGroup>
                </Colxx>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Colxx xs={12} sm={6} md={4}>
                  <Field
                    className="mb-3"
                    name="locationSeized"
                    label="Location seized"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={4}>
                  <Field
                    className="mb-3"
                    name="notes"
                    label="Notes"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <div className="w-100 d-none d-md-block" />
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="docFrom"
                    label="Document From"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="docTo"
                    label="Document To"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="docCc"
                    label="Document CC"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="docSummary"
                    label="Document summary"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} md={9}>
                  <Row>
                    <Colxx xs={12} sm={6} md={4}>
                      <Field
                        className="mb-3"
                        name="namesOfPeople"
                        label="Names of people"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="text"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6} md={4}>
                      <Field
                        className="mb-3"
                        name="namesOfPlaces"
                        label="Names of places"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="text"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6} md={4}>
                      <Field
                        className="mb-3"
                        name="namesOfEntities"
                        label="Names of entities"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="text"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6} md={4}>
                      <Field
                        className="mb-3"
                        name="from"
                        label="From"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="text"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6} md={4}>
                      <Field
                        className="mb-3"
                        name="to"
                        label="To"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="text"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6} md={4}>
                      <Field
                        className="mb-3"
                        name="cc"
                        label="Cc"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="text"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6}>
                      <Field
                        className="mb-3"
                        name="startDate"
                        label="Start Date"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="date"
                      />
                    </Colxx>
                    <Colxx xs={12} sm={6}>
                      <Field
                        className="mb-3"
                        name="endDate"
                        label="End Date"
                        component={ValidatedInput}
                        inputClassName="p-1"
                        labelClassName="mb-0"
                        type="date"
                      />
                    </Colxx>
                  </Row>
                </Colxx>

                <Colxx xs={12} sm={6} md={3}>
                  <Label htmlFor={"signatureBlock"}>
                    <IntlMessages id={"Tags"} />
                  </Label>
                  <Field
                    className="mb-3 p-1 form-control"
                    name="signatureBlock"
                    component={"textarea"}
                  />
                </Colxx>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <IntlMessages id={"Find pages with"} />
              <Row>
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="allWords"
                    label="All these words"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="anyWords"
                    label="Any of these words"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={3}>
                  <Field
                    className="mb-3"
                    name="noneWords"
                    label="None of these words"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="text"
                  />
                </Colxx>
                <div className="w-100 d-none d-md-block" />

                <Colxx xs={12} sm={6} md={4}>
                  <Field
                    className="mb-3"
                    name="startDate"
                    label="Start Date"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="date"
                  />
                </Colxx>
                <Colxx xs={12} sm={6} md={4}>
                  <Field
                    className="mb-3"
                    name="endDate"
                    label="End Date"
                    component={ValidatedInput}
                    inputClassName="p-1"
                    labelClassName="mb-0"
                    type="date"
                  />
                </Colxx>
              </Row>
            </TabPane>
          </TabContent>
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
    form: "searchPages"
  })(FilterCmp)
);
