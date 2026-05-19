import React from 'react';
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import StatCard from '../components/Layout/Cards';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { RiFileList3Line, RiWalletLine, RiBankLine } from 'react-icons/ri';
import { LuChevronDown } from "react-icons/lu";
import "../styles/pages/reportpage.css";

const ReportPage = () => {
  const metrics = [
    { title: "Total Capital", amount: "$130,450", trend: "10%", isUp: true, icon: RiFileList3Line, color: "purple" },
    { title: "Total Revenue", amount: "$52,820", trend: "45%", isUp: true, icon: RiWalletLine, color: "orange" },
    { title: "Total Income", amount: "$85,640", trend: "3%", isUp: false, icon: RiBankLine, color: "green" },
  ];

  const chartData = [
    { month: 'Jan', target: 80, sales: 45, stock: 35 },
    { month: 'Feb', target: 90, sales: 35, stock: 75 },
    { month: 'Mar', target: 75, sales: 55, stock: 65 },
    { month: 'Apr', target: 85, sales: 65, stock: 55 },
    { month: 'May', target: 95, sales: 85, stock: 65 },
    { month: 'Jun', target: 70, sales: 65, stock: 75 },
  ];

  return (
    <div className="report-wrapper">
      <Sidebar />
      <main className="report-main">
        <Navbar />
        <div className="report-content">
          <h1 className="page-title">Report</h1>

          {metrics.map((item, index) => (
  <StatCard 
    key={index}
    title={item.title}
    amount={item.amount}
    icon={item.icon}
    iconColor={item.color}
  >
    {/* This is passed as children to your StatCard component */}
    <div className={`trend-container ${item.isUp ? 'up' : 'down'}`}>
      {item.isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
      <span>{item.trend} Than last Month</span>
    </div>
  </StatCard>
))}

          <div className="report-charts-row">
            <div className="bar-chart-card">
              <div className="chart-bars">
                {chartData.map((d, i) => (
                  <div key={i} className="chart-col">
                    <div className="bar-stack">
                      <div className="bar target" style={{ height: `${d.target}%` }}></div>
                      <div className="bar sales" style={{ height: `${d.sales}%` }}></div>
                      <div className="bar stock" style={{ height: `${d.stock}%` }}></div>
                    </div>
                    <span className="month-label">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item"><span className="indicator target"></span> Sales Target</div>
                <div className="legend-item"><span className="indicator sales"></span> Sales</div>
                <div className="legend-item"><span className="indicator stock"></span> Stock</div>
              </div>
            </div>

            <div className="stock-history-card">
              <div className="card-header-flex">
                <h3>Stock History</h3>
                <button className="filter-btn">7days <LuChevronDown /></button>
              </div>
              <div className="stat-summary-box">
                <p>Total Sales Items</p>
                <h2>450</h2>
                <div className="trend-indicator up">
                  <FiArrowUpRight /> <span>20% Than last Month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;