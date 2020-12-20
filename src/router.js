import Vue from 'vue'
import Router from 'vue-router'

//Views
//import HelloWorld from './views/HelloWorld.vue'
import Home from './views/Home.vue'
import Line from './components/Line.vue'

Vue.use(Router);

const router = new Router ({
    mode:'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/line',
            name: 'line',
            component: Line
        }
    ]
});

export default router;