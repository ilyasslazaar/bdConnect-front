/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { servicePath } from "../../../constants/defaultValues";
import instance from "../../../util/instances";
import { NotificationManager } from "../../../components/ReactNotifications";
import { adminRole } from "../../../util/permissions";
import AceEditor from "react-ace";
import {
  Row,
  Card,
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  UncontrolledDropdown,
  Collapse,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  Label,
  Badge,
  Alert
} from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import { NavLink } from "react-router-dom";

import classnames from "classnames";

import IntlMessages from "../../../util/IntlMessages";
import { Colxx, Separator } from "../../../components/CustomBootstrap";

import Pagination from "../../../components/List/Pagination";
import mouseTrap from "react-mousetrap";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const queryString = require("query-string");
function collect(props) {
  return { data: props.data };
}

class QueryList extends Component {
  constructor(props) {
    super(props);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.dataListRender = this.dataListRender.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.onContextMenuClick = this.onContextMenuClick.bind(this);

    this.state = {
      query: {
        type: "",
        name: "",
        statment: "",
        created_at: new Date(),
        database: "",
        connexion: null,
        executions: []
      },
      togleTitle: true,
      selectedUser: "",
      displayMode: "list",
      pageSizes: [10, 20, 30, 50, 100],
      selectedPageSize: 10,
      orderOptions: [
        { column: "name", label: "Query Name" },
        { column: "ssl", label: "query type" }
      ],
      selectedOrderOption: { column: "name", label: "Connection Name" },
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 0,
      search: "",
      selectedItems: [],
      lastChecked: null,
      displayOptionsIsOpen: false,
      isLoading: false
    };
  }
  componentWillMount() {
    this.props.bindShortcut(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.props.bindShortcut(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
  }

  validateConnectionForm = () => {
    let errors = "";
    if (isNaN(this.state.connectionForm.port)) {
      errors += "port should be a number\n";
    }
    if (
      this.state.connectionForm.port === "" ||
      this.state.connectionForm.hostname === "" ||
      this.state.connectionForm.name === "" ||
      this.state.connectionForm.user === "" ||
      this.state.connector === ""
    ) {
      errors += "Worng Iput make sure you enter a valid data";
    }
    return errors;
  };
  OnInputChange = event => {
    this.setState({
      connectionForm: {
        ...this.state.connectionForm,
        [event.target.name]: event.target.value
      }
    });
  };

  hundleNewConnexionSubmit = () => {
    let errors = this.validateConnectionForm();
    if (errors === "" && this.state.togleTitle) {
      instance
        .post(
          servicePath +
            "/api/connexions/" +
            this.state.selectedUser +
            "/" +
            this.state.connector,
          this.state.connectionForm
        )
        .then(() => {
          this.toggleModal();
          this.dataListRender();
        });
    } else if (!this.state.togleTitle) {
      const updateForm = {
        ...this.state.connectionForm,
        id: this.state.connectionToUpdate + ""
      };
      instance
        .put(
          servicePath + "/api/connexions/" + this.state.connector,
          updateForm
        )
        .then(() => {
          this.toggleModal();
          this.dataListRender();
        });
    } else {
      this.setState({ formErrors: errors });
    }
  };

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen,
      togleTitle: true,
      formErrors: ""
    });
  }
  toggleDisplayOptions() {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  }
  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }
  changeOrderBy(column) {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  }
  changePageSize(size) {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  }
  changeDisplayMode(mode) {
    this.setState({
      displayMode: mode
    });
    return false;
  }
  onChangePage(page) {
    this.setState(
      {
        currentPage: page
      },
      () => this.dataListRender()
    );
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.dataListRender()
      );
    }
  }

  handleCheckChange(event, id) {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {
      return true;
    }
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });

    if (event.shiftKey) {
      var items = this.state.items;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems
      });
    }
    document.activeElement.blur();
    //console.log(this.state);
  }

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  handleChangeSelectAll(isToggle) {
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: []
        });
      }
    } else {
      this.setState({
        selectedItems: this.state.items.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  }
  componentDidMount() {
    this.dataListRender();
    this.loadConnection();
  }

  loadConnection = () => {
    const connectionId = queryString.parse(this.props.location.search).id;

    instance
      .get(servicePath + "/api/connexions/" + connectionId)
      .then(response => {
        this.setState({
          query: {
            ...this.state.query,
            connexion: response.data,
            type: response.data.connector.type,
            database: response.data.currentDatabase
          }
        });
      });
  };

  dataListRender() {
    const connectionId = queryString.parse(this.props.location.search).id;
    const url = "/api/connections/" + connectionId + "/queries";
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;

    instance
      .get(
        `${servicePath +
          url}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
          selectedOrderOption.column
        }&search=${search}&u=${adminRole() ? 1 : 2}`
      )
      .then(response => {
        if (response != null) {
          this.setState({
            totalPage: response.data.totalPages,
            items: response.data.content,
            selectedItems: [],
            totalItemCount: response.data.totalElements,
            isLoading: true
          });
        }
      });
  }

  onContextMenuClick = (e, data, target) => {
    if (
      this.state.selectedItems !== undefined &&
      this.state.selectedItems.length > 0
    ) {
      confirmAlert({
        message: "Are you sure you want to delete this query ",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              instance
                .post(
                  servicePath + "/api/queries/delete",
                  this.state.selectedItems
                )
                .then(() => {
                  this.dataListRender();
                });
            }
          },
          {
            label: "No",
            onClick: () => {}
          }
        ]
      });
    } else {
      NotificationManager.error(
        "please select  Connection(s) to delete",
        "ERROR: can't delete connection(s) ",
        5000,
        () => {
          alert("callback");
        },
        null,
        "danger"
      );
    }
  };

  OnUpdateClick = e => {
    const selectedConnectionId = this.state.selectedItems[
      this.state.selectedItems.length - 1
    ];
    instance
      .get(servicePath + "/api/connexions/" + selectedConnectionId)
      .then(response => {
        this.setState({
          togleTitle: false,
          connectionToUpdate: response.data.id,
          connector: response.data.connector.id,
          modalOpen: true,
          connectionForm: {
            ...this.state.connectionForm,
            currentDatabase: response.data.currentDatabase,
            hostname: response.data.hostname,
            name: response.data.name,
            password: response.data.password,
            port: response.data.port,
            queries: response.data.queries,
            ssl: response.data.ssl,
            user: response.data.user
          }
        });
      });

    if (this.state.selectedItems.length > 1) {
      NotificationManager.warning(
        "Can't update  multiple connections last one is selected !",
        "update Warning",
        3000,
        null,
        null,
        ""
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

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }

    return true;
  };

  render() {
    const startIndex =
      (this.state.currentPage - 1) * this.state.selectedPageSize;
    const endIndex = this.state.currentPage * this.state.selectedPageSize;
    const { messages } = this.props.intl;
    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <Row>
            <Colxx xxs="12">
              <div className="mb-2">
                <h1>
                  <IntlMessages id="menu.query-list" />
                </h1>

                <div className="float-sm-right">
                  {adminRole() && (
                    <Button
                      color="primary"
                      size="lg"
                      className="top-right-button"
                      onClick={this.toggleModal}
                    >
                      <IntlMessages id="Query.add-new" />
                    </Button>
                  )}
                  {"  "}

                  <Modal
                    isOpen={this.state.modalOpen}
                    toggle={this.toggleModal}
                    wrapClassName="modal-right"
                    backdrop="static"
                  >
                    <AvForm>
                      {this.state.formErrors !== "" ? (
                        <Alert color="danger">{this.state.formErrors}</Alert>
                      ) : null}
                      <ModalHeader toggle={this.toggleModal}>
                        <IntlMessages id={"pages.add-new-query-title"} />
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          placeholder="Query  Name"
                          id="query-name"
                          name="name"
                          value={this.state.query.name}
                          onChange={e => {
                            console.log(this.state.query.name);
                            this.setState({
                              query: {
                                ...this.state.query,
                                name: e.target.value
                              }
                            });
                          }}
                        />
                        <Label className="mt-4" />
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
                              query: {
                                ...this.state.query,
                                statment: value
                              }
                            });
                          }}
                          placeholder="type your query"
                          fontSize={14}
                          showPrintMargin={true}
                          showGutter={true}
                          highlightActiveLine={true}
                          value={this.state.query.statment}
                          setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="secondary"
                          outline
                          onClick={this.toggleModal}
                        >
                          <IntlMessages id="pages.cancel" />
                        </Button>
                        <Button
                          color="primary"
                          onClick={e => {
                            if (
                              this.state.query.name !== "" &&
                              this.state.query.statment !== ""
                            ) {
                              instance
                                .post(
                                  servicePath + "/api/queries",
                                  this.state.query
                                )
                                .then(response => {
                                  const queries = this.state.items;
                                  queries.push(response.data);
                                  this.setState({
                                    items: queries
                                  });
                                });
                              this.toggleModal();
                              this.customNotification(
                                "success",
                                "Query Added successfully",
                                "Info"
                              );
                            } else {
                              this.customNotification(
                                "error",
                                "Error :Query name and/or Statment shouldn't be empty",
                                "Info"
                              );
                            }
                          }}
                        >
                          <IntlMessages id="pages.submit" />
                        </Button>{" "}
                      </ModalFooter>
                    </AvForm>
                  </Modal>
                  {adminRole()&&
                  <ButtonDropdown
                    isOpen={this.state.dropdownSplitOpen}
                    toggle={this.toggleSplit}
                  >
                    <div className="btn btn-primary pl-4 pr-0 check-button">
                      <Label
                        for="checkAll"
                        className="custom-control custom-checkbox mb-0 d-inline-block"
                      >
                        <Input
                          className="custom-control-input"
                          type="checkbox"
                          id="checkAll"
                          onChange={() => {
                            console.log("checked at data-list line 374");
                          }}
                          checked={
                            this.state.selectedItems.length >=
                            this.state.items.length
                          }
                          onClick={() => this.handleChangeSelectAll(true)}
                        />
                        <span
                          className={`custom-control-label ${
                            this.state.selectedItems.length > 0 &&
                            this.state.selectedItems.length <
                              this.state.items.length
                              ? "indeterminate"
                              : ""
                          }`}
                        />
                      </Label>
                    </div>
                    <DropdownToggle
                      caret
                      color="primary"
                      className="dropdown-toggle-split pl-2 pr-2"
                    />
                    <DropdownMenu right>
                      <DropdownItem
                        onClick={() => {
                          this.onContextMenuClick();
                        }}
                      >
                        <IntlMessages id="pages.delete" />
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>}
                </div>
              </div>

              <div className="mb-2">
                <Button
                  color="empty"
                  className="pt-0 pl-0 d-inline-block d-md-none"
                  onClick={this.toggleDisplayOptions}
                >
                  <i className="simple-icon-arrow-down align-middle" />
                </Button>
                <Collapse
                  isOpen={this.state.displayOptionsIsOpen}
                  className="d-md-block"
                  id="displayOptions"
                >
                  <span className="mr-3 mb-2 d-inline-block float-md-left">
                    <a
                      className={`mr-2 view-icon ${
                        this.state.displayMode === "list" ? "active" : ""
                      }`}
                      onClick={() => this.changeDisplayMode("list")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 19 19"
                      >
                        <path
                          className="view-icon-svg"
                          d="M17.5,3H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z"
                        />
                        <path
                          className="view-icon-svg"
                          d="M17.5,10H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z"
                        />
                        <path
                          className="view-icon-svg"
                          d="M17.5,17H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z"
                        />
                      </svg>
                    </a>
                  </span>

                  <div className="d-block d-md-inline-block">
                    <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                      <DropdownToggle caret color="outline-dark" size="xs">
                        <IntlMessages id="pages.orderby" />
                        {this.state.selectedOrderOption.label}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.orderOptions.map((order, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() => this.changeOrderBy(order.column)}
                            >
                              {order.label}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                      <input
                        type="text"
                        name="keyword"
                        id="search"
                        placeholder={messages["menu.search"]}
                        onKeyPress={e => this.handleKeyPress(e)}
                      />
                    </div>
                  </div>
                  <div className="float-md-right">
                    <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} of ${this.state.totalItemCount} `}</span>
                    <UncontrolledDropdown className="d-inline-block">
                      <DropdownToggle caret color="outline-dark" size="xs">
                        {this.state.selectedPageSize}
                      </DropdownToggle>
                      <DropdownMenu right>
                        {this.state.pageSizes.map((size, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() => this.changePageSize(size)}
                            >
                              {size}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </Collapse>
              </div>
              <Separator className="mb-5" />
            </Colxx>
          </Row>
          <Row>
            {this.state.items.map(query => {
              return (
                <Colxx xxs="12" key={query.id} className="mb-3">
                  <ContextMenuTrigger
                    id="menu_id"
                    data={query.id}
                    collect={collect}
                  >
                    <Card
                      onClick={event => this.handleCheckChange(event, query.id)}
                      className={classnames("d-flex flex-row", {
                        active: this.state.selectedItems.includes(query.id)
                      })}
                    >
                      <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                          <NavLink
                            to={`session?id=${query.id}`}
                            className="w-40 w-sm-100"
                          >
                            <p className="list-item-heading mb-1 truncate">
                              {query.name}
                            </p>
                          </NavLink>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">
                            {query.type}
                          </p>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">
                            {query.created_at}
                          </p>
                          <div className="w-15 w-sm-100">
                            <Badge
                              color={
                                query.type === "mysql"
                                  ? "secondary"
                                  : query === "Oracle"
                                  ? "primary"
                                  : null
                              }
                              pill
                            >
                              {query.type}
                            </Badge>
                          </div>
                        </div>
                        {adminRole() &&<div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                          <CustomInput
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_${query.id}`}
                            checked={this.state.selectedItems.includes(
                              query.id
                            )}
                            onChange={() => {}}
                            label=""
                          />
                        </div>}
                      </div>
                    </Card>
                  </ContextMenuTrigger>
                </Colxx>
              );
            })}
            <Pagination
              currentPage={this.state.currentPage}
              totalPage={this.state.totalPage}
              onChangePage={i => this.onChangePage(i)}
            />
          </Row>
        </div>

        <ContextMenu
          id="menu_id"
          onShow={e => this.onContextMenu(e, e.detail.data)}
        >
          {adminRole() && (
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "delete" }}
            >
              <i className="simple-icon-trash" /> <span>Delete</span>
            </MenuItem>
          )}
        </ContextMenu>
      </Fragment>
    );
  }
}
export default injectIntl(mouseTrap(QueryList));
