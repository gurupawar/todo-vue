import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoXuDIyKCS8ZFN43ilxBHrvuGnR2Y0wz4",
  authDomain: "todo-vue-2adc9.firebaseapp.com",
  projectId: "todo-vue-2adc9",
  storageBucket: "todo-vue-2adc9.appspot.com",
  messagingSenderId: "654626828387",
  appId: "1:654626828387:web:1fe0a83ca703dbd45e8856",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();
export { db, auth };
