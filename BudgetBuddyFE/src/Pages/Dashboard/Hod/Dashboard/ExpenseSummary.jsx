import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './style/ExpenseSummary.css';
import { useAuth } from '../../../../Auth/AuthContext';
import { API_URL } from '../../../../config/api';
import axios from 'axios';

const ExpenseSummary = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!currentUser || !currentUser.department_id) {
        console.error("No departmentId found in currentUser");
        setError("No department information found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/departments/${currentUser.department_id}/dashboard/expense-summary`);
        setMonthlyData(response.data);
        console.log("This is the monthly expense summary: ", response.data)
        
        const availableMonths = Object.keys(response.data);
        if (availableMonths.length > 0) {
          setSelectedMonth(availableMonths[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, [currentUser]);

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div>Error: {error}</div>;

  if (Object.keys(monthlyData).length === 0) {
    return (
      <div className="expense-wrapper expense-card">
        <h2>Expense Summary</h2>
        <p>No expense data available.</p>
      </div>
    );
  }

  const COLORS = ['#F1BFBF', '#D3C3F9', '#CFF1FB', '#FFECB2'];
  
  const currentMonthData = monthlyData[selectedMonth] || {};
  
  const chartData = Object.entries(currentMonthData).map(([name, value]) => ({
    name: name, 
    value: value
  })).sort((a, b) => b.value - a.value);

  const total = Object.values(currentMonthData).reduce((acc, curr) => acc + curr, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p>{payload[0].name}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="expense-wrapper expense-card">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">Expense Summary</h2>
        <select 
          className="expense-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Object.keys(monthlyData).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {total === 0 ? (
        <div className="text-center mt-4">
          <p>No expense data available for {selectedMonth}.</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className={activeIndex === index ? 'pie-segment-hover' : ''}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="center-total">
                <span className="total-label">Total</span>
                <h3 className="total-amount">₦ {(total / 1000).toFixed(0)}K</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="expense-grid">
              {chartData.map((item, index) => (
                <div key={item.name} className="expense-item">
                  <div className="expense-label">
                    <span 
                      className="expense-dot"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="expense-name">{item.name}</span>
                  </div>
                  <span className="expense-value">₦{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;