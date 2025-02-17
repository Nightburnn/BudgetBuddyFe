import React from 'react';
import BudgetSummaryCards from './BudgetSummaryCards';
import BudgetList from './BudgetList';


const BudgetLayout = () => {
  return (
    <div className="container-fluid">

     <div>
        <BudgetSummaryCards />
     </div>

      <div className="border mt-2"></div>



      <div>
        <BudgetList />
     </div>

    </div>
  );
};

export default BudgetLayout;