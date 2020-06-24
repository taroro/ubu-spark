import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle, faInfoCircle, faImages } from "@fortawesome/free-solid-svg-icons";

const Machines = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ machinesItem, setMachinesItem ] = useState([]);
  //const [ error, setError ] = useState();


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getMachines({
          next: querySnapshot => {
            const updatedMachineItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setMachinesItem(updatedMachineItems);
          },
          //error: () => setError('machine-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setMachinesItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const machinesItemElements = machinesItem.map((machine, i) => 
    <tr key={i}>
      <td>{machine.data().nameTh} ({machine.data().nameEn})<br />รหัสเครื่องมือ: {machine.data().assetNo}</td>
      <td className="d-none d-xl-table-cell">{machine.data().brand}/{machine.data().model}</td>
      <td className="d-none d-xl-table-cell">{machine.data().room}</td>
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
        <HeaderTitle>เครื่องจักร</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>เครื่องจักร (Machine)</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/machines/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มเครื่องจักร
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาเครื่องจักร..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>เครื่องจักร</th>
                <th className="d-none d-xl-table-cell">ยี่ห้อ/รุ่น</th>
                <th className="d-none d-xl-table-cell">ตำแหน่งที่ตั้ง</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machinesItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Machines;
