import * as VueRouter from 'vue-router';
import routes from "./config/route.ts";

export const router = VueRouter.createRouter({
history: VueRouter.createMemoryHistory(),
routes,
});
