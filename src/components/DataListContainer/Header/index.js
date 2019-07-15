import React, { Fragment } from "react";
import { Row } from "reactstrap";

import { Colxx, Separator } from "components/CustomBootstrap";
import { TitleRow } from "./TitleRow";
import { FilterRow } from "./FilterRow";

export const Header = props => {
  return (
    <Fragment>
      <div className="disable-text-selection">
        <Row>
          <Colxx xxs="12">
            <TitleRow {...props} />
            <FilterRow {...props} />
            <Separator />
          </Colxx>
        </Row>
      </div>
    </Fragment>
  );
};
