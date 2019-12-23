const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addUserRecords = functions.auth.user().onCreate(
  (user) => {
    db.collection('individual').doc(user.uid).set({
      'email': user.email,
      'name': user.displayName,
      'avatar': user.photoURL,
      'groups': []
    });
  }
);

exports.deleteUserRecords = functions.auth.user().onDelete(
  (user) => {
    db.collection('individual').doc(user.uid).delete();
  }
);
