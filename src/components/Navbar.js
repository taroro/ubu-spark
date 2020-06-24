import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import { Redirect } from "react-router-dom";
import { 
  Collapse, Navbar, Nav, UncontrolledDropdown, 
  DropdownToggle, DropdownMenu, DropdownItem, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faCog, faArrowAltCircleRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { signout } from "../redux/actions/authActions";

const NavbarToggle = connect(store => ({ app: store.app })) (({ dispatch }) => {
  return (
    <span className="sidebar-toggle d-flex mr-2" onClick={() => { dispatch(toggleSidebar()); }} >
      <i className="hamburger align-self-center" />
    </span>
  );
});

const NavbarSearch = connect(store => ({ sidebar: store.sidebar })) (({ sidebar }) => {
  return (
    <Form inline>
    </Form>
  );
});

const NavbarDropdowns = connect(store => ({ sidebar: store.sidebar })) (({ sidebar }) => {
  const [userState, setUserState] = useState(null);
  const [routeRedirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const signoutAction = () => dispatch(signout());

  const signoutForm = async() => {
    setUserState(null);
    await signoutAction();
    setRedirect(true);
  }

  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  return (
    <Collapse navbar>
      <Nav className={!sidebar.isOnRight ? "ml-auto" : "mr-auto"} navbar>
        <UncontrolledDropdown nav inNavbar className="ml-lg-1">
          <DropdownToggle nav caret>
            <FontAwesomeIcon icon={faCog} className="align-middle" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <FontAwesomeIcon icon={faUser} fixedWidth className="mr-2 align-middle" />
              View Profile
            </DropdownItem>
            <DropdownItem>
              <FontAwesomeIcon icon={faCogs} fixedWidth className="mr-2 align-middle" />
              Settings
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={signoutForm}>
              <FontAwesomeIcon icon={faArrowAltCircleRight} fixedWidth className="mr-2 align-middle"  />
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Collapse>
  );
});

const NavbarComponent = ({ sidebar }) => {
  return (
    <Navbar expand className="navbar-theme">
      <React.Fragment>
        <NavbarToggle />
        <NavbarSearch />
        <NavbarDropdowns />
      </React.Fragment>
    </Navbar>
  );
};

export default connect(store => ({ sidebar: store.sidebar })) (NavbarComponent);
