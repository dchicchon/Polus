import Vue from 'vue'
import Popup from './popup/Popup.vue'

window.onload = () => {
    const popup = new Vue({
        el: "#popup",
        render: createElement => createElement(Popup)
    })
}