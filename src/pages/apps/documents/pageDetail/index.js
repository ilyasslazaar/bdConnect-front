import React, { Fragment, Component } from "react";
import IntlMessages from "util/IntlMessages";
import { Row, Card, CardBody, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { Colxx, Separator } from "components/CustomBootstrap";
import { MetaData } from "../metadata";
import { getPageMetadata, downloadPage } from "redux/actions";

class PageDetailsCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    props.getPageMetadata(props.match.params.pageId);
    props.downloadPage(props.match.params.pageId, (filePath, type) =>
      this.setState({ filePath, type })
    );
  }
  render() {
    const {
      match,
      loading,
      boxMetadata,
      docMetadata,
      pageMetadata
    } = this.props;

    return (
      <Fragment>
        {loading ? (
          <div className="loading" />
        ) : (
          <Row>
            <Colxx xxs="12">
              <h1>
                <IntlMessages id="doc.file" />
                {" " + match.params.pageId}
              </h1>
              <Breadcrumb className="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
                <BreadcrumbItem>
                  <NavLink to="/app/documents/list">Boxes</NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <NavLink to={`/app/documents/list/box/${match.params.id}`}>
                    {boxMetadata.number}
                  </NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <NavLink
                    to={`/app/documents/list/box/${match.params.id}/${
                      match.params.documentId
                    }`}
                  >
                    {docMetadata.number}
                  </NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem active>{pageMetadata.number}</BreadcrumbItem>
              </Breadcrumb>
              <Separator className="mb-5" />
            </Colxx>
            <Colxx xxs="12">
              <Row>
                <MetaData
                  pageId={match.params.pageId}
                  boxId={match.params.id}
                  documentId={match.params.documentId}
                  showMetadata
                  showPageMetadata
                />
                <Colxx xxs="12" md="8" className="mb-4">
                  <Card className="mb-4">
                    <CardBody>
                      {this.state.type !== "" ? (
                        <iframe
                          title="page"
                          width="100%"
                          height="800"
                          style={{ border: "none" }}
                          src={this.state.filePath}
                        />
                      ) : (
                        this.state.filePath && (
                          <Cropper
                            ref="cropper"
                            src={this.state.filePath}
                            style={{ height: 400, width: "100%" }}
                          />
                        )
                      )}
                    </CardBody>
                  </Card>
                </Colxx>
              </Row>
            </Colxx>
          </Row>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { appData } = state;
  return {
    loading: appData.pages.loading,
    docMetadata: appData.docs.metadata,
    boxMetadata: appData.boxs.metadata,
    pageMetadata: appData.pages.metadata
  };
};

export const PageDetails = connect(
  mapStateToProps,
  { getPageMetadata, downloadPage }
)(PageDetailsCmp);
