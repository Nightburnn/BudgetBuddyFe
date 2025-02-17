import React from 'react';
import BudgetCard from './BudgetCard';
import BudgetCostComponent from './BudgetCostComponent'
import ExpenseChart from './ExpenseChart';
import BudgetList from './BudgetList';


const AdminDashboardLayout = () => {
  return (
    <div className="container-fluid">

      <div className="row g-4">
        <div className="col-md-6">
          <div className="mb-4">
            <BudgetCard />
          </div>
          <div>
           <BudgetCostComponent/>
          </div>
        </div>

       

        <div className="col-md-6">
          <ExpenseChart />
        </div>
      </div>
      <div className="border mt-2"></div>


<div>
  <BudgetList/>
</div>



    </div>
  );
};

export default AdminDashboardLayout;