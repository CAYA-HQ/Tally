import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate(RoutePaths.LOGIN);
  };

  return (
    <div>
      <p>Dashboard Coming Soon</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
