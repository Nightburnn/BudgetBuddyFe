import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Signup from "./Pages/Signup";
import Index from "./Pages/Index";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";

import Sidebar from "./Pages/Dashboard/Components/Sidebar";
import AppLayout from "./Pages/Dashboard/Components/AppLayout";
import DashboardLayout from "./Pages/Dashboard/Hod/Dashboard/DashboardLayout";
import BudgetLayout from "./Pages/Dashboard/Hod/Budgets/BudgetLayout";
import RecurringLayout from "./Pages/Dashboard/Hod/RecurringExpenses/RecurringLayout";    
import Settings from "./Pages/Dashboard/Hod/Settings/Settings";





 
function App() {
  return (
    <BrowserRouter>


      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="dashboard" element={<AppLayout />}>
          <Route index element={<DashboardLayout />} />
          <Route path="budgets" element={<BudgetLayout />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recurring-expenses" element={<RecurringLayout />} />

        </Route>







      </Routes>

    </BrowserRouter>
  );
}

export default App;
