import React from "react";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";

export default function Inventory() {
  return (
    <div className="inventory-page">
        <Sidebar />
        <main className="main-content">
            <Navbar />  
            <div className="content-padding"></div>
                <h1>Inventory Page</h1>
                <Table />
        </main>
    </div>
  )}