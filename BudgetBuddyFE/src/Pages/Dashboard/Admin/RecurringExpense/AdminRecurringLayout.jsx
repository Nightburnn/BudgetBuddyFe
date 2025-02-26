import React from 'react';
import RecurringCards from './RecurringCards';
import RecurringList from './RecurringList';


const AdminRecurringLayout = () => {
  return (
    <div className="container-fluid">

     <div>
        <RecurringCards/>
     </div>

      <div className="border mt-2"></div>



      <div>
        <RecurringList />
     </div>

    </div>
  );
};

export default AdminRecurringLayout;