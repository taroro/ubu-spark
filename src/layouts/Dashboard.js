import React, { useEffect, useState, useRef }  from "react";
import { connect, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import * as firebase from '../firebase/firebase'

const Dashboard = ({ sidebar, children }) => {
  const dispatch = useDispatch();
  const [routeRedirect, setRedirect] = useState(false);

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user)
        setRedirect(true)
    })
  }, [dispatch]);

  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  return (
    <React.Fragment>
      <Wrapper>
        {!sidebar.isOnRight && <Sidebar />}
        <Main>
          <Navbar />
          <Content>{children}</Content>
        </Main>
        {sidebar.isOnRight && <Sidebar />}
      </Wrapper>
    </React.Fragment>
  );
}

export default connect(store => ({
  sidebar: store.sidebar
}))(Dashboard);
