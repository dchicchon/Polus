const functions = require("firebase-functions");
const admin = require('firebase-admin')
const { CloudTasksClient } = require('@google-cloud/tasks');
admin.initializeApp()
const log = functions.logger.log
const join = (t, s) => {
    let a = [{ month: 'numeric' }, { day: 'numeric' }, { year: 'numeric' }];
    function format(m) {
        let f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

// This article saved me tons of research by showing how to use Cloud Tasks. I then implemented Cloud Firebase Notifications
// https://medium.com/firebase-developers/how-to-schedule-a-cloud-function-to-run-in-the-future-in-order-to-build-a-firestore-document-ttl-754f9bf3214a

// Potentially do this
// exports.checkForTasks = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
//     const date = join(new Date(), '-')
//     const users = admin.firestore().getAll()
//     log(users)
//     // for user in users
//     // check if user has date collection
//     // check if user has any entries that are timed for that collection
//     // create task for each timed entry

// })

// exports.test = functions.https.onCall(async (data, context) => {
//     const date = join(new Date(), '-')
//     const users = admin.firestore().collection('users').get()
//     log(users)
// })

exports.createTask = functions.https.onCall(async (data, context) => {
    // I should somehow check to users current timezone? just so we know which date they want to edit
    log("Create task")
    let { difference, date, uid, id, } = data
    const taskClient = new CloudTasksClient();
    log(difference)

    const expirationAtSeconds = difference + Date.now() / 1000 // offset in seconds

    let prevEntry = await admin.firestore().doc(`/users/${uid}/${date}/${id}`).get()
    let prevEntryData = await prevEntry.data()
    // log(prevEntryData)
    if (prevEntryData.hasOwnProperty('expirationTask')) {
        // Delete old expiration task
        await taskClient.deleteTask({ name: prevEntryData.expirationTask })
    }

    const project = JSON.parse(process.env.FIREBASE_CONFIG).projectId
    const location = 'us-central1'
    const queue = 'firestore-ttl'
    const queuePath = taskClient.queuePath(project, location, queue)
    const url = `https://${location}-${project}.cloudfunctions.net/firestoreTtlCallback`
    const docPath = `/users/${uid}/${date}/${id}`
    const payload = {
        docPath,
        uid,
    }
    log(payload)
    const task = {
        httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: {
                'Content-Type': 'application/json'
            },
        },
        scheduleTime: {
            seconds: expirationAtSeconds
        }
    }
    const [response] = await taskClient.createTask({ parent: queuePath, task })
    const expirationTask = response.name;
    // update the entry with the expiration task name
    await admin.firestore().doc(docPath).update({ expirationTask })
    log("Done with Create Task")
    return [`Success! You will receive message in ${difference} seconds`]
})

// If entry had a running task, then we will call this function
exports.deleteTask = functions.https.onCall(async (data, context) => {
    log("Delete Task")
    try {
        const taskClient = new CloudTasksClient();
        const { date, uid, id } = data
        let entry = await admin.firestore().doc(`/users/${uid}/${date}/${id}`).get()
        let { expirationTask } = entry.data();
        await taskClient.deleteTask({ name: expirationTask })
        return ['Successfully Deleted Data']
    } catch (e) {
        log("Something Went Wrong")
        log(e)
        return ['Something Went Wrong!']
    }
})
// // on deleting an entry, we should also delete the task as well on googlecloud client

exports.firestoreTtlCallback = functions.https.onRequest(async (req, res) => {
    try {
        const payload = req.body;
        let entry = await (await admin.firestore().doc(payload.docPath).get()).data();
        let tokens = await (await admin.firestore().doc(`/users/${payload.uid}`).get()).get('tokens')
        await admin.messaging().sendMulticast({
            tokens,
            notification: {
                title: "Polus",
                body: entry['text']
            }
        }).then((response) => {
            log('Successfully sent message:')
            log(response)
        }).catch((error) => {
            log('Error in sending Message')
            log(error)
        })
        await admin.firestore().doc(payload.docPath).update({ expirationTask: admin.firestore.FieldValue.delete() })
        res.status(200)
    } catch (err) {
        log(err)
        res.status(500).send(err)
    }
})