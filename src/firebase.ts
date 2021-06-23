import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

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
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.addScope(
  "https://www.googleapis.com/auth/contacts.readonly"
);
firebase.auth().useDeviceLanguage();

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export default firebase;
