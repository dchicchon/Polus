import Vue from "vue";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDocs, getDoc, collection, query, where } from 'firebase/firestore'
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


  create: async (date, entry, key) => {
    if (state.signedIn) {
      // Create in firestore
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
  read: async (date) => {
    const getChromeStorage = new Promise((resolve, reject) => {
      chrome.storage.sync.get([date], function (result) {
        if (Object.keys(result).length > 0) {
          resolve(result[date])
        } else {
          resolve({})
        }
      })
    })


    let entryObject = {}
    if (state.signedIn) {
      console.log("From Firebase")
      // Get entries from firebase
      const db = getFirestore();
      const q = query(collection(db, 'entries'), where('uid', '==', uid))
      const querySnapshot = await getDocs(q).catch(error => console.error(error));
      // querySnapshot.forEach((doc) => {
      //   console.log(doc.id, '=>', doc.data())
      // })
      // I think I should pass in the id as well to the entries class
      // This is where we replace everything with a dash

    } else {
      entryObject = await getChromeStorage
    }
    return entryObject
  },

  // Chrome no need to worry about collections
  // Firebase everybody around so we need to worry about that
  update: async (date, entry, key) => {
    if (state.signedIn) {
      // firebase things
    } else {
      chrome.storage.sync.get([date], result => {
        result[date][key] = entry
        chrome.storage.sync.set({ [date]: result[date] })
      })
      // I want to update an item in my storage
    }
  },
  delete: async (date, key) => {
    if (state.signedIn) {
      // 
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

};
