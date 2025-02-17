import React from 'react';
import RecurringList from './RecurringList';
import RecurringSummary from './RecurringSummary';


const RecurringLayout = () => {
  return (
    <div className="container-fluid">

    <RecurringSummary/>

      <div className="border mt-2"></div>



      <div>
        <RecurringList/>  
     </div>

    </div>
  );
};

export default RecurringLayout;