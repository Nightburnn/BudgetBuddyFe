import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CreateDepartment from './CreateDepartment'
import { API_URL } from '../../../../config/api';
import { toast, ToastContainer } from 'react-toastify';


const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/departments`);
        const data = await response.json();
        console.log("Fetched departments:", data); 
        const transformedData = data.map(dept => ({
          DepartmentName: dept.name || 'N/A', 
          HODName: dept.hod || 'N/A',
          TotalBudget: dept.budgets.reduce((total, budget) => total + (budget.amount || 0), 0), 
          DateCreated: dept.createdAt || 'N/A', 
          id: dept.id || dept._id 
        }));
  
        setDepartmentData(transformedData || []); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartmentData([]); 
        setIsLoading(false);
      }
    };
  
    fetchDepartments();
  }, []);
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
  
    console.log("Deleting department:", selectedDepartment);
  
    try {
      const departmentId = selectedDepartment.id || selectedDepartment._id;
  
      console.log(`Making DELETE request to: ${API_URL}/departments/${departmentId}/delete`);
  
      const response = await fetch(`${API_URL}/departments/${departmentId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
  
      console.log("Department deleted successfully");
  
      toast.success("Department deleted successfully!", {
        position: "top-right",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      setDepartmentData(prevData =>
        prevData.filter(dept => (dept.id || dept._id) !== departmentId)
      );
  
      setShowDeleteModal(false);
  
    } catch (error) {
      console.error("Error deleting department:", error);
  
      toast.error("Failed to delete department. Please try again.", {
        position: "top-right",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const filteredData = Array.isArray(departmentData)
    ? departmentData.filter((item) => {
      if (!searchTerm) return true;
      if (!item) return false; 
      const searchValue = searchTerm.toLowerCase();
      return (
        (item.DepartmentName && item.DepartmentName.toLowerCase().includes(searchValue)) ||
        (item.HODName && item.HODName.toLowerCase().includes(searchValue)) ||
        (item.TotalBudget && item.TotalBudget.toString().includes(searchValue))
      );
    })
    : [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteClick = (department) => {
    console.log("Selected department for deletion:", department);
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="container my-5 budgetlist budgetlistadvanced">
    
      <div className="budget-list-row row mb-3">
        <div className="col d-flex justify-content-between align-items-center mobile-layout">
          <div className="d-flex align-items-center gap-4">
            <h2 className="">Department List</h2>
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
          <CreateDepartment />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>HOD Name</th>
                <th>Total Budget Cost<span className="text-muted">/yr</span></th>
                <th>Date Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(departmentData) && departmentData.length > 0 ? (
                departmentData.map((department, index) => (
                  <tr key={index}>
                    <td>{department?.DepartmentName || 'N/A'}</td>
                    <td>{department?.HODName || 'N/A'}</td>
                    <td>
                      {department?.TotalBudget !== undefined
                        ? `₦ ${department.TotalBudget.toLocaleString()}`
                        : 'N/A'}
                    </td>
                    <td>{department?.DateCreated || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-link text-danger p-0"
                        onClick={() => handleDeleteClick(department)}
                      >

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 3H11V2.5C11 2.10218 10.842 1.72064 10.5607 1.43934C10.2794 1.15804 9.89782 1 9.5 1H6.5C6.10218 1 5.72064 1.15804 5.43934 1.43934C5.15804 1.72064 5 2.10218 5 2.5V3H2.5C2.36739 3 2.24021 3.05268 2.14645 3.14645C2.05268 3.24021 2 3.36739 2 3.5C2 3.63261 2.05268 3.75979 2.14645 3.85355C2.24021 3.94732 2.36739 4 2.5 4H3V13C3 13.2652 3.10536 13.5196 3.29289 13.7071C3.48043 13.8946 3.73478 14 4 14H12C12.2652 14 12.5196 13.8946 12.7071 13.7071C12.8946 13.5196 13 13.2652 13 13V4H13.5C13.6326 4 13.7598 3.94732 13.8536 3.85355C13.9473 3.75979 14 3.63261 14 3.5C14 3.36739 13.9473 3.24021 13.8536 3.14645C13.7598 3.05268 13.6326 3 13.5 3ZM6 2.5C6 2.36739 6.05268 2.24021 6.14645 2.14645C6.24021 2.05268 6.36739 2 6.5 2H9.5C9.63261 2 9.75979 2.05268 9.85355 2.14645C9.94732 2.24021 10 2.36739 10 2.5V3H6V2.5ZM12 13H4V4H12V13ZM7 6.5V10.5C7 10.6326 6.94732 10.7598 6.85355 10.8536C6.75979 10.9473 6.63261 11 6.5 11C6.36739 11 6.24021 10.9473 6.14645 10.8536C6.05268 10.7598 6 10.6326 6 10.5V6.5C6 6.36739 6.05268 6.24021 6.14645 6.14645C6.24021 6.05268 6.36739 6 6.5 6C6.63261 6 6.75979 6.05268 6.85355 6.14645C6.94732 6.24021 7 6.36739 7 6.5ZM10 6.5V10.5C10 10.6326 9.94732 10.7598 9.85355 10.8536C9.75979 10.9473 9.63261 11 9.5 11C9.36739 11 9.24021 10.9473 9.14645 10.8536C9.05268 10.7598 9 10.6326 9 10.5V6.5C9 6.36739 9.05268 6.24021 9.14645 6.14645C9.24021 6.05268 9.36739 6 9.5 6C9.63261 6 9.75979 6.05268 9.85355 6.14645C9.94732 6.24021 10 6.36739 10 6.5Z" fill="#6A6A6A" />
                        </svg>
                       
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No departments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="budget-modal">
          <div className="modal-backdrop show"></div>
          <div className="modal budget-list-modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center p-4">
                  <div className="modal-pic-reject mb-2">
                    <div className="approve-icon">

                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M20.25 5H16.5V4.25C16.5 3.65326 16.2629 3.08097 15.841 2.65901C15.419 2.23705 14.8467 2 14.25 2H9.75C9.15326 2 8.58097 2.23705 8.15901 2.65901C7.73705 3.08097 7.5 3.65326 7.5 4.25V5H3.75C3.55109 5 3.36032 5.07902 3.21967 5.21967C3.07902 5.36032 3 5.55109 3 5.75C3 5.94891 3.07902 6.13968 3.21967 6.28033C3.36032 6.42098 3.55109 6.5 3.75 6.5H4.5V20C4.5 20.3978 4.65804 20.7794 4.93934 21.0607C5.22064 21.342 5.60218 21.5 6 21.5H18C18.3978 21.5 18.7794 21.342 19.0607 21.0607C19.342 20.7794 19.5 20.3978 19.5 20V6.5H20.25C20.4489 6.5 20.6397 6.42098 20.7803 6.28033C20.921 6.13968 21 5.94891 21 5.75C21 5.55109 20.921 5.36032 20.7803 5.21967C20.6397 5.07902 20.4489 5 20.25 5ZM9 4.25C9 4.05109 9.07902 3.86032 9.21967 3.71967C9.36032 3.57902 9.55109 3.5 9.75 3.5H14.25C14.4489 3.5 14.6397 3.57902 14.7803 3.71967C14.921 3.86032 15 4.05109 15 4.25V5H9V4.25ZM18 20H6V6.5H18V20ZM10.5 10.25V16.25C10.5 16.4489 10.421 16.6397 10.2803 16.7803C10.1397 16.921 9.94891 17 9.75 17C9.55109 17 9.36032 16.921 9.21967 16.7803C9.07902 16.6397 9 16.4489 9 16.25V10.25C9 10.0511 9.07902 9.86032 9.21967 9.71967C9.36032 9.57902 9.55109 9.5 9.75 9.5C9.94891 9.5 10.1397 9.57902 10.2803 9.71967C10.421 9.86032 10.5 10.0511 10.5 10.25ZM15 10.25V16.25C15 16.4489 14.921 16.6397 14.7803 16.7803C14.6397 16.921 14.4489 17 14.25 17C14.0511 17 13.8603 16.921 13.7197 16.7803C13.579 16.6397 13.5 16.4489 13.5 16.25V10.25C13.5 10.0511 13.579 9.86032 13.7197 9.71967C13.8603 9.57902 14.0511 9.5 14.25 9.5C14.4489 9.5 14.6397 9.57902 14.7803 9.71967C14.921 9.86032 15 10.0511 15 10.25Z" fill="white" />
                      </svg></div>
                  </div>
                  <h3 className="mb-2">Delete?</h3>
                  <p className="text-muted">
                    Are you sure you want to delete the department?
                  </p>
                  <div className="d-flex justify-content-center gap-4 mt-2">
                    <button className="btn btn-light" onClick={() => setShowDeleteModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-send" onClick={handleDeleteDepartment}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
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
              className={`btn btn-next ${currentPage === totalPages ? "disabled" : ""
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

export default DepartmentList;