import React, { Component } from "react";
import { connect } from "react-redux";

import IntlMessages from "util/IntlMessages";
import { injectIntl } from "react-intl";
import { Card, CardBody, CardTitle, CustomInput, Button } from "reactstrap";
import { Colxx } from "components/CustomBootstrap";
import { searchBoxMetadata } from "redux/actions";
import { DataListContainer } from "components/DataListContainer";

class BoxCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {},
      page: 1,
      size: 10,
      isLoading: false,
      data: {
        total: 0
      }
    };
  }
  search = () => {
    this.setState({ isLoading: true });
    this.props.searchBoxMetadata(
      this.state.options,
      this.state.page,
      this.state.size,
      data =>
        this.setState({
          data,
          isLoading: false
        })
    );
  };
  toggleCheckbox = e => {
    const { id } = e.target;
    const { options } = this.state;
    options[id] = !this.state.options[id];
    this.setState({ options });
  };
  changePageSize = size => {
    this.setState({ size }, this.search);
  };
  onChangePage = page => {
    this.setState({ page }, this.search);
  };
  handleBoxClick = index => {
    this.props.history.push(
      "/app/documents/list/box/" + this.state.data.result[index].id
    );
  };
  render() {
    return (
      <Colxx xxs="12">
        <Card>
          <CardBody>
            <CardTitle>
              <IntlMessages id="Search for documents box having no metadata for fields" />
            </CardTitle>
            <CustomInput
              className="itemCheck mb-1"
              type="checkbox"
              label="Location seized"
              id="withoutLocationSeized"
              checked={this.state.options.withoutLocationSeized || false}
              onChange={this.toggleCheckbox}
            />
            <CustomInput
              className="itemCheck mb-4"
              type="checkbox"
              label="Notes"
              id="withoutNotes"
              checked={this.state.options.withoutNotes || false}
              onChange={this.toggleCheckbox}
            />
            <Button color="primary" className="ml-2 mb-2" onClick={this.search}>
              <IntlMessages id="menu.search" />
            </Button>
          </CardBody>
        </Card>
        {this.state.data.result && (
          <DataListContainer
            hideButtons
            dataLength={this.state.data.total || 0}
            pageSize={this.state.size}
            changePageSize={this.changePageSize}
            onChangePage={this.onChangePage}
            currentPage={this.state.page}
          >
            {this.state.isLoading ? (
              <div className="loading" />
            ) : (
              this.state.data.result.map((box, index) => {
                return (
                  <Colxx xxs="12" key={index} className="mb-3">
                    <Card
                      onClick={() => this.handleBoxClick(index)}
                      className={"d-flex flex-row"}
                    >
                      <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                          <p className="list-item-heading mb-1 truncate">
                            {box.project + "." + box.number}
                          </p>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">
                            Box ID: {box.id}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Colxx>
                );
              })
            )}
          </DataListContainer>
        )}
      </Colxx>
    );
  }
}

export const BoxSearch = connect(
  null,
  { searchBoxMetadata }
)(injectIntl(BoxCmp));
