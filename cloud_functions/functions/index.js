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
    log("create task")
    let { dateString, uid, id } = data
    log(dateString)
    log(uid)
    log(id)
    // Check if task already exists in entry
    // Get Date from time in format mm-dd-yyyy
    let entryDate = new Date(Date.UTC(dateString[0], dateString[1], dateString[2], dateString[3], dateString[4],));
    const date = join(entryDate, '-');
    let prevEntry = await admin.firestore().doc(`/users/${uid}/${date}/${id}`).get()
    let prevEntryData = await prevEntry.data()
    log(prevEntryData)
    const taskClient = new CloudTasksClient();
    if (prevEntryData.hasOwnProperty('expirationTask')) {
        // Delete old expiration task
        await tasksClient.deleteTask({ name: prevEntryData.expirationTask })
    }
    log(date)
    // This works now! Now I should create a task on google tasks
    const todayDate = new Date()
    log(entryDate.getTime())
    log(todayDate.getTime())

    const expirationAtSeconds = (entryDate.getTime() - todayDate.getTime()) / 1000 // offset in seconds

    log(`Expire in:`)
    log(expirationAtSeconds)

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
    // const entry = (await admin.firestore().doc(docPath).get()).data()
    // // if entry has previous task
    // if (entry.hasOwnProperty('expirationTask')) {
    //     await taskClient.deleteTask({ name: expirationTask })
    // }
    const [response] = await taskClient.createTask({ parent: queuePath, task })
    const expirationTask = response.name;
    const update = { expirationTask }
    // update the entry with the expiration task name
    await admin.firestore().doc(docPath).update(update)
    log("Done with Create Task")
    return ['Success!']
})

// If entry had a running task, then we will call this function
// exports.deleteTask = functions.https.onCall(async (data, context) => {
//     const taskClient = new CloudTasksClient();
//     const { expirationTask } = data
//     await taskClient.deleteTask({ name: expirationTask })
// })
// // on deleting an entry, we should also delete the task as well on googlecloud client

exports.firestoreTtlCallback = functions.https.onRequest(async (req, res) => {
    try {
        const payload = req.body;
        let entry = await (await admin.firestore().doc(payload.docPath).get()).data();
        let tokens = await (await admin.firestore().doc(`/users/${uid}`).get()).get('tokens')
        log(entry);
        log(tokens)
        // send firebase messaging to all devices!
        // admin.messaging().sendToDevice('token')
        res.status(200)
    } catch (err) {
        log(error)
        res.status(500).send(err)
    }
})