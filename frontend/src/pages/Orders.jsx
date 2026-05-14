import React from 'react';
import { FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';
import { LuChevronDown } from "react-icons/lu";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/orders.css";

const TaskHistoryPage = () => {

  const taskColumns = [
    { key: 'sn', header: 'S/N', sortable: true, width: '80px' },
    { key: 'description', header: 'Description', width: '450px' },
    { 
      key: 'date', 
      header: 'Date', 
      sortable: true,
      render: (value, row) => (
        <div className="date-column">
          <span className="date-text">{value}</span>
          <span className="time-text">{row.time}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: false,
      render: (value) => (
        <span className={`status-text ${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },
  ];

  // Data mapped from the image
  const taskData = [
    { sn: 1, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Completed" },
    { sn: 2, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Completed" },
    { sn: 3, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Completed" },
    { sn: 4, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Deleted" },
  ];

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="content-container">
          <h1 className="page-title">Task history</h1>

          {/* Filter and Tab Section */}
          <div className="filter-bar">
            <div className="tabs">
              <span className="tab active">All Orders</span>
              <span className="tab">Summary</span>
              <span className="tab">Completed</span>
              <span className="tab">Canceled</span>
            </div>

            <div className="actions">
              <button className="action-btn"><FiCalendar /> Jan-Sept 2026 <LuChevronDown /></button>
              <button className="action-btn">Status <LuChevronDown /></button>
              <button className="action-btn"><FiFilter /> Filter</button>
            </div>
          </div>

          <Table columns={taskColumns} data={taskData} />
        </div>
      </main>
    </div>
  );
};

export default TaskHistoryPage;