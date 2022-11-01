import { createApp } from "vue";
import Popup from "./Popup.vue";
// import "vue-material/dist/vue-material.min.css";
// import "vue-material/dist/theme/default.css";
// import { MdField, MdButton, MdBottomBar } from "vue-material/dist/components";
import { actions } from "../utils/store";

// Vue.use(MdField);
// Vue.use(MdButton);
// Vue.use(MdBottomBar);
const start = async () => {
  await actions.initUserSettings()
  const popup = createApp(Popup).mount('#popup')
};

window.onload = () => {
  start();
};
