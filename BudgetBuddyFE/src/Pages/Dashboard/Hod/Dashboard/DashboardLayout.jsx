import React from 'react';
import BudgetCards from './BudgetCards';
import ExpenseSummary from './ExpenseSummary';
import ExpensesChart from './ExpensesChart';
import BudgetList from './BudgetList';


const DashboardLayout = () => {
  return (
    <div className="container-fluid">

      <div className="row g-4">
        <div className="col-md-6">
          <div className="mb-4">
            <BudgetCards />
          </div>
          <div>
            <ExpenseSummary />
          </div>
        </div>

       

        <div className="col-md-6">
          <ExpensesChart />
        </div>
      </div>
      <div className="border mt-2"></div>


<div>
  <BudgetList/>
</div>



    </div>
  );
};

export default DashboardLayout;