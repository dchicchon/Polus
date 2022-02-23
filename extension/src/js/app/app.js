import Vue from "vue";
import App from "./App.vue";
import { state, actions } from '../utils/store'

const start = async () => {
  await actions.initBackground()
  await actions.initUserSettings()
  if (state.userSettings.newTab || state.userSettings.indexOpen) {
    // need to do this if I want functionality for new open tab
    state.userSettings.indexOpen = false; 
    await actions.setUserSettings(state.userSettings)
    const app = new Vue({
      el: "#app",
      render: (createElement) => createElement(App),
    });
  } else {
    chrome.tabs.update({
      url: "chrome-search://sync-ntp/sync-ntp.html",
    });
  }
};

window.onload = () => {
  start();
};
