import React from 'react';
import { FiPlus, FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';
import { LuChevronDown } from "react-icons/lu";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/inventory.css";

const OrderPage = () => {
const OrderColumns = [
    { key: 'sn', header: 'S/N', width: '92px' },
    { key: 'Discription', header: 'Description', width: '115px' },
    { key: 'Date', header: 'Date', width: '82px' },
    { key: 'status', header: 'Status', width: '99px' },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      // Custom render to apply specific colors from your design
      render: (value) => {
        const statusClass = value.toLowerCase().replace(/\s+/g, '-');
        return <span className={`status-pill ${statusClass}`}>{value}</span>;
      }
    },
  ];

  const orderData = [
    { sn: 1, Discription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,consectetur, adipisci velit...',
          Date: '12/06/2026', status: 'Completed' },
    { sn: 2, Discription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,consectetur, adipisci velit...',
          Date: '12/06/2026', status: 'Completed' },
    { sn: 3, Discription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,consectetur, adipisci velit...',
          Date: '12/06/2026', status: 'Completed' },
    { sn: 4, Discription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,consectetur, adipisci velit...',
          Date: '12/06/2026', status: 'Deleted' },
    
  ];


  return (
    <div className="order-wrapper">
      <Sidebar />
      
      <main className="order-main">
        <Navbar />
        
        <div >
          {/* Header Section */}
          <div className="inventory-header">
            <h1 className='page-title'>Task history</h1>
          </div>

             

          {/* Table Filters Section */}
          <div className="table-controls">
            <div className="table-search">
              <FiSearch className="search-icon-inner" />
              <input type="text" placeholder="Search" />
            </div>
            
            <div className="filter-group">
              <button className="filter-btn"><FiCalendar /> Jan-Sept 2026 <LuChevronDown /></button>
              <button className="filter-btn">Status <LuChevronDown /></button>
              <button className="filter-btn"><FiFilter /> Filter</button>
            </div>
          </div>

          {/* Reusable Table Component */}
          <Table columns={OrderColumns} data={orderData}/>
        </div>
      </main>
    </div>
  );
};

export default OrderPage;