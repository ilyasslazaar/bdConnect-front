import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import { injectIntl } from "react-intl";
import { Row } from "reactstrap";
import { Separator } from "components/CustomBootstrap";
import { connect } from "react-redux";

class ReportingCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  render() {
    return (
      <div className="mb-2">
        <h1>
          <IntlMessages id={"menu.app"} />
        </h1>
        <Separator className="mb-5" />
        <Row className="icon-cards-row mb-2" />
      </div>
    );
  }
}

export const home = connect(
  null,
  {}
)(injectIntl(ReportingCmp));
