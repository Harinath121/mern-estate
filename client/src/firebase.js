// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-89d99.firebaseapp.com",
  projectId: "mern-estate-89d99",
  storageBucket: "mern-estate-89d99.appspot.com",
  messagingSenderId: "789933623741",
  appId: "1:789933623741:web:da8ad797a5b8aa392a2ad4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);