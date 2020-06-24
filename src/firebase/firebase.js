import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyC3t_N0rh8tgjPqIhicgBK0G_zO7FNqFN8",
  authDomain: "ubuspark-pilotplant.firebaseapp.com",
  databaseURL: "https://ubuspark-pilotplant.firebaseio.com",
  projectId: "ubuspark-pilotplant",
  storageBucket: "ubuspark-pilotplant.appspot.com",
  messagingSenderId: "767228393521",
  appId: "1:767228393521:web:2ab3eb4c2f65885d0d3d10",
  measurementId: "G-PQCVHGNC9Y"
}

firebase.initializeApp(config);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export const signup = async(email, password) => {
  const user = await auth.createUserWithEmailAndPassword(email, password).catch((error) => {
    console.log(error);
  });
  return user;
}

export const signin = async(email, password) => {
  const user = await auth.signInWithEmailAndPassword(email, password).catch((error) => {
    console.log(error);
  });

  return user;
}

export const signout = async() => {
  const signout = await auth.signOut().catch((error) => {
    console.log(error);
  });
  return signout;
}

export const getUserState = async() => {
  return new Promise(resolve => {
    auth.onAuthStateChanged(resolve)
  })
}

export const getMachines = (observer) => {
  return db.collection('machines').orderBy('nameTh').onSnapshot(observer);
}

export const getMachine = async(machineId) => {
  const machine = await db.collection('machines').doc(machineId).get().then((machineSnapshot) => {
    
    console.log(machineId)
    return machineSnapshot
  });
  return machine
}

export const createMachine = (
  nameTh, nameEn, assetNo, brand, 
  model, room, specification, capacity, 
  capacityUnit, cipTime, settingTime, availableTime, costPerHour) => {
  return db.collection('machines').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, assetNo, brand, 
            model, room, specification, capacity, 
            capacityUnit, cipTime, settingTime, availableTime, costPerHour
        });
}

export const addMachinePhoto = (machineDocId, urlImage) => {
  return db.collection('machines').doc(machineDocId).collection('photos').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    urlImage
  });
}

export const getRooms = (observer) => {
  return db.collection('rooms').orderBy('nameTh').onSnapshot(observer);
}

export const createRoom = (nameTh, nameEn, roomNo, description) => {
  return db.collection('rooms').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, roomNo, description
        });
}

export const addRoomPhoto = (roomDocId, urlImage) => {
  return db.collection('rooms').doc(roomDocId).collection('photos').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    urlImage
  });
}

export const getCapacities = (observer) => {
  return db.collection('capacities').orderBy('title').onSnapshot(observer);
}

export const createCapacity = (title, description) => {
  return db.collection('capacities').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            title, description
        });
}

export const getIngredients = (observer) => {
  return db.collection('ingredients').orderBy('nameTh').onSnapshot(observer);
}

export const createIngredient = (nameTh, nameEn, description) => {
  return db.collection('ingredients').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, description
        });
}

export const getSeasonings = (observer) => {
  return db.collection('seasonings').orderBy('nameTh').onSnapshot(observer);
}

export const createSeasoning = (nameTh, nameEn, description) => {
  return db.collection('seasonings').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, description
        });
}

export const getSpices = (observer) => {
  return db.collection('spices').orderBy('nameTh').onSnapshot(observer);
}

export const createSpice = (nameTh, nameEn, description) => {
  return db.collection('spices').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, description
        });
}

export const getPackagings = (observer) => {
  return db.collection('packagings').orderBy('nameTh').onSnapshot(observer);
}

export const createPackaging = (nameTh, nameEn, description) => {
  return db.collection('packagings').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, description
        });
}

export const getProducts = (observer) => {
  return db.collection('products').orderBy('nameTh').onSnapshot(observer);
}

export const createProduct = (nameTh, nameEn, description) => {
  return db.collection('products').add({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            nameTh, nameEn, description
        });
}

export const getProcessCanvas = (productId, observer) => {
  return db.collection('products').doc(productId).collection('process').orderBy('order').onSnapshot(observer);
}

export const addProcessCanvasProduct = (productDocId, order) => {
  return db.collection('products').doc(productDocId).collection('process').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    order
  });
}

export const getSubProcessProduct = (productId, processCanvasId, observer) => {
  return db.collection('products').doc(productId)
  .collection('process').doc(processCanvasId)
  .collection('subProcess').orderBy('order').onSnapshot(observer);
}

export const addSubProcessProduct = (productDocId, processCanvasId, order) => {
  return db.collection('products').doc(productDocId)
  .collection('process').doc(processCanvasId).collection('subProcess').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    order
  });
}

export const getProcessProduct = (productId, processCanvasId, subProcessDocId, observer) => {
  return db.collection('products').doc(productId)
  .collection('process').doc(processCanvasId)
  .collection('subProcess').doc(subProcessDocId)
  .collection('process').orderBy('order').onSnapshot(observer);
}

export const addProcessProduct = (productDocId, processCanvasId, subProcessDocId, order, name, duration, description, machine) => {
  return db.collection('products').doc(productDocId)
  .collection('process').doc(processCanvasId)
  .collection('subProcess').doc(subProcessDocId)
  .collection('process').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    order, name, duration, description, machine
  });
}

export const addProductPhoto = (roomDocId, urlImage) => {
  return db.collection('products').doc(roomDocId).collection('photos').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    urlImage
  });
}

export const uploadPhotoTask = (ref) => {
  return storage.ref().child(ref);
}

export const firebaseApp = firebase;