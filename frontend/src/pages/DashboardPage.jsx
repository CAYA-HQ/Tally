import Cookies from "js-cookie";
import Sidebar from "../components/Layout/Sidebar";
// import Table from "../components/Layout/Tables";    
import Navbar from "../components/Layout/Navbar";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";
import Card from "../components/Layout/Cards";
import Table from "../components/Layout/Tables";
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
        
        <div className="content-padding">
          <div className="stats-grid">
            {/* You'll likely want to map your cards here */}
            <Card title="Total Capital" amount="130,450" percentage="10" isUp={true} />
            <Card title="Total Revenue" amount="52,820" percentage="45" isUp={true} />
            <Card title="Total Income" amount="85,640" percentage="3" isUp={false} />
          </div>

          <section className="table-section">
            <h2 className="section-title">Task history</h2>
            <Table />
          </section>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;