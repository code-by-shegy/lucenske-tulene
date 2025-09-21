// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQQyBlwyw1WLF_Xkm60r89LebST8LjEHs",
  authDomain: "lucenske-tulene-ff2f7.firebaseapp.com",
  projectId: "lucenske-tulene-ff2f7",
  storageBucket: "lucenske-tulene-ff2f7.firebasestorage.app",
  messagingSenderId: "134589697796",
  appId: "1:134589697796:web:80363952dc8e2108bdca51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services for use in your app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);