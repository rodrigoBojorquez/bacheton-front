// src/core/router/userRoutes.ts
import ReportView from "@/views/user/ReportView.vue";
import UserDashboard from "@/shared/layouts/user/UserDashboard.vue";

const userRoutes = [
  {
    path: "/app",
    name: "app",

    component: UserDashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "report",
        name: "report",
        component: ReportView,
        meta: { title: "Reportes" }
      }
    ]
  }
];

export default userRoutes;

