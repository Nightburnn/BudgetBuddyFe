import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../../Auth/AuthContext';
import './style/BudgetCards.css';
import { API_URL } from '../../../../config/api';

const BudgetCards = () => {
  const [totalBudgets, setTotalBudgets] = useState({
    budgetCount: 0,
    recurringExpenseCount: 0,
    loading: true,
    error: null
  });

  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!currentUser || !currentUser.department_id) {
        console.error("No departmentId found in currentUser");
        return;
      }

      try {
        const budgetResponse = await axios.get(`${API_URL}/departments/${currentUser.department_id}/dashboard/total-budget-count`);
        console.log("Budget response data:", budgetResponse.data);
        
        const recurringResponse = await axios.get(`${API_URL}/departments/${currentUser.department_id}/dashboard/total-recurring-expense-count`);
        console.log("Recurring expense response data:", recurringResponse.data);
        
        const budgetCount = typeof budgetResponse.data === 'object' && budgetResponse.data !== null 
          ? budgetResponse.data.count 
          : budgetResponse.data;
          
        const recurringExpenseCount = typeof recurringResponse.data === 'object' && recurringResponse.data !== null 
          ? recurringResponse.data.count 
          : recurringResponse.data;
        
        setTotalBudgets({
          budgetCount: budgetCount,
          recurringExpenseCount: recurringExpenseCount,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching budget data:', error);
        setTotalBudgets({
          budgetCount: 0,
          recurringExpenseCount: 0,
          loading: false,
          error: error.response?.data?.message || 'Failed to fetch budget data'
        });
      }
    };

    fetchBudgetData();
  }, [currentUser]);

  const ErrorDisplay = () => (
    <div className="text-danger">
      {totalBudgets.error}
    </div>
  );

  const LoadingIndicator = () => (
    <div className="d-flex justify-content-center align-items-center">
      <Loader2 className="text-primary animate-spin" size={48} />
    </div>
  );

  return (
    <div className="container budgetCards">
      {totalBudgets.error ? (
        <ErrorDisplay />
      ) : totalBudgets.loading ? (
        <LoadingIndicator />
      ) : (
        <div className="cards-grid">
          <div className="budget-card budget-purple">
            <div className="card-content">
              <div className="card-text">
                <div className="card-label">Total Budgets</div>
                <div className="card-value">{totalBudgets.budgetCount}</div>
              </div>
              <div className="icon-container purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                  <path d="M24 15C24 15.2967 23.912 15.5867 23.7472 15.8334C23.5824 16.08 23.3481 16.2723 23.074 16.3858C22.7999 16.4994 22.4983 16.5291 22.2074 16.4712C21.9164 16.4133 21.6491 16.2704 21.4393 16.0607C21.2296 15.8509 21.0867 15.5836 21.0288 15.2926C20.9709 15.0017 21.0007 14.7001 21.1142 14.426C21.2277 14.1519 21.42 13.9176 21.6666 13.7528C21.9133 13.588 22.2033 13.5 22.5 13.5C22.8978 13.5 23.2794 13.658 23.5607 13.9393C23.842 14.2206 24 14.6022 24 15ZM19 8.5H14C13.7348 8.5 13.4804 8.60536 13.2929 8.79289C13.1054 8.98043 13 9.23478 13 9.5C13 9.76522 13.1054 10.0196 13.2929 10.2071C13.4804 10.3946 13.7348 10.5 14 10.5H19C19.2652 10.5 19.5196 10.3946 19.7071 10.2071C19.8946 10.0196 20 9.76522 20 9.5C20 9.23478 19.8946 8.98043 19.7071 8.79289C19.5196 8.60536 19.2652 8.5 19 8.5ZM31 14.5V18.5C31 19.2956 30.6839 20.0587 30.1213 20.6213C29.5587 21.1839 28.7957 21.5 28 21.5H27.705L25.6788 27.1725C25.54 27.561 25.2845 27.8972 24.9473 28.1348C24.6101 28.3725 24.2076 28.5 23.795 28.5H22.205C21.7924 28.5 21.3899 28.3725 21.0527 28.1348C20.7155 27.8972 20.46 27.561 20.3213 27.1725L20.0813 26.5H12.9188L12.6788 27.1725C12.54 27.561 12.2845 27.8972 11.9473 28.1348C11.6101 28.3725 11.2076 28.5 10.795 28.5H9.205C8.79243 28.5 8.38995 28.3725 8.05271 28.1348C7.71547 27.8972 7.45998 27.561 7.32125 27.1725L5.75 22.7775C4.25523 21.0857 3.31926 18.9737 3.07 16.73C2.74728 16.8995 2.47702 17.154 2.28844 17.4659C2.09985 17.7779 2.00011 18.1355 2 18.5C2 18.7652 1.89464 19.0196 1.70711 19.2071C1.51957 19.3946 1.26522 19.5 1 19.5C0.734784 19.5 0.48043 19.3946 0.292893 19.2071C0.105357 19.0196 0 18.7652 0 18.5C0.00152797 17.6082 0.301028 16.7425 0.850918 16.0404C1.40081 15.3383 2.16955 14.8401 3.035 14.625C3.2584 11.8692 4.51003 9.29811 6.54135 7.4224C8.57268 5.54669 11.2351 4.50351 14 4.5H27C27.2652 4.5 27.5196 4.60536 27.7071 4.79289C27.8946 4.98043 28 5.23478 28 5.5C28 5.76522 27.8946 6.01957 27.7071 6.20711C27.5196 6.39464 27.2652 6.5 27 6.5H24.3263C25.9858 7.66437 27.291 9.26504 28.0975 11.125C28.1513 11.25 28.2038 11.375 28.2538 11.5C29.0046 11.5637 29.704 11.9077 30.2129 12.4636C30.7217 13.0194 31.0027 13.7464 31 14.5ZM29 14.5C29 14.2348 28.8946 13.9804 28.7071 13.7929C28.5196 13.6054 28.2652 13.5 28 13.5H27.5425C27.3295 13.5002 27.122 13.4324 26.9503 13.3065C26.7785 13.1806 26.6514 13.0032 26.5875 12.8C26.0146 10.9717 24.8723 9.37428 23.3275 8.24093C21.7826 7.10759 19.916 6.49761 18 6.5H14C12.2534 6.49991 10.5445 7.00804 9.08171 7.96243C7.61891 8.91682 6.46543 10.2762 5.76191 11.8749C5.05839 13.4735 4.83524 15.2423 5.11967 16.9656C5.4041 18.6889 6.18382 20.2922 7.36375 21.58C7.45398 21.6781 7.52368 21.7933 7.56875 21.9188L9.205 26.5H10.795L11.2725 25.1637C11.3418 24.9696 11.4695 24.8016 11.638 24.6828C11.8065 24.5639 12.0076 24.5001 12.2138 24.5H20.7863C20.9924 24.5001 21.1935 24.5639 21.362 24.6828C21.5305 24.8016 21.6582 24.9696 21.7275 25.1637L22.205 26.5H23.795L26.0588 20.1637C26.1281 19.9696 26.2557 19.8016 26.4242 19.6828C26.5927 19.5639 26.7938 19.5001 27 19.5H28C28.2652 19.5 28.5196 19.3946 28.7071 19.2071C28.8946 19.0196 29 18.7652 29 18.5V14.5Z" fill="#723FEB"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="budget-card budget-blue">
            <div className="card-content">
              <div className="card-text">
                <div className="card-label">Total Recurring Expenses</div>
                <div className="card-value">{totalBudgets.recurringExpenseCount}</div>
              </div>
              <div className="icon-container blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                  <path d="M23 11.6962V11C23 7.865 18.2712 5.5 12 5.5C5.72875 5.5 1 7.865 1 11V16C1 18.6112 4.28125 20.6863 9 21.3075V22C9 25.135 13.7288 27.5 20 27.5C26.2712 27.5 31 25.135 31 22V17C31 14.4125 27.8225 12.335 23 11.6962ZM29 17C29 18.6525 25.1512 20.5 20 20.5C19.5338 20.5 19.0712 20.4838 18.615 20.4538C21.3112 19.4713 23 17.875 23 16V13.7175C26.7337 14.2737 29 15.7838 29 17ZM9 19.2812V16.3075C9.99472 16.4371 10.9969 16.5014 12 16.5C13.0031 16.5014 14.0053 16.4371 15 16.3075V19.2812C14.0068 19.428 13.004 19.5011 12 19.5C10.996 19.5011 9.99324 19.428 9 19.2812ZM21 14.2413V16C21 17.0487 19.4487 18.175 17 18.8587V15.9375C18.6138 15.5463 19.98 14.9637 21 14.2413ZM12 7.5C17.1512 7.5 21 9.3475 21 11C21 12.6525 17.1512 14.5 12 14.5C6.84875 14.5 3 12.6525 3 11C3 9.3475 6.84875 7.5 12 7.5ZM3 16V14.2413C4.02 14.9637 5.38625 15.5463 7 15.9375V18.8587C4.55125 18.175 3 17.0487 3 16ZM11 22V21.4788C11.3287 21.4913 11.6613 21.5 12 21.5C12.485 21.5 12.9587 21.4837 13.4237 21.4562C13.9403 21.6412 14.4665 21.7981 15 21.9263V24.8587C12.5513 24.175 11 23.0487 11 22ZM17 25.2812V22.3C17.9944 22.4337 18.9967 22.5005 20 22.5C21.0031 22.5014 22.0053 22.4371 23 22.3075V25.2812C21.0106 25.5729 18.9894 25.5729 17 25.2812ZM25 24.8587V21.9375C26.6138 21.5462 27.98 20.9637 29 20.2412V22C29 23.0487 27.4487 24.175 25 24.8587Z" fill="#97E0F7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCards;