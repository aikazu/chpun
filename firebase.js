const firebaseConfig = {
  apiKey: "AIzaSyAHwa7IRQjVOqTZXtDLlC6Db-Dgj0Jh4mM",
  authDomain: "chpun-be523.firebaseapp.com",
  projectId: "chpun-be523",
  storageBucket: "chpun-be523.appspot.com",
  messagingSenderId: "742699786240",
  appId: "1:742699786240:web:2f5ee3aa47e71d2ee678e5",
  measurementId: "G-3ZFJSRWGYL"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();