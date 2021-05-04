import Vue from "vue";
// Components
import App from './App.vue'

window.onload = function () {
  const app = new Vue({
    el: "#app",
    render: (createElement) => createElement(App)
  });
};
