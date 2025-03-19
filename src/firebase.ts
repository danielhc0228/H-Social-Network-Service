// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNGhym6VNkui4Vzl3fco2SAJmvY1mw9vA",
    authDomain: "twitter-clone-15a8b.firebaseapp.com",
    projectId: "twitter-clone-15a8b",
    storageBucket: "twitter-clone-15a8b.firebasestorage.app",
    messagingSenderId: "1080597560961",
    appId: "1:1080597560961:web:237d1ab224fad933621780",
    measurementId: "G-BY5MMF87J7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
