import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../Auth/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style/CreateExpense.css';
import { API_URL } from '../../../../config/api';


const CreateExpense = ({ 
  onExpenseCreated, 
  onError 
}) => {
  const { currentUser } = useAuth();
  
  const departmentId = currentUser?.department_id;

  const [showModal, setShowModal] = useState(false);
  const [expenseType, setExpenseType] = useState('one-time');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    oneTime: {
      expenseName: '',
      amount: '',
    },
    recurring: {
      expenseName: '',
      amount: '',
      expenseInterval: 'Weekly'
    }
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const expenseIntervals = ['Weekly', 'Monthly', 'Yearly'];

  useEffect(() => {
    const currentForm = expenseType === 'one-time' ? formData.oneTime : formData.recurring;
    const requiredFields = expenseType === 'one-time'
      ? ['expenseName', 'amount']
      : ['expenseName', 'amount', 'expenseInterval'];

    const isValid = requiredFields.every(field => {
      const value = currentForm[field];
      return value && value.toString().trim() !== '';
    });
    setIsFormValid(isValid);
  }, [formData, expenseType]);

  const formatNumber = (value) => {
    if (!value) return '';
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    const [integerPart, decimalPart] = cleanValue.split('.');
    
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const currentType = expenseType === 'one-time' ? 'oneTime' : 'recurring';
    
    let updatedValue = value;
    if (name === 'amount') {
      updatedValue = formatNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [currentType]: {
        ...prev[currentType],
        [name]: updatedValue
      }
    }));
  };

  const handleSubmit = async () => {
    console.log('Current User:', currentUser);
    console.log('Department ID:', departmentId);

    if (!departmentId) {
      toast.error('Department ID is not available. Please login again.');
      onError?.('Department ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      if (expenseType === 'one-time') {
        const payload = {
          name: formData.oneTime.expenseName,
          amount: parseFloat(formData.oneTime.amount.replace(/,/g, ''))
        };

        console.log('One-Time Expense Payload:', payload);

        const response = await axios.post(`${API_URL}/departments/${departmentId}/expenses/create`, payload);

        console.log('One-Time Expense Response:', response);

        toast.success('One-time Expense created successfully!');
        onExpenseCreated?.(response.data);
      } else {
        const payload = {
          name: formData.recurring.expenseName,
          amount: parseFloat(formData.recurring.amount.replace(/,/g, '')),
          expenseInterval: formData.recurring.expenseInterval
        };

        // Log payload before sending
        console.log('Recurring Expense Payload:', payload);

        const response = await axios.post(`${API_URL}/departments/${departmentId}/recurringexpenses/create`, payload);

        // Log full response
        console.log('Recurring Expense Response:', response);

        toast.success('Recurring Expense created successfully!');
        onExpenseCreated?.(response.data);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      // Log full error details
      console.error('Full Expense Creation Error:', error);
      console.error('Error Response:', error.response);
      
      const errorMessage = error.response?.data?.message || 'Failed to create expense';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({
      oneTime: {
        expenseName: '',
        amount: '',
      },
      recurring: {
        expenseName: '',
        amount: '',
        expenseInterval: 'Weekly'
      }
    });
  };

  const handleTabChange = (type) => {
    setExpenseType(type);
    setIsFormValid(false);
  };

  const renderOneTimeForm = () => (
    <div className="modal-body">
      <form className="create-expense-form">
        <div className="row mb-3">
          <div className="col-6">
            <div className="form-group">
              <label>Expense Name</label>
              <input
                type="text"
                className="form-control"
                name="expenseName"
                value={formData.oneTime.expenseName}
                onChange={handleInputChange}
                placeholder="Enter name of expense"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                className="form-control"
                name="amount"
                value={formData.oneTime.amount}
                onChange={handleInputChange}
                placeholder="Enter the cost of expense"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const renderRecurringForm = () => (
    <div className="modal-body">
      <form className="create-expense-form">
        <div className="row mb-3">
          <div className="col-6">
            <div className="form-group">
              <label>Expense Name</label>
              <input
                type="text"
                className="form-control"
                name="expenseName"
                value={formData.recurring.expenseName}
                onChange={handleInputChange}
                placeholder="Enter name of expense"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                className="form-control"
                name="amount"
                value={formData.recurring.amount}
                onChange={handleInputChange}
                placeholder="Enter the cost of expense"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Expense Interval</label>
          <select
            className="form-control"
            name="expenseInterval"
            value={formData.recurring.expenseInterval}
            onChange={handleInputChange}
          >
            {expenseIntervals.map(interval => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <button
        className="btn create-budget-btn"
        onClick={() => {
          setShowModal(true);
          resetForm();
        }}
      >
        Create Expense
      </button>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal-wrapper">
            <div className="custom-modal create-budget">
              <div className="modal-header">
                <h5 className="modal-title text-center">Create Expense</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  {/* Close icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M19.2806 18.7193C19.3503 18.789 19.4056 18.8717 19.4433 18.9628C19.481 19.0538 19.5004 19.1514 19.5004 19.2499C19.5004 19.3485 19.481 19.4461 19.4433 19.5371C19.4056 19.6281 19.3503 19.7109 19.2806 19.7806C19.2109 19.8502 19.1282 19.9055 19.0372 19.9432C18.9461 19.9809 18.8486 20.0003 18.75 20.0003C18.6515 20.0003 18.5539 19.9809 18.4628 19.9432C18.3718 19.9055 18.2891 19.8502 18.2194 19.7806L12 13.5602L5.78063 19.7806C5.6399 19.9213 5.44903 20.0003 5.25001 20.0003C5.05098 20.0003 4.86011 19.9213 4.71938 19.7806C4.57865 19.6398 4.49959 19.449 4.49959 19.2499C4.49959 19.0509 4.57865 18.86 4.71938 18.7193L10.9397 12.4999L4.71938 6.28055C4.57865 6.13982 4.49959 5.94895 4.49959 5.74993C4.49959 5.55091 4.57865 5.36003 4.71938 5.2193C4.86011 5.07857 5.05098 4.99951 5.25001 4.99951C5.44903 4.99951 5.6399 5.07857 5.78063 5.2193L12 11.4396L18.2194 5.2193C18.3601 5.07857 18.551 4.99951 18.75 4.99951C18.949 4.99951 19.1399 5.07857 19.2806 5.2193C19.4214 5.36003 19.5004 5.55091 19.5004 5.74993C19.5004 5.94895 19.4214 6.13982 19.2806 6.28055L13.0603 12.4999L19.2806 18.7193Z" fill="#6A6A6A" />
                  </svg>
                </button>
              </div>

              <div className="expense-tabs">
                <div
                  className={`tab ${expenseType === 'one-time' ? 'active' : ''}`}
                  onClick={() => handleTabChange('one-time')}
                >
                  One-time Expense
                </div>
                <div
                  className={`tab ${expenseType === 'recurring' ? 'active' : ''}`}
                  onClick={() => handleTabChange('recurring')}
                >
                  Recurring Expense
                </div>
              </div>

              {expenseType === 'one-time' ? renderOneTimeForm() : renderRecurringForm()}

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
        </>
      )}
    </>
  );
};



export default CreateExpense;