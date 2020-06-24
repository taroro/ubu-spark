import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Capacities = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ capacitiesItem, setCapacitiesItem ] = useState([]);
  //const [ error, setError ] = useState();

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getCapacities({
          next: querySnapshot => {
            const updatedCapacityItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setCapacitiesItem(updatedCapacityItems);
          },
          //error: () => setError('room-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setCapacitiesItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const capacitiesItemElements = capacitiesItem.map((capacity, i) => 
    <tr key={i}>
      <td>{capacity.data().title}</td>
      <td>{capacity.data().description}</td>
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
        <HeaderTitle>หน่วยกำลังการผลิต</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>หน่วยกำลังการผลิต</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/capacities/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มหน่วยกำลังการผลิต
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาหน่วยกำลังการผลิต..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>หน่วยกำลังการผลิต</th>
                <th>รายละเอียดเพิ่มเติม</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {capacitiesItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Capacities;
