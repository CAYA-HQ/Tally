import Cookies from "js-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import RoutePaths from "../routes/routePaths";

const AuthGuard = () => {
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    return (
      <Navigate to={RoutePaths.LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default AuthGuard;
