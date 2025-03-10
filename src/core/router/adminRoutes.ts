import AdminDashboard from "@/shared/layouts/admin/AdminDashboard.vue";
import DashboardView from "@/views/admin/dashboard/DashboardView.vue";


const adminRoutes = [
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdminAccess: true },
    children: [
      {
        path: "panel",
        name: "admin-dashboard",
        component: DashboardView

      },

    ]
  }
]

export default adminRoutes
