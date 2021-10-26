import Vue from "vue";
import App from "./app/App.vue";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions'

const config = {
  apiKey: "AIzaSyC-jyQX_JbQnJAjADK3ApS1gyemkr-AqW8",
  authDomain: "polus-cc376.firebaseapp.com",
  databaseURL: "https://polus-cc376.firebaseio.com",
  projectId: "polus-cc376",
  storageBucket: "polus-cc376.appspot.com",
  messagingSenderId: "926662511983",
  appId: "1:926662511983:web:dbb9499dfe95d22c116c9a",
  measurementId: "G-VRXQZDBLBF",
};

// Script initialized
const initPolus = () => {
  const firebaseApp = initializeApp(config);
  Vue.prototype.$auth = getAuth(firebaseApp);
  Vue.prototype.$firestore = getFirestore(firebaseApp);
  Vue.prototype.$functions = getFunctions(firebaseApp)
};

const start = () => {
  // Do a check here to see if a user is signed in perhaps
  chrome.storage.sync.get("userSettings", (result) => {
    // If not updated to the current version of the app
    let { userSettings } = result;
    // if new tab is enabled
    if (userSettings.newTab || userSettings.indexOpen) {
      userSettings.indexOpen = false; // need to do this if I want functionality for new open tab
      chrome.storage.sync.set({ userSettings });

      // Here maybe I could
      new Vue({
        el: "#app",
        render: (createElement) => createElement(App),
        // Maybe find out later on how to pass in authstatechanged
      });
    } else {
      chrome.tabs.update({
        url: "chrome-search://sync-ntp/sync-ntp.html",
      });
    }
  });
};

// Window Loaded
window.onload = () => {
  // Vue.prototype.$firebaseApp = firebaseApp
  start();
};

// Will execute before the window loads. In the future if there is any
// code i need to load beforehand, i can run it here
initPolus();
