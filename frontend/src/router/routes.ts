import type { RouteRecordRaw } from "vue-router";
import { validateClientID, validatePurchaseID } from "./guards";

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
        component: () => import("pages/clients/ClientsPage.vue"),
      },
      {
        path: "/clients/new",
        component: () => import("pages/clients/ClientCreatePage.vue"),
      },
      {
        path: "/clients/:id",
        component: () => import("pages/clients/ClientViewPage.vue"),
        beforeEnter: validateClientID,
      },
      {
        path: "/clients/:id/edit",
        component: () => import("pages/clients/ClientEditPage.vue"),
        beforeEnter: validateClientID,
      },
      {
        path: "/clients/:id/purchases",
        component: () => import("pages/clients/ClientPurchasesPage.vue"),
        beforeEnter: validateClientID,
      },
      {
        path: "/purchases/:id",
        component: () => import("pages/purchases/PurchaseViewPage.vue"),
        beforeEnter: validatePurchaseID,
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
