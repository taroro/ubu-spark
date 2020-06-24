import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Packagings = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ packagingsItem, setPackagingsItem ] = useState([]);
  //const [ error, setError ] = useState();


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getPackagings({
          next: querySnapshot => {
            const updatedCapacityItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setPackagingsItem(updatedCapacityItems);
          },
          //error: () => setError('room-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setPackagingsItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const packagingsItemElements = packagingsItem.map((packaging, i) => 
    <tr key={i}>
      <td>{packaging.data().nameTh}</td>
      <td>{packaging.data().nameEn}</td>
      <td>{packaging.data().description}</td>
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
        <HeaderTitle>บรรจุภัณฑ์</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>บรรจุภัณฑ์</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/packagings/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มบรรจุภัณฑ์
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาบรรจุภัณฑ์..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>ชื่อบรรจุภัณฑ์ (ภาษาไทย)</th>
                <th>ชื่อบรรจุภัณฑ์ (ภาษาอังกฤษ)</th>
                <th>รายละเอียดเพิ่มเติม</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packagingsItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Packagings;
