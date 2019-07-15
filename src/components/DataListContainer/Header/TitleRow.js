import React, { Component } from "react";

import {
  Button,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  Label
} from "reactstrap";

import IntlMessages from "util/IntlMessages";

export class TitleRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropDownOpened: false
    };
  }

  toggleDropDown = () =>
    this.setState({ isDropDownOpened: !this.state.isDropDownOpened });
  render() {
    const {
      title,
      addNewText,
      onAddClick,
      isAllSelected,
      hideButtons,
      onAllSelectedClick,
      onDeleteSelected
    } = this.props;
    return (
      <div className="mb-2">
        {title && (
          <h1>
            <IntlMessages id={title} />
          </h1>
        )}

        {!hideButtons && (
          <div className="float-sm-right">
            <Button color="primary" size="lg" onClick={onAddClick}>
              <IntlMessages id={addNewText} />
            </Button>
            {onAllSelectedClick && (
              <ButtonDropdown
                isOpen={this.state.isDropDownOpened}
                toggle={this.toggleDropDown}
                className="pl-2"
              >
                <div className="btn btn-primary pl-4 pr-0 check-button">
                  <Label
                    for="checkAll"
                    className="custom-control custom-checkbox mb-0 d-inline-block"
                  >
                    <Input
                      className="custom-control-input custom-control-input-dark"
                      type="checkbox"
                      id="checkAll"
                      checked={isAllSelected}
                      onClick={onAllSelectedClick}
                      onChange={() => {}}
                    />
                    <span className={`custom-control-label`} />
                  </Label>
                </div>
                <DropdownToggle
                  caret
                  color="primary"
                  className="dropdown-toggle-split pl-2 pr-2"
                />
                <DropdownMenu right>
                  <DropdownItem onClick={onDeleteSelected}>
                    <IntlMessages id="Delete" />
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            )}
          </div>
        )}
      </div>
    );
  }
}
