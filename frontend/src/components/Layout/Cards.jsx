import React from 'react';
/* Switching from hi2 to hi for better compatibility */
import { HiArrowUp, HiArrowDown } from 'react-icons/hi'; 
import "../../styles/layout/cards.css";

const Card = ({ title, amount, percentage, isUp, icon: Icon, iconBg }) => {
 
  if (!Icon) {
    console.error(`Icon component for "${title}" is undefined. Check your imports in the parent component.`);
    return null; 
  }

  return (
    <div className="report-card">
      <div className="card-header">
        <div className="icon-box" style={{ backgroundColor: iconBg }}>
          <Icon className="card-icon" />
        </div>
      </div>
      
      <div className="card-body">
        <p className="card-title">{title}</p>
        <h2 className="card-amount">${amount}</h2>
      </div>

      <div className="card-footer">
        <span className={`trend-tag ${isUp ? 'trend-up' : 'trend-down'}`}>
          {/* Using the standard HiArrow icons */}
          {isUp ? <HiArrowUp /> : <HiArrowDown />}
          {percentage}%
        </span>
        <span className="trend-text">Than last Month</span>
      </div>
    </div>
  );
};

export default Card;