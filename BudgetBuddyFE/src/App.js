import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider, useAuth } from "./Auth/AuthContext"; 
import { ProtectedRoute, AdminRoute } from "./Auth/ProtectedRoute"; 
import Signup from "./Pages/Signup";
import Index from "./Pages/Index";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";


/* HOD routes*/
import AppLayout from "./Pages/Dashboard/Components/AppLayout";
import DashboardLayout from "./Pages/Dashboard/Hod/Dashboard/DashboardLayout";
import BudgetLayout from "./Pages/Dashboard/Hod/Budgets/BudgetLayout";
import RecurringLayout from "./Pages/Dashboard/Hod/RecurringExpenses/RecurringLayout";    

/*ADMIN ROUTES*/
import AdminDashboardLayout from './Pages/Dashboard/Admin/Dashboard/AdminDashboardLayout';
import AdminBudgetLayout from './Pages/Dashboard/Admin/Budgets/AdminBudgetLayout';
import AdminDepartmentLayout from './Pages/Dashboard/Admin/Department/AdminDepartmentLayout';
import AdminRecurringLayout from './Pages/Dashboard/Admin/RecurringExpense/AdminRecurringLayout';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            {/* Role-based routing for the dashboard index */}
            <Route index element={
              <RoleBasedRoute 
                adminComponent={<AdminDashboardLayout />} 
                hodComponent={<DashboardLayout />} 
              />
            } />

            {/* Role-based routing for budgets */}
            <Route path="budgets" element={
              <RoleBasedRoute 
                adminComponent={<AdminBudgetLayout />} 
                hodComponent={<BudgetLayout />} 
              />
            } />
            
            {/* Role-based routing for recurring expenses */}
            <Route path="recurring-expenses" element={
              <RoleBasedRoute 
                adminComponent={<AdminRecurringLayout />} 
                hodComponent={<RecurringLayout />} 
              />
            } />
            
            {/* Admin-only route */}
            <Route path="department" element={
              <AdminRoute>
                <AdminDepartmentLayout />
              </AdminRoute>
            } />
          </Route>
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

const RoleBasedRoute = ({ adminComponent, hodComponent }) => {
  const { isAdmin, isHOD } = useAuth();
  
  if (isAdmin()) {
    return adminComponent;
  } else if (isHOD()) {
    return hodComponent;
  } else {
    // Fallback - should not reach here due to ProtectedRoute
    return <Navigate to="/login" />;
  }
};

export default App;