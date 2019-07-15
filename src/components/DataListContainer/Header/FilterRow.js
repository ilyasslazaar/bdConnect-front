import React from "react";

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap";

import IntlMessages from "util/IntlMessages";
import { listPageSizes } from "constants/defaultValues";

export const FilterRow = props => {
  const {
    onChangeOrderBy,
    orderOptions,
    pageSize,
    changePageSize,
    dataLength,
    orderBy
  } = props;
  const startIndex = (props.currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return (
    <div className="mb-3">
      <div id="displayOptions" className="d-block d-md-inline-block">
        {orderOptions && (
          <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
            <DropdownToggle caret color="outline-dark" size="xs">
              <IntlMessages id="order-by" /> {orderBy ? orderBy.label : ""}
            </DropdownToggle>
            <DropdownMenu>
              {orderOptions.map((order, index) => {
                return (
                  <DropdownItem
                    key={index}
                    onClick={() => onChangeOrderBy(order)}
                  >
                    {order.label}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </div>
      <div className="float-md-right">
        <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} of ${dataLength} `}</span>
        <UncontrolledDropdown className="d-inline-block">
          <DropdownToggle caret color="outline-dark" size="xs">
            {pageSize}
          </DropdownToggle>
          <DropdownMenu right>
            {listPageSizes.map((size, index) => {
              return (
                <DropdownItem key={index} onClick={() => changePageSize(size)}>
                  {size}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
};
