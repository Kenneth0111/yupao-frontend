import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router';
import routes from "./config/route";
import Vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App);


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})
app.use(Vant);
app.use(router);
app.mount('#app');