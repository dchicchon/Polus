import Vue from 'vue'
// Components
import Navbar from './components/Navbar.vue'
import Clock from './components/Clock.vue'
import Calendar from './components/Calendar.vue'

window.onload = function () {
    const navbar = new Vue({
        el: '#vuenav',
        render: createElement => createElement(Navbar)

    })
    const clock = new Vue({
        el: '#vueclock',
        render: createElement => createElement(Clock)
    })
    const calendar = new Vue({
        el: '#vuecalendar',
        render: createElement => createElement(Calendar)
    })
}
