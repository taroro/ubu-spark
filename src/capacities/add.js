import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Input, Label, FormGroup, Form, 
  Button, Breadcrumb, BreadcrumbItem, Container, 
  Card, CardBody, Row, Col } from "reactstrap";
import { Redirect, useHistory } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'

const AddCapacity = (props) => {
  const history = useHistory();
  const [ routeRedirect, setRedirect ] = useState(false);
  //const [ error, setError ] = useState();
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      }
    })
  }, []);

  function createCapacity(e) {
    e.preventDefault();
    //setError(null);
    firebase.createCapacity(title, description)
      .then(docRef => { history.goBack(); })
      //.catch(reason => setError('create-capacity-error'));
  };
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  };
  
  return (
    <Container fluid>
      <Header>
        <HeaderTitle>หน่วยกำลังการผลิต</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/capacities">หน่วยกำลังการผลิต</Link></BreadcrumbItem>
          <BreadcrumbItem active>เพิ่มหน่วยกำลังการผลิต</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardBody>
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อหน่วยกำลังการผลิต</Label>
                  <Input type="text" name="title" placeholder="ชื่อหน่วยกำลังการผลิต"
                    onChange={(e) => setTitle(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>รายละเอียดเพิ่มเติม</Label>
                  <Input type="textarea" name="description"
                      onChange={(e) => setDescription(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form className="align-right">
              <Button color="success" className="mr-1 mb-1" onClick={createCapacity} >
                บันทึกข้อมูล
              </Button>
              <Button tag={Link} color="danger" className="mr-1 mb-1" to="/rooms" >
                ยกเลิก
              </Button>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AddCapacity;
