import UserDashboard from "@/shared/layouts/user/UserDashboard.vue"
import ReportView from "@/views/user/ReportView.vue"
import MapReports from "@/views/admin/monitoring/MapReports.vue"

const appRoutes = [
    {
        path: "/app",
        name: "app",
        component: UserDashboard,
        meta: { requiresAuth: true },
        redirect: "/app/report",
        children: [
            {
                path: "report",
                name: "report",
                component: ReportView,
                meta: { title: "Reportes", requiresPermission: "read:Reportes" }
            },
            {

                path: "map",
                name: "app-monitoring",
                component: MapReports,
                meta: { title: "Mapa", requiresPermission: "monitoring:Reportes" } 
            }
        ],
    }
]

export default appRoutes