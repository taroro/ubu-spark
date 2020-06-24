import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Ingredients = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ ingredientsItem, setIngredientsItem ] = useState([]);
  //const [ error, setError ] = useState();


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getIngredients({
          next: querySnapshot => {
            const updatedCapacityItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setIngredientsItem(updatedCapacityItems);
          },
          //error: () => setError('room-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setIngredientsItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const ingredientsItemElements = ingredientsItem.map((ingredient, i) => 
    <tr key={i}>
      <td>{ingredient.data().nameTh}</td>
      <td>{ingredient.data().nameEn}</td>
      <td>{ingredient.data().description}</td>
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
        <HeaderTitle>ส่วนผสม</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>ส่วนผสม</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/ingredients/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มส่วนผสม
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาส่วนผสม..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>ชื่อส่วนผสม (ภาษาไทย)</th>
                <th>ชื่อส่วนผสม (ภาษาอังกฤษ)</th>
                <th>รายละเอียดเพิ่มเติม</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredientsItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Ingredients;
