import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';
import { IoChatbubbleOutline } from 'react-icons/io5';
import "../../styles/layout/navbar.css";
import Ellipse2 from "../../assets/Ellipse2.png";

const Navbar = () => {
  return (
    <nav className="top-navbar">
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search" 
          className="search-input" 
        />
      </div>

      <div className="nav-actions">
        <div className="icon-group">
          <button className="icon-btn">
            <FiBell />
            <span className="notification-dot"></span>
          </button>
          <button className="icon-btn">
            <IoChatbubbleOutline />
          </button>
        </div>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Mike John</span>
            <span className="user-email">Mike_john@outlook.com</span>
          </div>
          <div className="avatar-wrapper">
            <img 
              src={Ellipse2} 
              alt="User Avatar" 
              className="user-avatar" 
            />
            <span className="status-indicator"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;