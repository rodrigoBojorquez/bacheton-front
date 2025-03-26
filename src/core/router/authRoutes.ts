import type {RouteRecordRaw} from "vue-router";
import LoginView from "../../views/public/LoginView.vue";
import RegisterView from "../../views/public/RegisterView.vue";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView
  },
]

export default authRoutes
