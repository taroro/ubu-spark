import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Col, Container, Row } from "reactstrap";
import brandUBUSpark from "../assets/img/brands/ubuspark.png";

const Intro = () => (
  <div className="h-100">
    <Container className="py-4 h-100 align-middle">
      <Row>
        <Col xl={11} className="mx-auto">
          <Row>
            <Col md={12} xl={8} className="mx-auto text-center">
              <div className="d-block my-4">
                <div className="my-4">
                  <img src={brandUBUSpark} alt="Ubon Ratchathani University" height="150" className="align-middle mr-2" />{" "}
                </div>
              </div>
              <Container className="text-center">
                <Button  tag={Link} to="/auth/sign-in" color="primary" size="lg" className="mr-1 mb-1" >
                  Sign in
                </Button>
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </div>
);

const Landing = () => {
  return (
    <React.Fragment>
      <Intro />
    </React.Fragment>
  )
}

export default connect()(Landing);