import React, { Component } from "react";
import { Row, Card, CardTitle, Button } from "reactstrap";
import { NavLink } from "react-router-dom";

import IntlMessages from "util/IntlMessages";
import FullPageHOC from "util/FullPageHOC";
import { Colxx } from "components/CustomBootstrap";

class Error404 extends Component {
  render() {
    return (
      <main>
        <div className="container">
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card text-center">
                <div className="form-side mx-auto">
                  <NavLink to={`/`} className="white">
                    <span className="logo-single" />
                  </NavLink>
                  <CardTitle className="mb-4">
                    <IntlMessages id="layouts.error-title" />
                  </CardTitle>
                  <p className="mb-0 text-muted text-small mb-0">
                    <IntlMessages id="layouts.error-code" />
                  </p>
                  <p className="display-1 font-weight-bold mb-5">404</p>
                  <Button
                    href="/app"
                    color="primary"
                    className="btn-shadow"
                    size="lg"
                  >
                    <IntlMessages id="layouts.go-back-home" />
                  </Button>
                </div>
              </Card>
            </Colxx>
          </Row>
        </div>
      </main>
    );
  }
}
export default FullPageHOC(Error404);
