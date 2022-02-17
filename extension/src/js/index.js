import Vue from "vue";
import App from "./app/App.vue";


// Script initialized
const initPolus = () => {
  // const firebaseApp = initializeApp(config);
  // Vue.prototype.$auth = getAuth(firebaseApp);
  // Vue.prototype.$firestore = getFirestore(firebaseApp);
  // Vue.prototype.$functions = getFunctions(firebaseApp)
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
