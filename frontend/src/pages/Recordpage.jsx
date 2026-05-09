import React from "react";
import { FiPlus, FiSearch, FiFilter, FiMoreVertical, FiCheckSquare } from 'react-icons/fi';
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/recordpage.css";



const  Recordpage = () => {

    const recordColumns = [
    { key: 'sn', header: 'S/N', width: '80px' },
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
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <div className="status-container">
          <span className={`status-pill ${value.toLowerCase()}`}>
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


    return(
    <div className="record-wrapper">
        <Sidebar />
        <main className="record-main">
            <Navbar />
            <div className="record-content">
                <div className="record-header">
                    <h1 className="page-title">Task/Record</h1>
                    <div className="header-actions">
                        <button className="icon-btn-gray"><FiFilter/></button>
                        <button className="icon-btn-gray"><FiSearch/></button>
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

export default Recordpage;