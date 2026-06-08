import { createBrowserRouter, Navigate } from "react-router-dom";

import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyPage from "../pages/VerifyPage";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/Inventory";
import TaskHistoryPage from "../pages/Orders";
import Reminderpage from "../pages/ReminderPage";
import SettingsPage from "../pages/Settingspage";
import NotificationPage from "../pages/Notification";
import ReportsPage from "../pages/ReportsPage";
import NotFoundPage from "../pages/NotFoundPage";
import RoutePaths from "./routePaths";
import { UserProvider } from "../context/userContext";
import { NotificationProvider } from "../context/notificationContext";
import ReportPage from '../pages/Reportpage'



export const router = createBrowserRouter([
  {
    path: RoutePaths.ROOT,
    element: <GuestGuard />,
    children: [
      {
        index: true,
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
    ],
  },

  {
    path: RoutePaths.VERIFY,
    element: <VerifyPage />,
  },

  {
    element: <UserProvider />,
    children: [
      {
        element: <NotificationProvider />,
        children: [
          {
            path: RoutePaths.DASHBOARD,
            element: <AuthGuard />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "inventory",
                element: <InventoryPage />,
              },
              {
                path: "orders",
                element: <ReportsPage />,
              },
              {
                path: "reports",
                element: <ReportPage />,
              },
              {
                path: "reminders",
                element: <Reminderpage />,
              },
              {
                path: "settings",
                element: <SettingsPage />,
              },
            ],
          },
          {
            path: RoutePaths.NOTIFICATIONS,
            element: <NotificationPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);