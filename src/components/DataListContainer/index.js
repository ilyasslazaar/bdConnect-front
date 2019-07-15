import React, { Fragment } from "react";
import { Row } from "reactstrap";

import Pagination from "components/List/Pagination";
import { Header } from "./Header";
import IntlMessages from "util/IntlMessages";

export const DataListContainer = props => {
  const { children, onChangePage, currentPage, showChildrenForEmpty } = props;
  const pagesCount = Math.ceil(props.dataLength / props.pageSize);

  return (
    <Fragment>
      <div className="disable-text-selection">
        <Header {...props} />
        <Row>
          {props.dataLength > 0 || showChildrenForEmpty ? (
            children
          ) : (
            <div className="col-12 text-center h6">
              <IntlMessages id="no-data-found" />
            </div>
          )}
          {currentPage >= 0 && (
            <Pagination
              currentPage={currentPage}
              totalPage={pagesCount}
              onChangePage={onChangePage}
            />
          )}
        </Row>
      </div>
    </Fragment>
  );
};
