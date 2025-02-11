// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7h5K_56tuHTBH7pP1bpE56yWWFWH4wzg",
  authDomain: "brgy-amoingon-portal.firebaseapp.com",
  projectId: "brgy-amoingon-portal",
  storageBucket: "brgy-amoingon-portal.appspot.com",
  messagingSenderId: "512790058331",
  appId: "1:512790058331:web:871da4d0b7cac03f97b67e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
