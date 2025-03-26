import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/public/AboutView.vue";


const publicRoutes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/about",
    name: "about",
    component: AboutView
  },


]

export default publicRoutes
