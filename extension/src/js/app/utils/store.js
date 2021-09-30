import Vue from "vue";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
// https://stackoverflow.com/questions/57710800/when-should-i-use-vuex
// https://vuejs.org/v2/guide/reactivity.html

// Maybe I should have my interactions here for Firebase vs Chrome Storage?

export const state = Vue.observable({
  signedIn: false,
  uid: 0,
  date: new Date(),
});

// Maybe I should also set a transaction that will occur every couple of minutes so that I can manage
// CRUD operations more

const getChromeStorage = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([date], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[date]); // this should return everything
      }
      resolve({});
    });
  });
};

const setChromeStorage = async ({ date, dateObject }) => {
  // maybe use local instead if the user is logged in?
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [date]: dateObject }, (result) => {
      resolve(result);
    });
  });
};

const removeChromeStorage = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove([date], (result) => {
      resolve(result);
    });
  });
};

const clearChromeStorage = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.sync.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeChromeStorage({ key })
      }
    })
  })
}

export const actions = {
  setSignedIn: (bool) => (state.signedIn = bool),
  setUid: (uid) => (state.uid = uid),
  setDate: (date) => {
    state.date = date;
  },

  // Reload Database
  resetSyncDatabase: async () => {
    await clearChromeStorage()
  },

  // ==================
  // CREATE
  // ==================
  create: async ({ date, entry, key }) => {
    const dateObject = await getChromeStorage({ date });
    dateObject[key] = entry;
    const results = await setChromeStorage({ date, dateObject });
    if (state.signedIn) {
      const db = getFirestore();
      await setDoc(doc(db, "users", state.uid, date, key), entry);
      // await setDoc(doc(db, 'users', state.uid,))
    }
  },
  // END CREATE

  // ==================
  // READ DATA
  // ==================
  // https://firebase.google.com/docs/firestore/query-data/get-data
  read: async ({ date }) => {
    const dateObject = await getChromeStorage({ date });
    // if a user is signed in, check if their storage sync needs to get updated
    if (state.signedIn) {
      const db = getFirestore();
      // Check here if there are items I need to update
      const userDocument = await getDoc(doc(db, "users", state.uid));
      const { update } = userDocument.data(); // update should only be changed if we added items from our mobile device
      // If there is an update, we must grab new data. Otherwise no.
      if (update) {
        if (Object.keys(dateObject).length > 0) {
          // Get all items that are currently not in our storage sync and set them
          const q = query(
            collection(db, "users", state.uid, date),
            where("__name__", "not-in", Object.keys(dateObject))
          );
          // maybe for user, add a check to see if they have any documents to get from the database
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size !== 0) {
            querySnapshot.forEach((doc) => {
              dateObject[doc.id] = doc.data(); // not only are we adding it here, but we will set it to chrome storage sync
            });
            const results = await setChromeStorage({ date, dateObject });
            // Set them all to this object
          }
          // Add all items from firestore to your chrome sync
        } else {
          const querySnapshot = await getDocs(
            collection(db, "users", state.uid, date)
          );
          if (querySnapshot.size !== 0) {
            querySnapshot.forEach((doc) => {
              dateObject[doc.id] = doc.data();
            });
            // Should be setting them here too
            console.log("Date Object to set after read");
            console.log(dateObject);
            const results = await setChromeStorage({ date, dateObject });
          }
        }
      }
    }

    return dateObject;
  },
  // END READ

  // ==================
  // UPDATE
  // ==================
  update: async ({ date, entry, key }) => {
    // console.log("Update in storage");
    const dateObject = await getChromeStorage({ date });
    dateObject[key] = entry;
    const result = await setChromeStorage({ date, dateObject });
    if (state.signedIn) {
      // maybe create a batch object in firestore and also create an alarm if there is no alarm at the moment
      // Maybe this can send to my firebase functions instead?
      const db = getFirestore();
      await updateDoc(doc(db, "users", state.uid, date, key), entry);
    }
    // I want to update an item in my storage
    return result;
  },

  // END UPDATE

  // ==================
  // DELETE
  // ==================
  delete: async ({ date, key }) => {
    const dateObject = await getChromeStorage({ date });
    let results;
    delete dateObject[key];
    if (Object.keys(dateObject).length === 0) {
      results = await removeChromeStorage({ date });
    } else {
      results = await setChromeStorage({ date, dateObject });
    }
    // If the user is signed in, be sure to delete the document. In cloud functions, delete the collection if possible
    if (state.signedIn) {
      // Check if there is a batching alarm
      const db = getFirestore();
      await deleteDoc(doc(db, "users", state.uid, date, key));
    }
    return results;
  },
  // END DELETE
};
