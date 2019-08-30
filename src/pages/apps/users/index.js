import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Modal, Card, CustomInput } from "reactstrap";
import classnames from "classnames";
import IntlMessages from "util/IntlMessages";
import { connect } from "react-redux";
import { range } from "lodash";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { Colxx } from "components/CustomBootstrap";
import mouseTrap from "react-mousetrap";
import { DataListContainer } from "components/DataListContainer";
import {
  getUsersData,
  changeUsersFilter,
  editUserOnModal,
  postUser,
  getUserRoles,
  deleteUser,
  updateUser,
  enableUser
} from "redux/actions";
import { AddUser } from "./addUser";
import { NotificationManager } from "components/ReactNotifications";
import { ConfirmationModal } from "../../../components/ConfirmationModal";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      errorAddingUser: false,
      isLoadingAddingUser: false,
      modalOpen: false
    };
  }
  componentWillMount() {
    this.props.getUsersData(this.props.isArchivedUsers);
    if (!this.props.roles.length) {
      this.props.getUserRoles();
    }
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
  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      errorAddingUser: false
    });
  };

  changeOrderBy = column => {
    const { usersFilter } = this.props;
    usersFilter.orderBy = column;
    usersFilter.page = 1;
    this.props.changeUsersFilter(usersFilter, this.props.isArchivedUsers);
  };
  changePageSize = size => {
    const { usersFilter } = this.props;
    usersFilter.pageSize = size;
    usersFilter.page = 1;
    this.props.changeUsersFilter(usersFilter, this.props.isArchivedUsers);
  };

  onChangePage = page => {
    const { usersFilter } = this.props;
    usersFilter.page = page;
    this.props.changeUsersFilter(usersFilter, this.props.isArchivedUsers);
  };

  handleCheckChange = (event, id) => {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {
      return true;
    }

    let { selectedItems } = this.state;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });
  };

  handleChangeSelectAll(isToggle) {
    let { selectedItems } = this.state;
    if (selectedItems.length >= this.props.usersData.content.length) {
      if (isToggle) {
        selectedItems = [];
      }
    } else {
      selectedItems = range(this.props.usersData.content.length);
    }
    this.setState({ selectedItems });
    return false;
  }

  onEnableUser = () => {
    const index = this.state.selectedItems[0];
    const user = this.props.usersData.result[index];
    this.props.enableUser(user.id, () => {
      this.createNotif("users.enabled-success-message");
    });
    return true;
  };
  onDeleteUsers = isConfirmed => {
    if (this.state.selectedItems.length > 0) {
      if (isConfirmed) {
        const userIds = this.state.selectedItems.map(
          index => this.props.usersData.content[index].id
        );
        this.props.deleteUser(userIds, () => {
          this.createNotif("users.deleted-success-message");
          this.setState({ isConfirmDelete: false, selectedItems: [] });
        });
        return true;
      }
      this.setState({ isConfirmDelete: true });
    }
  };

  onEditUser = index => {
    this.props.editUserOnModal(this.props.usersData.content[index]);
    this.toggleModal();
  };
  onAddUser = () => {
    this.props.editUserOnModal({});
    this.toggleModal();
  };
  createNotif = message => {
    NotificationManager.success(
      this.props.intl.messages[message],
      "",
      3000,
      null,
      null,
      "filled"
    );
  };
  onSubmitUser = ({ confirmPassword, ...others }) => {
    this.setState({ errorAddingUser: false, isLoadingAddingUser: true });
    const successCallback = () => {
      this.setState({ isLoadingAddingUser: false });
      this.createNotif("users.add-success-message");
      this.toggleModal();
    };
    const errorCallback = errorMsg => {
      this.setState({
        errorAddingUser: true,
        isLoadingAddingUser: false,
        errorMsg
      });
    };
    if (others.id) {
      this.props.updateUser(others, successCallback, errorCallback);
    } else {
      this.props.postUser(others, successCallback, errorCallback);
    }
  };
  onContextMenu = ({ detail }) => {
    const selectedItems = [detail.data.data];
    this.setState({ selectedItems });
  };

  onChangePage = page => {
    const { usersFilter } = this.props;
    usersFilter.page = page;
    this.props.changeUsersFilter(usersFilter, this.props.isArchivedUsers);
  };
  conditionRender = () => {
    if (this.props.usersLoading) {
      return <div className="loading" />;
    }
    if (this.props.usersError) {
      return (
        <div className="col-12 text-center h6">
          <IntlMessages id={"user.error-gettings-users"} />
        </div>
      );
    }
    return false;
  };

  render() {
    const { usersFilter, usersData, isArchivedUsers } = this.props;

    return (
      <Fragment>
        <DataListContainer
          title={isArchivedUsers ? "user.Archived-Users" : "user.Manage-Uses"}
          addNewText="user.Add-User"
          hideButtons={isArchivedUsers}
          onAddClick={this.onAddUser}
          dataLength={usersData.totalElements ? usersData.totalElements : 0}
          pageSize={usersFilter.pageSize}
          changePageSize={this.changePageSize}
          onChangeOrderBy={this.changeOrderBy}
          orderBy={usersFilter.orderBy}
          onChangePage={this.onChangePage}
          currentPage={usersFilter.page}
          isAllSelected={
            usersData.content &&
            usersData.content.length === this.state.selectedItems.length
          }
          onAllSelectedClick={() => this.handleChangeSelectAll(true)}
          onDeleteSelected={() => this.onDeleteUsers()}
        >
          {this.conditionRender()
            ? this.conditionRender()
            : usersData.content &&
              usersData.content.map((product, index) => {
                return (
                  <Colxx xxs="12" key={index} className="mb-3">
                    <ContextMenuTrigger id="menu_id" data={index}>
                      <Card
                        onClick={e => this.handleCheckChange(e, index)}
                        className={classnames("d-flex flex-row", {
                          active: this.state.selectedItems.includes(index)
                        })}
                      >
                        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                          <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                            <p className="list-item-heading mb-1 truncate">
                              {product.firstName + " " + product.lastName}
                            </p>
                            <p className="mb-1 text-muted text-small w-15 w-sm-100">
                              {product.login}
                            </p>
                            <p className="mb-1 text-muted text-small w-15 w-sm-100">
                              {product.email}
                            </p>
                          </div>
                          {!isArchivedUsers && (
                            <Fragment>
                              <div className="align-self-center pr-3">
                                <a
                                  href=" "
                                  onClick={e => {
                                    e.preventDefault();
                                    this.onEditUser(index);
                                  }}
                                >
                                  <i className="simple-icon-pencil" />
                                </a>
                              </div>
                              <div className="align-self-center pr-4">
                                <a
                                  href=" "
                                  onClick={e => {
                                    e.preventDefault();
                                    this.setState(
                                      { selectedItems: [index] },
                                      () => this.onDeleteUsers()
                                    );
                                  }}
                                >
                                  <i className="simple-icon-trash" />
                                </a>
                              </div>
                              <div className="align-self-center pr-4">
                                <CustomInput
                                  className="itemCheck mb-0"
                                  type="checkbox"
                                  id={`check_${index}`}
                                  checked={this.state.selectedItems.includes(
                                    index
                                  )}
                                  label=""
                                  onChange={() => {}}
                                />
                              </div>
                            </Fragment>
                          )}
                          {isArchivedUsers && (
                            <div className="align-self-center pr-4">
                              <a
                                href=" "
                                onClick={e => {
                                  e.preventDefault();
                                  this.setState(
                                    { selectedItems: [index] },
                                    this.onEnableUser
                                  );
                                }}
                              >
                                <i className="simple-icon-check" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Card>
                    </ContextMenuTrigger>
                  </Colxx>
                );
              })}
        </DataListContainer>
        <ConfirmationModal
          isOpen={this.state.isConfirmDelete}
          toggle={() =>
            this.setState({ isConfirmDelete: !this.state.isConfirmDelete })
          }
          title={"users.confirm-delete-title"}
          content={"users.confirm-delete"}
          onConfirmClick={() => this.onDeleteUsers(true)}
        />
        <Modal
          isOpen={this.state.modalOpen}
          toggle={this.toggleModal}
          wrapClassName="modal-right"
          backdrop="static"
        >
          <AddUser
            errorAddingUser={this.state.errorAddingUser}
            isLoadingAddingUser={this.state.isLoadingAddingUser}
            msgError={this.state.errorMsg}
            toggleModal={this.toggleModal}
            onSubmit={this.onSubmitUser}
          />
        </Modal>

        <ContextMenu id="menu_id" onShow={this.onContextMenu}>
          {!isArchivedUsers && (
            <Fragment>
              <MenuItem onClick={() => this.onDeleteUsers()}>
                <i className="simple-icon-trash" />
                <span>
                  <IntlMessages id="Delete" />
                </span>
              </MenuItem>
              <MenuItem
                onClick={() => this.onEditUser(this.state.selectedItems[0])}
              >
                <i className="simple-icon-pencil" />
                <span>
                  <IntlMessages id="Edit" />
                </span>
              </MenuItem>
            </Fragment>
          )}
          {isArchivedUsers && (
            <MenuItem onClick={() => this.onEnableUser()}>
              <i className="simple-icon-check" />
              <span>
                <IntlMessages id="Enable" />
              </span>
            </MenuItem>
          )}
        </ContextMenu>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ appData }) => ({
  usersData: appData.users.data,
  usersLoading: appData.users.loading,
  usersError: appData.users.error,
  usersFilter: appData.users.filter,
  roles: appData.users.roles
});

export default connect(
  mapStateToProps,
  {
    getUsersData,
    changeUsersFilter,
    editUserOnModal,
    postUser,
    getUserRoles,
    updateUser,
    deleteUser,
    enableUser
  }
)(injectIntl(mouseTrap(Users)));
