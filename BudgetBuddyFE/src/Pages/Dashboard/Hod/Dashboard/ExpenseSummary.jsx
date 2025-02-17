import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './style/ExpenseSummary.css';

const ExpenseSummary = () => {
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [activeIndex, setActiveIndex] = useState(null);

  const monthlyData = {
    July: {
      transportation: 88000,
      feeding: 88000,
      insurance: 88000,
      electricity: 88000
    },
    June: {
      transportation: 14000,
      feeding: 1000,
      insurance: 7994,
      electricity: 3456
    },
    March: {
      transportation: 4000,
      feeding: 10000,
      insurance: 7894,
      electricity: 3456
    }
  };

 
  const COLORS = ['#F1BFBF', '#D3C3F9', '#CFF1FB', '#FFECB2'];
  
  const data = monthlyData[selectedMonth] || {
    transportation: 0,
    feeding: 0,
    insurance: 0,
    electricity: 0
  };

  const chartData = [
    { name: 'Transportation', value: data.transportation },
    { name: 'Feeding Cost', value: data.feeding },
    { name: 'Insurance', value: data.insurance },
    { name: 'Electricity Bills', value: data.electricity }
  ];

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);

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
      <div className="d-flex justify-content-between align-items-center ">
        <h2 className=" m-0">Expense Summary</h2>
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
                      fill={COLORS[index]}
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
                    className={`expense-dot ${item.name.toLowerCase().replace(' ', '-')}`}
                  ></span>
                  <span className="expense-name">{item.name}</span>
                </div>
                <span className="expense-value">₦{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;

/*API INTEGRATION 


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './ExpenseSummary.css';

const ExpenseSummary = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentMonth = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[new Date().getMonth()];
  };

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get('/api/expenses');
        setMonthlyData(response.data);
        setSelectedMonth(getCurrentMonth());
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div>Error: {error}</div>;

  const COLORS = ['#F1BFBF', '#D3C3F9', '#CFF1FB', '#FFECB2'];
  
  const currentMonthData = monthlyData[selectedMonth] || {
    transportation: 0,
    feeding: 0,
    insurance: 0,
    electricity: 0
  };

  const sortedExpenses = Object.entries(currentMonthData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const chartData = sortedExpenses.map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value
  }));

  const total = Object.values(currentMonthData).reduce((acc, curr) => acc + curr, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p>{payload[0].name}</p>
          <p>₦{payload[0].value.toLocaleString()}</p>
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

      {total === 0 ? null : (
        <div className="row">
          <div className="col-md-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-3">
              <h4>Total Expenses</h4>
              <h3>₦{total.toLocaleString()}</h3>
            </div>
          </div>
          <div className="col-md-6">
            {chartData.map((item, index) => (
              <div key={item.name} className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>{item.name}</span>
                  <span>₦{item.value.toLocaleString()}</span>
                </div>
                <div 
                  className="progress" 
                  style={{height: '10px', backgroundColor: COLORS[index % COLORS.length] + '33'}}
                >
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{
                      width: `${(item.value / total) * 100}%`, 
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;
*/
