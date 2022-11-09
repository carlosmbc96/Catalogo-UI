import { route } from "quasar/wrappers";
import { api } from "boot/axios";
import { Notify } from "quasar";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });
  Router.beforeEach(async (to, from, next) => {
    if (to.meta.private) {
      try {
        const response = await api.get("auth");
        if (response.data) {
          let permission = false;
          for (let i = 0; i < to.meta.permissions.length; i++) {
            permission =
              response.data.rol.permissions.find(
                (item) => item.code === to.meta.permissions[i]
              ) !== undefined
                ? true
                : false;
            if (permission) {
              break;
            }
          }
          if (permission) {
            next();
          } else {
            Notify.create({
              color: "negative",
              position: "bottom-right",
              iconColor: "negative",
              icon: "close",
              message: `Mensaje de Error`,
              caption: `No tiene los permisos necesarios para acceder a esta ruta`,
              timeout: 2000,
            });
            next({ name: "adminHome" });
          }
        }
      } catch (error) {
        console.log("asdas");
        if (error.message === "Network Error") {
          Notify.create({
            color: "negative",
            position: "bottom-right",
            iconColor: "negative",
            icon: "close",
            message: `Mensaje de Error`,
            caption: `Verifique su conexión`,
            timeout: 2000,
          });
          next({ name: "404" });
        } else if (error.response.status === 401) {
          Notify.create({
            color: "negative",
            position: "bottom-right",
            iconColor: "negative",
            icon: "security",
            message: `Mensaje de Error`,
            caption: `Usted debe estar autenticado`,
            timeout: 2000,
          });
          next({ name: "login" });
        }
      }
    } else {
      next();
    }
  });
  return Router;
});
