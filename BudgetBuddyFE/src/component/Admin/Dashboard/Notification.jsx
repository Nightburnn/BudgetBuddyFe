/* global google */
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Main.css";
import {Link} from 'react-router-dom'



const posts = [
  {
    title: "Recent",
    items: [
      {
        header: "Monthly Budget Review",
        description: "Office supplies exceeded budget by 15%, Travel expenses under budget, New cost-saving initiatives implemented",
        time: "3d",
      },
      {
        header: "Expense Report Due",
        description: "Reminder: Submit your quarterly travel and entertainment expenses by end of week. Include all receipts...",
        time: "4d",
      },
    ],
  },
  {
    title: "Earlier",
    items: [
      {
        header: "Expense Policy Update",
        description: "New guidelines for remote work equipment reimbursement and monthly internet allowance.",
        time: "3d",
      },
      {
        header: "Q3 Expense Summary",
        description: "Total department spending below projected budget. Major savings in utility and office supplies categories.",
        time: "3d",
      },
      {
        header: "Annual Budget Planning",
        description: "Department expense forecasting for next fiscal year required.",
        time: "4d",
      },
    ],
  },
];


const Notification = () => {
  const [activeLink, setActiveLink] = useState("Notification");
  const [sidebarActive, setSidebarActive] = useState(false);


  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };




  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav id="sidebar" className={`sidebar bg-dark text-light ${sidebarActive ? "active" : ""}`}>
      <div className="profile text-center p-3 pt-5 mt-3">
          <h5>Jane Doe</h5>
        </div>
        <ul className="list-unstyled components px-3">
        <li className={activeLink === "Home" ? "active" : ""}>
            <Link to="/home" onClick={() => setActiveLink("Home")}>Home</Link>
          </li>
          <li className={activeLink === "Budgets" ? "active" : ""}>
            <Link to="Pages/Budgets.html" onClick={() => setActiveLink("Budgets")}>Budgets</Link>
          </li>
          <li className={activeLink === "Departments" ? "active" : ""}>
            <Link to="#" onClick={() => setActiveLink("Departments")}>Departments</Link>
          </li>
          <li className={activeLink === "Expenses" ? "active" : ""}>
            <Link to="#" onClick={() => setActiveLink("Expenses")}>Expenses</Link>
          </li>
          <li className={activeLink === "Notification" ? "active" : ""}>
            <Link to="/notify" onClick={() => setActiveLink("Notification")}>Notification</Link>
          </li>
          <li className={activeLink === "Settings" ? "active" : ""}>
            <Link to="#" onClick={() => setActiveLink("Settings")}>Settings</Link>
          </li>
          <li className="logout"><Link to="#">Logout</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="content flex-grow-1">
        <header className="header bg-dark text-white d-flex justify-content-between align-items-center p-3">
          <button className="btn d-md-none" id="toggle-sidebar" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <h3 className="m-0">BudgetBuddy</h3>
        </header>

       
        <div className="container-fluid p-4">
      <div className="row">
        <div className="col-lg-12 right">
          {posts.map((section, index) => (
            <div key={index} className="box shadow-sm rounded bg-white mb-3">
              <div className="box-title border-bottom p-3">
                <h6 className="m-0">{section.title}</h6>
              </div>
              <div className="box-body p-0">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-3 d-flex align-items-center justify-content-between border-bottom osahan-post-header"
                  >
                    <div className="font-weight-bold mr-3">
                      <div className="text-truncate">{item.header}</div>
                      <div className="small">{item.description}</div>
                    </div>
                    <span className="ml-auto mb-auto">
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-light btn-sm rounded"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="mdi mdi-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button className="dropdown-item bg-danger" type="button">
                              <i className="mdi mdi-delete"></i> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                      <br />
                      <div className="text-center text-muted pt-1">{item.time}</div>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      
      </div>
    </div>
  );
};

export default Notification;
