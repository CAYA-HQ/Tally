import React from 'react';
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import StatCard from '../components/Layout/Cards';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts'
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
    { name: 'Jan', target: 4000, sales: 2400, stock: 2400 },
    { name: 'Feb', target: 3000, sales: 1398, stock: 2210 },
    { name: 'Mar', target: 2000, sales: 9800, stock: 2290 },
    { name: 'Apr', target: 2780, sales: 3908, stock: 2000 },
    { name: 'May', target: 1890, sales: 4800, stock: 2181 },
    { name: 'Jun', target: 2390, sales: 3800, stock: 2500 },
  ];

  return (
    <div className="report-wrapper">
      <Sidebar />
      <main className="report-main">
        <Navbar />
        <div className="report-content">
          <h1 className="page-title">Report</h1>

          <div className="report-metrics-grid">
            {metrics.map((item, index) => (
              <StatCard 
                key={index}
                title={item.title}
                amount={item.amount}
                icon={item.icon}
                iconColor={item.color}
              >
                <div className={`trend-container ${item.isUp ? 'up' : 'down'}`}>
                  {item.isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  <span>{item.trend} Than last Month</span>
                </div>
              </StatCard>
            ))}
          </div>

          <div className="report-charts-row">
            <div className="bar-chart-card">
              <h3 className="chart-title">Sales Analytics</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#828282', fontSize: 12 }} 
                    />
                    <Tooltip cursor={{fill: '#F8F9FD'}} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    
                    {/* Replicating the design colors */}
                    <Bar dataKey="target" fill="#E0E0E0" radius={[4, 4, 0, 0]} barSize={12} name="Sales Target" />
                    <Bar dataKey="sales" fill="#EB5757" radius={[4, 4, 0, 0]} barSize={12} name="Sales" />
                    <Bar dataKey="stock" fill="#6C5CE7" radius={[4, 4, 0, 0]} barSize={12} name="Stock" />
                  </BarChart>
                </ResponsiveContainer>
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