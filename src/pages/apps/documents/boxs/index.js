import React, { Component, Fragment } from "react";
import IntlMessages from "util/IntlMessages";
import {
  Row,
  CustomInput,
  Card,
  CardBody,
  CardTitle,
  Button,
  FormGroup,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";

import { Colxx, Separator } from "components/CustomBootstrap";
import { ResultSearch } from "./ResultSearch";
import { getBoxs } from "redux/actions";

class ListBoxCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFirstTab: "1",
      hideDocument: false,
      hideVideo: false
    };
    this.refreshData();
  }
  refreshData = () => {
    this.props.getBoxs();
  };
  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab
      });
    }
  };

  toggleCheckbox = e => {
    const { id } = e.target;
    let { activeFirstTab } = this.state;
    if (id === "hideDocument" && !this.state[id]) {
      activeFirstTab = "2";
    }
    if (id === "hideVideo" && !this.state[id]) {
      activeFirstTab = "1";
    }
    this.setState({
      [id]: !this.state[id],
      activeFirstTab
    });
  };

  renderBoxs = boxs => {
    return (
      <Fragment>
        {boxs.map((item, key) => (
          <Fragment key={key}>
            {item.intervals.map((interval, key) => (
              <Colxx xxs="12" className="mb-5" key={key}>
                <Card>
                  <CardBody>
                    <CardTitle>
                      <h5>{item.letter}</h5> {interval.from + "-" + interval.to}
                    </CardTitle>
                    <FormGroup>
                      {interval.boxs.map((box, key) => (
                        <Button
                          key={key}
                          outline
                          color="info"
                          className="ml-2 mb-2"
                          onClick={() =>
                            this.props.history.push(
                              "/app/documents/list/box/" + box.id
                            )
                          }
                        >
                          {box.number}
                        </Button>
                      ))}
                    </FormGroup>
                  </CardBody>
                </Card>
              </Colxx>
            ))}
          </Fragment>
        ))}
      </Fragment>
    );
  };
  render() {
    const { boxs = {} } = this.props;
    const { videos = [], documents = [], quickStat = {} } = boxs;

    return (
      <Row>
        <Colxx xxs="12">
          <h1>
            <IntlMessages id="doc.list-document" />
          </h1>
          <div className="float-sm-right">
            <CustomInput
              className="itemCheck mb-0"
              type="checkbox"
              label="Show Document boxes"
              id="hideDocument"
              checked={!this.state.hideDocument}
              onChange={this.toggleCheckbox}
            />
            <CustomInput
              className="itemCheck mb-0"
              type="checkbox"
              label="Show Videos boxes"
              id="hideVideo"
              checked={!this.state.hideVideo}
              onChange={this.toggleCheckbox}
            />
          </div>

          <Separator className="mb-5" />
        </Colxx>
        {this.props.loading ? (
          <div className="loading" />
        ) : (
          <Fragment>
            <Colxx xxs="12">
              <ResultSearch quickStat={quickStat} />
            </Colxx>
            <Colxx xxs="12">
              <Nav tabs className="separator-tabs ml-0 mb-5">
                {!this.state.hideDocument && (
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeFirstTab === "1",
                        "nav-link": true
                      })}
                      onClick={() => {
                        this.toggleTab("1");
                      }}
                      to="#"
                    >
                      <h4 className=" mt-5">
                        <IntlMessages id="doc.document-boxes" />
                      </h4>
                    </NavLink>
                  </NavItem>
                )}
                {!this.state.hideVideo && (
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeFirstTab === "2",
                        "nav-link": true
                      })}
                      onClick={() => {
                        this.toggleTab("2");
                      }}
                      to="#"
                    >
                      <h4 className=" mt-5">
                        <IntlMessages id="doc.video-boxes" />
                      </h4>
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </Colxx>
            {this.state.activeFirstTab === "1" && this.renderBoxs(documents)}
            {this.state.activeFirstTab === "2" && this.renderBoxs(videos)}
          </Fragment>
        )}
      </Row>
    );
  }
}

const mapStateToProps = state => {
  const { appData } = state;
  return {
    boxs: appData.boxs.data,
    loading: appData.boxs.loading
  };
};

export const ListBox = connect(
  mapStateToProps,
  { getBoxs }
)(ListBoxCmp);
