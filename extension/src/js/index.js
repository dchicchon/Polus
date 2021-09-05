import Vue from "vue";
import App from "./app/App.vue";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
Vue.prototype.$firebase = firebase;

const start = () => {
  chrome.storage.sync.get("userSettings", (result) => {
    // If not updated to the current version of the app
    let { userSettings } = result

    // if new tab is enabled
    if (userSettings.newTab || userSettings.indexOpen) {
      userSettings.indexOpen = false;
      chrome.storage.sync.set({ userSettings });
      new Vue({
        el: "#app",
        render: (createElement) => createElement(App),
      });

    }
    else {
      chrome.tabs.update({
        url: "chrome-search://local-ntp/local-ntp.html",
      });
    }
  });
};

window.onload = () => {
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
  firebase.initializeApp(config);
  // check if user is logged in to firebase, if not use default chrome sync options.
  if (firebase.auth().currentUser) {
    console.log("User is logged in");
    console.log(firebase.auth().currentUser);
    start(); // instead use firebase to check stuff
  } else {
    console.log("User is not logged in");
    start();
  }
};
