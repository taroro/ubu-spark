import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, InputGroup, InputGroupAddon, Label, FormGroup, Form, Button, Breadcrumb, BreadcrumbItem, Container, Card, CardBody, Row, Col } from "reactstrap";
import Select from "react-select";
import { Redirect, useHistory } from "react-router-dom";
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase'

const AddMachines = (props) => {
  const history = useHistory();
  const [ routeRedirect, setRedirect ] = useState(false);
  //const [ error, setError ] = useState();
  
  const [ nameTh, setNameTh ] = useState("");
  const [ nameEn, setNameEn ] = useState("");
  const [ assetNo, setAssetNo ] = useState("");
  const [ brand, setBrand ] = useState("");
  const [ model, setModel ] = useState("");
  const [ room, setRoom ] = useState("");
  const [ specification, setSpecification ] = useState("");
  const [ capacity, setCapacity ] = useState("");
  const [ capacityUnit, setCapacityUnit ] = useState("");
  const [ cipTime, setCipTime ] = useState(0);
  const [ settingTime, setSettingTime ] = useState(0);
  const [ availableTime, setAvailableTime ] = useState(0);
  const [ costPerHour, setCostPerHour ] = useState(0);
  const [ photos, setPhotos ] = useState([]);

  const [ roomsItem, setRoomsItem ] = useState([]);
  const [ capacitiesItem, setCapacitiesItem ] = useState([]);

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribeRooms = firebase.getRooms({
          next: querySnapshot => {
            const updatedRoomItems = [];
            querySnapshot.docs.map((docSnapshot) => {
              updatedRoomItems.push({
                value: docSnapshot.id,
                label: docSnapshot.data().roomNo + ": " +docSnapshot.data().nameTh+" ("+docSnapshot.data().nameEn+")"
              })
            });
            setRoomsItem(updatedRoomItems);
          },
          error: () => console.log('room-list-item-get-fail')
        });
        
        const unsubscribeCapacities = firebase.getCapacities({
          next: querySnapshot => {
            const updatedCapacityItems = [];
            querySnapshot.docs.map((docSnapshot) => {
              updatedCapacityItems.push({
                value: docSnapshot.id,
                label: docSnapshot.data().title
              })
            });
            setCapacitiesItem(updatedCapacityItems);
          },
          error: () => console.log('room-list-item-get-fail')
        });
        return [ unsubscribeRooms, unsubscribeCapacities ];
      }
    })
  }, []);

  function createMachine(e) {
    e.preventDefault();
    //setError(null);
    firebase.createMachine(nameTh, nameEn, assetNo, brand, model, room, specification, capacity, capacityUnit, cipTime, settingTime, availableTime, costPerHour)
      .then(docRef => {
        const promises = [];
        console.log(docRef)
        photos.forEach(photo => {
          const uploadTask = firebase.uploadPhotoTask(`machine/${docRef.id}/${photo.name}`).put(photo);
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
              firebase.addMachinePhoto(docRef.id, downloadURL);
            }
          );
        });
        Promise.all(promises)
          .then(() => { history.goBack() })
          .catch(err => console.log(err.code));
      })
      //.catch(reason => setError('create-machine-error'));
  }
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  }

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
        <HeaderTitle>เครื่องจักร</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/machines">เครื่องจักร (Machine)</Link></BreadcrumbItem>
          <BreadcrumbItem active>เพิ่มเครื่องจักร</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Card>
        <CardBody>
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อเครื่องจักร (ภาษาไทย)</Label>
                  <Input type="text" name="nameTh" placeholder="ชื่อเครื่องจักร (ภาษาไทย)"
                    onChange={(e) => setNameTh(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>ชื่อเครื่องจักร (ภาษาอังกฤษ)</Label>
                  <Input type="text" name="nameEn" placeholder="ชื่อเครื่องจักร (ภาษาอังกฤษ)"
                    onChange={(e) => setNameEn(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>รหัสเครื่องมือ (เลขพัสดุ)</Label>
                  <Input type="text" name="assetNo" placeholder="รหัสเครื่องมือ (เลขพัสดุ)"
                    onChange={(e) => setAssetNo(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>ยี่ห้อเครื่องจักร</Label>
                  <Input type="text" name="brand" placeholder="ยี่ห้อเครื่องจักร"
                    onChange={(e) => setBrand(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>รุ่นเครื่องจักร</Label>
                  <Input type="text" name="model" placeholder="รุ่นเครื่องจักร"
                    onChange={(e) => setModel(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={7}>
                <FormGroup>
                  <Label>สถานที่ตั้ง (ห้องปฏิบัติงาน)</Label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={roomsItem}
                    isSearchable
                    onChange={(selected) => setRoom(selected.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>กำลังการผลิต</Label>
                  <InputGroup className="mb-3">
                    <Input type="text" name="capacity" placeholder="กำลังการผลิต"
                        onChange={(e) => setCapacity(e.target.value)} />
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      options={capacitiesItem}
                      isSearchable
                      onChange={(selected) => setCapacityUnit(selected.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label>เวลาทำความสะอาด</Label>
                  <InputGroup className="mb-3">
                    <Input type="text" name="cipTime" placeholder="เวลาทำความสะอาด"
                        onChange={(e) => setCipTime(e.target.value)} />
                    <InputGroupAddon addonType="append">นาที</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>เวลาตั้งค่าเครื่องมือ</Label>
                  <InputGroup className="mb-3">
                    <Input type="text" name="settingTime" placeholder="เวลาตั้งค่าเครื่องมือ"
                        onChange={(e) => setSettingTime(e.target.value)} />
                    <InputGroupAddon addonType="append">นาที</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>จำนวนชั่วโมงที่ใช้งานได้จริง</Label>
                  <InputGroup className="mb-3">
                    <Input type="text" name="availableTime" placeholder="จำนวนชั่วโมงที่ใช้งานได้จริง"
                        onChange={(e) => setAvailableTime(e.target.value)} />
                    <InputGroupAddon addonType="append">ชั่วโมง</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label>ราคา/ชั่วโมง</Label>
                  <InputGroup className="mb-3">
                    <Input type="text" name="costPerHour" placeholder="ราคา/ชั่วโมง"
                        onChange={(e) => setCostPerHour(e.target.value)} />
                    <InputGroupAddon addonType="append">บาท/ชั่วโมง</InputGroupAddon>
                  </InputGroup>
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
                  <Label>คุณสมบัติ</Label>
                  <Input type="textarea" name="specification"
                      onChange={(e) => setSpecification(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form className="align-right">
              <Button color="success" className="mr-1 mb-1" onClick={createMachine} >
                บันทึกข้อมูล
              </Button>
              <Button tag={Link} color="danger" className="mr-1 mb-1" to="/machines" >
                ยกเลิก
              </Button>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AddMachines;
