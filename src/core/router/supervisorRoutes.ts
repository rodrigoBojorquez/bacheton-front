import MapReports from "@/views/admin/monitoring/MapReports.vue";

const supervisorRoutes = [
    {
        path: "/app",
        name: "app-supervisor",

        meta: { requiresAuth: true },
        children: [
            {
                path: "map",
                name: "map-reports",
                component: MapReports
            },
        ]
    }
]

export default supervisorRoutes
