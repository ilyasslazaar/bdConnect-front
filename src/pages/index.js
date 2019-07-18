import React, { Component, Fragment } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import TopNav from "containers/TopNav";
import Sidebar from "containers/Sidebar";
import datalist from "../pages/apps/data-list/data-list";
import { connect } from "react-redux";
import instance from "util/instances";
import survey from "./apps/survey/survey";

import { getUserPermissions } from "redux/actions";

const PrivateRoute = ({ hasAccess, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("token") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

class MainApp extends Component {
  constructor(props) {
    super(props);
    let that = this;
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response && 401 === error.response.status) {
          that.props.history.push("/login");
        }

        return error.response;
      }
    );
    localStorage.getItem("token") && this.props.getUserPermissions();
  }

  render() {
    const { match, containerClassnames /*userPermissions*/ } = this.props;

    return (
      <Fragment>
        {false ? (
          <div className="loading" />
        ) : (
          <div id="app-container" className={containerClassnames}>
            <TopNav history={this.props.history} />
            <Sidebar />
            <main>
              <div className="container-fluid">
                <Switch>
                  <PrivateRoute
                    path={`${match.url}/home`}
                    component={datalist}
                  />
                  <PrivateRoute
                    path={`${match.url}/session`}
                    component={survey}
                  />
                  <Redirect to="/error" />
                </Switch>
              </div>
            </main>
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ menu, appData }) => {
  const { containerClassnames } = menu;
  return {
    containerClassnames,
    userPermissions: appData.users.userPermissions
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getUserPermissions }
  )(MainApp)
);
