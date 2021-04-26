import Vue from 'vue'
import Navbar from './components/Navbar.vue'
import Clock from './components/Clock.vue'
console.log("Main Vue app")
window.onload = function () {
    const clock = new Vue({
        el: '#vueclock',
        render: createElement => createElement(Clock)
    })
    const navbar = new Vue({
        el: '#vuenav',
        render: createElement => createElement(Navbar)
    })

}
