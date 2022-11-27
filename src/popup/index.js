import { createApp } from "vue";
import Popup from "./Popup.vue";
import { actions } from "../utils";

const startPopup = async () => {
  console.info('Start Popup')
  await actions.initUserSettings()
  createApp(Popup).mount('#app')
};

window.onload = () => {
  startPopup();
};
