import React from 'react';
import { FiPlus, FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';
import { LuChevronDown } from "react-icons/lu";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/inventory.css";

const InventoryPage = () => {
const inventoryColumns = [
    { key: 'sn', header: 'S/N', width: '50px' },
    { key: 'idNo', header: 'ID No.' },
    { key: 'productName', header: 'Product name' },
    { key: 'category', header: 'Category' },
    { key: 'stocks', header: 'Stocks' },
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

  const inventoryData = [
    { sn: 1, idNo: 'IVS-1002', productName: 'Hi-Drone', category: 'Electronics', stocks: 50, status: 'Low Stock' },
    { sn: 2, idNo: 'BEN-6701', productName: 'Body-fit Compact', category: 'Wellness', stocks: 95, status: 'In Stock' },
    { sn: 3, idNo: 'TIN-2090', productName: 'Peak Milk', category: 'Beverages', stocks: 20, status: 'Out of Stock' },
    { sn: 3, idNo: 'PAN-0076', productName: 'Paracetamol', category: 'Medication', stocks: 15, status: 'Out of Stock' },
    { sn: 3, idNo: 'TIN-2090', productName: 'Nivea', category: 'Deodorant', stocks: 400, status: 'In Stock' },
  ];




  return (
    <div className="inventory-wrapper">
      <Sidebar />
      
      <main className="inventory-main">
        <Navbar />
        
        <div className="inventory-content">
          {/* Header Section */}
          <div className="inventory-header">
            <h1 className='page-title'>Inventory</h1>
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
                <span className="legend-item"><span className="dot green"></span> In stock: <strong className="stock-value">1452</strong></span>
                <span className="legend-item"><span className="dot yellow"></span> low stock: <strong className="stock-value">355</strong></span>
                <span className="legend-item"><span className="dot red"></span> out of stock: <strong className="stock-value">186</strong></span>
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
          <Table columns={inventoryColumns} data={inventoryData}/>
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;