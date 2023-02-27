import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDoRTaQSGshFUizxHstRKhtED_AKsFcSyw",
    authDomain: "cs-178-tier-2a.firebaseapp.com",
    projectId: "cs-178-tier-2a",
    storageBucket: "cs-178-tier-2a.appspot.com",
    messagingSenderId: "27582499547",
    appId: "1:27582499547:web:9f09c66d3ed735e423dafe",
    measurementId: "G-Z4D2MQ7YV4"
};
  
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();