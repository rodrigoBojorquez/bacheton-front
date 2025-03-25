import UsersCRUD from "@/views/admin/users/UsersCRUD.vue";
import AdminDashboard from "@/shared/layouts/admin/AdminDashboard.vue";
import DashboardView from "@/views/admin/dashboard/DashboardView.vue";
import PermissionsCRUD from "@/views/admin/Permisions/PermissionsCRUD.vue";
import RolesCRUD from "@/views/admin/roles/RolesCRUD.vue";
import LoggingView from "@/views/admin/loggin/LoggView.vue";
import MapReports from "@/views/admin/monitoring/MapReports.vue";
import ReportCRUD from "@/views/admin/report/ReportCRUD.vue";

const adminRoutes = [
  {
    path: "/admin",
    component: AdminDashboard,
    redirect: "/admin/dashboard",
    meta: { requiresAuth: true, requiresPermission: "superAdmin:Administracion" },
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
      {
        path: "logs",
        name: "logs",
        component: LoggingView
      },
      {
        path: "map",
        name: "map",
        component: MapReports
      },
      {
        path: "reports",
        name: "reports",
        component: ReportCRUD
      },
    ]
  }
]

export default adminRoutes
