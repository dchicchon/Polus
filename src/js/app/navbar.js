import Vue from 'vue'
import Navbar from './components/Navbar.vue'

const app = new Vue({
    el: '#vuenav',
    render: createElement => createElement(Navbar)
})
