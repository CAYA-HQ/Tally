import React, { useEffect, useState } from 'react';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import { IoChatbubbleOutline } from 'react-icons/io5';
import "../../styles/layout/navbar.css";
import Ellipse2 from "../../assets/Ellipse2.png";
import { useNotificationStore } from '../../utils/zustand';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
  const { notifications } = useNotificationStore();
  const hasNotification = notifications.length > 0;[notifications]
  return (
    <nav className="top-navbar">
      <button className="hamburger-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <FiMenu />
      </button>

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
          <NavLink to="/notifications" className="icon-btn">
            <FiBell />
            {hasNotification && <span className="notification-dot"></span>}
          </NavLink>
          <NavLink className="icon-btn">
            <IoChatbubbleOutline />
          </NavLink>
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