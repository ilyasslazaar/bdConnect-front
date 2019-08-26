import React, { Component, Fragment } from "react";
import IntlMessages from "../../../util/IntlMessages";
import { injectIntl } from "react-intl";
import MUIDataTable from "mui-datatables";
import instance from "../../../util/instances";
import { adminRole } from "../../../util/permissions";
import axios from "axios";

import {
  Row,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { NotificationManager } from "../../../components/ReactNotifications";
import Pagination from "../../../components/List/Pagination";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Colxx } from "../../../components/CustomBootstrap";
import { connect } from "react-redux";

import {
  getSurveyList,
  getSurveyListWithFilter,
  getSurveyListWithOrder,
  getSurveyListSearch,
  addSurveyItem,
  selectedSurveyItemsChange
} from "../../../redux/actions";

import { servicePath } from "../../../constants/defaultValues";
import AceEditor from "react-ace";
import "react-ace-builds/webpack-resolver-min";
import "brace/mode/mysql";
import "brace/theme/monokai";
import "brace/ext/language_tools";
import "brace/snippets/mysql";

const apiUrl = servicePath + "/api/statment";
const queryString = require("query-string");
class SurveyListApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryNameToUpdate: "",
      collapse: false,
      tableName: "Result List",
      selectedPageSize: 10,
      currentPage: 1,
      totalPage: 1,
      search: "",
      disableExecute: false,
      queryName: "",
      modal: false,
      queryToExecute: "",
      quereryExecuted: false,
      quereryExecutionStatus: "",
      connection: {
        currentDatabase: ""
      },
      InputDisabled: true,
      query: {
        statment: ""
      },
      databases: [],
      QueryResult: {
        columns: [],
        data: [],
        options: {
          pagination: false
        }
      }
    };
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  HandleIntialQuery = queryToExecute => {
    this.setState({ disableExecute: true });
    axios.defaults.headers.common["Authorization"] =
      instance.defaults.headers.common["Authorization"];
    axios
      .post(apiUrl, {
        statement: queryToExecute.statment,
        connection: queryToExecute.connexion.id + "",
        offset: "1",
        limit: "10"
      })
      .then(response => {
        this.prepareQueryResult(response);
      })
      .catch(e => {
        this.customNotification(
          "error",
          "Query execution Failded :" + e.response.data.message,
          "Error Execution"
        );
      });
    this.setState({ quereryExecuted: true, disableExecute: false });
  };

  handleExecuteQuery = e => {
    this.setState({ disableExecute: true });
    axios.defaults.headers.common["Authorization"] =
      instance.defaults.headers.common["Authorization"];
    const { selectedPageSize, currentPage } = this.state;
    const notify = e !== undefined;
    axios
      .post(apiUrl, {
        statement: this.state.queryToExecute,
        connection: this.state.connection.id + "",
        offset: currentPage + "",
        limit: selectedPageSize + ""
      })
      .then(response => {
        this.prepareQueryResult(response);

        notify &&
          this.customNotification(
            "success",
            "Query executed successfully",
            "Info"
          );
      })
      .catch(e => {
        notify &&
          this.customNotification(
            "error",
            "Query execution Failded : " + e.response.data.message,
            "Error Execution"
          );
      });
    this.setState({ quereryExecuted: true, disableExecute: false });
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
  onChangePage = page => {
    this.setState(
      {
        currentPage: page
      },
      () => this.handleExecuteQuery()
    );
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
      tableName:
        response.data.tableName !== undefined
          ? response.data.tableName
          : "Results List",
      totalPage: response.data.totalRecords,
      QueryResult: {
        ...this.state.QueryResult,
        columns: cols,
        data: data
      }
    });
  }

  toggleUpdateButtons = () => {
    return (
      this.state.queryToExecute !== this.state.query.statment ||
      this.state.queryNameToUpdate !== this.state.query.name
    );
  };

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
    this.getQuery();
  }

  getQuery = () => {
    const queryId = queryString.parse(this.props.location.search).id;

    instance.get(servicePath + "/api/queries/" + queryId).then(response => {
      if (response != null) {
        this.setState({
          query: response.data,
          connection: response.data.connexion,
          queryToExecute: response.data.statment,
          queryNameToUpdate: response.data.name
        });
        this.HandleIntialQuery(response.data);
      }
    });
  };

  dataListRender() {
    const { selectedPageSize, currentPage } = this.state;
    axios
      .get(`${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}`)
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          totalPage: data.totalPages,
          items: data.content,
          selectedItems: [],
          totalItemCount: data.totalElements,
          isLoading: true
        });
      });
  }

  render() {
    return (
      <Fragment>
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <Card>
              {adminRole() && (
                <InputGroup style={{ margin: "5px 0 5px 0" }}>
                  <Input
                    style={
                      this.state.InputDisabled
                        ? {
                            marginLeft: "5px",
                            background: "white",
                            border: "none"
                          }
                        : { marginLeft: "5px", background: "white" }
                    }
                    value={this.state.queryNameToUpdate}
                    onChange={e => {
                      this.setState({
                        queryNameToUpdate: e.target.value
                      });
                    }}
                    disabled={this.state.InputDisabled}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      onClick={e => {
                        this.setState({
                          InputDisabled: !this.state.InputDisabled
                        });
                      }}
                      outline
                      color="secondary"
                      style={{ marginRight: "5px", borderRadius: "0px" }}
                    >
                      {this.state.InputDisabled ? (
                        <i className="glyph-icon simple-icon-pencil " />
                      ) : (
                        <i className="glyph-icon simple-icon-close " />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              )}
              {adminRole() && (
                <AceEditor
                  editorProps={{
                    $blockScrolling: Infinity
                  }}
                  mode="mysql"
                  theme="monokai"
                  height="100px"
                  width="98%"
                  name="blah2"
                  onLoad={this.onLoad}
                  onChange={value => {
                    this.setState({
                      currentPage: 1,
                      queryToExecute: value
                    });
                  }}
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.queryToExecute}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              )}

              {adminRole() && (
                <div
                  style={{
                    margin: "5px"
                  }}
                >
                  <Button
                    color={"success"}
                    disabled={this.state.disableExecute}
                    onClick={e => {
                      this.handleExecuteQuery("execute");
                    }}
                    title="Execute"
                    target="_blank"
                    style={{ margin: " 0px 5px", float: "right" }}
                  >
                    Execute
                  </Button>
                  {this.toggleUpdateButtons() && (
                    <Button
                      color={"info"}
                      onClick={this.saveQuery}
                      title="save query"
                      target="_blank"
                      style={{ margin: " 0px 5px", float: "right" }}
                    >
                      Save as new
                    </Button>
                  )}
                  {this.toggleUpdateButtons() && (
                    <Button
                      onClick={e => {
                        let updatedQuery = this.state.query;
                        updatedQuery.statment = this.state.queryToExecute;
                        updatedQuery.name = this.state.queryNameToUpdate;

                        axios.defaults.headers.common["Authorization"] =
                          instance.defaults.headers.common["Authorization"];
                        axios
                          .put(servicePath + "/api/queries", updatedQuery)
                          .then(response => {
                            this.setState({ query: response.data });
                            this.customNotification(
                              "success",
                              "Query Updated Successfully",
                              "Error"
                            );
                          });
                      }}
                      title="save query"
                      target="_blank"
                      style={{ margin: " 0px 5px", float: "right" }}
                    >
                      Update
                    </Button>
                  )}
                </div>
              )}

              {adminRole() && (
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
                          connexion: this.state.connection,
                          created_at: new Date(),
                          database: this.state.connection.currentDatabase,
                          executions: [],
                          name: this.state.queryName,
                          statment: this.state.queryToExecute,
                          type: this.state.connection.connector.type
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
                            })
                            .catch(e => {
                              this.customNotification(
                                "error",
                                "couldn't save Query" + e.message,
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
              )}
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title={this.state.tableName}
                  data={this.state.QueryResult.data}
                  columns={this.state.QueryResult.columns}
                  options={this.state.QueryResult.options}
                />
                <Pagination
                  size="sm"
                  currentPage={this.state.currentPage}
                  totalPage={this.state.totalPage}
                  onChangePage={i => this.onChangePage(i)}
                />
              </MuiThemeProvider>
            </Card>
          </Colxx>
        </Row>
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
