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
    return db.collection('site').doc('information')
	     .collection('users').doc(user.email)
	     .get().then(doc=> {
	       if (doc.exists) {
                 db.collection('individual').doc(user.uid).set({
                   'email': user.email,
                   'name': user.displayName,
                   'avatar': user.photoURL,
                   'groups': []
                 });
	       }
	       return true; 
	     }).catch(err=>console.log(`Error: ${err}`))
  }
);

exports.deleteUserRecords = functions.auth.user().onDelete(
  (user) => {
    db.collection('individual').doc(user.uid).delete();
    // TODO: change site/information/users/user.uid as well 
  }
);

exports.readData = functions.https.onRequest((req, resp) => {
  db.collection('site').doc('information').collection('users').doc('hymeldon@gmail.com').get()
	.then((doc)=>{return console.log(doc.data())}).catch(err=>console.log(err));
});
