import React from 'react';
import { FiPlus, FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';
import { LuChevronDown } from "react-icons/lu";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/inventory.css";

const InventoryPage = () => {
  return (
    <div className="inventory-wrapper">
      <Sidebar />
      
      <main className="inventory-main">
        <Navbar />
        
        <div className="inventory-content">
          {/* Header Section */}
          <div className="inventory-header">
            <h1 className="page-title">Inventory</h1>
            <button className="add-product-btn">
              <FiPlus /> Add Product
            </button>
          </div>

          {/* Summary Card */}
          <div className="summary-card">
            <div className="assets-value">
              <p className="label">Total Assets Value</p>
              <h2 className="value">$12,980,310</h2>
            </div>
            
            <div className="divider"></div>

            <div className="product-stock-stats">
              <div className="stats-header">
                <span className="product-count"><strong>2379</strong> Product</span>
              </div>
              
              {/* Custom Multi-color Progress Bar */}
              <div className="stock-progress-bar">
                <div className="segment green" style={{ width: '60%' }}></div>
                <div className="segment yellow" style={{ width: '25%' }}></div>
                <div className="segment red" style={{ width: '15%' }}></div>
              </div>

              <div className="stock-legend">
                <span className="legend-item"><span className="dot green"></span> In stock: <strong>1452</strong></span>
                <span className="legend-item"><span className="dot yellow"></span> low stock: <strong>355</strong></span>
                <span className="legend-item"><span className="dot red"></span> out of stock: <strong>186</strong></span>
              </div>
            </div>
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
          <Table />
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;