import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AdminHeader from "./AdminHeader";
import "./style/Sidebar.css";
import { useAuth } from "../../../Auth/AuthContext"; 

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAdmin} = useAuth(); 
  
  return (
    <div className="layout-container">
      <div className="sidebar-layout">
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      <div className="main-content">
        {isAdmin() ? (
          <AdminHeader 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen} 
          />
        ) : (
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen} 
          />
        )}
        <div className="content-area">
          <Outlet />
        </div>
        {isSidebarOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;