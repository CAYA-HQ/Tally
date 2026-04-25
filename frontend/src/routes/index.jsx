import { createBrowserRouter, Navigate } from "react-router-dom";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
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
      }
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
    ],
  },
]);
