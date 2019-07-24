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

import { servicePath } from "../../../constants/defaultValues";

const categories = ["cat1", "cat2"];
const labels = ["labl1,labl2"];

const queryString = require("query-string");
class SurveyListApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryToExecute: "",
      connecection: {
        currentDatabase: ""
      },
      queries: null,
      databases: [],
      QueryResult: {
        columns: [],
        data: [],
        options: []
      }
    };
  }

  prepareQueryResult(response) {
    let data = [];
    let cols = [];
    if (
      response != null &&
      response.data != null &&
      response.data.tableName != null
    ) {
      cols = response.data.rows[0].columns.map(column => {
        return column.columnName;
      });

      data = response.data.rows.map(row => {
        return row.columns.map(value => {
          return value.columnValue;
        });
      });
    }
    this.setState({
      QueryResult: {
        ...this.state.QueryResult,
        columns: cols,
        data: data
      }
    });
  }

  getMuiTheme = () =>
    createMuiTheme({
      typography: {
        useNextVariants: true
      },
      overrides: {
        MUIDataTableSelectCell: {
          root: {
            backgroundColor: "white"
          }
        }
      }
    });

  componentWillMount() {
    this.getConnection();

    this.getAllDatabases();
  }

  getConnection = () => {
    const connectionId = queryString.parse(this.props.location.search).id;

    instance
      .get(servicePath + "/api/connexions/" + connectionId)
      .then(response => {
        if (response != null) {
          this.setState({ connecection: response.data });

          this.setState({ queries: response.data.queries });
        }
      });
  };

  getAllDatabases = () => {
    const connectionId = queryString.parse(this.props.location.search).id;
    instance
      .get(servicePath + "/api/databases/" + connectionId)
      .then(response => {
        if (response) {
          let databases = response.data.rows.map((row, index) => {
            return {
              label: row.columns[0].columnValue,
              value: row.columns[0].columnValue,
              key: index
            };
          });
          this.setState({ databases: databases });
        }
      })
      .catch(e => {
        console.log("[getAllDATABASES] " + e.message);
      });
  };

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
                            event.target.value === "on" ? "COMPLETED" : "ACTIVE"
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
                            event.target.value !== "on" ? "COMPLETED" : "ACTIVE"
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
                <i className="simple-icon-arrow-down align-middle" />
              </Button>

              <Collapse
                className="d-md-block"
                isOpen={this.state.displayOptionsIsOpen}
              >
                <div className="d-block mb-2 d-md-inline-block">
                  <Select
                    placeholder={
                      "Current: " + this.state.connecection.currentDatabase
                    }
                    onChange={e => {
                      if (e.value !== this.state.connecection.currentDatabase) {
                        instance.get(
                          "/api/connexions/updateDatabase/" +
                            this.state.connecection.id +
                            "/" +
                            e.value
                        );
                      }
                    }}
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    name="databases"
                    id="connexion-databases"
                    options={this.state.databases}
                  />
                </div>
              </Collapse>
            </div>

            <Separator className="mb-5" />
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="SQL" />
                </CardTitle>
                <textarea
                  style={{ width: "100%", height: "200px" }}
                  value={this.state.queryToExecute}
                  onChange={e => {
                    this.setState({ queryToExecute: e.target.value });
                  }}
                />
              </CardBody>
              <table
                border="0"
                style={{
                  borderCollapse: "separate !important",
                  marginRight: "10px",
                  marginBottom: "16px"
                }}
              >
                <tbody>
                  <tr>
                    <td align="right" style={{ padding: "18px" }}>
                      <Button
                        onClick={e => {
                          instance
                            .post("/api/statment", {
                              statement: this.state.queryToExecute,
                              connection: this.state.connecection.id + ""
                            })
                            .then(response => {
                              this.prepareQueryResult(response);
                            });
                        }}
                        title="Execute"
                        target="_blank"
                        style={{
                          border: 0,
                          fontSize: "14px",
                          lineHeight: "1.5",
                          fontWeight: "700",
                          letterSpacing: "1px",
                          padding: "15px 40px",
                          textAlign: "center",
                          textDecoration: "none",
                          color: "#FFFFFF",
                          borderadius: "50px",
                          backgroundColor: "#922c88"
                        }}
                      >
                        Execute
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title={"Employee List"}
                  data={this.state.QueryResult.data}
                  columns={this.state.QueryResult.columns}
                  options={this.state.QueryResult.options}
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
                <IntlMessages id="queries" />
              </p>
              <ul>
                {this.state.queries !== null
                  ? this.state.queries.map(query => {
                      return (
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a
                          style={{ display: "block" }}
                          href="#"
                          onClick={e => {
                            e.preventDefault();

                            instance
                              .get("/api/statment/" + query.id)
                              .then(response => {
                                this.prepareQueryResult(response);
                              })
                              .catch(e => {
                                console.log(e.message);
                              });
                          }}
                          key={query.id}
                        >
                          {query.name}
                        </a>
                      );
                    })
                  : null}
              </ul>
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
