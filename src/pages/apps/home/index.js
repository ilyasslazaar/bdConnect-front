import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import { injectIntl } from "react-intl";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx, Separator } from "components/CustomBootstrap";
import { connect } from "react-redux";

class ReportingCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
    
  }

  render() {
    const {
      totalDocuments,
      totalEnglishTranslations,
      totalImages,
      totalMetadatas,
      totalOcrs,
      totalVideos
    } = this.state.data;

    return (
      <div className="mb-2">
        <h1>
          <IntlMessages id={"menu.app"} />
        </h1>
        <Separator className="mb-5" />
        <Row className="icon-cards-row mb-2">
          <Colxx xxs="6" sm="4">
            <Card className="mb-4">
              <CardBody className="text-center">
                <i className="simple-icon-docs" />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id="totalDocuments" />
                </p>
                <p className="lead text-center">{totalDocuments}</p>
              </CardBody>
            </Card>
          </Colxx>

          <Colxx xxs="6" sm="4">
            <Card className="mb-4">
              <CardBody className="text-center">
                <i className="simple-icon-picture" />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id="totalImages" />
                </p>
                <p className="lead text-center">{totalImages}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="6" sm="4">
            <Card className="mb-4">
              <CardBody className="text-center">
                <i className="simple-icon-camrecorder" />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id="totalVideos" />
                </p>
                <p className="lead text-center">{totalVideos}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="6" sm="4">
            <Card className="mb-4">
              <CardBody className="text-center">
                <i className="simple-icon-note" />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id="totalMetadatas" />
                </p>
                <p className="lead text-center">{totalMetadatas}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="6" sm="4">
            <Card className="mb-4">
              <CardBody className="text-center">
                <i className="simple-icon-globe" />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id="totalEnglishTranslations" />
                </p>
                <p className="lead text-center">{totalEnglishTranslations}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="6" sm="4">
            <Card className="mb-4">
              <CardBody className="text-center">
                <i className="simple-icon-eye" />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id="totalOcrs" />
                </p>
                <p className="lead text-center">{totalOcrs}</p>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </div>
    );
  }
}

export const home = connect(
  null,
  {}
)(injectIntl(ReportingCmp));
