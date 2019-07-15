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
import * as actions from "redux/projets/actions";
import { AddProjets } from "./addProjets";
import { NotificationManager } from "components/ReactNotifications";
import { ConfirmationModal } from "components/ConfirmationModal";

class Projets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      errorAdding: false,
      isLoadingAdding: false,
      modalOpen: false
    };
  }
  componentWillMount() {
    this.props.getProjets();
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
      modalOpen: !this.state.modalOpen
    });
  };

  changeOrderBy = column => {
    const { listFilter } = this.props;
    listFilter.orderBy = column;
    listFilter.page = 1;
    this.props.getProjets(listFilter);
  };
  changePageSize = size => {
    const { listFilter } = this.props;
    listFilter.pageSize = size;
    listFilter.page = 1;
    this.props.getProjets(listFilter);
  };

  onChangePage = page => {
    const { listFilter } = this.props;
    listFilter.page = page;
    this.props.getProjets(listFilter);
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
    if (selectedItems.length >= this.props.listData.result.length) {
      if (isToggle) {
        selectedItems = [];
      }
    } else {
      selectedItems = range(this.props.listData.result.length);
    }
    this.setState({ selectedItems });
    return false;
  }

  onDeleteItems = isConfirmed => {
    if (this.state.selectedItems.length > 0) {
      if (isConfirmed) {
        const index = this.state.selectedItems[0];
        const item = this.props.listData.result[index];
        this.props.deleteProjets(item.id, () => {
          this.createNotif("projets.deleted-success-message");
          this.setState({ isConfirmDelete: false });
        });
        return true;
      }
      this.setState({ isConfirmDelete: true });
    }
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
  onSubmitItem = team => {
    this.setState({ errorAdding: false, isLoadingAdding: true });
    const successCallback = () => {
      this.setState({ isLoadingAdding: false });
      this.createNotif("projets.add-success-message");
      this.toggleModal();
    };
    const errorCallback = () => {
      this.setState({ errorAdding: true, isLoadingAdding: false });
    };
    this.props.postProjets(team, successCallback, errorCallback);
  };
  onContextMenu = ({ detail }) => {
    const selectedItems = [detail.data.data];
    this.setState({ selectedItems });
  };

  onChangePage = page => {
    const { listFilter } = this.props;
    listFilter.page = page;
    this.props.getProjets(listFilter);
  };
  conditionRender = () => {
    if (this.props.listLoading) {
      return <div className="loading" />;
    }
    if (this.props.listError) {
      return (
        <div className="col-12 text-center h6">
          <IntlMessages id="projets.error-gettings" />
        </div>
      );
    }
    return false;
  };

  render() {
    let { listFilter, listData } = this.props;
    if (!listData.result) {
      listData = { result: listData, total: listData.length };
    }

    return (
      <Fragment>
        <DataListContainer
          title={"doc.list-projets"}
          addNewText="projets.Add-Projets"
          onAddClick={this.toggleModal}
          dataLength={listData.total || 0}
          pageSize={listFilter.pageSize}
          changePageSize={this.changePageSize}
          onChangeOrderBy={this.changeOrderBy}
          orderBy={listFilter.orderBy}
          onChangePage={this.onChangePage}
          currentPage={listFilter.page}
          isAllSelected={
            listData.result &&
            listData.result.length === this.state.selectedItems.length
          }
          onAllSelectedClick={() => this.handleChangeSelectAll(true)}
          onDeleteSelected={() => this.onDeleteItems(this.state.selectedItems)}
        >
          {this.conditionRender()
            ? this.conditionRender()
            : listData.result.map((item, index) => {
                return (
                  <Colxx xxs="12" key={index} className="mb-3">
                    <ContextMenuTrigger
                      id="menu_id"
                      data={index}
                      collect={p => ({ data: p.data })}
                    >
                      <Card
                        onClick={e => this.handleCheckChange(e, index)}
                        className={classnames("d-flex flex-row", {
                          active: this.state.selectedItems.includes(index)
                        })}
                      >
                        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                          <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                            <p className="list-item-heading mb-1 truncate">
                              {item.name}
                            </p>
                            <p className="mb-1 text-muted text-small w-15 w-sm-100">
                              {item.prefix}
                            </p>
                          </div>
                          <div className="align-self-center pr-4">
                            <a
                              href=" "
                              onClick={e => {
                                e.preventDefault();
                                this.setState({ selectedItems: [index] }, () =>
                                  this.onDeleteItems()
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
                              checked={this.state.selectedItems.includes(index)}
                              label=""
                              onChange={() => {}}
                            />
                          </div>
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
          content={"projets.confirm-delete"}
          onConfirmClick={() => this.onDeleteItems(true)}
        />
        <Modal
          isOpen={this.state.modalOpen}
          toggle={this.toggleModal}
          wrapClassName="modal-right"
          backdrop="static"
        >
          <AddProjets
            errorAdding={this.state.errorAdding}
            isLoadingAdding={this.state.isLoadingAdding}
            msgError={"errors.error-adding-user"}
            toggleModal={this.toggleModal}
            onSubmit={this.onSubmitItem}
          />
        </Modal>

        <ContextMenu id="menu_id" onShow={this.onContextMenu}>
          <MenuItem onClick={() => this.onDeleteItems()}>
            <i className="simple-icon-trash" />
            <span>
              <IntlMessages id="Delete" />
            </span>
          </MenuItem>
        </ContextMenu>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ appData }) => ({
  listData: appData.projets.data,
  listLoading: appData.projets.loading,
  listError: appData.projets.error,
  listFilter: appData.projets.filter
});

export default connect(
  mapStateToProps,
  actions
)(injectIntl(mouseTrap(Projets)));
