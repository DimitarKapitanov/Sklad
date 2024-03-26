import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import NotFound from "../../../features/errors/NotFound";
import ServerError from "../../../features/errors/ServerError";
import OrdersDashboard from "../../../features/orders/dashboard/OrdersDashboard";
import OrderDetails from "../../../features/orders/details/ProductDetails";
import OrderForm from "../../../features/orders/form/OrderForm";
import PartnerDashboard from "../../../features/partners/dashboard/PartnerDashboard";
import PartnerCreate from "../../../features/partners/partnerCreate/PartnerCreate";
import ProductDashboard from "../../../features/products/dashboard/ProductDashboard";
import ProductForm from "../../../features/products/form/ProductForm";
import ProfilePage from "../../../features/profile/ProfilePage";
import StatisticsDashboard from "../../../features/references/dashboard/StatisticsDashboard";
import UsersDashboard from "../../../features/users/dashboard/UsersDashboard";
import CreateWarehouse from "../../../features/warehouses/CreateWarehouse";
import Warehouses from "../../../features/warehouses/WareHouses";
import App from "../../layout/App";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />, children: [
          { path: "warehouses", element: <Warehouses /> },
          { path: "orders", element: <OrdersDashboard /> },
          { path: "orders/:id", element: <OrderDetails /> },
          { path: "orders/:id/:back?", element: <OrderDetails /> },
          { path: "orders/client/:id", element: <OrdersDashboard /> },
          { path: "orders/warehouse/:id", element: <OrdersDashboard /> },
          { path: "not-found", element: <NotFound /> },
          { path: "server-error", element: <ServerError /> },
          { path: "*", element: <Navigate replace to="/not-found" /> },
          { path: "profile/:username", element: <ProfilePage /> },
        ]
      },
      {
        element: <RequireAuth roles={["Admin", "Manager"]} />, children: [
          { path: "warehouses/create", element: <CreateWarehouse /> },
          { path: "products", element: <ProductDashboard key={"all"} /> },
          { path: "create-product", element: <ProductForm key={"create"} /> },
          { path: "/orders-create", element: <OrderForm /> },
          { path: "partners", element: <PartnerDashboard /> },
          { path: "partners/create", element: <PartnerCreate /> },
          // user-routes
          { path: "statistics", element: <StatisticsDashboard /> },
          { path: "users", element: <UsersDashboard /> },
        ]
      }
    ],
  },
];

export const router = createBrowserRouter(routes);
