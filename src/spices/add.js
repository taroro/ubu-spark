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

const AddSpice = (props) => {
  const history = useHistory();
  const [ routeRedirect, setRedirect ] = useState(false);
  //const [ error, setError ] = useState();
  const [ nameTh, setNameTh ] = useState("");
  const [ nameEn, setNameEn ] = useState("");
  const [ description, setDescription ] = useState("");


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      }
    })
  }, []);

  function createSpice(e) {
    e.preventDefault();
    //setError(null);
    firebase.createSpice(nameTh, nameEn, description)
      .then(docRef => { history.goBack(); })
      //.catch(reason => setError('create-spice-error'));
  };
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  };
  
  return (
    <Container fluid>
      <Header>
        <HeaderTitle>เครื่องเทศ</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/spices">เครื่องเทศ</Link></BreadcrumbItem>
          <BreadcrumbItem active>เพิ่มเครื่องเทศ</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardBody>
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อเครื่องเทศ (ภาษาไทย)</Label>
                  <Input type="text" name="nameTh" placeholder="ชื่อเครื่องเทศ (ภาษาไทย)"
                    onChange={(e) => setNameTh(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อเครื่องเทศ (ภาษาอังกฤษ)</Label>
                  <Input type="text" name="nameEn" placeholder="ชื่อเครื่องเทศ (ภาษาอังกฤษ)"
                    onChange={(e) => setNameEn(e.target.value)} />
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
              <Button color="success" className="mr-1 mb-1" onClick={createSpice} >
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

export default AddSpice;
