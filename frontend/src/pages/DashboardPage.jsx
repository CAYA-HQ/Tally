import Cookies from "js-cookie";
import Sidebar from "../components/Layout/Sidebar";   
import Navbar from "../components/Layout/Navbar";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";
import Card from "../components/Layout/Cards";
import Table from "../components/Layout/Tables";
import InventoryPage from "../pages/Inventory";
import "../styles/pages/dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate(RoutePaths.LOGIN);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar stays on the left */}
      <Sidebar />

      {/* Main content area */}
      <main className="main-content">
        <Navbar />
        

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </main>
    </div>
  );
};

export default DashboardPage;