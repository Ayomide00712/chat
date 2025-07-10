import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN2wLN7gjg5umBKMimlcSpiNWGWbRumyw",
  authDomain: "login-authen-92817.firebaseapp.com",
  projectId: "login-authen-92817",
  storageBucket: "login-authen-92817.firebasestorage.app",
  messagingSenderId: "826934130085",
  appId: "1:826934130085:web:6db1cb975935a2c6c9644c",
  measurementId: "G-SRFJ75Q67P",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 