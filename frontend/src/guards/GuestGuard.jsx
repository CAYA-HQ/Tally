import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import RoutePaths from "../routes/routePaths";

const GuestGuard = () => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) return <Navigate to={RoutePaths.DASHBOARD} />;

  return <Outlet />;
};

export default GuestGuard;
