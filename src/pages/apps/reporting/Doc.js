import React, { Component } from "react";
import { connect } from "react-redux";

import IntlMessages from "util/IntlMessages";
import { injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardTitle,
  CustomInput,
  Button,
  Row
} from "reactstrap";
import { Colxx } from "components/CustomBootstrap";
import { searchDocMetadata } from "redux/actions";
import { DataListContainer } from "components/DataListContainer";

class DocCmp extends Component {
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
    this.props.searchDocMetadata(
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
    const value = this.state.data.result[index];
    this.props.history.push(
      "/app/documents/list/box/" + value.boxId + "/" + value.id
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
            <Row>
              <Colxx xxs="6">
                <CustomInput
                  className="itemCheck mb-1"
                  type="checkbox"
                  label="Cc"
                  id="withoutCc"
                  checked={this.state.options.withoutCc || false}
                  onChange={this.toggleCheckbox}
                />
                <CustomInput
                  className="itemCheck mb-4"
                  type="checkbox"
                  label="From"
                  id="withoutFrom"
                  checked={this.state.options.withoutFrom || false}
                  onChange={this.toggleCheckbox}
                />
              </Colxx>
              <Colxx xxs="6">
                <CustomInput
                  className="itemCheck mb-1"
                  type="checkbox"
                  label="Summary"
                  id="withoutSummary"
                  checked={this.state.options.withoutSummary || false}
                  onChange={this.toggleCheckbox}
                />
                <CustomInput
                  className="itemCheck mb-4"
                  type="checkbox"
                  label="To"
                  id="withoutTo"
                  checked={this.state.options.withoutTo || false}
                  onChange={this.toggleCheckbox}
                />
              </Colxx>
            </Row>
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
              this.state.data.result.map((doc, index) => {
                return (
                  <Colxx xxs="12" key={index} className="mb-3">
                    <Card
                      onClick={() => this.handleBoxClick(index)}
                      className={"d-flex flex-row"}
                    >
                      <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                          <p className="list-item-heading mb-1 truncate">
                            {doc.project + "." + doc.box + "." + doc.number}
                          </p>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">
                            Document ID: {doc.id}
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

export const DocSearch = connect(
  null,
  { searchDocMetadata }
)(injectIntl(DocCmp));
