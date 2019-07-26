import React, { Component, Fragment } from "react";
import IntlMessages from "../../../util/IntlMessages";
import { injectIntl } from "react-intl";
import MUIDataTable from "mui-datatables";
import instance from "../../../util/instances";
import axios from "axios";

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
import { NotificationManager } from "../../../components/ReactNotifications";

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
      disableExecute: false,
      queryName: "",
      modal: false,
      queryToExecute: "",
      quereryExecuted: false,
      quereryExecutionStatus: "",
      connecection: {
        currentDatabase: ""
      },
      queries: null,
      databases: [],
      QueryResult: {
        columns: [],
        data: [],
        options: {
          pagination: true
        }
      }
    };
  }

  handleExecuteQuery = () => {
    this.setState({ disableExecute: true });
    axios.defaults.headers.common["Authorization"] =
      instance.defaults.headers.common["Authorization"];
    axios
      .post(servicePath + "/api/statment", {
        statement: this.state.queryToExecute,
        connection: this.state.connecection.id + ""
      })
      .then(response => {
        this.prepareQueryResult(response);
        this.customNotification(
          "success",
          "Query executed successfully",
          "Info"
        );
      })
      .catch(e => {
        this.customNotification(
          "error",
          "Query execution Failded",
          "Error Execution"
        );
      });
    this.setState({ quereryExecuted: true });
    this.setState({ disableExecute: false });
  };

  saveQuery = () => {
    if (this.state.queryToExecute !== "") {
      this.setState({ modal: true });
    } else {
      this.customNotification(
        "error",
        "Query Stirng Shouldn't be  empty",
        "Error"
      );
    }
  };

  customNotification(status, message, title) {
    if (status === "success") {
      NotificationManager.success(
        message,
        title,
        5000,
        () => {
          alert("callback");
        },
        null,
        null
      );
    } else if (status === "error") {
      NotificationManager.error(
        message,
        title,
        5000,
        () => {
          alert("callback");
        },
        null,
        "danger"
      );
    }
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

  updateQueries = (queries, currentDatabase) => {
    const qs = [];
    queries.filter(q => {
      if (q.database === currentDatabase) {
        qs.push(q);
      }
      return true;
    });
    this.setState({ queries: qs });
  };
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

          this.updateQueries(
            response.data.queries,
            response.data.currentDatabase
          );
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
                        this.setState({
                          connecection: {
                            ...this.state.connecection,
                            currentDatabase: e.value
                          }
                        });
                        instance.get(
                          "/api/connexions/updateDatabase/" +
                            this.state.connecection.id +
                            "/" +
                            e.value
                        );
                        this.updateQueries(
                          this.state.connecection.queries,
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

              <Modal
                isOpen={this.state.modal}
                toggle={e => {
                  this.setState({ modal: false });
                }}
              >
                <ModalHeader
                  toggle={e => {
                    this.setState({ modal: false });
                  }}
                >
                  <IntlMessages id="modal.modal-title" />
                </ModalHeader>
                <ModalBody>
                  <Input
                    placeholder="Enter Query Name Here"
                    id="query-name"
                    name="queryname"
                    value={this.state.queryName}
                    onChange={e => {
                      this.setState({ queryName: e.target.value });
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={e => {
                      const query = {
                        connexion: this.state.connecection,
                        created_at: new Date(),
                        database: this.state.connecection.currentDatabase,
                        executions: [],
                        name: this.state.queryName,
                        statment: this.state.queryToExecute,
                        type: this.state.connecection.connector.type
                      };
                      if (this.state.queryToExecute === "") {
                        this.customNotification(
                          "error",
                          "Query Shouldn't be an empty string",
                          "Error"
                        );
                      } else if (this.state.queryName === "") {
                        this.customNotification(
                          "error",
                          "Query Name Shouldn't be an empty string",
                          "Error"
                        );
                      } else {
                        axios.defaults.headers.common["Authorization"] =
                          instance.defaults.headers.common["Authorization"];
                        axios
                          .post(servicePath + "/api/queries", query)
                          .then(response => {
                            this.customNotification(
                              "success",
                              "Query saved !",
                              "Info"
                            );
                            const qs = this.state.queries;
                            qs.push({
                              id: response.data.id,
                              type: query.type,
                              name: query.name,
                              statment: query.statment,
                              created_at: query.created_at
                            });
                            this.setState({ queries: qs });
                          })
                          .catch(e => {
                            this.customNotification(
                              "error",
                              "couldn't save Query",
                              "Error"
                            );
                          });

                        this.setState({ modal: false });
                      }
                    }}
                  >
                    Submit
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={e => {
                      this.setState({ modal: false });
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>

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
                        onClick={this.saveQuery}
                        title="Execute"
                        target="_blank"
                        style={{
                          border: 0,
                          fontSize: "14px",
                          marginRight: "2%",
                          lineHeight: "1.5",
                          fontWeight: "700",
                          letterSpacing: "1px",
                          padding: "15px 40px",
                          textAlign: "center",
                          textDecoration: "none",
                          color: "#FFFFFF",
                          borderadius: "50px",
                          backgroundColor: "#28a745de"
                        }}
                      >
                        save query
                      </Button>
                      <Button
                        disabled={this.state.disableExecute}
                        onClick={e => {
                          this.handleExecuteQuery();
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
                  title={"Result List"}
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
                            this.setState({ queryToExecute: query.statment });
                            instance
                              .get("/api/statment/" + query.id)
                              .then(response => {
                                this.prepareQueryResult(response);
                                this.customNotification(
                                  "success",
                                  "Query executed successfully",
                                  "Info"
                                );
                              })
                              .catch(e => {
                                this.customNotification(
                                  "error",
                                  "Query execution Failded",
                                  "Error Execution"
                                );
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
