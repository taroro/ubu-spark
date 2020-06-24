import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle, faInfoCircle, faImages } from "@fortawesome/free-solid-svg-icons";

const Rooms = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ roomsItem, setRoomsItem ] = useState([]);
  //const [ error, setError ] = useState();

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getRooms({
          next: querySnapshot => {
            const updatedRoomItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setRoomsItem(updatedRoomItems);
          },
          //error: () => setError('room-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setRoomsItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const roomsItemElements = roomsItem.map((room, i) => 
    <tr key={i}>
      <td>{room.data().roomNo}</td>
      <td>{room.data().nameTh} ({room.data().nameEn})</td>
      <td className="table-action">
        <Button color="primary" className="mr-1 mb-1" size="sm" >
          <FontAwesomeIcon icon={faInfoCircle} />
        </Button>
        <Button color="primary" className="mr-1 mb-1" size="sm" >
          <FontAwesomeIcon icon={faImages} />
        </Button>
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
        <HeaderTitle>ห้องปฏิบัติการ</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>ห้องปฏิบัติการ</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/rooms/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มห้องปฏิบัติการ
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาห้องปฏิบัติการ..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>รหัสห้องปฏิบัติการ</th>
                <th>ห้องปฏิบัติการ</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomsItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Rooms;
