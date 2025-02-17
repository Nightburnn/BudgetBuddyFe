/* global google */
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Main.css";
import {Link} from 'react-router-dom'


const Main = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    let googleChartLoaded = false;

    // Load the Google Charts library
    const loadGoogleCharts = () => {
      if (!googleChartLoaded) {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
          googleChartLoaded = true;
          initializeCharts();
        };
        document.head.appendChild(script);
      }
    };

    const initializeCharts = () => {
      if (typeof google !== 'undefined' && google.charts) {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawCharts);
      }
    };

    const drawCharts = () => {
      if (typeof google === 'undefined' || !google.visualization) {
        return;
      }

      // Team Spending Chart
      const teamData = new google.visualization.arrayToDataTable([
        ['Employee', 'Amount'],
        ['PJ', 80000],
        ['SJ', 60000],
        ['MB', 90000],
        ['IS', 70000],
        ['DW', 100000],
        ['NJ', 40000],
        ['BS', 85000]
      ]);

      const teamOptions = {
        title: 'Team Spending Trend',
        backgroundColor: 'transparent',
        colors: ['#00FFAA'],
        chartArea: { width: '80%', height: '70%' },
        legend: { textStyle: { color: '#FFF' }, position: 'none' },
        hAxis: { textStyle: { color: '#FFF' }, gridlines: { color: '#444' } },
        vAxis: { 
          textStyle: { color: '#FFF' }, 
          gridlines: { color: '#444' },
          format: '€#,###'
        },
        titleTextStyle: { color: '#FFF' },
        animation: {
          startup: true,
          duration: 1000,
          easing: 'out'
        }
      };

      const teamChartElement = document.getElementById('team-spending-chart');
      if (teamChartElement) {
        const teamChart = new google.visualization.ColumnChart(teamChartElement);
        teamChart.draw(teamData, teamOptions);
      }

      // Day-to-Day Chart
      const dayToDayData = new google.visualization.arrayToDataTable([
        ['Category', 'Amount'],
        ['Accommodation', 40000],
        ['Comms', 20000],
        ['Services', 80000],
        ['Food', 60000],
        ['Fuel', 30000]
      ]);

      const dayToDayOptions = {
        title: 'Day-to-Day Expenses',
        backgroundColor: 'transparent',
        colors: ['#FF5733'],
        chartArea: { width: '80%', height: '70%' },
        legend: { textStyle: { color: '#FFF' }, position: 'none' },
        hAxis: { textStyle: { color: '#FFF' }, gridlines: { color: '#444' } },
        vAxis: { 
          textStyle: { color: '#FFF' }, 
          gridlines: { color: '#444' },
          format: '€#,###'
        },
        titleTextStyle: { color: '#FFF' },
        animation: {
          startup: true,
          duration: 1000,
          easing: 'out'
        }
      };

      const dayToDayChartElement = document.getElementById('day-to-day-chart');
      if (dayToDayChartElement) {
        const dayToDayChart = new google.visualization.ColumnChart(dayToDayChartElement);
        dayToDayChart.draw(dayToDayData, dayToDayOptions);
      }
    };

    // Handle window resize
    const handleResize = () => {
      drawCharts();
    };

    loadGoogleCharts();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };



  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav id="sidebar" className={`sidebar bg-dark text-light ${sidebarActive ? "active" : ""}`}>
      <div className="profile text-center p-3 pt-5 mt-3">
          <h5>Janice Chandler</h5>
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
        <header className="header bg-dark text-light d-flex justify-content-between align-items-center p-3">
          <button className="btn d-md-none" id="toggle-sidebar" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <h3 className="m-0">BudgetBuddy</h3>
        </header>

        <div className="container-fluid p-4">
          {/* Pending Tasks and Recent Expenses */}
          <div className="row mb-4">
            <div className="col-lg-6">
              <div className="card h-100 pending-tasks">
                <div className="card-header">Pending Tasks</div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-dark text-light d-flex justify-content-between">
                      Pending Approvals <span>5</span>
                    </li>
                    <li className="list-group-item bg-dark text-light d-flex justify-content-between">
                      New Trips Registered <span>1</span>
                    </li>
                    <li className="list-group-item bg-dark text-light d-flex justify-content-between">
                      Unreported Expenses <span>4</span>
                    </li>
                    <li className="list-group-item bg-dark text-light d-flex justify-content-between">
                      Upcoming Expenses <span>0</span>
                    </li>
                    <li className="list-group-item bg-dark text-light d-flex justify-content-between">
                      Unreported Advances <span>€0.00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="recent-expenses h-100 card">
                <div className="card-header">Recent Expenses</div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Employee</th>
                        <th>Team</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Office Supplies</td>
                        <td>John Smith</td>
                        <td><span className="team-tag marketing">Marketing</span></td>
                        <td>€150.00</td>
                      </tr>
                      <tr>
                        <td>Business Lunch</td>
                        <td>Sarah Jade</td>
                        <td><span className="team-tag sales">Sales</span></td>
                        <td>€75.50</td>
                      </tr>
                      <tr>
                        <td>Travel Expenses</td>
                        <td>Mike Brown</td>
                        <td><span className="team-tag operations">Operations</span></td>
                        <td>€450.25</td>
                      </tr>
                      <tr>
                        <td>Client Dinner</td>
                        <td>Jennifer Lee</td>
                        <td><span className="team-tag marketing">Marketing</span></td>
                        <td>€120.00</td>
                      </tr>
                      <tr>
                        <td>Hotel</td>
                        <td>David Wilson</td>
                        <td><span className="team-tag finance">Finance</span></td>
                        <td>€275.75</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="card quick-access mb-4">
            <div className="card-header">Quick Access</div>
            <div className="card-body d-flex flex-wrap justify-content-between">
              <button className="btn btn-light m-2 flex-grow-1">+ New Expense</button>
              <button className="btn btn-light m-2 flex-grow-1">+ Add Receipt</button>
              <button className="btn btn-light m-2 flex-grow-1">+ Create Report</button>
              <button className="btn btn-light m-2 flex-grow-1">+ Create Trip</button>
            </div>
          </div>

          {/* Monthly Report */}
          <div className="card monthly-report">
            <div className="card-header">Monthly Report</div>
            <div className="card-body">
              <div className="row">
              <div className="col-md-6 mb-3">
                  <h6>Team Spending Trend</h6>
                  <div id="team-spending-chart" style={{ width: '100%', height: '300px' }}></div>
                </div>
                <div className="col-md-6 mb-3">
                  <h6>Day-to-Day Expenses</h6>
                  <div id="day-to-day-chart" style={{ width: '100%', height: '300px' }}></div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
