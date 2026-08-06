// ===== Pagination Component =====
// Controls for navigating between pages of products.
// Props:
//   - currentPage: the current page number (1-based)
//   - totalPages: total number of pages
//   - onPageChange: callback function called with the new page number

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate an array of page numbers to display.
  // We show up to 5 page numbers around the current page.
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      {/* Previous page button */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {/* Page number buttons */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next page button */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

export default Pagination;