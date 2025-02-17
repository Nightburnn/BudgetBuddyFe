import React from "react";
import ill from '../../assests/images/ill.png';
import './Hero.css';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 text-content">
            <h1 className="display-7 ">BudgetBuddy</h1>
            <p className="h5 fw-semibold">Track Every Penny, Maximize Every Potential</p>
            <p className="mt-3">
            BudgetBuddy, the ultimate financial command center designed exclusively for forward-thinking organization administrators and department heads. 
            </p>
            <Link to="/signup">
            <button className="btn  btn-lg get">Get Started</button>
            </Link> 
          </div>

          <div className="col-lg-6 text-center mb-3">
            <img
              src={ill}
              alt="Illustration"
              className="img-fluid illustration-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
