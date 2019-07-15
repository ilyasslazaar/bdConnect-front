import React from "react";
import IntlMessages from "util/IntlMessages";
import { Row, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";

import { Colxx } from "components/CustomBootstrap";

const ResultSearchCmp = ({ boxs, quickStat }) => (
  <Row>
    <Colxx xs="4" className="mb-4">
      <Card className="progress-banner">
        <CardBody className="justify-content-between d-flex flex-row align-items-center">
          <i className="iconsmind-Files mr-2 text-white align-text-bottom d-inline-block" />
          <div>
            <p className="lead text-white">
              {quickStat.totalDocuments} <IntlMessages id="Documents" />
            </p>
          </div>
        </CardBody>
      </Card>
    </Colxx>
    <Colxx xs="4" className="mb-4">
      <Card className="progress-banner">
        <CardBody className="justify-content-between d-flex flex-row align-items-center">
          <i className="iconsmind-File-Pictures mr-2 text-white align-text-bottom d-inline-block" />
          <div>
            <p className="lead text-white">
              {quickStat.totalImages} <IntlMessages id="Images" />
            </p>
          </div>
        </CardBody>
      </Card>
    </Colxx>
    <Colxx xs="4" className="mb-4">
      <Card className="progress-banner">
        <CardBody className="justify-content-between d-flex flex-row align-items-center">
          <i className="iconsmind-Film-Board mr-2 text-white align-text-bottom d-inline-block" />
          <div>
            <p className="lead text-white">
              {quickStat.totalVideos} <IntlMessages id="Videos" />
            </p>
          </div>
        </CardBody>
      </Card>
    </Colxx>
  </Row>
);

const mapStateToProps = state => {
  const { appData } = state;
  return {
    boxs: appData.boxs.data
  };
};

export const ResultSearch = connect(mapStateToProps)(ResultSearchCmp);
