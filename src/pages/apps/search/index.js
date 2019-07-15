import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import MUIDataTable from "mui-datatables";

import cs from "classnames";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { searchPage } from "redux/actions";
import { Filter } from "./filter";
import { DataListContainer } from "components/DataListContainer";
import { Colxx } from "components/CustomBootstrap";
import { options, columns } from "./dataTableOptions";

class SearchCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: true
    };
  }
  searchPage = values => {
    const { page, resultPerPage } = this.props.filterSearch;
    this.props.searchPage({ ...values, page, resultPerPage });
  };
  changePageSize = size => {
    const { filterSearch } = this.props;
    filterSearch.resultPerPage = size;
    filterSearch.page = 1;
    this.props.searchPage(filterSearch);
  };

  onChangePage = page => {
    const { filterSearch } = this.props;
    filterSearch.page = page;
    this.props.searchPage(filterSearch);
  };
  render() {
    let { loading, listData, filterSearch } = this.props;

    return (
      <DataListContainer
        title={"menu.search"}
        addNewText="Show Filter"
        hideButtons={this.state.showFilter}
        onAddClick={() => this.setState({ showFilter: true })}
        dataLength={listData.total || 0}
        pageSize={filterSearch.resultPerPage}
        changePageSize={this.changePageSize}
        onChangePage={this.onChangePage}
        currentPage={filterSearch.page}
        showChildrenForEmpty
      >
        <Filter
          onSubmit={this.searchPage}
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
    );
  }
}
const mapStateToProps = state => {
  const { appData } = state;
  return {
    listData: appData.pages.search.data,
    loading: appData.pages.search.loading,
    filterSearch: appData.pages.filterSearch
  };
};

export const Search = connect(
  mapStateToProps,
  { searchPage }
)(injectIntl(SearchCmp));
