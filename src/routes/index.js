import async from "../components/Async";

import { 
  faHome, faSignInAlt, faCogs, faUtensils, 
  faDoorClosed, faClipboardList, faFish, faPepperHot,
  faSeedling, faBox } from "@fortawesome/free-solid-svg-icons";

// Landing
import Landing from "../landing/Landing";

// Auth
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import ResetPassword from "../auth/ResetPassword";
import Page404 from "../auth/Page404";
import Page500 from "../auth/Page500";

import addMachines from "../machines/add";
import addProduct from "../products/add";
import processProduct from "../products/process";
import addRoom from "../rooms/add";
import addCapacity from "../capacities/add";
import addIngredient from "../ingredients/add";
import addSeasoning from "../seasonings/add";
import addSpice from "../spices/add";
import addPackaging from "../packagings/add";

// Dashboards
const Dashboards = async(() => import("../dashboards"));

// Machines
const Machines = async(() => import("../machines"));

// Products
const Products = async(() => import("../products"));

// Rooms
const Rooms = async(() => import("../rooms"));

// Capacities
const Capacities = async(() => import("../capacities"));

// Ingredients
const Ingredients = async(() => import("../ingredients"));

// Seasoning
const Seasonings = async(() => import("../seasonings"));

// Spices
const Spices = async(() => import("../spices"));

// Packagings
const Packagings = async(() => import("../packagings"));


// Routes
const landingRoutes = {
  path: "/",
  name: "Landing Page",
  component: Landing,
  children: null
};

const dashboardRoutes = {
  path: "/dashboard",
  name: "Dashboard",
  icon: faHome,
  component: Dashboards,
  children: null
};

const machinesRoutes = {
  path: "/machines",
  header: "การจัดการเครื่องจักร",
  name: "เครื่องจักร (Machines)",
  icon: faCogs,
  component: Machines,
  children: null
};

const addMachineRoutes = {
  path: "/machines/add",
  name: "เครื่องจักร (Machines)",
  component: addMachines,
};

const productsRoutes = {
  path: "/products",
  header: "การจัดการผลิตภัณฑ์",
  name: "ผลิตภัณฑ์ (Products)",
  icon: faUtensils,
  component: Products,
  children: null
};

const addProductRoutes = {
  path: "/products/add",
  name: "ผลิตภัณฑ์ (Products)",
  component: addProduct,
};

const processProductRoutes = {
  path: "/products/process/:id",
  name: "ผลิตภัณฑ์ (Products)",
  component: processProduct,
};

const roomsRoutes = {
  path: "/rooms",
  header: "การจัดการข้อมูลพื้นฐาน",
  name: "ห้องปฏิบัติการ",
  icon: faDoorClosed,
  component: Rooms,
  children: null
};

const addRoomRoutes = {
  path: "/rooms/add",
  name: "ห้องปฏิบัติการ",
  component: addRoom,
};

const capacitiesRoutes = {
  path: "/capacities",
  name: "หน่วยกำลังการผลิต",
  icon: faClipboardList,
  component: Capacities,
  children: null
};

const addCapacityRoutes = {
  path: "/capacities/add",
  name: "หน่วยกำลังการผลิต",
  component: addCapacity,
};

const ingredientsRoutes = {
  path: "/ingredients",
  name: "ส่วนผสม",
  icon: faFish,
  component: Ingredients,
  children: null
};

const addIngredientRoutes = {
  path: "/ingredients/add",
  name: "ส่วนผสม",
  component: addIngredient,
};

const seasoningsRoutes = {
  path: "/seasonings",
  name: "เครื่องปรุง",
  icon: faPepperHot,
  component: Seasonings,
  children: null
};

const addSeasoningRoutes = {
  path: "/seasonings/add",
  name: "เครื่องปรุง",
  component: addSeasoning,
};

const spicesRoutes = {
  path: "/spices",
  name: "เครื่องเทศ",
  icon: faSeedling,
  component: Spices,
  children: null
};

const addSpiceRoutes = {
  path: "/spices/add",
  name: "เครื่องเทศ",
  component: addSpice,
};

const packagingsRoutes = {
  path: "/packagings",
  name: "บรรจุภัณฑ์",
  icon: faBox,
  component: Packagings,
  children: null
};

const addPackagingRoutes = {
  path: "/packagings/add",
  name: "บรรจุภัณฑ์",
  component: addPackaging,
};

const authRoutes = {
  path: "/auth",
  name: "Auth",
  icon: faSignInAlt,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    }
  ]
};

// Dashboard specific routes
export const dashboard = [
  dashboardRoutes,
  machinesRoutes,
  productsRoutes,
  roomsRoutes,
  capacitiesRoutes,
  ingredientsRoutes,
  seasoningsRoutes,
  spicesRoutes,
  packagingsRoutes,
  addMachineRoutes,
  addProductRoutes, processProductRoutes,
  addRoomRoutes,
  addCapacityRoutes,
  addIngredientRoutes,
  addSeasoningRoutes,
  addSpiceRoutes,
  addPackagingRoutes,
];

// Landing specific routes
export const landing = [landingRoutes];

// Auth specific routes
export const page = [authRoutes];

// All routes
export default [
  dashboardRoutes,
  machinesRoutes,
  productsRoutes,
  roomsRoutes,
  capacitiesRoutes,
  ingredientsRoutes,
  seasoningsRoutes,
  spicesRoutes,
  packagingsRoutes,
];
