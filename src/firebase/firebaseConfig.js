// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "restapp-7e72d.firebaseapp.com",
  databaseURL:
    "https://restapp-7e72d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restapp-7e72d",
  storageBucket: "restapp-7e72d.appspot.com",
  messagingSenderId: "52521960368",
  appId: "1:52521960368:web:64217e49f7344db2380c75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
