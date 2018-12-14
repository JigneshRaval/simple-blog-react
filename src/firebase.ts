// src/firebase.js

// Initialize Firebase
// import firebase from 'firebase';
import firebase from 'firebase';

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
