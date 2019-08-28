import React, { Component } from "react";
import IntlMessages from "util/IntlMessages";
import FullPageHOC from "util/FullPageHOC";
import { Row, Card, CardTitle } from "reactstrap";
import { Colxx } from "components/CustomBootstrap";
import { connect } from "react-redux";
import { login } from "redux/users/actions";
import { LoginForm } from "./LoginForm";

class LoginLayout extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      showError: false,
      isLoading: false
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.props.login("", "", () => {
      this.props.history.push("/app/home");
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onUserLogin = ({ username, password }) => {
    this._isMounted && this.setState({ isLoading: true, showError: false });
    this.props.login(
      username,
      password,
      () => {
        this.props.history.push("/app/home");
        this._isMounted && this.setState({ isLoading: false });
      },
      () => {
        this.setState({ isLoading: false, showError: true });
      }
    );
  };
  render() {
    return (
      <main>
        <div className="container">
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="form-side mx-auto">
                  <CardTitle className="mb-4">
                    <IntlMessages id="user.login-intro" />
                  </CardTitle>
                  <LoginForm
                    onSubmit={this.onUserLogin}
                    showError={this.state.showError}
                    isLoading={this.state.isLoading}
                  />
                </div>
              </Card>
            </Colxx>
          </Row>
        </div>
      </main>
    );
  }
}
export default connect(
  null,
  { login }
)(FullPageHOC(LoginLayout));
