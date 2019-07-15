import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import cs from "classnames";

import { Colxx } from "components/CustomBootstrap";
import { Box } from "./box";
import { Document } from "./document";
import {
  updateBoxMetadata,
  updateDocsMetadata,
  getDocsMetadata,
  getBoxMetadata,
  getPageMetadata,
  updatePageMetadata
} from "redux/actions";
import { Page } from "./page";
import { Video } from "./video";

class MetaDataCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBoxEdited: false,
      boxState: {
        error: undefined,
        loading: false
      },
      isDocumentEdited: false,
      docState: {
        error: undefined,
        loading: false
      },
      isPageEdited: false,
      pageState: {
        error: undefined,
        loading: false
      }
    };

    if (this.props.showPageMetadata && isEmpty(this.props.pageMetadata)) {
      this.props.getPageMetadata(this.props.pageId);
    }

    if (this.props.showMetadata && isEmpty(this.props.docMetadata)) {
      this.props.getDocsMetadata(this.props.documentId);
    }

    if (isEmpty(this.props.boxMetadata)) {
      this.props.getBoxMetadata(this.props.boxId);
    }
  }

  saveBoxMetaData = values => {
    this.setState({ boxState: { error: undefined, loading: true } });

    this.props.updateBoxMetadata(
      this.props.boxId,
      values,
      () => {
        this.setState({
          boxState: { error: undefined, loading: false },
          isBoxEdited: false
        });
      },
      () => {
        this.setState({
          boxState: { error: "errors.error-adding-user", loading: false }
        });
      }
    );
  };

  saveDocMetaData = values => {
    this.setState({ docState: { error: undefined, loading: true } });
    this.props.updateDocsMetadata(
      this.props.documentId,
      values,
      () => {
        this.setState({
          docState: { error: undefined, loading: false },
          isDocumentEdited: false
        });
      },
      () => {
        this.setState({
          docState: { error: "errors.error-adding-user", loading: false }
        });
      },
      this.props.docMetadata.documentType === "VIDEO"
    );
  };

  savePageMetaData = values => {
    this.setState({ pageState: { error: undefined, loading: true } });

    this.props.updatePageMetadata(
      this.props.pageId,
      values,
      () => {
        this.setState({
          pageState: { error: undefined, loading: false },
          isPageEdited: false
        });
      },
      () => {
        this.setState({
          pageState: { error: "errors.error-adding-user", loading: false }
        });
      }
    );
  };

  render() {
    const { showMetadata, showPageMetadata, docMetadata } = this.props;
    const { isBoxEdited, isDocumentEdited, isPageEdited } = this.state;

    return (
      <Colxx xxs="12" md="4" className="mb-4">
        {showPageMetadata && (
          <Card
            className={cs("ems-metadata", "mb-4", {
              "ems-metadata-edited": isPageEdited
            })}
          >
            <div className="position-absolute card-top-buttons">
              <Button
                outline
                color={"primary"}
                className={cs("icon-button", { active: isPageEdited })}
                onClick={() => this.setState({ isPageEdited: !isPageEdited })}
              >
                <i className="simple-icon-pencil" />
              </Button>
            </div>

            <CardBody>
              <CardTitle>
                <h5>
                  <IntlMessages id="Page Metadata" />
                </h5>
              </CardTitle>
              <Page
                isEdited={isPageEdited}
                onSubmit={this.savePageMetaData}
                saveState={this.state.pageState}
              />
            </CardBody>
          </Card>
        )}
        {showMetadata && (
          <Card
            className={cs("ems-metadata", "mb-4", {
              "ems-metadata-edited": isDocumentEdited
            })}
          >
            <div className="position-absolute card-top-buttons">
              <Button
                outline
                color={"primary"}
                className={cs("icon-button", { active: isDocumentEdited })}
                onClick={() =>
                  this.setState({ isDocumentEdited: !isDocumentEdited })
                }
              >
                <i className="simple-icon-pencil" />
              </Button>
            </div>

            <CardBody>
              <CardTitle>
                <h5>
                  {docMetadata.documentType === "VIDEO" && (
                    <IntlMessages id="Video" />
                  )}{" "}
                  <IntlMessages id="Metadata" />
                </h5>
              </CardTitle>
              {docMetadata.documentType === "VIDEO" ? (
                <Video
                  isEdited={isDocumentEdited}
                  onSubmit={this.saveDocMetaData}
                  saveState={this.state.docState}
                />
              ) : (
                <Document
                  isEdited={isDocumentEdited}
                  onSubmit={this.saveDocMetaData}
                  saveState={this.state.docState}
                />
              )}
            </CardBody>
          </Card>
        )}

        <Card
          className={cs("ems-metadata", "mb-4", {
            "ems-metadata-edited": isBoxEdited
          })}
        >
          <div className="position-absolute card-top-buttons">
            <Button
              outline
              color={"primary"}
              className={cs("icon-button", { active: isBoxEdited })}
              onClick={() => this.setState({ isBoxEdited: !isBoxEdited })}
            >
              <i className="simple-icon-pencil" />
            </Button>
          </div>

          <CardBody>
            <CardTitle>
              <h5>
                <IntlMessages id="doc.Box Information Sheet" />
              </h5>
            </CardTitle>
            <Box
              boxId={this.props.boxId}
              isBoxEdited={isBoxEdited}
              onSubmit={this.saveBoxMetaData}
              saveState={this.state.boxState}
            />
          </CardBody>
        </Card>
      </Colxx>
    );
  }
}
const mapStateToProps = state => {
  const { appData } = state;
  return {
    docMetadata: appData.docs.metadata,
    boxMetadata: appData.boxs.metadata,
    pageMetadata: appData.pages.metadata
  };
};

export const MetaData = connect(
  mapStateToProps,
  {
    updateBoxMetadata,
    updateDocsMetadata,
    getDocsMetadata,
    getBoxMetadata,
    getPageMetadata,
    updatePageMetadata
  }
)(MetaDataCmp);
