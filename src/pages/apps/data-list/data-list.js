/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { servicePath } from "../../../constants/defaultValues";
import { CONNECTORS_ENDPOINT } from "../../../constants/defaultValues";
import instance from "../../../util/instances";
import {
  Row,
  Card,
  CustomInput,
  Button,
  InputGroup,
  InputGroupAddon,
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
  Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "../../../components/CustomSelectInput";
import classnames from "classnames";

import IntlMessages from "./../../../util/IntlMessages";
import { Colxx, Separator } from "../../../components/CustomBootstrap";

import Pagination from "../../../components/List/Pagination";
import mouseTrap from "react-mousetrap";
import axios from "axios";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
function collect(props) {
  return { data: props.data };
}

const apiUrl = servicePath + "/api/currentUserConnections";

class DataListLayout extends Component {
  constructor(props) {
    super(props);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.dataListRender = this.dataListRender.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.onContextMenuClick = this.onContextMenuClick.bind(this);

    this.state = {
      connectionForm: {
        host: "",
        port: "",
        name: "",
        connector: "",
        ssl: false,
        user: "",
        password: "",
        currentDatabase: ""
      },
      displayMode: "list",
      pageSizes: [10, 20, 30, 50, 100],
      selectedPageSize: 10,
      connectors: [],
      orderOptions: [
        { column: "name", label: "Connection Name" },
        { column: "connector.type", label: "Connector" },
        { column: "ssl", label: "connection type" }
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
    this.loadConnectors();

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

  OnInputChange = event => {
    this.setState({
      connectionForm: {
        ...this.state.connectionForm,
        [event.target.name]: event.target.value
      }
    });
  };

  loadConnectors = () => {
    let result = [];
    instance.get(CONNECTORS_ENDPOINT).then(response => {
      response.data.map(row => {
        result.push({ label: row.type, value: row.id, key: row.id });
        return false;
      });
    });
    this.setState({
      connectors: result
    });
  };

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
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
  }

  dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;
    axios
      .get(
        `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
          selectedOrderOption.column
        }&search=${search}`
      )
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

  onContextMenuClick = (e, data, target) => {
    console.log(
      "onContextMenuClick - selected items",
      this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
  };

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
                  <IntlMessages id="menu.data-list" />
                </h1>

                <div className="float-sm-right">
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button"
                    onClick={this.toggleModal}
                  >
                    <IntlMessages id="pages.add-new" />
                  </Button>
                  {"  "}

                  <Modal
                    isOpen={this.state.modalOpen}
                    toggle={this.toggleModal}
                    wrapClassName="modal-right"
                    backdrop="static"
                  >
                    <ModalHeader toggle={this.toggleModal}>
                      <IntlMessages id="pages.add-new-connection-title" />
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        placeholder="Connection Name"
                        id="connexion-name"
                        name="name"
                        value={this.state.connectionForm.name}
                        onChange={e => this.OnInputChange(e)}
                      />
                      <Label className="mt-4" />
                      <InputGroup>
                        <InputGroupAddon addonType="prepend" />
                        <Input
                          placeholder="host"
                          id="connexion-host"
                          name="host"
                          value={this.state.connectionForm.host}
                          onChange={e => this.OnInputChange(e)}
                        />
                        <Input
                          placeholder="database"
                          id="connexion-currentDatabase"
                          name="currentDatabase"
                          value={this.state.connectionForm.currentDatabase}
                          onChange={e => this.OnInputChange(e)}
                        />
                        <Input
                          placeholder="port"
                          id="connexion-port"
                          name="port"
                          value={this.state.connectionForm.port}
                          onChange={e => this.OnInputChange(e)}
                        />
                      </InputGroup>
                      <Label className="mt-4" />
                      <InputGroup>
                        <InputGroupAddon addonType="prepend" />
                        <Input
                          placeholder="username"
                          id="connexion-user"
                          name="user"
                          value={this.state.connectionForm.user}
                          onChange={e => this.OnInputChange(e)}
                        />
                        <Input
                          placeholder="password"
                          id="connexion-password"
                          name="password"
                          value={this.state.connectionForm.password}
                          onChange={e => this.OnInputChange(e)}
                        />
                      </InputGroup>
                      <Label className="mt-4" />
                      <Select
                        placeholder="Select a Connector"
                        components={{ Input: CustomSelectInput }}
                        className="react-select"
                        classNamePrefix="react-select"
                        name="connector"
                        id="connexion-connector"
                        options={this.state.connectors}
                        value={this.state.connectionForm.connector}
                        onChange={e => {
                          this.setState({
                            connectionForm: {
                              ...this.state.connectionForm,
                              connector: e.value
                            }
                          });
                        }}
                      />
                      <Label className="mt-4" />
                      <CustomInput
                        type="checkbox"
                        id="connexion-ssl"
                        name="ssl"
                        label="use SSL"
                        checked={this.state.connectionForm.ssl}
                        onChange={e => {
                          this.setState({
                            connectionForm: {
                              ...this.state.connectionForm,
                              [e.target.name]: e.target.checked
                            }
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
                        <IntlMessages id="pages.cancel" />
                      </Button>
                      <Button color="primary" onClick={this.toggleModal}>
                        <IntlMessages id="pages.submit" />
                      </Button>{" "}
                    </ModalFooter>
                  </Modal>
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
                      <DropdownItem>
                        <IntlMessages id="pages.delete" />
                      </DropdownItem>
                      <DropdownItem>
                        <IntlMessages id="pages.update" />
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
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
                    <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} of ${
                      this.state.totalItemCount
                    } `}</span>
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
            {this.state.items.map(connection => {
              return (
                <Colxx xxs="12" key={connection.id} className="mb-3">
                  <ContextMenuTrigger
                    id="menu_id"
                    data={connection.id}
                    collect={collect}
                  >
                    <Card
                      onClick={event =>
                        this.handleCheckChange(event, connection.id)
                      }
                      className={classnames("d-flex flex-row", {
                        active: this.state.selectedItems.includes(connection.id)
                      })}
                    >
                      <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                          <NavLink
                            to={`session?id=${connection.id}`}
                            className="w-40 w-sm-100"
                          >
                            <p className="list-item-heading mb-1 truncate">
                              {connection.name}
                            </p>
                          </NavLink>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">
                            {connection.connector.type}
                          </p>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">
                            {connection.date}
                          </p>
                          <div className="w-15 w-sm-100">
                            <Badge
                              color={
                                connection.connector.type === "mysql"
                                  ? "secondary"
                                  : connection.connector.type === "Oracle"
                                  ? "primary"
                                  : null
                              }
                              pill
                            >
                              {connection.connector.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                          <CustomInput
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_${connection.id}`}
                            checked={this.state.selectedItems.includes(
                              connection.id
                            )}
                            onChange={() => {}}
                            label=""
                          />
                        </div>
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
          <MenuItem onClick={this.onContextMenuClick} data={{ action: "copy" }}>
            <i className="simple-icon-docs" /> <span>Copy</span>
          </MenuItem>
          <MenuItem onClick={this.onContextMenuClick} data={{ action: "move" }}>
            <i className="simple-icon-drawer" /> <span>Move to archive</span>
          </MenuItem>
          <MenuItem
            onClick={this.onContextMenuClick}
            data={{ action: "delete" }}
          >
            <i className="simple-icon-trash" /> <span>Delete</span>
          </MenuItem>
        </ContextMenu>
      </Fragment>
    );
  }
}
export default injectIntl(mouseTrap(DataListLayout));
