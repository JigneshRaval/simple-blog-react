// src/firebase.js

// Initialize Firebase

// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
// firebase-app         - The core firebase client (required).
// firebase-auth        - Firebase Authentication (optional).
// firebase-database    - The Firebase Realtime Database (optional).
// firebase-firestore   - Cloud Firestore (optional).
// firebase-storage     - Firebase Storage (optional).
// firebase-messaging   - Firebase Cloud Messaging (optional).
// firebase-functions   - Firebase Cloud Functions (optional).
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyDuF3aJJ0UdGcgG74XqDeUPXfZiVWXAGXM",
    authDomain: "simple-react-blog.firebaseapp.com",
    databaseURL: "https://simple-react-blog.firebaseio.com",
    projectId: "simple-react-blog",
    storageBucket: "simple-react-blog.appspot.com",
    messagingSenderId: "609289394377"
};

firebase.initializeApp(config);
/*
var ref = firebase.database().ref();
ref.on("value", function (snapshot) {
    console.log('snapshot ==', snapshot.val());
});
let dbCon = firebase.database().ref('/articles'); */

export default firebase;

/* function writeUserData() {
    dbCon.push({
        message: 'Hi test'
    });
} */
