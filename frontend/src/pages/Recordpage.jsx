import React from 'react';
// Import everything from 'fi' (Feather Icons)
import { FiPlus, FiSearch, FiFilter, FiMoreVertical, FiCheckSquare, FiChevronDown } from 'react-icons/fi';
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/record.css";

const RecordPage = () => {
  const recordColumns = [
    { key: 'sn', header: 'S/N', width: '50px' },
    { key: 'taskName', header: 'Task Name' },
    { 
      key: 'date', 
      header: 'Date',
      render: (value, row) => (
        <div className="record-date-cell">
          <span className="date-text">{value}</span>
          <span className="time-text">{row.time}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      header: (
      <div className="header-with-icon">
        Status <FiChevronDown className="header-dropdown-icon" />
      </div>
    ), 
      render: (value) => (
        <div className="status-container">
          <span className={`status-pill ${value.toLowerCase()}`}>
            {/* Use FiCheckSquare here */}
            <FiCheckSquare className="status-icon" /> {value}
          </span>
          <FiMoreVertical className="more-options-icon" />
        </div>
      )
    },
  ];

  const recordData = [
    { sn: 1, taskName: 'Hi-Drone', date: '24/06/2026', time: '10:30', status: 'Upcoming' },
  ];

  return (
    <div className="record-wrapper">
      <Sidebar />
      <main className="record-main">
        <Navbar />
        <div className="record-content">
          <div className="record-header">
            <h1 className="page-title">Task/Record</h1>
            <div className="header-actions">
              <button className="icon-btn-gray"><FiFilter /></button>
              <button className="icon-btn-gray"><FiSearch /></button>
              <button className="add-task-btn">
                <FiPlus /> Add New Task
              </button>
            </div>
          </div>
          <Table columns={recordColumns} data={recordData} />
        </div>
      </main>
    </div>
  );
};

export default RecordPage;