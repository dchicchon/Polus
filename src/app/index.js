import { createApp } from "vue";
import App from "./App.vue";
import { state, actions } from '../utils'

const startApp = async () => {
  console.info('Start App')
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
  startApp();
};
