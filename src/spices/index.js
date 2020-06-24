import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Spices = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ spicesItem, setSpicesItem ] = useState([]);
  //const [ error, setError ] = useState();

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getSpices({
          next: querySnapshot => {
            const updatedCapacityItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setSpicesItem(updatedCapacityItems);
          },
          //error: () => setError('room-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setSpicesItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const spicesItemElements = spicesItem.map((spice, i) => 
    <tr key={i}>
      <td>{spice.data().nameTh}</td>
      <td>{spice.data().nameEn}</td>
      <td>{spice.data().description}</td>
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
        <HeaderTitle>เครื่องเทศ</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>เครื่องเทศ</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/spices/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มเครื่องเทศ
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาเครื่องเทศ..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>ชื่อเครื่องเทศ (ภาษาไทย)</th>
                <th>ชื่อเครื่องเทศ (ภาษาอังกฤษ)</th>
                <th>รายละเอียดเพิ่มเติม</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {spicesItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Spices;
