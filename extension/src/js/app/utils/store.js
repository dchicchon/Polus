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
  arrayRemove
} from "firebase/firestore";
// https://stackoverflow.com/questions/57710800/when-should-i-use-vuex
// https://vuejs.org/v2/guide/reactivity.html

export const state = Vue.observable({
  signedIn: false,
  uid: 0,
  date: new Date(),
  updateList: []
});

// Local storage manipulation
/** 
  Get entryDate objects from chrome.storage.local asynchronously and return them 
  to use on our Entry Lists
*/
const getChromeStorageLocal = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([date], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[date]); // this should return everything
      }
      resolve({});
    });
  });
}
const setChromeStorageLocal = async ({ date, dateObject }) => {
  // maybe use sync instead if the user is logged in?
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [date]: dateObject }, (result) => {
      resolve(result);
    });
  });
};
const removeChromeStorageLocal = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([date], (result) => {
      resolve(result);
    });
  });
};
const clearChromeStorageLocal = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.local.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeChromeStorageLocal({ key })
      }
    })
  })
}
// end local storage manipulation

// Sync Storage Manipulation

/** 
  Get entryDate objects from chrome.storage.sync asynchronously and return them 
  to use on our Entry Lists
*/
const getChromeStorageSync = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([date], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[date]); // this should return everything
      }
      resolve({});
    });
  });
};

/** 
  Set entry objects to our chrome.storage.sync asynchronously
  @param date: A date string
  @param dateObject: an object of the date that contains the entries

*/

const setChromeStorageSync = async ({ date, dateObject }) => {
  // maybe use sync instead if the user is logged in?
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [date]: dateObject }, (result) => {
      resolve(result);
    });
  });
};

const removeChromeStorageSync = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove([date], (result) => {
      resolve(result);
    });
  });
};

const clearChromeStorageSync = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.sync.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeChromeStorageSync({ key })
      }
    })
  })
}
// End Sync Storage Manipulation


// CRUD Functions

/**
 * A store item with a set of CRUD functions and some stateful properties
 */

