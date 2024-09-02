// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBVCwUfFCCws0O3S3CTyd3-cQwYdc4BGn8",
  authDomain: "meraj-courses.firebaseapp.com",
  projectId: "meraj-courses",
  storageBucket: "meraj-courses.appspot.com",
  messagingSenderId: "1035865300782",
  appId: "1:1035865300782:web:ebf4674a086776a2dba4bf",
  measurementId: "G-3TYDZNVB6R"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
const database = getDatabase(app);

export { auth, database, storage };  // Named export