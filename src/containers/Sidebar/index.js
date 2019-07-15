import React, { Component } from "react";
import ReactDOM from "react-dom";
import IntlMessages from "util/IntlMessages";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

import { connect } from "react-redux";
import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames
} from "redux/actions";
import menuData from "constants/menu";
import * as permissions from "util/permissions";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.addEvents = this.addEvents.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleProps = this.handleProps.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.getMenuClassesForResize = this.getMenuClassesForResize.bind(this);
    this.setSelectedLiActive = this.setSelectedLiActive.bind(this);

    this.state = {
      selectedParentMenu: "",
      viewingParentMenu: ""
    };
  }

  handleWindowResize(event) {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.props;
    let nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.props.setContainerClassnames(0, nextClasses.join(" "));
  }

  handleDocumentClick(e) {
    const container = this.getContainer();
    let isMenuClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("menu-button") ||
        e.target.classList.contains("menu-button-mobile"))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      (e.target.parentElement.classList.contains("menu-button") ||
        e.target.parentElement.classList.contains("menu-button-mobile"))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.classList &&
      (e.target.parentElement.parentElement.classList.contains("menu-button") ||
        e.target.parentElement.parentElement.classList.contains(
          "menu-button-mobile"
        ))
    ) {
      isMenuClick = true;
    }
    if (
      (container.contains(e.target) && container !== e.target) ||
      isMenuClick
    ) {
      return;
    }
    this.toggle(e);
    this.setState({
      viewingParentMenu: ""
    });
  }

  getMenuClassesForResize(classes) {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props;
    let nextClasses = classes.split(" ").filter(x => x !== "");
    const windowWidth = window.innerWidth;
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push("menu-mobile");
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter(x => x !== "menu-mobile");
      if (
        nextClasses.includes("menu-default") &&
        !nextClasses.includes("menu-sub-hidden")
      ) {
        nextClasses.push("menu-sub-hidden");
      }
    } else {
      nextClasses = nextClasses.filter(x => x !== "menu-mobile");
      if (
        nextClasses.includes("menu-default") &&
        nextClasses.includes("menu-sub-hidden")
      ) {
        nextClasses = nextClasses.filter(x => x !== "menu-sub-hidden");
      }
    }
    return nextClasses;
  }

  getContainer() {
    return ReactDOM.findDOMNode(this);
  }

  toggle() {
    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(" ").filter(x => x !== "")
      : "";

    if (currentClasses.includes("menu-sub-hidden") && menuClickCount === 3) {
      this.props.setContainerClassnames(2, containerClassnames);
    } else if (
      currentClasses.includes("menu-hidden") ||
      currentClasses.includes("menu-mobile")
    ) {
      this.props.setContainerClassnames(0, containerClassnames);
    }
  }

  handleProps() {
    this.addEvents();
  }

  addEvents() {
    ["click", "touchstart"].forEach(event =>
      document.addEventListener(event, this.handleDocumentClick, true)
    );
  }
  removeEvents() {
    ["click", "touchstart"].forEach(event =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    );
  }
  setSelectedLiActive() {
    const oldli = document.querySelector(".sub-menu  li.active");
    if (oldli !== null) {
      oldli.classList.remove("active");
    }

    /* set selected parent menu */
    const selectedlink = document.querySelector(".sub-menu  a.active");
    if (selectedlink !== null) {
      selectedlink.parentElement.classList.add("active");
      this.setState({
        selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute(
          "data-parent"
        )
      });
    } else {
      var selectedParentNoSubItem = document.querySelector(
        ".main-menu  li a.active"
      );

      if (
        selectedParentNoSubItem !== null &&
        selectedParentNoSubItem.getAttribute("data-flag")
      ) {
        this.setState({
          selectedParentMenu: selectedParentNoSubItem.getAttribute("data-flag")
        });
      } else if (this.state.selectedParentMenu === "") {
        this.setState({
          selectedParentMenu: "gogo"
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setSelectedLiActive();
      this.toggle();
      window.scrollTo(0, 0);
    }

    this.handleProps();
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
    this.handleProps();
    this.setSelectedLiActive();
  }

  componentWillUnmount() {
    this.removeEvents();
    window.removeEventListener("resize", this.handleWindowResize);
  }

  changeDefaultMenuType(e, containerClassnames) {
    e.preventDefault();
    let nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.props.setContainerClassnames(0, nextClasses.join(" "));
  }

  openSubMenu(e, item) {
    if (item.child) {
      e.preventDefault();

      const { containerClassnames, menuClickCount } = this.props;
      const currentClasses = containerClassnames
        ? containerClassnames.split(" ").filter(x => x !== "")
        : "";

      if (!currentClasses.includes("menu-mobile")) {
        if (
          currentClasses.includes("menu-sub-hidden") &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.props.setContainerClassnames(3, containerClassnames);
        } else if (
          currentClasses.includes("menu-hidden") &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(2, containerClassnames);
        } else if (
          currentClasses.includes("menu-default") &&
          !currentClasses.includes("menu-sub-hidden") &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(0, containerClassnames);
        }
      } else {
        this.props.addContainerClassname(
          "sub-show-temporary",
          containerClassnames
        );
      }
      this.setState({
        viewingParentMenu: item.id
      });
    } else {
      this.setState({
        selectedParentMenu: item.id,
        viewingParentMenu: item.id
      });
    }
  }
  changeViewingParentMenu(menu) {
    this.toggle();

    this.setState({
      viewingParentMenu: menu
    });
  }
  hasAccess = ({ hasAccess }) => {
    if (hasAccess) return permissions[hasAccess]();
    return true;
  };
  render() {
    return (
      <div className="sidebar">
        <div className="main-menu">
          <div className="scroll">
            <PerfectScrollbar
              option={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <Nav vertical className="list-unstyled">
                {menuData.map((item, index) => {
                  return !this.hasAccess(item) ? (
                    ""
                  ) : (
                    <NavItem
                      key={index}
                      className={classnames({
                        active:
                          (this.state.selectedParentMenu === item.id &&
                            this.state.viewingParentMenu === "") ||
                          this.state.viewingParentMenu === item.id
                      })}
                    >
                      <NavLink
                        to={"/app/" + item.id}
                        onClick={e => this.openSubMenu(e, item)}
                      >
                        <i className={item.icon} />
                        <IntlMessages id={item.textId} />
                      </NavLink>
                    </NavItem>
                  );
                })}
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>

        <div className="sub-menu">
          <div className="scroll">
            {menuData.map((item, index) => {
              return !item.child || !this.hasAccess(item) ? (
                ""
              ) : (
                <Nav
                  key={index}
                  className={classnames({
                    "d-block":
                      (this.state.selectedParentMenu === item.id &&
                        this.state.viewingParentMenu === "") ||
                      this.state.viewingParentMenu === item.id
                  })}
                  data-parent={item.id}
                >
                  {item.child.map((child, index) => {
                    return (
                      <NavItem key={index}>
                        <NavLink to={`/app/${item.id}/${child.id}`}>
                          <i className={child.icon} />
                          <IntlMessages id={child.textId} />
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </Nav>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ menu }) => {
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount
  } = menu;
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    { setContainerClassnames, addContainerClassname, changeDefaultClassnames }
  )(Sidebar)
);
