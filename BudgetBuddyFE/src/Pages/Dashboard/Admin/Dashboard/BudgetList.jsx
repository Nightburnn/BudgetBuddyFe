import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search } from "lucide-react";
import { API_URL } from '../../../../config/api';

const BudgetList = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Budgets");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        console.log("Fetching budget data from API...");
        const response = await fetch(`${API_URL}/budgets`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Budget data fetched successfully:", data);

        // Check if data exists and create a proper array for the component
        if (data) {
          // If data is a single object (not in an array)
          if (!Array.isArray(data)) {
            // Create an array with this single budget item
            const formattedData = [{
              BudgetName: data.name || "Unnamed Budget",
              Amount: data.amount || 0,
              Expenses: Array.isArray(data.expenses) ? data.expenses.join(", ") : "None",
              RecurringExpenses: Array.isArray(data.recurringExpenses) ? data.recurringExpenses.join(", ") : "None",
              Date: data.date || new Date().toISOString().split('T')[0],
              Status: data.approvalStatus || "Pending",
              id: data.id || 1
            }];
            console.log("Formatted single budget data:", formattedData);
            setBudgetData(formattedData);
          } else {
            // If it's already an array, transform each item
            const formattedData = data.map(item => ({
              BudgetName: item.name || "Unnamed Budget",
              Amount: item.amount || 0,
              Expenses: Array.isArray(item.expenses) ? item.expenses.join(", ") : "None",
              RecurringExpenses: Array.isArray(item.recurringExpenses) ? item.recurringExpenses.join(", ") : "None",
              Date: item.date || new Date().toISOString().split('T')[0],
              Status: item.approvalStatus || "Pending",
              id: item.id
            }));
            console.log("Formatted budget data array:", formattedData);
            setBudgetData(formattedData);
          }
        } else {
          console.log("No budget data returned from API, using empty array");
          setBudgetData([]);
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
        setError(error.message);
        setBudgetData([]); // Use empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);


  const filteredData = budgetData.filter((item) => {
    const matchesTab = activeTab === "All Budgets" ||
      (item.Status && item.Status.toLowerCase() === activeTab.toLowerCase());

    if (!searchTerm) return matchesTab;

    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      (item.BudgetName && item.BudgetName.toLowerCase().includes(searchValue)) ||
      (item.Expenses && item.Expenses.toLowerCase().includes(searchValue)) ||
      (item.RecurringExpenses && item.RecurringExpenses.toLowerCase().includes(searchValue)) ||
      (item.Amount && item.Amount.toString().includes(searchValue));

    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    console.log(`Changing to page ${pageNumber}`);
    setCurrentPage(pageNumber);
  };

  const handleTabChange = (tab) => {
    console.log(`Changing tab to ${tab}`);
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const ellipsis = <span key="ellipsis" className="ellipsis">...</span>;

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

    if (currentPage < totalPages - maxVisiblePages) {
      pages.push(ellipsis);
    }

    // Always show the last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`btn btn-page ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  // Helper function to display N/A for missing data
  const displayValue = (value) => {
    return value !== undefined && value !== null && value !== "" ? value : "N/A";
  };

  if (loading) {
    return <div className="container my-5">Loading...</div>;
  }

  if (error) {
    console.error("Error rendering budget list:", error);
    return <div className="container my-5">Error loading budget data. Please try again later.</div>;
  }

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
            onChange={(e) => {
              console.log("Search term changed:", e.target.value);
              setSearchTerm(e.target.value);
            }}
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
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td className="budget-name">
                      {displayValue(item.BudgetName)} <br />
                      <span>{displayValue(item.Date)}</span>
                    </td>
                    <td className="budget-amount text-right">
                      {item.Amount ? `₦ ${item.Amount.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "100px" }}>
                      {displayValue(item.Expenses)}
                    </td>
                    <td className="text-truncate recurring-expenses">
                      {displayValue(item.RecurringExpenses)}
                    </td>
                    <td>
                      <span
                        className={`status-badge text-${item.Status ? item.Status.toLowerCase() : ""}`}
                      >
                        {displayValue(item.Status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
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
            Page {currentPage} of {totalPages || 1}
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
              className={`btn btn-next ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""
                }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
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