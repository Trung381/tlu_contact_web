// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Nếu cần Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHuMewCt80aOzluBhCo7hyRLu36Yv-vTY",
    authDomain: "tlu-contact-c0c69.firebaseapp.com",
    projectId: "tlu-contact-c0c69",
    storageBucket: "tlu-contact-c0c69.firebasestorage.app",
    messagingSenderId: "944316572954",
    appId: "1:944316572954:web:408ec47f40cacfef16f8a3",
    measurementId: "G-WWX015ZM0P"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // Nếu cần Firestore

// Export the services you need
export { auth, db };