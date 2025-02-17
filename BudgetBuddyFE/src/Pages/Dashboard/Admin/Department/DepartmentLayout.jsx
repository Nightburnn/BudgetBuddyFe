import React from 'react';
import DepartmentCards from './DepartmentCards';
import DepartmentList from './DepartmentList';


const DepartmentLayout = () => {
  return (
    <div className="container-fluid">

     <div>
        <DepartmentCards/>
     </div>

      <div className="border mt-2"></div>



      <div>
        <DepartmentList />
     </div>

    </div>
  );
};

export default DepartmentLayout;