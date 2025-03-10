import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config/api';
import { useAuth } from "../../../../Auth/AuthContext";



const TotalBudgetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
  <path d="M17.25 8.89719V8.375C17.25 6.02375 13.7034 4.25 9 4.25C4.29656 4.25 0.75 6.02375 0.75 8.375V12.125C0.75 14.0834 3.21094 15.6397 6.75 16.1056V16.625C6.75 18.9762 10.2966 20.75 15 20.75C19.7034 20.75 23.25 18.9762 23.25 16.625V12.875C23.25 10.9344 20.8669 9.37625 17.25 8.89719ZM5.25 14.2691C3.41344 13.7562 2.25 12.9116 2.25 12.125V10.8059C3.015 11.3478 4.03969 11.7847 5.25 12.0781V14.2691ZM12.75 12.0781C13.9603 11.7847 14.985 11.3478 15.75 10.8059V12.125C15.75 12.9116 14.5866 13.7562 12.75 14.2691V12.0781ZM11.25 18.7691C9.41344 18.2562 8.25 17.4116 8.25 16.625V16.2341C8.49656 16.2434 8.74594 16.25 9 16.25C9.36375 16.25 9.71906 16.2378 10.0678 16.2172C10.4552 16.3559 10.8499 16.4736 11.25 16.5697V18.7691ZM11.25 14.5859C10.5051 14.696 9.75302 14.7508 9 14.75C8.24698 14.7508 7.49493 14.696 6.75 14.5859V12.3556C7.49604 12.4528 8.24765 12.5011 9 12.5C9.75235 12.5011 10.504 12.4528 11.25 12.3556V14.5859ZM17.25 19.0859C15.758 19.3047 14.242 19.3047 12.75 19.0859V16.85C13.4958 16.9503 14.2475 17.0004 15 17C15.7523 17.0011 16.504 16.9528 17.25 16.8556V19.0859ZM21.75 16.625C21.75 17.4116 20.5866 18.2562 18.75 18.7691V16.5781C19.9603 16.2847 20.985 15.8478 21.75 15.3059V16.625Z" fill="#97E0F7"/>
</svg>
);

const PendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M17.9167 8.89719V8.375C17.9167 6.02375 14.3702 4.25 9.66675 4.25C4.96331 4.25 1.41675 6.02375 1.41675 8.375V12.125C1.41675 14.0834 3.87769 15.6397 7.41675 16.1056V16.625C7.41675 18.9762 10.9633 20.75 15.6667 20.75C20.3702 20.75 23.9167 18.9762 23.9167 16.625V12.875C23.9167 10.9344 21.5336 9.37625 17.9167 8.89719ZM22.4167 12.875C22.4167 14.1144 19.5302 15.5 15.6667 15.5C15.3171 15.5 14.9702 15.4878 14.628 15.4653C16.6502 14.7284 17.9167 13.5312 17.9167 12.125V10.4131C20.7171 10.8303 22.4167 11.9628 22.4167 12.875ZM7.41675 14.5859V12.3556C8.16279 12.4528 8.9144 12.5011 9.66675 12.5C10.4191 12.5011 11.1707 12.4528 11.9167 12.3556V14.5859C11.1718 14.696 10.4198 14.7508 9.66675 14.75C8.91373 14.7508 8.16168 14.696 7.41675 14.5859ZM16.4167 10.8059V12.125C16.4167 12.9116 15.2533 13.7562 13.4167 14.2691V12.0781C14.6271 11.7847 15.6517 11.3478 16.4167 10.8059ZM9.66675 5.75C13.5302 5.75 16.4167 7.13562 16.4167 8.375C16.4167 9.61438 13.5302 11 9.66675 11C5.80331 11 2.91675 9.61438 2.91675 8.375C2.91675 7.13562 5.80331 5.75 9.66675 5.75ZM2.91675 12.125V10.8059C3.68175 11.3478 4.70644 11.7847 5.91675 12.0781V14.2691C4.08019 13.7562 2.91675 12.9116 2.91675 12.125ZM8.91675 16.625V16.2341C9.16331 16.2434 9.41269 16.25 9.66675 16.25C10.0305 16.25 10.3858 16.2378 10.7346 16.2172C11.122 16.3559 11.5166 16.4736 11.9167 16.5697V18.7691C10.0802 18.2562 8.91675 17.4116 8.91675 16.625ZM13.4167 19.0859V16.85C14.1625 16.9503 14.9142 17.0004 15.6667 17C16.4191 17.0011 17.1707 16.9528 17.9167 16.8556V19.0859C16.4247 19.3047 14.9088 19.3047 13.4167 19.0859ZM19.4167 18.7691V16.5781C20.6271 16.2847 21.6517 15.8478 22.4167 15.3059V16.625C22.4167 17.4116 21.2533 18.2562 19.4167 18.7691Z" fill="#FFC107"/>
</svg>
);

const ApprovedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M17.5834 8.89719V8.375C17.5834 6.02375 14.0368 4.25 9.33337 4.25C4.62994 4.25 1.08337 6.02375 1.08337 8.375V12.125C1.08337 14.0834 3.54431 15.6397 7.08337 16.1056V16.625C7.08337 18.9762 10.6299 20.75 15.3334 20.75C20.0368 20.75 23.5834 18.9762 23.5834 16.625V12.875C23.5834 10.9344 21.2002 9.37625 17.5834 8.89719ZM22.0834 12.875C22.0834 14.1144 19.1968 15.5 15.3334 15.5C14.9837 15.5 14.6368 15.4878 14.2946 15.4653C16.3168 14.7284 17.5834 13.5312 17.5834 12.125V10.4131C20.3837 10.8303 22.0834 11.9628 22.0834 12.875ZM7.08337 14.5859V12.3556C7.82942 12.4528 8.58103 12.5011 9.33337 12.5C10.0857 12.5011 10.8373 12.4528 11.5834 12.3556V14.5859C10.8384 14.696 10.0864 14.7508 9.33337 14.75C8.58036 14.7508 7.82831 14.696 7.08337 14.5859ZM16.0834 10.8059V12.125C16.0834 12.9116 14.9199 13.7562 13.0834 14.2691V12.0781C14.2937 11.7847 15.3184 11.3478 16.0834 10.8059ZM9.33337 5.75C13.1968 5.75 16.0834 7.13562 16.0834 8.375C16.0834 9.61438 13.1968 11 9.33337 11C5.46994 11 2.58337 9.61438 2.58337 8.375C2.58337 7.13562 5.46994 5.75 9.33337 5.75ZM2.58337 12.125V10.8059C3.34837 11.3478 4.37306 11.7847 5.58337 12.0781V14.2691C3.74681 13.7562 2.58337 12.9116 2.58337 12.125ZM8.58337 16.625V16.2341C8.82994 16.2434 9.07931 16.25 9.33337 16.25C9.69712 16.25 10.0524 16.2378 10.4012 16.2172C10.7886 16.3559 11.1833 16.4736 11.5834 16.5697V18.7691C9.74681 18.2562 8.58337 17.4116 8.58337 16.625ZM13.0834 19.0859V16.85C13.8292 16.9503 14.5809 17.0004 15.3334 17C16.0857 17.0011 16.8373 16.9528 17.5834 16.8556V19.0859C16.0913 19.3047 14.5754 19.3047 13.0834 19.0859ZM19.0834 18.7691V16.5781C20.2937 16.2847 21.3184 15.8478 22.0834 15.3059V16.625C22.0834 17.4116 20.9199 18.2562 19.0834 18.7691Z" fill="#4CAF50"/>
</svg>
);

const RejectedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
  <path d="M17.25 8.89719V8.375C17.25 6.02375 13.7034 4.25 9 4.25C4.29656 4.25 0.75 6.02375 0.75 8.375V12.125C0.75 14.0834 3.21094 15.6397 6.75 16.1056V16.625C6.75 18.9762 10.2966 20.75 15 20.75C19.7034 20.75 23.25 18.9762 23.25 16.625V12.875C23.25 10.9344 20.8669 9.37625 17.25 8.89719ZM21.75 12.875C21.75 14.1144 18.8634 15.5 15 15.5C14.6503 15.5 14.3034 15.4878 13.9613 15.4653C15.9834 14.7284 17.25 13.5312 17.25 12.125V10.4131C20.0503 10.8303 21.75 11.9628 21.75 12.875ZM6.75 14.5859V12.3556C7.49604 12.4528 8.24765 12.5011 9 12.5C9.75235 12.5011 10.504 12.4528 11.25 12.3556V14.5859C10.5051 14.696 9.75302 14.7508 9 14.75C8.24698 14.7508 7.49493 14.696 6.75 14.5859ZM15.75 10.8059V12.125C15.75 12.9116 14.5866 13.7562 12.75 14.2691V12.0781C13.9603 11.7847 14.985 11.3478 15.75 10.8059ZM9 5.75C12.8634 5.75 15.75 7.13562 15.75 8.375C15.75 9.61438 12.8634 11 9 11C5.13656 11 2.25 9.61438 2.25 8.375C2.25 7.13562 5.13656 5.75 9 5.75ZM2.25 12.125V10.8059C3.015 11.3478 4.03969 11.7847 5.25 12.0781V14.2691C3.41344 13.7562 2.25 12.9116 2.25 12.125ZM8.25 16.625V16.2341C8.49656 16.2434 8.74594 16.25 9 16.25C9.36375 16.25 9.71906 16.2378 10.0678 16.2172C10.4552 16.3559 10.8499 16.4736 11.25 16.5697V18.7691C9.41344 18.2562 8.25 17.4116 8.25 16.625ZM12.75 19.0859V16.85C13.4958 16.9503 14.2475 17.0004 15 17C15.7523 17.0011 16.504 16.9528 17.25 16.8556V19.0859C15.758 19.3047 14.242 19.3047 12.75 19.0859ZM18.75 18.7691V16.5781C19.9603 16.2847 20.985 15.8478 21.75 15.3059V16.625C21.75 17.4116 20.5866 18.2562 18.75 18.7691Z" fill="#D32F2F"/>
