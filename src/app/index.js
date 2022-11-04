import { createApp } from "vue";
import App from "./App.vue";
import { state, actions } from '../utils'

const start = async () => {
  console.log('Start')
  await actions.initBackground()
  await actions.initUserSettings()
  if (state.userSettings.newTab || state.userSettings.indexOpen) {
    // need to do this if I want functionality for new open tab
    state.userSettings.indexOpen = false;
    await actions.setUserSettings()
    createApp(App).mount('#app');

  } else {
    actions.showDefaultTab()
  }
};

window.onload = () => {
  start();
};
