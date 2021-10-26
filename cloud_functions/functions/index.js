const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { CloudTasksClient } = require("@google-cloud/tasks");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://polus-cc376.firebaseio.com",
});
const log = functions.logger.log;

// This article saved me tons of research by showing how to use Cloud Tasks. I then implemented Cloud Firebase Notifications
// https://medium.com/firebase-developers/how-to-schedule-a-cloud-function-to-run-in-the-future-in-order-to-build-a-firestore-document-ttl-754f9bf3214a
// Task Related
exports.createTask = functions.https.onCall(async (data, context) => {
  // I should somehow check to users current timezone? just so we know which date they want to edit
  log("Create task");
  const { difference, date, uid, id } = data;
  const taskClient = new CloudTasksClient();
  const expirationAtSeconds = difference + Date.now() / 1000; // offset in seconds
  const docPath = `/users/${uid}/${date}/${id}`;
  let prevEntry = await admin.firestore().doc(docPath).get();
  let prevEntryData = await prevEntry.data();
  // log("Check Expiration Task")
  if (prevEntryData.hasOwnProperty("expirationTask")) {
    // Delete old expiration task
    await taskClient.deleteTask({ name: prevEntryData.expirationTask });
  }
  // This is good, its something wrong with firebase env?
  const project = "polus-cc376";
  const location = "us-central1";
  const queue = "firestore-ttl";
  const queuePath = taskClient.queuePath(project, location, queue);
  const url = `https://${location}-${project}.cloudfunctions.net/firestoreTtlCallback`;
  const payload = {
    docPath,
    uid,
  };
  const task = {
    httpRequest: {
      httpMethod: "POST",
      url,
      body: Buffer.from(JSON.stringify(payload)).toString("base64"),
      headers: {
        "Content-Type": "application/json",
      },
    },
    scheduleTime: {
      seconds: expirationAtSeconds,
    },
  };
  // log("Create Task")
  const [response] = await taskClient.createTask({ parent: queuePath, task });
  const expirationTask = response.name;
  // update the entry with the expiration task name
  // log("Update Task")
  await admin.firestore().doc(docPath).update({ expirationTask });
  log("Done with Create Task");
  return [`Success! You will receive message in ${difference} seconds`];
});
// If entry had a running task, then we will call this function
exports.deleteTask = functions.https.onCall(async (data, context) => {
  log("Delete Task");
  try {
    const taskClient = new CloudTasksClient();
    const { task } = data;
    await taskClient.deleteTask({ name: task });
    return ["Successfully Deleted Data"];
  } catch (e) {
    log("Something Went Wrong");
    log(e);
    return ["Something Went Wrong!"];
  }
});

exports.firestoreTtlCallback = functions.https.onRequest(async (req, res) => {
  try {
    const payload = req.body;
    let entry = await (
      await admin.firestore().doc(payload.docPath).get()
    ).data();
    let tokens = await (
      await admin.firestore().doc(`/users/${payload.uid}`).get()
    ).get("tokens");
    const notification = {
      notification: {
        title: "Polus",
        body: entry["text"],
      },
    };
    const response = await admin.messaging().sendToDevice(tokens, notification);
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        functions.logger.error(
          "Failure sending notification to",
          tokens[index],
          error
        );
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          // remove token here
        }
      } else {
        log("Successfully send message!");
      }
    });
    await admin
      .firestore()
      .doc(payload.docPath)
      .update({ expirationTask: admin.firestore.FieldValue.delete() });
    res.sendStatus(200);
  } catch (err) {
    log(err);
    await admin
      .firestore()
      .doc(payload.docPath)
      .update({ expirationTask: admin.firestore.FieldValue.delete() });
    res.status(500).send(err);
  }
});

// User Related
// get all subcollections for a user and return them to the user
exports.getSubcollections = functions.https.onCall(async (data, context) => {
  // we will get userUid from data variable
  const { uid } = data;
  const subCollections = await admin
    .firestore()
    .doc(`users/${uid}`)
    .listCollections();
  return subCollections.map((collection) => collection.id);
});

exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  // delete all user information
  console.log(user.uid);
  const subCollections = await admin
    .firestore()
    .doc(`users/${user.uid}`)
    .listCollections()
    .map((collection) => collection.id);
  if (subCollections.length > 0) {
    for (const collection of subCollections) {
      const collectionRef = admin
        .firestore()
        .collection(`users/${user.uid}/${collection}`);
      deleteBatch(collectionRef);
    }
  }
  // finally, delete the user document
  admin.firestore().doc(`users/${user.uid}`).delete();
});

const deleteBatch = async (collectionRef) => {
  const snapshot = await collectionRef.get();
  const batchSize = snapshot.size();
  if (batchSize === 0) {
    return;
  }
  const batch = admin.firestore().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};
