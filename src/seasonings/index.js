import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Seasonings = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ seasoningsItem, setSeasoningsItem ] = useState([]);
  //const [ error, setError ] = useState();


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getSeasonings({
          next: querySnapshot => {
            const updatedCapacityItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setSeasoningsItem(updatedCapacityItems);
          },
          //error: () => setError('room-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setSeasoningsItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const seasoningsItemElements = seasoningsItem.map((seasoning, i) => 
    <tr key={i}>
      <td>{seasoning.data().nameTh}</td>
      <td>{seasoning.data().nameEn}</td>
      <td>{seasoning.data().description}</td>
      <td className="table-action">
        <Button color="primary" className="mr-1 mb-1" size="sm" >
          <FontAwesomeIcon icon={faPen} />
        </Button>
        <Button color="danger" className="mr-1 mb-1" size="sm" >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </td>
    </tr>
  );
  

  return (
    <Container fluid>
      <Header>
        <HeaderTitle>เครื่องปรุง</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>เครื่องปรุง</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/seasonings/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มเครื่องปรุง
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาเครื่องปรุง..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>ชื่อเครื่องปรุง (ภาษาไทย)</th>
                <th>ชื่อเครื่องปรุง (ภาษาอังกฤษ)</th>
                <th>รายละเอียดเพิ่มเติม</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seasoningsItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Seasonings;
