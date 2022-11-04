import { createApp } from "vue";
import Popup from "./Popup.vue";
import { actions } from "../utils";

const start = async () => {
  await actions.initUserSettings()
  const popup = createApp(Popup).mount('#app')
};

window.onload = () => {
  start();
};
