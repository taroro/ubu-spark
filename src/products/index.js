import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPen, faTrash, faPlusCircle, faInfoCircle, 
  faImages, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const Products = (props) => {
  const [ routeRedirect, setRedirect ] = useState(false);
  const [ productsItem, setProductsItem ] = useState([]);
  //const [ error, setError ] = useState();

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribe = firebase.getProducts({
          next: querySnapshot => {
            const updatedProductItems = querySnapshot.docs.map(docSnapshot => docSnapshot);
            setProductsItem(updatedProductItems);
          },
          //error: () => setError('product-list-item-get-fail')
        });
        return unsubscribe;
      }
    })
  }, [setProductsItem]);
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

  const productsItemElements = productsItem.map((product, i) => {
    const link = "/products/process/"+product.id;
    return (
      <tr key={i}>
        <td>{product.data().nameTh} ({product.data().nameEn})</td>
        <td className="table-action">
          <Button color="primary" className="mr-1 mb-1 text-white" size="sm" >
            <FontAwesomeIcon icon={faInfoCircle} /> ดูรายละเอียด
          </Button>
          <Button color="success" className="mr-1 mb-1 text-white" size="sm" to={link} tag={Link} >
            <FontAwesomeIcon icon={faClipboardList} /> จัดการขั้นตอนการผลิต
          </Button>
          <Button color="success" className="mr-1 mb-1 text-white" size="sm" >
            <FontAwesomeIcon icon={faPen} /> แก้ไข
          </Button>
          <Button color="danger" className="mr-1 mb-1 text-white" size="sm" >
            <FontAwesomeIcon icon={faTrash} /> ลบ
          </Button>
        </td>
      </tr>)
  });
  

  return (
    <Container fluid>
      <Header>
        <HeaderTitle>ผลิตภัณฑ์ (Products)</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>ผลิตภัณฑ์ (Products)</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardHeader>
          <Form inline className="align-middle">
            <Button tag={Link} color="success" className="mr-1 mb-1" to="/products/add" >
              <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มผลิตภัณฑ์
            </Button>
            <Input
              type="text"
              placeholder="ค้นหาผลิตภัณฑ์..."
              aria-label="ค้นหา"
            />
          </Form>
        </CardHeader>
        <CardBody>
          <Table striped>
            <thead>
              <tr>
                <th>ชื่อผลิตภัณฑ์</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsItemElements}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Products;
