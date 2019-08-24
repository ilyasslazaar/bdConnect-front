import React, { Component, Fragment } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import TopNav from "containers/TopNav";
import Sidebar from "containers/Sidebar";
import Connections from "../pages/apps/Connections/Connections";
import { connect } from "react-redux";
import instance from "util/instances";
import Query from "./apps/Queries/Query";
import QueriesList from "./apps/Queries/QueriesList";
/*import { home } from "./apps/UserDashBoard";*/
import { adminRole, userRole, loadingRoles } from "../util/permissions";
import {
  defaultAdminStartPath
  /*defaultUserStartPath*/
} from "../constants/defaultValues";

import { getUserPermissions } from "redux/actions";

const isAuthenticated = () => localStorage.getItem("token");

const PrivateRoute = ({ hasAccess, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasAccess() ? (
        <Component {...props} />
      ) : adminRole() ? (
        <Redirect to={defaultAdminStartPath} />
      ) : userRole() ? (
        <Redirect to={defaultAdminStartPath} />
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
    const { match, containerClassnames /*userData*/ } = this.props;

    return isAuthenticated() ? (
      <Fragment>
        {loadingRoles() ? (
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
                    component={Connections}
                    hasAccess={() => userRole() || adminRole()}
                  />
                  <PrivateRoute
                    path={`${match.url}/session`}
                    component={Query}
                    hasAccess={() => userRole() || adminRole()}
                  />
                  <PrivateRoute
                    path={`${match.url}/queryList`}
                    component={QueriesList}
                    hasAccess={() => userRole() || adminRole()}
                  />
                  <Redirect to="/error" />
                </Switch>
              </div>
            </main>
          </div>
        )}
      </Fragment>
    ) : (
      <Redirect to="/login" />
    );
  }
}
const mapStateToProps = ({ menu, appData }) => {
  const { containerClassnames } = menu;
  return {
    containerClassnames,
    userData: appData.users.userPermissions
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getUserPermissions }
  )(MainApp)
);
