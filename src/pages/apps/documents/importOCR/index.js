import React, { Component, Fragment } from "react";
import IntlMessages from "util/IntlMessages";
import { Row, Card, Button, CustomInput, CardBody, Progress } from "reactstrap";
import { connect } from "react-redux";
import { uniqWith } from "lodash";

import { Colxx, Separator } from "components/CustomBootstrap";
import { uploadPage } from "redux/actions";
import { DropZone } from "components/DropZone";
import Axios from "axios";

const CancelToken = Axios.CancelToken;
const source = CancelToken.source();

class importOCRCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      showOnlyFailed: false
    };
  }
  onDrop = newFiles => {
    let { files } = this.state;
    newFiles = newFiles.map(item => ({ file: item, progress: "WAITING" }));
    files = uniqWith(
      [...files, ...newFiles],
      (a, b) => a.file.path === b.file.path
    );
    this.setState({ files });
  };

  changeProgressFile = (index, statut, data = {}) => {
    let { files } = this.state;
    files[index] = { ...files[index], progress: statut, ...data };
    this.setState({ files });
  };

  onPrograssUpload = (index, p) => {
    this.changeProgressFile(index, "PROGRESS", {
      progressValue: Math.round((p.loaded * 100) / p.total)
    });
  };

  onSuccessUpload = index => {
    this.changeProgressFile(index, "DONE");
    this.startUpload(++index);
  };

  onErrorUpload = (index, error) => {
    this.changeProgressFile(index, "ERROR", {
      error
    });
    this.startUpload(++index);
  };
  onCancel = () => {
    source.cancel("Operation canceled by the user.");
  };
  onDelete = () => {
    this.setState({ files: [] });
  };
  startUpload = index => {
    if (!this.state.files[index]) return;
    if (this.state.files[index].progress === "DONE") {
      this.startUpload(++index);
      return;
    }
    this.props.uploadPage(
      this.state.files[index].file,
      p => this.onPrograssUpload(index, p),
      () => this.onSuccessUpload(index),
      err => this.onErrorUpload(index, err),
      source.token,
      true
    );
  };
  render() {
    return (
      <Row>
        <Colxx xxs="12">
          <h1>
            <IntlMessages id="doc.import-ocr" />
          </h1>
          <Separator className="mb-5" />
        </Colxx>
        <Colxx xxs="12">
          <Row>
            <Colxx xxs="12" className="mb-4">
              <Button
                color="info"
                className="ml-2 mb-2"
                onClick={() => this.startUpload(0)}
              >
                <i className="simple-icon-cloud-upload" />{" "}
                <IntlMessages id="Start upload" />
              </Button>
              <Button
                color="danger"
                className="ml-2 mb-2"
                onClick={this.onCancel}
              >
                <i className="simple-icon-ban" />{" "}
                <IntlMessages id="Cancel upload" />
              </Button>
              <Button
                color="danger"
                className="ml-2 mb-2"
                onClick={this.onDelete}
              >
                <i className="simple-icon-trash" /> <IntlMessages id="Delete" />
              </Button>
              <CustomInput
                className="d-inline-block ml-4 mb-0"
                type="checkbox"
                label="Show Only failed uploads"
                id=""
                checked={this.state.showOnlyFailed}
                onChange={() => {
                  this.setState({ showOnlyFailed: !this.state.showOnlyFailed });
                }}
              />
              <Card className="dashboard-sq-banner justify-content-center mt-2">
                <CardBody className="justify-content-center d-flex flex-column p-0">
                  <DropZone onDrop={this.onDrop} />
                </CardBody>
              </Card>
              {this.state.files.length > 0 && (
                <Card className="mb-4">
                  <CardBody>
                    <ul>
                      {this.state.files.map((item, index) => (
                        <Fragment key={index}>
                          {(!this.state.showOnlyFailed ||
                            item.progress !== "DONE") && (
                            <li className="row">
                              <Colxx xxs="12" sm="6">
                                {item.progress === "ERROR" && (
                                  <i className="simple-icon-close align-middle mr-2 text-danger" />
                                )}
                                {item.progress === "DONE" && (
                                  <i className="simple-icon-check  align-middle mr-2 text-success" />
                                )}
                                {item.file.path} - {item.file.size} bytes
                              </Colxx>
                              <Colxx xxs="12" sm="6">
                                {item.progress === "PROGRESS" && (
                                  <Progress
                                    value={item.progressValue}
                                    className="pt-2"
                                  />
                                )}
                                {item.progress === "ERROR" && (
                                  <span className="text-danger">
                                    {item.error}
                                  </span>
                                )}
                              </Colxx>
                            </li>
                          )}
                        </Fragment>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}
              <p className="text-muted text-small text-center">
                The file name should respect the pattern :
                PROJECT_NAME.BOX_NUMBER.DOCUMENT_NUMBER.PAGE_NUMBER.EXTENSION
                for example : SYR.D300.0001.001.pdf
              </p>
            </Colxx>
          </Row>
        </Colxx>
      </Row>
    );
  }
}
export const importOCR = connect(
  null,
  { uploadPage }
)(importOCRCmp);
