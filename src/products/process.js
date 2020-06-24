import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Input, Label, FormGroup, Form, Row, Col,
  Button, Breadcrumb, BreadcrumbItem, Container, 
  Card, CardHeader, CardTitle, CardBody,
  InputGroup, InputGroupAddon,
  ListGroup, ListGroupItem,
  ModalFooter, ModalBody, ModalHeader, Modal } from "reactstrap";
import { Redirect, useHistory } from "react-router-dom";
import Select from "react-select";
import Dragula from 'react-dragula';
import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import * as firebase from '../firebase/firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlusCircle, faShareAlt, faPlusSquare } from "@fortawesome/free-solid-svg-icons";

const ProcessProducts = (props) => {
  const productId = useParams().id;
  const history = useHistory();
  const [ routeRedirect, setRedirect ] = useState(false);
  //const [ error, setError ] = useState();
  const [ showModal, setShowModal ] = useState(false);
  const [ name, setName ] = useState("");
  const [ duration, setDuration ] = useState("");
  const [ machine, setMachine ] = useState("");
  const [ machineLabel, setMachineLabel ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ processItem, setProcessItem ] = useState([]);
  /* [{
    process: [
      {
        subProcess: []
      },
      {
        subProcess: []
      }
    ]
  }] */
  const [ processFlowItem, setProcessFlowItem] = useState();
  const [ machinesItem, setMachinesItem ] = useState([]);
  const [ currentI, setCurrentI ] = useState(null);
  const [ currentJ, setCurrentJ ] = useState(null);
  const [ loadingCanvas, setLoadingCanvas ] = useState(0);
  const [ loadingProcess, setLoadingProcess ] = useState(0);

  useEffect(() => {
    firebase.getUserState().then((user) => {
      if(!user) {
        setRedirect(true);
      } else {
        const unsubscribeMachines = firebase.getMachines({
          next: querySnapshot => {
            const updatedMachineItems = [];
            querySnapshot.docs.map((docSnapshot) => {
              updatedMachineItems.push({
                value: docSnapshot.id,
                label: docSnapshot.data().nameTh + " ("+docSnapshot.data().assetNo+")"
              })
            });
            setMachinesItem(updatedMachineItems);
          },
          error: () => console.log('Machine-list-item-get-fail')
        });

        const unsubscribeProcessCanvas = firebase.getProcessCanvas(productId, {
          next: querySnapshot => {
            const updateProcessItem = [];
            querySnapshot.docs.map((processCanvasSnapshot, i) => {
              updateProcessItem.push({
                process: []
              });

              firebase.getSubProcessProduct(productId, processCanvasSnapshot.id, {
                next: querySubProceeSnapshot => {
                  querySubProceeSnapshot.docs.map((subProcessSnapshot, j) => {
                    updateProcessItem[i].process.push({
                      subProcess: []
                    })
                    firebase.getProcessProduct(productId, processCanvasSnapshot.id, subProcessSnapshot.id, {
                      next: queryProceeSnapshot => {
                        queryProceeSnapshot.docs.map((processSnapshot, k) => {
                          var machineLabel = ""
                          if(processSnapshot.data().machine === "") {
                            machineLabel = "ไม่ใช้เครื่องจักร"
                          } else {
                            /* const machine = firebase.getMachine(processSnapshot.data().machine)
                            machineLabel = machine.data().nameTh + " ("+machine.data().assetNo+")" */
                          }
                          const process = {
                            name: processSnapshot.data().name,
                            duration: processSnapshot.data().duration,
                            description: processSnapshot.data().description,
                            machine: processSnapshot.data().machine,
                            machineLabel: machineLabel
                          }

                          updateProcessItem[i].process[j].subProcess.push(process);
                          setLoadingProcess(loadingProcess+(1*k))
                        });
                      }
                    })
                  });
                }
              })
            });
            setProcessItem(updateProcessItem);
          },
          error: () => console.log('Machine-list-item-get-fail')
        });

        return [ unsubscribeMachines, unsubscribeProcessCanvas ];
      }
    })
  }, []);

  React.useEffect(() => {
      createFlow()
  }, [loadingCanvas, loadingProcess]);

  function toggleModal() {
    setShowModal(!showModal)
  }

  function createProcess(e) {
    e.preventDefault();
    processItem.map((canvas, i) => {
      firebase.addProcessCanvasProduct(productId, i+1).then((processCanvasDocRef) => {
        canvas.process.map((processCanvas, j) => {
          firebase.addSubProcessProduct(productId, processCanvasDocRef.id, j+1).then((subProcessDocRef) => {
            processCanvas.subProcess.map((process, k) => {
              firebase.addProcessProduct(
                productId, processCanvasDocRef.id, subProcessDocRef.id,
                k+1, process.name, process.duration, process.description, process.machine)
            })
          })
        })
      })
    })
    history.goBack();
  }

  function addProcessCanvas() {
    let updateProcessItem = processItem;
    updateProcessItem.push({
      process: [{
        subProcess: []
      }]
    });
    setProcessItem(updateProcessItem);
    createFlow()
  }

  function addSubProcessCanvas(index) {
    let updateProcessItem = processItem;
    updateProcessItem[index].process.push({
      subProcess: []
    });
    setProcessItem(updateProcessItem);
    createFlow()
  }

  function openProcessModal(i, j) {
    setShowModal(true)
    setCurrentI(i);
    setCurrentJ(j);
  }

  function addProcessItem(i, j) {
    let updateProcessItem = processItem;
    var machineLabelAdd = machineLabel;
    if(machineLabelAdd === "") {
      machineLabelAdd = "ไม่ใช้เครื่องจักร"
    }
    const process = {
      name: name,
      duration: duration,
      description: description,
      machine: machine,
      machineLabel: machineLabel
    }
    updateProcessItem[i].process[j].subProcess.push(process);
    setProcessItem(updateProcessItem);
    createFlow()
    toggleModal()
  }

  function deleteProcessItem(i, j ,k) {
    var updateProcessItem = processItem;
    updateProcessItem[i].process[j].subProcess.splice(k, 1);
    setProcessItem(updateProcessItem);
    createFlow()
  }

  function deleteCanvasItem(i) {
    var updateProcessItem = processItem;
    updateProcessItem.splice(i, 1);
    setProcessItem(updateProcessItem);
    createFlow()
  }

  function deleteSubProcessItem(i, j) {
    var updateProcessItem = processItem;
    updateProcessItem[i].process.splice(j, 1);
    setProcessItem(updateProcessItem);
    createFlow()
  }

  function swapProcess(i, j, k, before) {
    var updateProcessItem = processItem;
    var itemSplice = updateProcessItem[i].process[j].subProcess.splice(k, 1);
    var item = itemSplice[0];
    if(before === "0") {
      updateProcessItem[i].process[j].subProcess.unshift(item);
    } else if(before === -99) {
      updateProcessItem[i].process[j].subProcess.push(item)
    } else {
      updateProcessItem[i].process[j].subProcess.splice(before-1, 0, item)
    }
    setProcessItem(updateProcessItem);
    createFlow()
  }

  function createFlow() {
    setProcessFlowItem(null);
    const updateProcessFlowItem = processItem.map((process, i) => {
      const canvas = process;
      const colSize = 12 / canvas.process.length;
      const updateProcessCanvasFlowItem = canvas.process.map((processCanvas, j) => {
        const updateSubProcess = processCanvas.subProcess.map((subProcess, k) => {
          return (
            <Card className="bg-primary" key={k} id={k}>
              <ListGroup flush>
                <ListGroupItem>
                  <Row>
                    <Col md={10}>
                      <Row><Col md={12}><strong>{subProcess.name}</strong></Col></Row>
                      <Row><Col md={12}>เครื่องจักรที่ใช้: {subProcess.machineLabel}</Col></Row>
                      <Row><Col md={12}>เวลาที่ใช้: {subProcess.duration} นาที</Col></Row>
                    </Col>
                    <Col md={2}>
                      <Button color="danger" className="mr-1 mb-1 text-white float-right" size="sm" onClick={() => deleteProcessItem(i, j, k)} >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          )
        })

        return (
          <Col md={colSize} className="bg-light" key={j}>
            <Row className="bg-light  pt-2">
              <Col md={12} className="">
                <Button className="ml-2" color="success" onClick={() => { openProcessModal(i, j); }}>
                  <FontAwesomeIcon icon={faPlusCircle} /> เพิ่มขั้นตอนการผลิต
                </Button>
                <Button color="danger" className="ml-1 mr-1" onClick={() => deleteSubProcessItem(i, j)} >
                  <FontAwesomeIcon icon={faTrash} /> ลบสายงาน
                </Button>
                <div className={"container pt-2 " + i + " " +j} ref={dragulaDecorator}>
                  {updateSubProcess}
                </div>
              </Col>
            </Row>
          </Col>
        )
      });
      
      return (
        <Row key={i} className="mt-3">
          <Col>
            <Row>
              <Col md={12}>
                <Row className="pt-2 pl-2 bg-light">
                  <Button color="success" className="ml-1 mr-1" onClick={() => { addSubProcessCanvas(i) }}>
                    <FontAwesomeIcon icon={faShareAlt} /> เพิ่มสายงาน
                  </Button>
                  <Button color="danger" className="ml-1 mr-1" onClick={() => deleteCanvasItem(i)} >
                    <FontAwesomeIcon icon={faTrash} /> ลบผังงาน
                  </Button>
                </Row>
                <Row className="bg-light pb-3">{updateProcessCanvasFlowItem}</Row>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    })
    setProcessFlowItem(updateProcessFlowItem);
  }
  
  const redirectTo = routeRedirect;
  if(redirectTo) {
    return <Redirect to="/" />
  };

  const dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = { };
      Dragula([componentBackingInstance], options).on('drop', function (el, target, source, sibling) {
        const className = target.className.split(" ")
        const i = className[2]
        const j = className[3]
        if(sibling) {
          swapProcess(i, j, el.id, sibling.id)
        } else {
          swapProcess(i, j, el.id, -99)
        }
      });
    }
  };
  
  //createFlow()
  
  return (
    <Container fluid>
      <Header>
        <HeaderTitle>ขั้นตอนการผลิต</HeaderTitle>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/products">ผลิตภัณฑ์</Link></BreadcrumbItem>
          <BreadcrumbItem active>ขั้นตอนการผลิต</BreadcrumbItem>
        </Breadcrumb>
      </Header>
      <Form>
        <Row form>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>
                  แผนผังขั้นตอนการผลิต
                </CardTitle>
              </CardHeader>
              <CardBody>
                {processFlowItem}
                <Button color="success" onClick={addProcessCanvas} className="mt-3">
                  <FontAwesomeIcon icon={faPlusSquare} /> เพิ่มแผนผัง
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row form className="align-right">
          <Col md={12}>
            <Button tag={Link} color="danger" className="mr-1 mb-1 float-right" to="/products" >
              ยกเลิก
            </Button>
            <Button color="success" className="mr-1 mb-1 float-right" onClick={createProcess} >
              บันทึกข้อมูล
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal isOpen={showModal} toggle={toggleModal} centered >
        <ModalHeader toggle={toggleModal}>
          เพิ่มขั้นตอนการผลิต {currentI} {currentJ}
        </ModalHeader>
        <ModalBody className="m-3">
          <Form>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>ชื่อขั้นตอนการผลิต</Label>
                  <Input type="text" name="name" placeholder="ชื่อขั้นตอนการผลิต"
                    onChange={(e) => setName(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>เครื่องจักรที่ใช้</Label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={machinesItem}
                    isSearchable
                    isClearable
                    onChange={(selected) => {
                      if(selected){
                        setMachine(selected.value)
                        setMachineLabel(selected.label)
                      } else {
                        setMachine("")
                        setMachineLabel("")
                      }
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
              <FormGroup>
                <Label>เวลาที่ใช้</Label>
                <InputGroup className="mb-3">
                  <Input type="text" name="duration" placeholder="เวลาที่ใช้"
                      onChange={(e) => setDuration(e.target.value)} />
                  <InputGroupAddon addonType="append">นาที</InputGroupAddon>
                </InputGroup>
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
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleModal}>
            ปิดหน้าต่าง
          </Button>{" "}
          <Button color="success" onClick={() => { addProcessItem(currentI, currentJ) }} >
            บันทึกข้อมูล
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default ProcessProducts;
