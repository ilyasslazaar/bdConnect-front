import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { Colxx, Separator } from "components/CustomBootstrap";
import { MetaData } from "../metadata";
import { getBoxDocs } from "redux/actions";

class BoxDetailsCmp extends Component {
  constructor(props) {
    super(props);

    props.getBoxDocs(props.match.params.id);
  }
  render() {
    const { match, history, docs = [], loading } = this.props;
    return (
      <Row>
        <Colxx xxs="12">
          <h1>
            <IntlMessages id="doc.files in" />
            {" " + this.props.boxMetadata.number}
          </h1>
          <Separator className="mb-5" />
        </Colxx>
        <Colxx xxs="12">
          {loading ? (
            <div className="loading" />
          ) : (
            <Row>
              <MetaData boxId={match.params.id} />
              <Colxx xxs="12" md="8" className="mb-4">
                <Card className="mb-4">
                  <CardBody>
                    <CardTitle>
                      <h5>
                        <IntlMessages id="menu.documents" />
                      </h5>
                    </CardTitle>
                    <div className="ems-documents-list">
                      <PerfectScrollbar
                        option={{
                          suppressScrollX: true
                        }}
                      >
                        {docs.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="align-self-center d-flex flex-column flex-xs-row justify-content-between align-items-lg-center border-bottom"
                            >
                              <div className="pl-3 pr-2">
                                <NavLink
                                  to={`/app/documents/list/box/${
                                    match.params.id
                                  }/${item.id}`}
                                >
                                  <p className="font-weight-medium mb-0 ">
                                    {item.number}
                                  </p>
                                  <p className="text-muted mb-0 text-small">
                                    {this.props.boxMetadata.number}
                                  </p>
                                </NavLink>
                              </div>
                              <div className="align-self-center pr-3">
                                <a
                                  href=" "
                                  className="mr-4"
                                  onClick={e => {
                                    e.preventDefault();
                                    history.push(
                                      `/app/documents/list/box/${
                                        match.params.id
                                      }/${item.id}`
                                    );
                                  }}
                                >
                                  <i className="simple-icon-eye" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </PerfectScrollbar>
                    </div>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          )}
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  const { appData } = state;
  return {
    docs: appData.boxs.docs,
    loading: appData.boxs.loading,
    boxMetadata: appData.boxs.metadata
  };
};

export const BoxDetails = connect(
  mapStateToProps,
  { getBoxDocs }
)(BoxDetailsCmp);
