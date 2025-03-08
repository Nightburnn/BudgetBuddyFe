import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search, ChevronRight } from "lucide-react";
import CreateBudget from "./CreateBudget";
import { API_URL } from '../../../../config/api';
import { useAuth } from "../../../../Auth/AuthContext"; 
import "./style/BudgetList.css";

const BudgetList = () => {
  const [budgetData, setBudgetData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Budgets");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const itemsPerPage = 10;

  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!currentUser || !currentUser.department_id) {
        console.error("No departmentId found in currentUser");
        setError("No department ID found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching budget data for department:", currentUser.department_id);
        const response = await fetch(`${API_URL}/departments/${currentUser.department_id}/dashboard/budget-list`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Budget data fetched successfully:", data);

        if (data) {
          if (!Array.isArray(data)) {
            const formattedData = [{
              BudgetName: data.name || "Unnamed Budget",
              Amount: data.amount || 0,
              Expenses: Array.isArray(data.expenses) ? data.expenses.join(", ") : "None",
              RecurringExpenses: Array.isArray(data.recurringExpenses) ? data.recurringExpenses.join(", ") : "None",
              Date: data.date || new Date().toISOString().split('T')[0],
              Status: data.approvalStatus || "Pending",
              id: data.id || 1
            }];
            setBudgetData(formattedData);
          } else {
            const formattedData = data.map(item => ({
              BudgetName: item.name || "Unnamed Budget",
              Amount: item.amount || 0,
              Expenses: Array.isArray(item.expenses) ? item.expenses.join(", ") : "None",
              RecurringExpenses: Array.isArray(item.recurringExpenses) ? item.recurringExpenses.join(", ") : "None",
              Date: item.date || new Date().toISOString().split('T')[0],
              Status: item.approvalStatus || "Pending",
              id: item.id
            }));
            setBudgetData(formattedData);
          }
        } else {
          console.log("No budget data returned from API, using empty array");
          setBudgetData([]);
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
        setError(error.message);
        setBudgetData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [currentUser]); 

  const handleBudgetClick = (budget) => {
    setSelectedBudget(budget);
    setShowDetailModal(true);
  };

  const handleViewBudget = async () => {
    if (!selectedBudget) return;

    try {
      const response = await fetch(`${API_URL}/budgets/${selectedBudget.id}/view`);

      if (!response.ok) {
        throw new Error(`Failed to fetch budget file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `budget_${selectedBudget.id}.csv`; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setShowDetailModal(false);
    } catch (error) {
      console.error("Error downloading budget file:", error);
      alert("Failed to download budget file. Please try again.");
    }
  };

  const filteredData = budgetData.filter((item) => {
    const itemStatus = item.Status ? item.Status.toLowerCase() : "";
    const tabStatus = activeTab.toLowerCase();
  
    const matchesTab =
      activeTab === "All Budgets" ||
      itemStatus === tabStatus; 
  
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

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const ellipsis = <span className="ellipsis">...</span>;

    pages.push(
      <button
        key={1}
        className={`btn btn-page ${currentPage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    if (currentPage > maxVisiblePages + 1) {
      pages.push(ellipsis);
    }

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

  const displayValue = (value) => {
    return value !== undefined && value !== null && value !== "" ? value : "N/A";
  };

  if (loading) {
    return <div className="container my-5">Loading...</div>;
  }

  if (error) {
    return <div className="container my-5">Error: {error}</div>;
  }

  return (
    <div className="container my-5 budgetlist budgetlistadvanced">
      {/* Search and Create Budget Section */}
      <div className="budget-list-row row mb-3">
        <div className="col d-flex justify-content-between align-items-center mobile-layout">
          <div className="d-flex align-items-center gap-4">
            <h2>Budget List</h2>
            <div className="input-group search-budget-input-group" style={{ width: "300px" }}>
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
          <CreateBudget />
        </div>
      </div>

      {/* Tab Buttons */}
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

      {/* Budget Table */}
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
                <th></th>
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
                    <td>
                      <button
                        className="btn btn-link p-0"
                        onClick={() => handleBudgetClick(item)}
                      >
                        <ChevronRight />
                      </button>
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

      {/* Pagination Controls */}
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div className="pageleft">
            Page {currentPage} of {totalPages || 1}
          </div>
          <div className="pagination-controls">
            <button
              className={`btn btn-prev ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            {renderPageNumbers()}
            <button
              className={`btn btn-next ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Budget Detail Modal */}
      {showDetailModal && (
        <div className="budget-modal">
          <div className="modal-backdrop show"></div>
          <div className="modal budget-list-modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center p-4">
                  <div className="modal-pic mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                      <path d="M18 11.375C18 11.5975 17.934 11.815 17.8104 12C17.6868 12.185 17.5111 12.3292 17.3055 12.4144C17.1 12.4995 16.8738 12.5218 16.6555 12.4784C16.4373 12.435 16.2368 12.3278 16.0795 12.1705C15.9222 12.0132 15.815 11.8127 15.7716 11.5945C15.7282 11.3762 15.7505 11.15 15.8356 10.9445C15.9208 10.7389 16.065 10.5632 16.25 10.4396C16.435 10.316 16.6525 10.25 16.875 10.25C17.1734 10.25 17.4595 10.3685 17.6705 10.5795C17.8815 10.7905 18 11.0766 18 11.375ZM14.25 6.5H10.5C10.3011 6.5 10.1103 6.57902 9.96967 6.71967C9.82902 6.86032 9.75 7.05109 9.75 7.25C9.75 7.44891 9.82902 7.63968 9.96967 7.78033C10.1103 7.92098 10.3011 8 10.5 8H14.25C14.4489 8 14.6397 7.92098 14.7803 7.78033C14.921 7.63968 15 7.44891 15 7.25C15 7.05109 14.921 6.86032 14.7803 6.71967C14.6397 6.57902 14.4489 6.5 14.25 6.5ZM23.25 11V14C23.25 14.5967 23.0129 15.169 22.591 15.591C22.169 16.0129 21.5967 16.25 21 16.25H20.7788L19.2591 20.5044C19.155 20.7958 18.9634 21.0479 18.7105 21.2261C18.4575 21.4044 18.1557 21.5 17.8463 21.5H16.6538C16.3443 21.5 16.0425 21.4044 15.7895 21.2261C15.5366 21.0479 15.345 20.7958 15.2409 20.5044L15.0609 20H9.68906L9.50906 20.5044C9.40502 20.7958 9.2134 21.0479 8.96047 21.2261C8.70754 21.4044 8.40568 21.5 8.09625 21.5H6.90375C6.59433 21.5 6.29246 21.4044 6.03953 21.2261C5.7866 21.0479 5.59498 20.7958 5.49094 20.5044L4.3125 17.2081C3.19142 15.9393 2.48945 14.3553 2.3025 12.6725C2.06046 12.7996 1.85777 12.9905 1.71633 13.2245C1.57489 13.4584 1.50009 13.7266 1.5 14C1.5 14.1989 1.42098 14.3897 1.28033 14.5303C1.13968 14.671 0.948912 14.75 0.75 14.75C0.551088 14.75 0.360322 14.671 0.21967 14.5303C0.0790176 14.3897 0 14.1989 0 14C0.00114598 13.3312 0.225771 12.6819 0.638188 12.1553C1.05061 11.6287 1.62716 11.2551 2.27625 11.0938C2.4438 9.02687 3.38252 7.09859 4.90601 5.6918C6.42951 4.28502 8.42634 3.50263 10.5 3.5H20.25C20.4489 3.5 20.6397 3.57902 20.7803 3.71967C20.921 3.86032 21 4.05109 21 4.25C21 4.44891 20.921 4.63968 20.7803 4.78033C20.6397 4.92098 20.4489 5 20.25 5H18.2447C19.4894 5.87328 20.4683 7.07378 21.0731 8.46875C21.1134 8.5625 21.1528 8.65625 21.1903 8.75C21.7535 8.7978 22.278 9.0558 22.6596 9.47268C23.0413 9.88957 23.252 10.4348 23.25 11ZM21.75 11C21.75 10.8011 21.671 10.6103 21.5303 10.4697C21.3897 10.329 21.1989 10.25 21 10.25H20.6569C20.4971 10.2502 20.3415 10.1993 20.2127 10.1049C20.0839 10.0105 19.9885 9.87738 19.9406 9.725C19.5109 8.35375 18.6542 7.15571 17.4956 6.3057C16.337 5.45569 14.937 4.99821 13.5 5H10.5C9.19005 4.99993 7.90838 5.38103 6.81128 6.09682C5.71419 6.81261 4.84907 7.83217 4.32143 9.03115C3.79379 10.2301 3.62643 11.5568 3.83975 12.8492C4.05308 14.1417 4.63787 15.3442 5.52281 16.31C5.59048 16.3836 5.64276 16.47 5.67656 16.5641L6.90375 20H8.09625L8.45438 18.9978C8.50637 18.8522 8.60211 18.7262 8.72848 18.6371C8.85485 18.548 9.00568 18.5001 9.16031 18.5H15.5897C15.7443 18.5001 15.8951 18.548 16.0215 18.6371C16.1479 18.7262 16.2436 18.8522 16.2956 18.9978L16.6538 20H17.8463L19.5441 15.2478C19.5961 15.1022 19.6918 14.9762 19.8182 14.8871C19.9445 14.798 20.0954 14.7501 20.25 14.75H21C21.1989 14.75 21.3897 14.671 21.5303 14.5303C21.671 14.3897 21.75 14.1989 21.75 14V11Z" fill="#723FEB"/>
                    </svg>
                  </div>
                  <h3 className="mb-2">View Budget?</h3>
                  <p className="text-muted">
                    This action will open the CSV file using an external application
                  </p>
                  <div className="d-flex justify-content-center gap-4 mt-2">
                    <button
                      className="btn btn-light"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-view" onClick={handleViewBudget}>
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetList;