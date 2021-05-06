import Vue from "vue";
import App from "./app/App.vue"; // vue
window.onload = () => {
    const app = new Vue({
        el: "#app",
        render: (createElement) => createElement(App)
    });
};
