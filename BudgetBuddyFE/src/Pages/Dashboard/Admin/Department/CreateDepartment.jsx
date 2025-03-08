import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../../../config/api';

const CreateDepartment = () => {
  const [showModal, setShowModal] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setDepartmentName(value);
    setIsFormValid(value.trim() !== '');
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const requestData = {
        departments: [departmentName]
      };

      console.log('Request Data:', requestData);

      const response = await fetch(`${API_URL}/departments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create department: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json') && response.status !== 204) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        data = { success: true };
      }

      console.log('API Response:', data);

      toast.success('Department created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setShowModal(false);
      setDepartmentName('');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error(error.message || 'Failed to create department. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <button
        className="btn create-budget-btn"
        onClick={() => setShowModal(true)}
      >
        Create Department
      </button>

      {showModal && (
        <div>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal-wrapper">
            <div className="custom-modal create-budget">
              <div className="modal-header">
                <h5 className="modal-title">Create Department</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M19.2806 18.7193C19.3503 18.789 19.4056 18.8717 19.4433 18.9628C19.481 19.0538 19.5004 19.1514 19.5004 19.2499C19.5004 19.3485 19.481 19.4461 19.4433 19.5371C19.4056 19.6281 19.3503 19.7109 19.2806 19.7806C19.2109 19.8502 19.1282 19.9055 19.0372 19.9432C18.9461 19.9809 18.8486 20.0003 18.75 20.0003C18.6515 20.0003 18.5539 19.9809 18.4628 19.9432C18.3718 19.9055 18.2891 19.8502 18.2194 19.7806L12 13.5602L5.78063 19.7806C5.6399 19.9213 5.44903 20.0003 5.25001 20.0003C5.05098 20.0003 4.86011 19.9213 4.71938 19.7806C4.57865 19.6398 4.49959 19.449 4.49959 19.2499C4.49959 19.0509 4.57865 18.86 4.71938 18.7193L10.9397 12.4999L4.71938 6.28055C4.57865 6.13982 4.49959 5.94895 4.49959 5.74993C4.49959 5.55091 4.57865 5.36003 4.71938 5.2193C4.86011 5.07857 5.05098 4.99951 5.25001 4.99951C5.44903 4.99951 5.6399 5.07857 5.78063 5.2193L12 11.4396L18.2194 5.2193C18.3601 5.07857 18.551 4.99951 18.75 4.99951C18.949 4.99951 19.1399 5.07857 19.2806 5.2193C19.4214 5.36003 19.5004 5.55091 19.5004 5.74993C19.5004 5.94895 19.4214 6.13982 19.2806 6.28055L13.0603 12.4999L19.2806 18.7193Z" fill="#6A6A6A" />
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <form className="create-department-form">
                  <div className="form-group">
                    <label>Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={departmentName}
                      onChange={handleInputChange}
                      placeholder="Enter department name"
                    />
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn btn-send ${!isFormValid || isLoading ? 'disabled' : ''}`}
                  disabled={!isFormValid || isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateDepartment;
