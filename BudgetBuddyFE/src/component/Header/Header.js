import React from "react";
import './Header.css';
import { FaBars } from "react-icons/fa"; 
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

      {/* Mobile Menu Button */}
      <button
        className="btn d-lg-none menu-icon"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileMenu"
        aria-controls="mobileMenu"
      >
        <FaBars size={24} color="#333" /> {/* Using an icon */}
      </button>

      {/* Offcanvas Mobile Menu */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">Menu</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <nav className="mobile-nav d-flex flex-column align-items-center gap-3">
            <a href="#home" className="text-decoration-none mobile-link">Home</a>
            <a href="#portfolio" className="text-decoration-none mobile-link">Portfolio</a>
            <a href="#about" className="text-decoration-none mobile-link">About Us</a>
            <button className="btn mobile-login-btn">Log In</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
