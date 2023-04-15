const routes = [
  {
    path: "/auth",
    name: "AuthLayout",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "/auth/login",
        name: "Login",
        component: () => import("pages/Auth/LoginPage/LoginPage.vue"),
      },

      {
        path: "/auth/register",
        name: "Register",
        component: () => import("pages/Auth/RegisterPage/RegisterPage.vue"),
      },
      {
        path: "/auth/verify-email/:uid",
        name: "VerifyEmail",
        component: () =>
          import("pages/Auth/VerifyEmailPage/VerifyEmailPage.vue"),
      },

      {
        path: "/auth/forgot-password",
        name: "ForgetPassword",
        component: () =>
          import("pages/Auth/ForgetPasswordPage/ForgetPasswordPage.vue"),
      },
      {
        path: "/s/:username",
        name: "Schedule",
        component: () => import("pages/Schedule/Schedule.vue"),
      },
      {
        path: "/checkout/:type/:status",
        name: "Checkout",
        component: () => import("pages/Billing/CheckoutStatus.vue"),
      },
    ],
  },
  {
    path: "/",
    name: "MainLayout",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import("pages/Dashboard/DashboardPage.vue"),
      },
      {
        path: "/billing",
        name: "Billing",
        component: () => import("src/pages/Billing/ManageBilling.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/map",
    component: () => import("pages/map.vue"),
  },
];

export default routes;
