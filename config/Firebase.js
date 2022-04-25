import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1bnf2ZjNR4YYxHrXH7ftCMqquS656Fmg",
  authDomain: "healthspace-12f87.firebaseapp.com",
  projectId: "healthspace-12f87",
  storageBucket: "healthspace-12f87.appspot.com",
  //storageBucket: "gs://healthspace-12f87.appspot.com",
  messagingSenderId: "803991289685",
  appId: "1:803991289685:web:815a7960243e10e35c39dc",
  measurementId: "G-B0MYV6KJZ9"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
// Get a reference to the storage service
const storage = getStorage(app);

export { db, auth, firebaseConfig};