import Vue from "vue";
import Popup from "./popup/Popup.vue";
import { initializeApp } from "firebase/app";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import { MdField, MdButton, MdBottomBar } from "vue-material/dist/components";
// Vue.prototype.$firebase = firebase
Vue.use(MdField);
Vue.use(MdButton);
Vue.use(MdBottomBar);

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
  const firebaseApp = initializeApp(config)

  const popup = new Vue({
    el: "#popup",
    render: (createElement) => createElement(Popup),
  });
};
