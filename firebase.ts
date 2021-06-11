import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiCYdm176He3C3NSv2_is-tZ9fyoDSJWY",
  authDomain: "coocal.firebaseapp.com",
  projectId: "coocal",
  storageBucket: "coocal.appspot.com",
  messagingSenderId: "134143270859",
  appId: "1:134143270859:web:44c5c87d5b34f41741604e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export default firebase;
