// database/firebaseDb.js

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAGP6PuEfx1jSGvSQdjteWaQxZuzQso0s8",
    authDomain: "reactnativefirebase-00000.firebaseapp.com",
    databaseURL: "https://reactnativefirebase-00000.firebaseio.com",
    projectId: "pictlonis2p0",
    storageBucket: "reactnativefirebase-00000.appspot.com",
    messagingSenderId: "1097108632553",
    appId: "1:1097108632553:ios:e9a1a5473e26ea2888d178"
};

let app;
if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

// const db =  app.firestore();


export default firebase;