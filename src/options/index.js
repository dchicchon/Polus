import { createApp } from "vue";
import { actions } from "../utils";
import Options from './Options.vue';

const start = async () => {
    await actions.initUserSettings()
    const popup = createApp(Options).mount('#app')
};

window.onload = () => {
    start();
};
