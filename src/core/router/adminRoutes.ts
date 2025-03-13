import UsersCRUD from "@/views/admin/users/UsersCRUD.vue";
import AdminDashboard from "@/shared/layouts/admin/AdminDashboard.vue";
import DashboardView from "@/views/admin/dashboard/DashboardView.vue";
import PermissionsCRUD from "@/views/admin/Permisions/PermissionsCRUD.vue";
import RolesCRUD from "@/views/admin/roles/RolesCRUD.vue";

const adminRoutes = [
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdminAccess: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardView
      },
      {
        path: "users",
        name: "users",
        component: UsersCRUD
      },
      {
        path: "roles",
        name: "roles",
        component: RolesCRUD
      },
      {
        path: "permissions",
        name: "permissions",
        component: PermissionsCRUD
      },

    ]
  }
]

export default adminRoutes
