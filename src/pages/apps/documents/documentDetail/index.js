import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { Colxx, Separator } from "components/CustomBootstrap";
import { MetaData } from "../metadata";
import { getDocsPages, getDocsMetadata } from "redux/actions";

class DocumentDetailsCmp extends Component {
  constructor(props) {
    super(props);
    props.getDocsPages(props.match.params.documentId);
    props.getDocsMetadata(props.match.params.documentId);
  }
  render() {
    const { match, pages, boxMetadata, docMetadata } = this.props;
    return (
      <Row>
        <Colxx xxs="12">
          <h1>
            <IntlMessages
              id={
                docMetadata.documentType === "VIDEO" ? "Video" : "doc.Pages in"
              }
            />
            {" " + docMetadata.number}
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
            <BreadcrumbItem active>{docMetadata.number}</BreadcrumbItem>
          </Breadcrumb>
          <Separator className="mb-5" />
        </Colxx>
        <Colxx xxs="12">
          {this.props.loading ? (
            <div className="loading" />
          ) : (
            <Row>
              <MetaData
                boxId={match.params.id}
                documentId={match.params.documentId}
                showMetadata
              />
              <Colxx xxs="12" md="8" className="mb-4">
                <Card className="mb-4">
                  <CardBody>
                    <CardTitle>
                      <h5>
                        <IntlMessages
                          id={
                            docMetadata.documentType === "VIDEO"
                              ? "Video"
                              : "Pages"
                          }
                        />
                      </h5>
                    </CardTitle>
                    {docMetadata.documentType !== "VIDEO" &&
                      pages.map((page, index) => {
                        return (
                          <div
                            key={index}
                            className="align-self-center d-flex flex-column flex-xs-row justify-content-between align-items-lg-center border-bottom"
                          >
                            <div className="pl-3 pr-2">
                              <NavLink
                                to={`/app/documents/list/box/${
                                  match.params.id
                                }/${match.params.documentId}/${page.id}`}
                              >
                                <p className="font-weight-medium mb-0 ">
                                  Page {page.number}
                                </p>
                                <p className="text-muted mb-0 text-small">
                                  {match.params.documentId}
                                </p>
                              </NavLink>
                            </div>
                            <div className="align-self-center pr-3">
                              <NavLink
                                className="mr-4"
                                to={`/app/documents/list/box/${
                                  match.params.id
                                }/${match.params.documentId}/${page.id}`}
                              >
                                <i className="simple-icon-eye" />
                              </NavLink>
                            </div>
                          </div>
                        );
                      })}
                    {docMetadata.documentType === "VIDEO" &&
                      (docMetadata.videoMetadata.originalUrl ? (
                        <video
                          src={docMetadata.videoMetadata.originalUrl}
                          controls
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <iframe
                          title="Youtube Video"
                          width="420"
                          height="315"
                          src={`https://www.youtube.com/embed/${
                            docMetadata.videoMetadata.youtubeId
                          }`}
                        />
                      ))}
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
    docMetadata: appData.docs.metadata,
    boxMetadata: appData.boxs.metadata,
    pages: appData.docs.pages,
    loading: appData.docs.loading
  };
};

export const DocumentDetails = connect(
  mapStateToProps,
  { getDocsPages, getDocsMetadata }
)(DocumentDetailsCmp);
