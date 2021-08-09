const functions = require("firebase-functions");
const admin = require('firebase-admin')

// var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://polus-cc376.firebaseio.com"
})

const log = functions.logger.logger


// exports.notificationUpdate = functions.firestore.

exports.newUser = functions.firestore.document("/users/{id}").onCreate(async (snapshot) => {
    // console.log("NEW USER")
    // console.log(snapshot)
})

exports.newEntry = functions.firestore.document("/users/{uid}/{collection}/{docID}").onCreate(async (snapshot, context) => {
    log("NEW ENTRY")
    log(snapshot.data())
    log(context)
})

exports.notificationCheck = functions.firestore.document("/users/{uid}/{collection}/{docID}").onUpdate(async (change, context) => {
    log("Notification Check")
    log(change)
    log(context)
})