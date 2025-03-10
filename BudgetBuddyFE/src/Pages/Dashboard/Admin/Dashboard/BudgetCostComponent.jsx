import React, { useState, useEffect } from 'react';
import "./Styles/BudgetCostComponent.css";
import { API_URL } from '../../../../config/api';
import { useAuth } from "../../../../Auth/AuthContext";



const BudgetCostComponent = () => {
  const [budgetTotal, setBudgetTotal] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
   const [loading, setLoading] = useState(true);
    
        const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBudgetTotal = async () => {
       if (!currentUser || !currentUser.organization_id) {
              console.error("No Organization found in currentUser");
              setError("No Organization ID found. Please log in again.");
              setLoading(false);
              return;
            }
             
            const org_id = currentUser.organization_id;
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/admin/${org_id}/dashboard/get-yearly-budget-total`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Budget cost component yearly total:", data);
  
        const year = Object.keys(data)[0]; 
        const amount = data[year]; 
  
        // Format the amount (e.g., "N 300 K")
        const formattedAmount = `N ${(amount / 1000).toFixed(0)} K`;
  
        setBudgetTotal(formattedAmount);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch budget total:", err);
        setError("Failed to load budget data");
        setBudgetTotal("N/A");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBudgetTotal();
  }, []);


  return (
    <div className="container budget-cost-container">
      <div className="left-content">
        <div className="budget-info">
          <div className="icon-wrapper">
            <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18 10.875C18 11.0975 17.934 11.315 17.8104 11.5C17.6868 11.685 17.5111 11.8292 17.3055 11.9144C17.1 11.9995 16.8738 12.0218 16.6555 11.9784C16.4373 11.935 16.2368 11.8278 16.0795 11.6705C15.9222 11.5132 15.815 11.3127 15.7716 11.0945C15.7282 10.8762 15.7505 10.65 15.8356 10.4445C15.9208 10.2389 16.065 10.0632 16.25 9.9396C16.435 9.81598 16.6525 9.75 16.875 9.75C17.1734 9.75 17.4595 9.86853 17.6705 10.0795C17.8815 10.2905 18 10.5766 18 10.875ZM14.25 6H10.5C10.3011 6 10.1103 6.07902 9.96967 6.21967C9.82902 6.36032 9.75 6.55109 9.75 6.75C9.75 6.94891 9.82902 7.13968 9.96967 7.28033C10.1103 7.42098 10.3011 7.5 10.5 7.5H14.25C14.4489 7.5 14.6397 7.42098 14.7803 7.28033C14.921 7.13968 15 6.94891 15 6.75C15 6.55109 14.921 6.36032 14.7803 6.21967C14.6397 6.07902 14.4489 6 14.25 6ZM23.25 10.5V13.5C23.25 14.0967 23.0129 14.669 22.591 15.091C22.169 15.5129 21.5967 15.75 21 15.75H20.7788L19.2591 20.0044C19.155 20.2958 18.9634 20.5479 18.7105 20.7261C18.4575 20.9044 18.1557 21 17.8463 21H16.6538C16.3443 21 16.0425 20.9044 15.7895 20.7261C15.5366 20.5479 15.345 20.2958 15.2409 20.0044L15.0609 19.5H9.68906L9.50906 20.0044C9.40502 20.2958 9.2134 20.5479 8.96047 20.7261C8.70754 20.9044 8.40568 21 8.09625 21H6.90375C6.59433 21 6.29246 20.9044 6.03953 20.7261C5.7866 20.5479 5.59498 20.2958 5.49094 20.0044L4.3125 16.7081C3.19142 15.4393 2.48945 13.8553 2.3025 12.1725C2.06046 12.2996 1.85777 12.4905 1.71633 12.7245C1.57489 12.9584 1.50009 13.2266 1.5 13.5C1.5 13.6989 1.42098 13.8897 1.28033 14.0303C1.13968 14.171 0.948912 14.25 0.75 14.25C0.551088 14.25 0.360322 14.171 0.21967 14.0303C0.0790176 13.8897 0 13.6989 0 13.5C0.00114598 12.8312 0.225771 12.1819 0.638188 11.6553C1.05061 11.1287 1.62716 10.7551 2.27625 10.5938C2.4438 8.52687 3.38252 6.59859 4.90601 5.1918C6.42951 3.78502 8.42634 3.00263 10.5 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75C21 3.94891 20.921 4.13968 20.7803 4.28033C20.6397 4.42098 20.4489 4.5 20.25 4.5H18.2447C19.4894 5.37328 20.4683 6.57378 21.0731 7.96875C21.1134 8.0625 21.1528 8.15625 21.1903 8.25C21.7535 8.2978 22.278 8.5558 22.6596 8.97268C23.0413 9.38957 23.252 9.93482 23.25 10.5ZM21.75 10.5C21.75 10.3011 21.671 10.1103 21.5303 9.96967C21.3897 9.82902 21.1989 9.75 21 9.75H20.6569C20.4971 9.75017 20.3415 9.69934 20.2127 9.6049C20.0839 9.51047 19.9885 9.37738 19.9406 9.225C19.5109 7.85375 18.6542 6.65571 17.4956 5.8057C16.337 4.95569 14.937 4.49821 13.5 4.5H10.5C9.19005 4.49993 7.90838 4.88103 6.81128 5.59682C5.71419 6.31261 4.84907 7.33217 4.32143 8.53115C3.79379 9.73014 3.62643 11.0568 3.83975 12.3492C4.05308 13.6417 4.63787 14.8442 5.52281 15.81C5.59048 15.8836 5.64276 15.97 5.67656 16.0641L6.90375 19.5H8.09625L8.45438 18.4978C8.50637 18.3522 8.60211 18.2262 8.72848 18.1371C8.85485 18.048 9.00568 18.0001 9.16031 18H15.5897C15.7443 18.0001 15.8951 18.048 16.0215 18.1371C16.1479 18.2262 16.2436 18.3522 16.2956 18.4978L16.6538 19.5H17.8463L19.5441 14.7478C19.5961 14.6022 19.6918 14.4762 19.8182 14.3871C19.9445 14.298 20.0954 14.2501 20.25 14.25H21C21.1989 14.25 21.3897 14.171 21.5303 14.0303C21.671 13.8897 21.75 13.6989 21.75 13.5V10.5Z" fill="#3F5E68"/>
</svg>
            </div>
          </div>
          <div className="text-container">
            <h2>Total Budget Cost</h2>
            <p>Amount of money approved in the year</p>
          </div>
        </div>
      </div>
      <div className="total-container">
        <div className="total-circle">
          <span className="total-label">Total</span>
          {isLoading ? (
            <span className="total-amount loading">Loading...</span>
          ) : error ? (
            <span className="total-amount error">{error}</span>
          ) : (
            <span className="total-amount">{budgetTotal}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCostComponent;