import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import { injectIntl } from "react-intl";
import { Row, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { Colxx } from "components/CustomBootstrap";
import { BoxSearch } from "./Box";
import { DocSearch } from "./Doc";
import { PageSearch } from "./Page";

class ReportingCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFirstTab: "1"
    };
  }
  changeTab = (e, index) => {
    e.preventDefault();
    this.setState({ activeFirstTab: index });
  };
  render() {
    return (
      <Colxx xxs="12">
        <h1>
          <IntlMessages id={"Records without metadata"} />
        </h1>
        <Nav tabs className="separator-tabs ml-0 mb-5">
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeFirstTab === "1",
                "nav-link": true
              })}
              onClick={e => this.changeTab(e, "1")}
              to=" "
            >
              <IntlMessages id="Boxs" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeFirstTab === "2",
                "nav-link": true
              })}
              onClick={e => this.changeTab(e, "2")}
              to=" "
            >
              <IntlMessages id="Documents" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeFirstTab === "3",
                "nav-link": true
              })}
              onClick={e => this.changeTab(e, "3")}
              to="#"
            >
              <IntlMessages id="Pages" />
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeFirstTab}>
          <TabPane tabId="1">
            <Row>
              <BoxSearch history={this.props.history} />
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <DocSearch history={this.props.history} />
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <PageSearch history={this.props.history} />
          </TabPane>
        </TabContent>
      </Colxx>
    );
  }
}

export const Reporting = injectIntl(ReportingCmp);
