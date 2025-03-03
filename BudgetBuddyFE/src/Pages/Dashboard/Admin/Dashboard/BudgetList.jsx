import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search } from "lucide-react";


const budgetData = [
  {
    BudgetName: "Staff Welfare",
    Date: "20/04/2024",
    Amount: 400000.0,
    Expenses: "Food (88,000), Coffee (...), Water (88,000), Drinks (...)",
    RecurringExpenses:
      "Food (88,000), Coffee (...), Water (88,000), Drinks (...)",
    Status: "Approved",
  },
 
];


const BudgetList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Budgets");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = budgetData.filter((item) => {
    const matchesTab = activeTab === "All Budgets" || item.Status.toLowerCase() === activeTab.toLowerCase();
    
    if (!searchTerm) return matchesTab;
    
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = 
      item.BudgetName.toLowerCase().includes(searchValue) ||
      item.Expenses.toLowerCase().includes(searchValue) ||
      item.RecurringExpenses.toLowerCase().includes(searchValue) ||
      item.Amount.toString().includes(searchValue);
      
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; 
    const ellipsis = <span className="ellipsis">...</span>;

    // Always show the first page
    pages.push(
      <button
        key={1}
        className={`btn btn-page ${currentPage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Show ellipsis if current page is far from the start
    if (currentPage > maxVisiblePages + 1) {
      pages.push(ellipsis);
    }

    // Calculate the range of pages to show around the current page
    const startPage = Math.max(2, currentPage - maxVisiblePages);
    const endPage = Math.min(totalPages - 1, currentPage + maxVisiblePages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-page ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Show ellipsis if current page is far from the end
    if (currentPage < totalPages - maxVisiblePages) {
      pages.push(ellipsis);
    }

    // Always show the last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`btn btn-page ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container my-5 budgetlist">
      <div className="row mb-3 align-items-center">
        <h2 className="col-auto mb-0">Budget List</h2>

        <div className="input-group search-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white border-right-0 text-muted search-icon">
              <Search size={16} />
            </span>
          </div>
          <input
            type="text"
            className="form-control border-left-0 shadow-none search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="col-auto">
        <div className="btn-group">
          <button
            className={`btn ${activeTab === "All Budgets" ? "active" : ""}`}
            onClick={() => handleTabChange("All Budgets")}
          >
            All Budgets
          </button>
          <button
            className={`btn ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => handleTabChange("Pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${activeTab === "Approved" ? "active" : ""}`}
            onClick={() => handleTabChange("Approved")}
          >
            Approved
          </button>
          <button
            className={`btn ${activeTab === "Rejected" ? "active" : ""}`}
            onClick={() => handleTabChange("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th>Budget Name</th>
                <th>Amount</th>
                <th>Expenses</th>
                <th>Recurring Expenses</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td className="budget-name">
                    {item.BudgetName} <br /> <span>{item.Date}</span>
                  </td>
                  <td className="budget-amount text-right">
                    ₦ {item.Amount.toLocaleString()}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "100px" }}>
                    {item.Expenses}
                  </td>
                  <td className="text-truncate recurring-expenses">
                    {item.RecurringExpenses}
                  </td>
                  <td>
                    <span
                      className={`status-badge text-${item.Status.toLowerCase()}`}
                    >
                      {item.Status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div className="pageleft">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            {/* Previous Button */}
            <button
              className={`btn btn-prev ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            <button
              className={`btn btn-next ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetList;