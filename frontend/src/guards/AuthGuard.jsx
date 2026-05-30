import { useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import RoutePaths from "../routes/routePaths";
import { getUser } from "../utils/fetchBackend";
import { useUserStore } from "../utils/zustand";

const AuthGuard = () => {
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (accessToken && !user) {
      getUser();
    }
  }, [accessToken, user]);

  if (!accessToken) {
    return (
      <Navigate to={RoutePaths.LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default AuthGuard;
