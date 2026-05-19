import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const StatCard = ({ title, amount, icon: Icon, iconColor, trend, isUp }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        <Icon className={`card-icon ${iconColor}`} />
      </div>
      <h2 className="card-amount">{amount}</h2>
      <div className="card-visual-area">
        <div className={`card-trend ${isUp ? 'up' : 'down'}`}>
          {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
          <span>{trend} Than last Month</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;