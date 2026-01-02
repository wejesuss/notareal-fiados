import type { RouteRecordRaw } from "vue-router";
import { validateClientID } from "./guards";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "/clients",
        component: () => import("pages/ClientsPage.vue"),
      },
      {
        path: "/clients/new",
        component: () => import("pages/ClientCreatePage.vue"),
      },
      {
        path: "/clients/:id/edit",
        component: () => import("pages/ClientEditPage.vue"),
        beforeEnter: validateClientID,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
