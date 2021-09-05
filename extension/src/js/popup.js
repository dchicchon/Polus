import Vue from "vue";
import Popup from "./popup/Popup.vue";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import { MdField, MdButton, MdBottomBar } from "vue-material/dist/components";
Vue.use(MdField);
Vue.use(MdButton);
Vue.use(MdBottomBar);

window.onload = () => {
  const popup = new Vue({
    el: "#popup",
    render: (createElement) => createElement(Popup),
  });
};
