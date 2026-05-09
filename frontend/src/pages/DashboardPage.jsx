import Cookies from "js-cookie";
import Sidebar from "../components/Layout/Sidebar";   
import Navbar from "../components/Layout/Navbar";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";
import Table from "../components/Layout/Tables";
import InventoryPage from "../pages/Inventory";
import "../styles/pages/dashboard.css";
import StatCard from '../components/Layout/Cards';

import {
  MdAttachMoney,       
  MdOutlineShowChart,
  MdStorefront,
} from "react-icons/md";



// ── Chart data (was undefined — caused crash) ──────────────────
const capitalBars  = [60, 80, 40, 70, 90, 50, 65, 75, 55, 85];
const capitalColors = [
  "#a78bfa", "#818cf8", "#c4b5fd", "#7c3aed", "#a78bfa",
  "#818cf8", "#c4b5fd", "#7c3aed", "#a78bfa", "#818cf8",
];

const revenueBars  = [40, 50, 70, 40, 80, 50, 60, 45, 75, 55];
const revenueColors = [
  "#f472b6", "#ec4899", "#fb7185", "#be185d", "#f472b6",
  "#ec4899", "#fb7185", "#be185d", "#f472b6", "#ec4899",
];

const salesLineData = [
  { x: 0, y: 30 }, { x: 1, y: 25 }, { x: 2, y: 35 },
  { x: 3, y: 28 }, { x: 4, y: 40 }, { x: 5, y: 32 },
  { x: 6, y: 45 },
];





const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate(RoutePaths.LOGIN);
  };


  return (
    <div className="dashboard-wrapper">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <Navbar />

        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, Mike</p>
          </div>

          <div className="stats-grid">
            {/* Capital — bar chart, blue/purple */}
            <StatCard
              title="Capital"
              amount="$2,400.50"
              icon={MdAttachMoney}   
              iconColor="blue"
              chartType="bars"
              barData={capitalBars}
              barColors={capitalColors}
            > 

            <div className="chart-placeholder blue-bars">
    {[60, 80, 40, 70, 90, 50].map((h, i) => (
      <div key={i} style={{ height: `${h}%` }} className="bar" />
    ))}
  </div>
</StatCard>

            {/* Revenue — bar chart, pink */}
            <StatCard
              title="Revenue"
              amount="$2,400.50"
              icon={MdOutlineShowChart}  
              iconColor="pink"
              chartType="bars"
              barData={revenueBars}
              barColors={revenueColors}
            >

              <div className="chart-placeholder pink-bars">
    {[40, 50, 70, 40, 80, 50].map((h, i) => (
      <div key={i} style={{ height: `${h}%` }} className="bar" />
    ))}
  </div>
</StatCard>

            {/* Sales — line chart */}
            <StatCard
              title="Sales"
              amount="7302"
              icon={MdStorefront}        
              iconColor="gray"
              chartType="line"
              lineData={salesLineData}
              lineColor="#7c3aed"
              xLabels={["M", "T", "W", "T", "F", "S", "S"]}
            >

              <svg viewBox="0 0 200 60" className="line-chart">
    <path d="M0,40 Q50,0 100,30 T200,10" fill="none" stroke="#7c4dff" strokeWidth="3" />
  </svg>
</StatCard>
          </div>
        </div>

        <div className="tally-bottom-row">
        {/* <PromoCard /> */}
        {/* <ReminderTable rows={REMINDERS} /> */}
      </div>
      </main>           
    </div>
    
  );
};

export default DashboardPage;