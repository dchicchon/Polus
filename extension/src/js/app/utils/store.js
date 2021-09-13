import Vue from "vue";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDocs, deleteDoc, collection, query, updateDoc } from 'firebase/firestore'
// https://stackoverflow.com/questions/57710800/when-should-i-use-vuex
// https://vuejs.org/v2/guide/reactivity.html

// Maybe I should have my interactions here for Firebase vs Chrome Storage?

export const state = Vue.observable({
  signedIn: false,
  uid: 0,
  date: new Date(),
});

export const actions = {
  setSignedIn: (bool) => state.signedIn = bool,
  setUid: (uid) => state.uid = uid,
  setDate: (date) => {
    state.date = date
  },


  // ==================
  // CREATE
  // ==================
  create: async (date, entry, key) => {
    console.log("Create Data")
    if (state.signedIn) {
      // Create in firestore
      // Add doc to a collection of date
      const db = getFirestore()
      await setDoc(doc(db, 'users', state.uid, date, key), entry)
    } else {
      chrome.storage.sync.get([date], (result) => {
        if (Object.keys(result).length > 0) {
          result[date][key] = entry
          chrome.storage.sync.set({ [date]: result[date] })
        } else {
          chrome.storage.sync.set({ [date]: { [key]: entry } })
        }
      })
    }
  },
  // END CREATE

  // ==================
  // READ DATA
  // ==================
  // https://firebase.google.com/docs/firestore/query-data/get-data
  read: async (date) => {
    console.log("Read Data")
    let entryObject = {}
    if (state.signedIn) {
      // Get entries from firebase
      const db = getFirestore();
      const q = query(collection(db, 'users', state.uid, date))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        entryObject[doc.id] = doc.data()
      })

    } else {
      const getChromeStorage = new Promise((resolve, reject) => {
        chrome.storage.sync.get([date], function (result) {
          if (Object.keys(result).length > 0) {
            resolve(result[date])
          } else {
            resolve({})
          }
        })
      })

      entryObject = await getChromeStorage
    }
    console.log("Entry Object")
    console.log(entryObject)
    return entryObject
  },
  // END READ

  // ==================
  // UPDATE 
  // ==================
  update: async (date, entry, key) => {
    console.log("Update Data")
    if (state.signedIn) {
      const db = getFirestore()
      await updateDoc(doc(db, 'users', state.uid, date, key), entry);
    } else {
      chrome.storage.sync.get([date], result => {
        result[date][key] = entry
        chrome.storage.sync.set({ [date]: result[date] })
      })
      // I want to update an item in my storage
    }
  },
  // END UPDATE

  // ==================
  // DELETE
  // ==================
  delete: async (date, key) => {
    if (state.signedIn) {
      const db = getFirestore()
      await deleteDoc(doc(db, 'users', state.uid, date, key))
    } else {
      chrome.storage.sync.get([date], (result) => {
        delete result[date][key]
        if (Object.keys(result[date]).length === 0) {
          chrome.storage.sync.remove([date])
        } else {
          chrome.storage.sync.set({ [date]: result[date] })
        }
      })
    }
  },
  // END DELETE


};
