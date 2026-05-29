import React, { useState, useMemo, useEffect } from "react";
import { HiSelector } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../styles/layout/table.css";

const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Table = ({ columns, data, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;

  const visibleData = useMemo(() => {
    if (!pageSize) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const rangeStart = pageSize ? (currentPage - 1) * pageSize + 1 : 1;
  const rangeEnd = pageSize ? Math.min(currentPage * pageSize, data.length) : data.length;

  if (!columns || !data) {
    return <div className="table-container">No data available</div>;
  }

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="task-history-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`col-${col.key}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                  {col.sortable && <HiSelector className="sort-icon" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item, rowIndex) => (
              <tr key={item.idNo || rowIndex}>
                {columns.map((col) => (
                  <td key={col.key} className={`col-${col.key}`}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageSize && data.length > pageSize && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing {rangeStart}–{rangeEnd} of {data.length} results
          </span>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft />
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
              ) : (
                <button
                  key={page}
                  className={`pagination-page${currentPage === page ? " is-active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
