const functions = require("firebase-functions");
const admin = require('firebase-admin')
// var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://polus-cc376.firebaseio.com"
})

const log = functions.logger.log

// https://firebase.google.com/docs/reference/functions/cloud_functions_
// USER FUNCTIONS
// exports.newUser = functions.firestore.document("/users/{uid}").onCreate(async (snapshot, context) => {
//     // console.log("NEW USER")
//     // console.log(snapshot)
// })

// Entry Functions
// exports.deleteEntry = functions.firestore.document("/users/{uid}/{collection}/{docID}").onDelete(async (snapshot, context) => {
//     log("Delete Entry")
//     log(snapshot.data())
//     log(context)
// })


// Maybe use this in the future to check how many documents a user has already
// functions.firestore.database ?  This mostly will check how much data a certain user is using at the moment
// exports.createEntry = functions.firestore.document("/users/{uid}/{collection}/{docID}").onCreate(async (snapshot, context) => {
//     log("Create Entry")
//     log(snapshot.data())
//     log(context)
// })

// https://firebase.google.com/docs/reference/functions/cloud_functions_.change
// exports.updateEntry = functions.firestore.document("/users/{uid}/{collection}/{docID}").onUpdate(async (change, context) => {
//     log("Update Entry")
//     log(change.before.data())
//     log(change.after.data())
//     log(context)
// })

async function onCreateNotification(uid, time) {
    const user = admin.firestore().collection('users').doc(uid).get();
    // Make this function execute at a specific time
    await admin.messaging().sendToDevice(
        user.tokens,
        {
            data: {
                user: JSON.stringify(user),
            }
        },
        {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: "high"
        }
    ).then((response) => {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log('Successfully sent message:', response);
    }).catch((error) => {
        console.log('Error sending message:', error);
    });

}

exports.createNotification = functions.https.onCall((data, context) => {
    log("Create/Update Notification")
    log(context) // a bunch of stuff to check that user is authenticated, etc.

    const uid = data['uid']
    const time = data['time']
    log(uid)
    log(time)
    // Within the context, we have a userID. based on this id, we will get the token so we know which 
    // one to use for sending the notifications
    return ['Success!']
})