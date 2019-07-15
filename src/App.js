import React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

//import App from "Containers/App";
import { configureStore } from "redux/store";
import App from "./containers/App";
export const store = configureStore();
const MainApp = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </Provider>
);

export default MainApp;
