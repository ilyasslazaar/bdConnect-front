import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { defaultStartPath } from "constants/defaultValues";

import AppLocale from "lang";
import MainRoute from "pages";
import login from "pages/login";
import error from "pages/error";

import "assets/style/vendor/bootstrap.min.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "assets/fonts/simple-line-icons/css/simple-line-icons.css";
import "assets/fonts/iconsmind/style.css";
import "assets/style/gogo/themes/gogo.light.green.scss";
import "assets/style/App.scss";
import { NotificationContainer } from "components/ReactNotifications";
/*
color options : 
	 'light.purple'		'dark.purple'
	 'light.blue'		'dark.blue'
	 'light.green'		'dark.green'
	 'light.orange'		'dark.orange'
	 'light.red'		'dark.red'
*/

const InitialPath = ({ component: Component, authUser, ...rest }) => (
  <Route
    render={props =>
      !authUser ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
    {...rest}
  />
);

class App extends Component {
  render() {
    const { location, match, user, locale } = this.props;
    const currentAppLocale = AppLocale[locale];
    if (
      location.pathname === "/" ||
      location.pathname === "/app" ||
      location.pathname === "/app/"
    ) {
      return <Redirect to={defaultStartPath} />;
    }
    return (
      <Fragment>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <Fragment>
            <NotificationContainer />
            <Switch>
              <InitialPath
                path={`${match.url}app`}
                authUser={user}
                component={MainRoute}
              />
              <Route path={`/login`} component={login} />
              <Route path={`/error`} component={error} />
              <Redirect to="/error" />
            </Switch>
          </Fragment>
        </IntlProvider>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { locale } = settings;
  return { locale };
};

export default connect(mapStateToProps)(App);
