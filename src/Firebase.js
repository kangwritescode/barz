import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCAKcTP3ThSZwJtWIZ5BXCCubhMgq-eTpA",
    authDomain: "barz-86ae0.firebaseapp.com",
    databaseURL: "https://barz-86ae0.firebaseio.com",
    projectId: "barz-86ae0",
    storageBucket: "barz-86ae0.appspot.com",
    messagingSenderId: "607580458991",
    appId: "1:607580458991:web:3d68049c04b18cfe17f01a",
    measurementId: "G-EMWQ4CYWP0"
  };
firebase.initializeApp(config);

export default firebase;