</svg>
);

const DepartmentCards = () => {
  const [totalBudget, setTotalBudget] = useState({
    count: 0,
    title: 'Total Recurring Expenses',
    className: 'total-card',
  });


  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const { currentUser } = useAuth();
  

  const fetchTotalBudget = async () => {

    if (!currentUser || !currentUser.organization_id) {
      console.error("No departmentId found in currentUser");
      setError("No department ID found. Please log in again.");
      setLoading(false);
      return;
    }
     
    const org_id = currentUser.organization_id;
    try {
      const response = await axios.get(`${API_URL}/admin/${org_id}/dashboard/get-total-recurring-expense-count`);
      setTotalBudget(prev => ({
        ...prev,
        count: response.data
      }));
    } catch (error) {
      console.error('Error fetching total budget:', error);
      setTotalBudget(prev => ({
        ...prev,
        count: 0
      }));
    }
  };

  const fetchStatusCount = async (status) => {
     if (!currentUser || !currentUser.organization_id) {
          console.error("No departmentId found in currentUser");
          setError("No department ID found. Please log in again.");
          setLoading(false);
          return;
        }
         
        const org_id = currentUser.organization_id;
    
    try {
      const response = await axios.get(`${API_URL}/admin/${org_id}/dashboard/get-total-recurring-expense-count?status=${status}`);
      setStatusCounts(prev => ({
        ...prev,
        [status]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching ${status} count:`, error);
      setStatusCounts(prev => ({
        ...prev,
        [status]: 0
      }));
    }
  };

  useEffect(() => {
    fetchTotalBudget();
    ['Pending', 'Approved', 'Rejected'].forEach(fetchStatusCount);
  }, []);

  
  const statusCards = [
    {
      title: 'Pending',
      count: statusCounts.Pending,
      icon: PendingIcon,
      className: 'pending-card'
    },
    {
      title: 'Approved',
      count: statusCounts.Approved,
      icon: ApprovedIcon,
      className: 'approved-card'
    },
    {
      title: 'Rejected',
      count: statusCounts.Rejected,
      icon: RejectedIcon,
      className: 'rejected-card'
    }
  ];

  return (
    <div className="budget-summary-container">
      <div className="row g-3 budgetsum">
        {/* Total Budget Card */}
        <div className="col-12 col-md-3">
          <div className={`budget-card ${totalBudget.className}`}>
            <div className="card-content">
              <div className="card-text">
                <h3 className="card-count">{totalBudget.count}</h3>
                <p className="card-title">{totalBudget.title}</p>
              </div>
              <div className="card-icon">
                {TotalBudgetIcon && <TotalBudgetIcon size={20} />}
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards Container */}
        <div className="col-12 col-md-9">
          <div className="status-cards-container">
            <div className="row g-0">
              {statusCards.map((card, index) => (
                <div key={index} className="col-12 col-md-4 status-card-col">
                  <div className={`budget-card ${card.className}`}>
                    <div className="card-content">
                      <div className="card-text">
                        <h3 className="card-count">{card.count}</h3>
                        <p className="card-title">{card.title}</p>
                      </div>
                      <div className="card-icon">
                        {card.icon && <card.icon size={20} />}
                      </div>
                    </div>
                  </div>
                  {index < statusCards.length - 1 && <div className="card-divider" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCards;