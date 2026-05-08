import React from 'react';

const StatCard = ({ title, amount, icon: Icon, iconColor, children }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {/* Render the passed-in Icon component with a dynamic color class */}
        <Icon className={`card-icon ${iconColor}`} />
      </div>
      <h2 className="card-amount">{amount}</h2>
      <div className="card-visual-area">
        {children}
      </div>
    </div>
  );
};

export default StatCard;