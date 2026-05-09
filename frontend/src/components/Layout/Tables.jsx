import React from 'react';
import { HiSelector } from "react-icons/hi"; 
import "../../styles/layout/table.css";

// Destructure columns and data from props
const Table = ({ columns, data }) => {
  
 
  if (!columns || !data) {
    return <div className="table-container">No data available</div>;
  }

  return (
    <div className="table-container">
      <table className="task-history-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`col-${col.key}`} style={{ width: col.width }}>
                {col.header} 
                {col.sortable && <HiSelector className="sort-icon" />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`col-${col.key}`}>
                  {/* If a 'render' function exists in the column definition, 
                    use it to display the data (useful for status colors).
                    Otherwise, just show the raw data.
                  */}
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;