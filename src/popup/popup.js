import { createApp } from "vue";
import Popup from "./Popup.vue";
import { actions } from "../utils/store";

const start = async () => {
  await actions.initUserSettings()
  const popup = createApp(Popup).mount('#popup')
};

window.onload = () => {
  start();
};
