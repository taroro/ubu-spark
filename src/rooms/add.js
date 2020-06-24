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

const AddRooms = (props) => {
  const history = useHistory();
  const [ routeRedirect, setRedirect ] = useState(false);
  //const [ error, setError ] = useState();
  
  const [ nameTh, setNameTh ] = useState("");
  const [ nameEn, setNameEn ] = useState("");
  const [ roomNo, setRoomNo ] = useState("");
  const [ photos, setPhotos ] = useState([]);
  const [ description, setDescription ] = useState("");


  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      }
    })
  }, []);

  function createRoom(e) {
    e.preventDefault();
    //setError(null);
    firebase.createRoom(nameTh, nameEn, roomNo, description)
      .then(docRef => {
        const promises = [];
        console.log(docRef)
        photos.forEach(photo => {
          const uploadTask = firebase.uploadPhotoTask(`room/${docRef.id}/${photo.name}`).put(photo);
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
              firebase.addRoomPhoto(docRef.id, downloadURL);
            }
          );
        });
        Promise.all(promises)
          .then(() => { history.goBack() })
          .catch(err => console.log(err.code));
      })
      //.catch(reason => setError('create-room-error'));
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
        <HeaderTitle>ห้องปฏิบัติการ</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/rooms">ห้องปฏิบัติการ</Link></BreadcrumbItem>
          <BreadcrumbItem active>เพิ่มห้องปฏิบัติการ</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardBody>
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อห้องปฏิบัติการ (ภาษาไทย)</Label>
                  <Input type="text" name="nameTh" placeholder="ชื่อห้องปฏิบัติการ (ภาษาไทย)"
                    onChange={(e) => setNameTh(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อห้องปฏิบัติการ (ภาษาอังกฤษ)</Label>
                  <Input type="text" name="nameEn" placeholder="ชื่อห้องปฏิบัติการ (ภาษาอังกฤษ)"
                    onChange={(e) => setNameEn(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>รหัสห้องปฏิบัติการ</Label>
                  <Input type="text" name="roomNo" placeholder="รหัสห้องปฏิบัติการ"
                    onChange={(e) => setRoomNo(e.target.value)} />
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
              <Button color="success" className="mr-1 mb-1" onClick={createRoom} >
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

export default AddRooms;
