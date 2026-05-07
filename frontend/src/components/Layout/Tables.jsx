import React from 'react';
import { HiSelector } from "react-icons/hi"; 
import { FiChevronDown } from "react-icons/fi";
import "../../styles/layout/table.css";

const Table = () => {
  const tasks = [
    { id: 1, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Completed" },
    { id: 2, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Completed" },
    { id: 3, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Completed" },
    { id: 4, description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", date: "12/06/2026", time: "10:30am", status: "Deleted" },
  ];

  return (
    <div className="table-container">
      <table className="task-history-table">
        <thead>
          <tr>
            <th className="col-sn">S/N <HiSelector className="sort-icon" /></th>
            <th className="col-desc">Description</th>
            <th className="col-date">Date <HiSelector className="sort-icon" /></th>
            <th className="col-status">Status <FiChevronDown className="sort-icon" /></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="col-sn">{task.id}</td>
              <td className="col-desc">{task.description}</td>
              <td className="col-date">
                <span className="date-text">{task.date}</span>
                <span className="time-text">{task.time}</span>
              </td>
              <td className={`col-status status-${task.status.toLowerCase()}`}>
                {task.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;