export const actions = {
  setSignedIn: (bool) => (state.signedIn = bool),
  setUid: (uid) => (state.uid = uid),
  setDate: (date) => {
    state.date = date;
  },
  setUpdateList: (arr) => {
    console.log("Setting update list")
    console.log(arr)
    state.updateList = arr
  },

  // Reload Database
  resetSyncDatabase: async () => {
    await clearChromeStorageSync()
  },

  // ==================
  // CREATE
  // ==================
  create: async ({ date, entry, key }) => {
    const dateObject = await getChromeStorageSync({ date });
    dateObject[key] = entry;
    const results = await setChromeStorageSync({ date, dateObject });
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



  /**
   * Read items from our chrome.storage.sync, chrome.storage.local, and/or Firestore.
   * @param string date pass in a string of date to our read function
   */

  read: async ({ date }) => {
    // Get all items
    let dateObject = await getChromeStorageSync({ date });
    // Check if dateObject is empty
    if (Object.keys(dateObject).length === 0) {
      // Get time items in order to check if this was about a month ago
      const todayDate = new Date();
      const entryListDate = new Date(date);
      const monthMS = 1000 * 60 * 60 * 24 * 30
      // If entryListDate is from ago, then lets check our local storage
      if (todayDate.getTime() - entryListDate.getTime() > monthMS) {
        // then lets check the local storage instead
        dateObject = await getChromeStorageLocal({ date })

        // cant really think that anyone would add something 
        // from the past
      }
    }
    // if a user is signed in and if our updateList includes this date
    if (state.signedIn && state.updateList.includes(date)) {
      const db = getFirestore();
      if (Object.keys(dateObject).length > 0) {
        // Get all items that are currently not in our storage sync and set them
        const q = query(
          // pointer to this collection
          collection(db, "users", state.uid, date),
          // get all where id doesnt match dateObject keys
          where("__name__", "not-in", Object.keys(dateObject))
        );
        // maybe for user, add a check to see if they have any documents to get from the database
        const querySnapshot = await getDocs(q);
        // if they arent equal to each other
        if (querySnapshot.size !== Object.keys(dateObject).length) {
          querySnapshot.forEach((doc) => {
            dateObject[doc.id] = doc.data(); // not only are we adding it here, but we will set it to chrome storage sync
          });
          const todayDate = new Date();
          const entryListDate = new Date(date);
          const twoWeeksMS = 1000 * 60 * 60 * 24 * 14
          if (todayDate.getTime() - entryListDate.getTime() > twoWeeksMS) {
            await setChromeStorageLocal({ date, dateObject });
          } else {
            await setChromeStorageSync({ date, dateObject });

          }

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
          const todayDate = new Date();
          const entryListDate = new Date(date);
          const twoWeeksMS = 1000 * 60 * 60 * 24 * 14
          if (todayDate.getTime() - entryListDate.getTime() > twoWeeksMS) {
            await setChromeStorageLocal({ date, dateObject });
          } else {
            await setChromeStorageSync({ date, dateObject });
          }
        }
      }
      // finally update the updateList and remove 
      console.log("Removing date from updateList")
      state.updateList.splice(state.updateList.indexOf(date), 1)

      await updateDoc(doc(db, 'users', state.uid), { update: arrayRemove(date) })
        .then(result => console.log("Updated array"))
        .catch(err => {
          console.error(err)
        })
    }
    return dateObject;
  },


  /**
   * Read items and set them to our machine if this is the first time they have the extension
   */
  readFromFirebase: async () => {
    // reading from firebase, shouldn't take too long
    // do a local read, then do a read from the 
    // read from firebase first actually

    // read everything from the updateList in state
    for (const date of state.updateList) {
      const db = getFirestore();
      const collectionRef = collection(db, 'users', state.uid, date)
      const q = query(collectionRef)
      const querySnapshot = await getDocs(q);

      // if its greater than 0, continue!
      if (querySnapshot.size > 0) {
        // check if date is older than a month
        const collectionDate = new Date(date)
        const todayDate = new Date()
        const monthMS = 1000 * 60 * 60 * 24 * 30

        // if its older than a month then add items from firestore to local
        if (todayDate.getTime() - collectionDate.getTime() > monthMS) {
          const dateObject = await getChromeStorageLocal({ date })
          // lets add our firestore items to local
          querySnapshot.forEach((doc) => {
            dateObject[doc.id] = doc.data()
          })
          await setChromeStorageLocal({ date, dateObject });

        }
        // else, add items to sync. In sync, now the user will have the info available on all computers where logged in
        else {
          const dateObject = await getChromeStorageSync({ date });
          querySnapshot.forEach((doc) => {
            dateObject[doc.id] = doc.data()
          })
          await setChromeStorageSync({ date, dateObject });
        }
      }

      // else, dont bother and move onto the next item

    }
    // get all collections from user ref


  },
  // END READ

  // ==================
  // UPDATE
  // ==================

  /**
   * Update an existing entry with new properties
   * @returns entry
   */
  update: async ({ date, entry, key }) => {
    // console.log("Update in storage");
    let dateObject = await getChromeStorageSync({ date });
    let result;
    if (key in dateObject) {
      dateObject[key] = entry;
      result = await setChromeStorageSync({ date, dateObject });
    } else {
      dateObject = await getChromeStorageLocal({ date })
      dateObject[key] = entry;
      result = await setChromeStorageLocal({ date, dateObject });
    }
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
  /**
   * Deletes an item in 
   */
  delete: async ({ date, key }) => {
    let dateObject = await getChromeStorageSync({ date });
    let results;
    if (key in dateObject) {
      delete dateObject[key];
      if (Object.keys(dateObject).length === 0) {
        results = await removeChromeStorageSync({ date });
      } else {
        results = await setChromeStorageSync({ date, dateObject });
      }
    } else {
      dateObject = await getChromeStorageLocal({ date })
      delete dateObject[key]
      if (Object.keys(dateObject).length === 0) {
        results = await removeChromeStorageLocal({ date })
      } else {
        results = await setChromeStorageLocal({ date, dateObject })
      }
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
// End Crud Functions