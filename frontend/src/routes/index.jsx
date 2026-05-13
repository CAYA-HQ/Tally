import { createBrowserRouter, Navigate } from "react-router-dom";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyPage from "../pages/VerifyPage";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/Inventory";
import TaskHistoryPage from "../pages/Orders";
import Recordpage from "../pages/Recordpage";
import RoutePaths from "./routePaths";

export const router = createBrowserRouter([
  {
    path: RoutePaths.ROOT,
    element: <GuestGuard />,
    children: [
      {
        path: RoutePaths.ROOT,
        element: <Navigate to={RoutePaths.LOGIN} replace />,
      },
      {
        path: RoutePaths.LOGIN,
        element: <LoginPage />,
      },
      {
        path: RoutePaths.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: RoutePaths.VERIFY,
        element: <VerifyPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
    ],
  },
  {
    path: RoutePaths.DASHBOARD,
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
<<<<<<< HEAD
      {
        path: "inventory", 
        element: <InventoryPage />,
      },
      {
        path: "orders",
        element: <TaskHistoryPage />,
      },
       {
        path: "record",
        element: <Recordpage />,
      },
=======
>>>>>>> d569d39c4836f929c4ed475ca460ca9e7e663616
    ],
  },
]);
