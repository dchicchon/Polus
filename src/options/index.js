import { createApp } from "vue";
import { actions } from "../utils";
import Options from './Options.vue';

const startOptions = async () => {
    console.info('Start Options')
    await actions.initUserSettings()
    createApp(Options).mount('#app')
};

window.onload = () => {
    startOptions();
};
