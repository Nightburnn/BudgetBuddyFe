import React from "react";
import './Header.css';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header container d-flex justify-content-between align-items-center p-3">
      {/* Logo Section */}
      <div className="logo">
        <span className="fw-bold">BudgetBuddy</span>
      </div>

     
      {/* Login Button */}

      <Link to="/login">

      <button className="btn login-btn d-none d-lg-block">Log In</button>
      </Link>

   
    </header>
  );
};

export default Header;
