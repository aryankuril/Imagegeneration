import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcHFY_llhXIBXtBFu-4yxPn1DKQJD2iC4",
  authDomain: "imagegeneration-4be14.firebaseapp.com",
  projectId: "imagegeneration-4be14",
storageBucket: "imagegeneration-4be14.appspot.com",
  messagingSenderId: "353417432599",
  appId: "1:353417432599:web:6d853085015a65f8bfd652",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAcHFY_llhXIBXtBFu-4yxPn1DKQJD2iC4",
//   authDomain: "imagegeneration-4be14.firebaseapp.com",
//   projectId: "imagegeneration-4be14",
//   storageBucket: "imagegeneration-4be14.firebasestorage.app",
//   messagingSenderId: "353417432599",
//   appId: "1:353417432599:web:6d853085015a65f8bfd652",
//   measurementId: "G-X3TYBTWKFJ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);