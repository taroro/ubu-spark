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

const AddProducts = (props) => {
  const history = useHistory();
  const [ routeRedirect, setRedirect ] = useState(false);
  //const [ error, setError ] = useState();
  
  const [ nameTh, setNameTh ] = useState("");
  const [ nameEn, setNameEn ] = useState("");
  const [ photos, setPhotos ] = useState([]);
  const [ description, setDescription ] = useState("");


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      }
    })
  }, []);

  function createProduct(e) {
    e.preventDefault();
    //setError(null);
    firebase.createProduct(nameTh, nameEn, description)
      .then(docRef => {
        const promises = [];
        console.log(docRef)
        photos.forEach(photo => {
          const uploadTask = firebase.uploadPhotoTask(`product/${docRef.id}/${photo.name}`).put(photo);
          promises.push(uploadTask);
          uploadTask.on(
            firebase.firebaseApp.storage.TaskEvent.STATE_CHANGED,
            snapshot => { 
              const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              if (snapshot.state === firebase.firebaseApp.storage.TaskState.RUNNING) {
                console.log(`Progress: ${progress}%`);
              }
            },
            error => console.log(error.code),
            async () => {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
              firebase.addProductPhoto(docRef.id, downloadURL);
            }
          );
        });
        Promise.all(promises)
          .then(() => { history.goBack() })
          .catch(err => console.log(err.code));
      })
      //.catch(reason => setError('create-product-error'));
  };
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  };

  const onFileChange = e => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      setPhotos(prevState => [...prevState, newFile]);
    }
  };
  
  return (
    <Container fluid>
      <Header>
        <HeaderTitle>ผลิตภัณฑ์</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/products">ผลิตภัณฑ์</Link></BreadcrumbItem>
          <BreadcrumbItem active>เพิ่มผลิตภัณฑ์</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardBody>
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อผลิตภัณฑ์ (ภาษาไทย)</Label>
                  <Input type="text" name="nameTh" placeholder="ชื่อผลิตภัณฑ์ (ภาษาไทย)"
                    onChange={(e) => setNameTh(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อผลิตภัณฑ์ (ภาษาอังกฤษ)</Label>
                  <Input type="text" name="nameEn" placeholder="ชื่อผลิตภัณฑ์ (ภาษาอังกฤษ)"
                    onChange={(e) => setNameEn(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>รูปภาพ</Label>
                  <Input type="file" multiple onChange={onFileChange}/>
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
              <Button color="success" className="mr-1 mb-1" onClick={createProduct} >
                บันทึกข้อมูล
              </Button>
              <Button tag={Link} color="danger" className="mr-1 mb-1" to="/products" >
                ยกเลิก
              </Button>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AddProducts;
