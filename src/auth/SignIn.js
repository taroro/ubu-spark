import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { Button, Card, CardBody, Form, FormGroup, Label, Input } from "reactstrap";
import brandUBU from "../assets/img/brands/spark.png";
import { signin } from "../redux/actions/authActions"

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [routeRedirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const signinAction = (email, password) => dispatch(signin(email, password));

  const signinForm = async(e) => {
    e.preventDefault();
    if(email !== "" && password !== "") {
      let user = await signinAction(email, password);
      if(user) { 
        setRedirect(true);
      }
    }
  }
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/dashboard" />
  }

  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <div className="text-center">
          <img src={brandUBU} alt="Science Park Ubon Ratchathani University" className="img-fluid"  width="120" />
        </div>
        <h2>Science Park Ubon Ratchathani University</h2>
      </div>
      <Card>
        <CardBody>
          <div className="m-sm-4">
            <Form onSubmit={signinForm}>
              <FormGroup>
                <Label>Email</Label>
                <Input bsSize="lg" type="email" name="email" placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input bsSize="lg" type="password" name="password" placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small>
                  <Link to="/auth/reset-password">Forgot password?</Link>
                </small>
              </FormGroup>
              <div className="text-center mt-3">
                <Button color="primary" size="lg" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default SignIn;