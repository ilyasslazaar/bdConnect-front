import React, { Component, Fragment } from "react";
import IntlMessages from "../../../util/IntlMessages";
import { injectIntl } from "react-intl";
import MUIDataTable from "mui-datatables";
import instance from "../../../util/instances";

import {
  Row,
  Card,
  CardBody,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  CardTitle,
  CustomInput,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Colxx, Separator } from "../../../components/CustomBootstrap";
import CustomSelectInput from "../../../components/CustomSelectInput";
import ApplicationMenu from "../../../components/ApplicationMenu";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import Select from "react-select";

import {
  getSurveyList,
  getSurveyListWithFilter,
  getSurveyListWithOrder,
  getSurveyListSearch,
  addSurveyItem,
  selectedSurveyItemsChange
} from "../../../redux/actions";

import ReactQuill from "react-quill";
import { servicePath } from "../../../constants/defaultValues";

const categories = ["cat1", "cat2"];
const labels = ["labl1,labl2"];

const orderColumn = ["tst", "test"];
const orderColumns = ["1", "2"];
const data = [
  ["column1", "column2", "column3"],
  ["column1", "column2", "column3"]
];
const columns = ["column1", "column2", "column3"];
const options = [];
class SurveyListApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connecection: {}
    };
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableSelectCell: {
          root: {
            backgroundColor: "white"
          }
        }
      }
    });

  componentDidMount() {
    const queryString = require("query-string");
    const connectionId = queryString.parse(this.props.location.search).id;

    console.log("component mounted");
    instance
      .get(servicePath + "/api/connexions/" + connectionId)
      .then(response => {
        console.log(response.data);
        this.setState({ connecection: response.data });
      });
  }

  getConnection = () => {};

  render() {
    return (
      <Fragment>
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>{this.state.connecection.name}</h1>

              <div className="float-sm-right">
                <Modal
                  isOpen={this.state.modalOpen}
                  toggle={this.toggleModal}
                  wrapClassName="modal-right"
                  backdrop="static"
                >
                  <ModalHeader toggle={this.toggleModal}>
                    <IntlMessages id="survey.add-new-title" />
                  </ModalHeader>
                  <ModalBody>
                    <Label className="mt-4">
                      <IntlMessages id="survey.title" />
                    </Label>
                    <Input
                      type="text"
                      defaultValue={this.state.title}
                      onChange={event => {
                        this.setState({ title: event.target.value });
                      }}
                    />

                    <Label className="mt-4">
                      <IntlMessages id="survey.category" />
                    </Label>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      name="form-field-name"
                      options={categories.map((x, i) => {
                        return { label: x, value: x, key: i };
                      })}
                      value={this.state.category}
                      onChange={val => {
                        this.setState({ category: val });
                      }}
                    />
                    <Label className="mt-4">
                      <IntlMessages id="survey.label" />
                    </Label>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      name="form-field-name"
                      options={labels.map((x, i) => {
                        return {
                          label: x.label,
                          value: x.label,
                          key: i,
                          color: x.color
                        };
                      })}
                      value={this.state.label}
                      onChange={val => {
                        this.setState({ label: val });
                      }}
                    />

                    <Label className="mt-4">
                      <IntlMessages id="survey.status" />
                    </Label>
                    <CustomInput
                      type="radio"
                      id="exCustomRadio"
                      name="customRadio"
                      label="COMPLETED"
                      checked={this.state.status === "COMPLETED"}
                      onChange={event => {
                        this.setState({
                          status:
                            event.target.value == "on" ? "COMPLETED" : "ACTIVE"
                        });
                      }}
                    />
                    <CustomInput
                      type="radio"
                      id="exCustomRadio2"
                      name="customRadio2"
                      label="ACTIVE"
                      checked={this.state.status === "ACTIVE"}
                      onChange={event => {
                        this.setState({
                          status:
                            event.target.value != "on" ? "COMPLETED" : "ACTIVE"
                        });
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="secondary"
                      outline
                      onClick={this.toggleModal}
                    >
                      <IntlMessages id="survey.cancel" />
                    </Button>
                    <Button color="primary" onClick={() => this.addNetItem()}>
                      <IntlMessages id="survey.submit" />
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </div>

            <div className="mb-2">
              <Button
                color="empty"
                id="displayOptions"
                className="pt-0 pl-0 d-inline-block d-md-none"
                onClick={this.toggleDisplayOptions}
              >
                <IntlMessages id="survey.display-options" />{" "}
                <i className="simple-icon-arrow-down align-middle" />
              </Button>

              <Collapse
                className="d-md-block"
                isOpen={this.state.displayOptionsIsOpen}
              >
                <div className="d-block mb-2 d-md-inline-block">
                  <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                    <DropdownToggle caret color="outline-dark" size="xs">
                      <IntlMessages id="survey.orderby" />
                      {orderColumn ? orderColumn.label : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderColumns.map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => this.changeOrderBy(o.column)}
                          >
                            {o.label}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </Collapse>
            </div>

            <Separator className="mb-5" />
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="SQL" />
                </CardTitle>
                <ReactQuill theme="bubble" />
              </CardBody>
              <table
                border="0"
                Style="border-collapse:separate !important; margin-right:10px; margin-bottom:16px"
              >
                <tbody>
                  <tr>
                    <td align="right" style={{ padding: "18px" }}>
                      <a
                        href="#"
                        title="Execute"
                        target="_blank"
                        Style="font-size: 14px; line-height: 1.5; font-weight: 700; letter-spacing: 1px;padding: 15px 40px; text-align:center; text-decoration:none; color:#FFFFFF; border-radius: 50px; background-color:#922c88;"
                      >
                        Execute
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title={"Employee List"}
                  data={data}
                  columns={columns}
                  options={options}
                />
              </MuiThemeProvider>
            </Card>
          </Colxx>
        </Row>
        <ApplicationMenu>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="p-4">
              <p className="text-muted text-small">
                <IntlMessages id="Queries" />
              </p>
            </div>
          </PerfectScrollbar>
        </ApplicationMenu>
      </Fragment>
    );
  }
}
const mapStateToProps = ({ surveyListApp }) => {
  return {
    surveyListApp
  };
};
export default injectIntl(
  connect(
    mapStateToProps,
    {
      getSurveyList,
      getSurveyListWithFilter,
      getSurveyListWithOrder,
      getSurveyListSearch,
      addSurveyItem,
      selectedSurveyItemsChange
    }
  )(SurveyListApplication)
);
