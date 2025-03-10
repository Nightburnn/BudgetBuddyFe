import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search, ChevronRight } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { API_URL } from '../../../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../../Auth/AuthContext";


const BudgetList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Budgets");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [budgetData, setBudgetData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
        const { currentUser } = useAuth();
  

  
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!currentUser || !currentUser.organization_id) {
        console.error("No departmentId found in currentUser");
        setError("No department ID found. Please log in again.");
        setLoading(false);
        return;
      }
       
      const org_id = currentUser.organization_id;
      try {
        console.log("Fetching budget data from API...");
        const response = await fetch(`${API_URL}/admin/${org_id}/dashboard/get-total-budget-list`);

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
              Expenses: Array.isArray(data.oneTimeExpenses) ? data.oneTimeExpenses.join(", ") : "None",
              RecurringExpenses: Array.isArray(data.recurringExpenses) ? data.recurringExpenses.join(", ") : "None",
              Date: data.date || new Date().toISOString().split('T')[0],
              Status: data.approvalStatus || "Pending",
              id: data.id || 1,
              Department: data.departmentName || "Unknown department"


            }];
            console.log("Formatted single budget data:", formattedData);
            setBudgetData(formattedData);
          } else {
            const formattedData = data.map(item => ({
              BudgetName: item.name || "Unnamed Budget",
              Amount: item.amount || 0,
              Expenses: Array.isArray(item.oneTimeExpenses) ? item.oneTimeExpenses.join(", ") : "None",
              RecurringExpenses: Array.isArray(item.recurringExpenses) ? item.recurringExpenses.join(", ") : "None",
              Date: item.date || new Date().toISOString().split('T')[0],
              Status: item.approvalStatus || "Pending",
              id: item.id,
              Department: item.departmentName || "Unknown department"
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
        setBudgetData([]); 
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const filteredData = budgetData.filter((item) => {
    const matchesTab =
      activeTab === "All Budgets" ||
      (activeTab === "Pending" && item.Status === "Pending") ||
      (activeTab === "Approved" && item.Status === "Approved") ||
      (activeTab === "Rejected" && item.Status === "Rejected");

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

  const handleBudgetClick = (budget) => {
    console.log("View budget clicked:", budget);
    setSelectedBudget(budget);
    setShowDetailModal(true);
  };

  const handleApproveClick = (budget) => {
    console.log("Approve budget clicked:", budget);
    setSelectedBudget(budget);
    setShowApproveModal(true);
  };

  const handleRejectClick = (budget) => {
    console.log("Reject budget clicked:", budget);
    setSelectedBudget(budget);
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    console.log("Approving budget:", selectedBudget);
    setIsLoading(true);
  
    try {
      const response = await axios.put(
        `${API_URL}/budgets/${selectedBudget.id}/approve`);
  
      console.log("Approve response:", response.data);
  
      setBudgetData((prevData) =>
        prevData.map((budget) =>
          budget.id === selectedBudget.id
            ? { ...budget, Status: "Approved" }
            : budget
        )
      );
  
      setShowApproveModal(false);
  
      toast.success("Budget approved successfully!");
    } catch (err) {
      console.error("Error approving budget:", err);
      setError(err.message);
      toast.error("Failed to approve budget. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

 const handleReject = async () => {
  console.log("Rejecting budget:", selectedBudget);
  console.log("Rejection reason:", rejectReason);

  if (!rejectReason.trim()) {
    console.error("Rejection reason is required");
    toast.error("Please provide a reason for rejection.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(
      `${API_URL}/budgets/${selectedBudget.id}/reject`,
      { reason: rejectReason }
    );

    console.log("Reject response:", response.data);

    setBudgetData((prevData) =>
      prevData.map((budget) =>
        budget.id === selectedBudget.id
          ? { ...budget, Status: "Rejected" }
          : budget
      )
    );

    setShowRejectModal(false);
    setRejectReason("");

    toast.success("Budget rejected successfully!");
  } catch (err) {
    console.error("Error rejecting budget:", err);

    toast.error(
      err.response?.data?.message || "Failed to reject budget. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  const handleViewBudget = async () => {
    console.log("Viewing budget file:", selectedBudget);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/budgets/${selectedBudget.id}/view`);

      console.log("View response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedBudget.BudgetName || 'budget'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Budget file downloaded successfully");
      setShowDetailModal(false);
      toast.success("Budget file downloaded successfully!"); 
    } catch (err) {
      console.error("Error downloading budget file:", err);
      setError(err.message);
      toast.error("Failed to download budget file. Please try again."); 
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    console.log("Page changed to:", pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleTabChange = (tab) => {
    console.log("Tab changed to:", tab);
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const renderActionButton = (item) => {
    if (item.Status === "Pending") {
      return (
        <Dropdown className="custom-dropdown">
          <Dropdown.Toggle variant="link" className="p-0 custom-dropdown-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9.84375 9C9.84375 9.16688 9.79427 9.33001 9.70155 9.46876C9.60884 9.60752 9.47706 9.71566 9.32289 9.77952C9.16871 9.84338 8.99906 9.86009 8.83539 9.82754C8.67172 9.79498 8.52138 9.71462 8.40338 9.59662C8.28538 9.47862 8.20502 9.32828 8.17246 9.16461C8.13991 9.00094 8.15662 8.83129 8.22048 8.67711C8.28434 8.52294 8.39248 8.39116 8.53124 8.29845C8.66999 8.20573 8.83312 8.15625 9 8.15625C9.22378 8.15625 9.43839 8.24514 9.59662 8.40338C9.75486 8.56161 9.84375 8.77622 9.84375 9ZM9 5.0625C9.16688 5.0625 9.33001 5.01302 9.46876 4.9203C9.60752 4.82759 9.71566 4.69581 9.77952 4.54164C9.84338 4.38746 9.86009 4.21781 9.82754 4.05414C9.79498 3.89047 9.71462 3.74013 9.59662 3.62213C9.47862 3.50413 9.32828 3.42377 9.16461 3.39121C9.00094 3.35866 8.83129 3.37537 8.67711 3.43923C8.52294 3.50309 8.39116 3.61123 8.29845 3.74999C8.20574 3.88874 8.15625 4.05187 8.15625 4.21875C8.15625 4.44253 8.24515 4.65714 8.40338 4.81537C8.56161 4.97361 8.77622 5.0625 9 5.0625ZM9 12.9375C8.83312 12.9375 8.66999 12.987 8.53124 13.0797C8.39248 13.1724 8.28434 13.3042 8.22048 13.4584C8.15662 13.6125 8.13991 13.7822 8.17246 13.9459C8.20502 14.1095 8.28538 14.2599 8.40338 14.3779C8.52138 14.4959 8.67172 14.5762 8.83539 14.6088C8.99906 14.6413 9.16871 14.6246 9.32289 14.5608C9.47706 14.4969 9.60884 14.3888 9.70155 14.25C9.79427 14.1113 9.84375 13.9481 9.84375 13.7812C9.84375 13.5575 9.75486 13.3429 9.59662 13.1846C9.43839 13.0264 9.22378 12.9375 9 12.9375Z" fill="#1A1A1A" />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item onClick={() => handleBudgetClick(item)} className="custom-dropdown-item">View</Dropdown.Item>
            <Dropdown.Item onClick={() => handleApproveClick(item)} className="custom-dropdown-item">Approve</Dropdown.Item>
            <Dropdown.Item onClick={() => handleRejectClick(item)} className="custom-dropdown-item">Reject</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    return (
      <button className="btn btn-link p-0" onClick={() => handleBudgetClick(item)}>
        <ChevronRight />
      </button>
    );
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

  if (error && budgetData.length === 0) {
    console.log("Displaying error state:", error);
    return <div className="container my-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container my-5 budgetlist budgetlistadvanced">
      <ToastContainer /> 
      <div className="budget-list-row row mb-3">
        <div className="col d-flex justify-content-between align-items-center mobile-layout">
          <div className="d-flex align-items-center gap-4">
            <h2 className="">Budget List</h2>
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
                <th>Department</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    No results found
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td className="budget-name">
                      {item.BudgetName} <br /> <span>{item.Date}</span>
                    </td>
                    <td className="budget-amount text-right">
                      ₦ {item.Amount?.toLocaleString() || ''}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "100px" }}>
                      {item.Expenses}
                    </td>
                    <td className="text-truncate recurring-expenses">
                      {item.RecurringExpenses}
                    </td>
                    <td>{item.Department}</td>
                    <td>
                      <span className={`status-badge text-${item.Status?.toLowerCase() || ''}`}>
                        {item.Status}
                      </span>
                    </td>
                    <td>{renderActionButton(item)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Budget Modal */}
      {showDetailModal && (
        <div className="budget-modal">
          <div className="modal-backdrop show"></div>
          <div className="modal budget-list-modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center p-4">
                  <div className="modal-pic mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                      <path d="M18 11.375C18 11.5975 17.934 11.815 17.8104 12C17.6868 12.185 17.5111 12.3292 17.3055 12.4144C17.1 12.4995 16.8738 12.5218 16.6555 12.4784C16.4373 12.435 16.2368 12.3278 16.0795 12.1705C15.9222 12.0132 15.815 11.8127 15.7716 11.5945C15.7282 11.3762 15.7505 11.15 15.8356 10.9445C15.9208 10.7389 16.065 10.5632 16.25 10.4396C16.435 10.316 16.6525 10.25 16.875 10.25C17.1734 10.25 17.4595 10.3685 17.6705 10.5795C17.8815 10.7905 18 11.0766 18 11.375ZM14.25 6.5H10.5C10.3011 6.5 10.1103 6.57902 9.96967 6.71967C9.82902 6.86032 9.75 7.05109 9.75 7.25C9.75 7.44891 9.82902 7.63968 9.96967 7.78033C10.1103 7.92098 10.3011 8 10.5 8H14.25C14.4489 8 14.6397 7.92098 14.7803 7.78033C14.921 7.63968 15 7.44891 15 7.25C15 7.05109 14.921 6.86032 14.7803 6.71967C14.6397 6.57902 14.4489 6.5 14.25 6.5ZM23.25 11V14C23.25 14.5967 23.0129 15.169 22.591 15.591C22.169 16.0129 21.5967 16.25 21 16.25H20.7788L19.2591 20.5044C19.155 20.7958 18.9634 21.0479 18.7105 21.2261C18.4575 21.4044 18.1557 21.5 17.8463 21.5H16.6538C16.3443 21.5 16.0425 21.4044 15.7895 21.2261C15.5366 21.0479 15.345 20.7958 15.2409 20.5044L15.0609 20H9.68906L9.50906 20.5044C9.40502 20.7958 9.2134 21.0479 8.96047 21.2261C8.70754 21.4044 8.40568 21.5 8.09625 21.5H6.90375C6.59433 21.5 6.29246 21.4044 6.03953 21.2261C5.7866 21.0479 5.59498 20.7958 5.49094 20.5044L4.3125 17.2081C3.19142 15.9393 2.48945 14.3553 2.3025 12.6725C2.06046 12.7996 1.85777 12.9905 1.71633 13.2245C1.57489 13.4584 1.50009 13.7266 1.5 14C1.5 14.1989 1.42098 14.3897 1.28033 14.5303C1.13968 14.671 0.948912 14.75 0.75 14.75C0.551088 14.75 0.360322 14.671 0.21967 14.5303C0.0790176 14.3897 0 14.1989 0 14C0.00114598 13.3312 0.225771 12.6819 0.638188 12.1553C1.05061 11.6287 1.62716 11.2551 2.27625 11.0938C2.4438 9.02687 3.38252 7.09859 4.90601 5.6918C6.42951 4.28502 8.42634 3.50263 10.5 3.5H20.25C20.4489 3.5 20.6397 3.57902 20.7803 3.71967C20.921 3.86032 21 4.05109 21 4.25C21 4.44891 20.921 4.63968 20.7803 4.78033C20.6397 4.92098 20.4489 5 20.25 5H18.2447C19.4894 5.87328 20.4683 7.07378 21.0731 8.46875C21.1134 8.5625 21.1528 8.65625 21.1903 8.75C21.7535 8.7978 22.278 9.0558 22.6596 9.47268C23.0413 9.88957 23.252 10.4348 23.25 11ZM21.75 11C21.75 10.8011 21.671 10.6103 21.5303 10.4697C21.3897 10.329 21.1989 10.25 21 10.25H20.6569C20.4971 10.2502 20.3415 10.1993 20.2127 10.1049C20.0839 10.0105 19.9885 9.87738 19.9406 9.725C19.5109 8.35375 18.6542 7.15571 17.4956 6.3057C16.337 5.45569 14.937 4.99821 13.5 5H10.5C9.19005 4.99993 7.90838 5.38103 6.81128 5.6918C5.71419 6.81261 4.84907 7.83217 4.32143 9.03115C3.79379 10.2301 3.62643 11.5568 3.83975 12.8492C4.05308 14.1417 4.63787 15.3442 5.52281 16.31C5.59048 16.3836 5.64276 16.47 5.67656 16.5641L6.90375 20H8.09625L8.45438 18.9978C8.50637 18.8522 8.60211 18.7262 8.72848 18.6371C8.85485 18.548 9.00568 18.5001 9.16031 18.5H15.5897C15.7443 18.5001 15.8951 18.548 16.0215 18.6371C16.1479 18.7262 16.2436 18.8522 16.2956 18.9978L16.6538 20H17.8463L19.5441 15.2478C19.5961 15.1022 19.6918 14.9762 19.8182 14.8871C19.9445 14.798 20.0954 14.7501 20.25 14.75H21C21.1989 14.75 21.3897 14.671 21.5303 14.5303C21.671 14.3897 21.75 14.1989 21.75 14V11Z" fill="#723FEB" />
                    </svg>
                  </div>
                  <h3 className="mb-2">View Budget?</h3>
                  <p className="text-muted">
                    This action will download the CSV file which you can open with an external application
                  </p>
                  <div className="d-flex justify-content-center gap-4 mt-2">
                    <button
                      className="btn btn-light"
                      onClick={() => setShowDetailModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-view"
                      onClick={handleViewBudget}
                      disabled={isLoading}
                    >
                      {isLoading ? "Downloading..." : "Download"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="budget-modal">
          <div className="modal-backdrop show"></div>
          <div className="modal budget-list-modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center p-4">
                  <div className="modal-pic-approve mb-2">
                    <div className="approve-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M21.5307 7.78104L9.53068 19.781C9.46102 19.8508 9.3783 19.9061 9.28726 19.9438C9.19621 19.9816 9.09861 20.001 9.00005 20.001C8.90149 20.001 8.80389 19.9816 8.71285 19.9438C8.6218 19.9061 8.53908 19.8508 8.46943 19.781L3.21943 14.531C3.0787 14.3903 2.99963 14.1994 2.99963 14.0004C2.99963 13.8014 3.0787 13.6105 3.21943 13.4698C3.36016 13.3291 3.55103 13.25 3.75005 13.25C3.94907 13.25 4.13995 13.3291 4.28068 13.4698L9.00005 18.1901L20.4694 6.71979C20.6102 6.57906 20.801 6.5 21.0001 6.5C21.1991 6.5 21.3899 6.57906 21.5307 6.71979C21.6714 6.86052 21.7505 7.05139 21.7505 7.25042C21.7505 7.44944 21.6714 7.64031 21.5307 7.78104Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2">Approve?</h3>
                  <p className="text-muted">
                    Are you sure you want to approve this budget?
                  </p>
                  <div className="d-flex justify-content-center gap-4 mt-2">
                    <button
                      className="btn btn-light"
                      onClick={() => setShowApproveModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-send"
                      onClick={handleApprove}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="budget-modal">
          <div className="modal-backdrop show"></div>
          <div className="modal budget-list-modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center p-4">
                  <div className="modal-pic-reject mb-2">
                    <div className="reject-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M19.2807 18.7198C19.3504 18.7895 19.4056 18.8722 19.4433 18.9632C19.4811 19.0543 19.5005 19.1519 19.5005 19.2504C19.5005 19.349 19.4811 19.4465 19.4433 19.5376C19.4056 19.6286 19.3504 19.7114 19.2807 19.781C19.211 19.8507 19.1283 19.906 19.0372 19.9437C18.9462 19.9814 18.8486 20.0008 18.7501 20.0008C18.6515 20.0008 18.5539 19.9814 18.4629 19.9437C18.3718 19.906 18.2891 19.8507 18.2194 19.781L12.0001 13.5607L5.78068 19.781C5.63995 19.9218 5.44907 20.0008 5.25005 20.0008C5.05103 20.0008 4.86016 19.9218 4.71943 19.781C4.5787 19.6403 4.49963 19.4494 4.49963 19.2504C4.49963 19.0514 4.5787 18.8605 4.71943 18.7198L10.9397 12.5004L4.71943 6.28104C4.5787 6.14031 4.49963 5.94944 4.49963 5.75042C4.49963 5.55139 4.5787 5.36052 4.71943 5.21979C4.86016 5.07906 5.05103 5 5.25005 5C5.44907 5 5.63995 5.07906 5.78068 5.21979L12.0001 11.4401L18.2194 5.21979C18.3602 5.07906 18.551 5 18.7501 5C18.9491 5 19.1399 5.07906 19.2807 5.21979C19.4214 5.36052 19.5005 5.55139 19.5005 5.75042C19.5005 5.94944 19.4214 6.14031 19.2807 6.28104L13.0604 12.5004L19.2807 18.7198Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2">Reject Budget?</h3>
                  <div className="form-group mb-3">
                  <textarea
                      className="form-control"
                      placeholder="State reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows="3"
                    />
                  </div>
                  <div className="d-flex justify-content-center gap-4 mt-2">
                    <button
                      className="btn btn-light"
                      onClick={() => setShowRejectModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-send"
                      onClick={handleReject}
                      disabled={isLoading || !rejectReason.trim()}
                    >
                      {isLoading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                  {!rejectReason.trim() && (
                    <div className="text-danger mt-2 small">
                      Please provide a reason for rejection
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              className={`btn btn-next ${currentPage === totalPages ? "disabled" : ""}`}
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