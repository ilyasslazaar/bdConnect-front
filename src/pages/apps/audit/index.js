import React, { Component, Fragment } from "react";
import IntlMessages from "util/IntlMessages";
import MUIDataTable from "mui-datatables";
import { get } from "lodash";
import cs from "classnames";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { auditSearch } from "redux/actions";
import { Filter } from "./filter";
import { DataListContainer } from "components/DataListContainer";
import { Colxx } from "components/CustomBootstrap";
import { columns, options } from "./dataTableOptions";
import { Chart } from "./Chart";

class AuditCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: true
    };
  }
  auditSearch = values => {
    const { page, resultPerPage } = this.props.filterAudit;
    values.userName = get(values, "userName.username");
    values.boxeId = get(values, "boxeId.id");
    values.teamId = get(values, "teamId.id");
    this.props.auditSearch({ ...values, page, resultPerPage });
  };
  changePageSize = size => {
    const { filterAudit } = this.props;
    filterAudit.resultPerPage = size;
    filterAudit.page = 1;

    this.props.auditSearch(filterAudit);
  };

  onChangePage = page => {
    const { filterAudit } = this.props;
    filterAudit.page = page;
    this.props.auditSearch(filterAudit);
  };
  render() {
    let { loading, listData, filterAudit } = this.props;

    return (
      <Fragment>
        <DataListContainer
          title={"menu.audit"}
          addNewText="Show Filter"
          hideButtons={this.state.showFilter}
          onAddClick={() => this.setState({ showFilter: true })}
          dataLength={listData.total || 0}
          pageSize={filterAudit.resultPerPage}
          changePageSize={this.changePageSize}
          onChangePage={this.onChangePage}
          currentPage={filterAudit.page}
          showChildrenForEmpty
        >
          <Filter
            onSubmit={this.auditSearch}
            onClose={() => this.setState({ showFilter: false })}
            className={cs({ "d-none": !this.state.showFilter })}
          />
          <Colxx xxs="12" className="text-center h6">
            {loading && <div className="loading" />}
            {listData.total === 0 && <IntlMessages id="no-data-found" />}
          </Colxx>
          {listData.total > 0 && (
            <Colxx xxs="12" className="text-center h6">
              <MUIDataTable
                data={listData.result}
                columns={columns}
                options={options}
              />
            </Colxx>
          )}
        </DataListContainer>
        <div className="mt-5" />
        <Chart />
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  const { appData } = state;
  return {
    listData: appData.pages.audit.data,
    loading: appData.pages.audit.loading,
    filterAudit: appData.pages.filterAudit
  };
};

export const Audit = connect(
  mapStateToProps,
  { auditSearch }
)(injectIntl(AuditCmp));
