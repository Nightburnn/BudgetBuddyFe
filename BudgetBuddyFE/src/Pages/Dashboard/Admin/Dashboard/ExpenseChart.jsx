import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const ExpenseChart = () => {
  const [viewType, setViewType] = useState('Monthly');

  const monthlyData = [
    { name: 'Jan', amount: 200 },
    { name: 'Feb', amount: 900 },
    { name: 'Mar', amount: 500 },
    { name: 'Apr', amount: 580 },
    { name: 'May', amount: 700 },
    { name: 'Jun', amount: 100 },
    { name: 'Jul', amount: 400 }
  ];

  const yearlyData = [
    { name: '2020', amount: 4500 },
    { name: '2021', amount: 5200 },
    { name: '2022', amount: 4800 },
    { name: '2023', amount: 6000 },
    { name: '2024', amount: 5500 }
  ];

  const data = viewType === 'Monthly' ? monthlyData : yearlyData;

  return (
    <div className="container-fluid expense-chart-container">
      <div className="row mb-4">
        <div className="col d-flex justify-content-between align-items-center">
          <h2 className="chart-title">Expenses</h2>
          <div className="toggle-container">
            <button
              className={`toggle-button ${viewType === 'Monthly' ? 'active' : ''}`}
              onClick={() => setViewType('Monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-button ${viewType === 'Yearly' ? 'active' : ''}`}
              onClick={() => setViewType('Yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                dy={10}
                tick={{ fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}k`}
                dx={-10}
                tick={{ fill: '#666' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(134, 118, 255, 0.1)' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '8px'
                }}
                formatter={(value) => [`${value}k`, 'Amount']}
              />
              <Bar
                dataKey="amount"
                fill="#A17EF2"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;

/*API INTEGRATION
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/ExpenseChart.css';

const ExpenseChart = () => {
  const [viewType, setViewType] = useState('Monthly');
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const [monthlyResponse, yearlyResponse] = await Promise.all([
          axios.get('/api/monthly-expenses'),
          axios.get('/api/yearly-expenses')
        ]);

        setMonthlyData(
          monthlyResponse.data.map(item => ({
            name: item.month,
            amount: item.totalExpense
          }))
        );

        setYearlyData(
          yearlyResponse.data.map(item => ({
            name: item.year,
            amount: item.totalExpense
          }))
        );

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

  const data = viewType === 'Monthly' ? monthlyData : yearlyData;

  // If no data, return null to hide the entire component
  if (!data || data.length === 0) return null;

  return (
    <div className="container-fluid expense-chart-container">
      <div className="row mb-4">
        <div className="col d-flex justify-content-between align-items-center">
          <h2 className="chart-title">Expenses</h2>
          <div className="toggle-container">
            <button
              className={`toggle-button ${viewType === 'Monthly' ? 'active' : ''}`}
              onClick={() => setViewType('Monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-button ${viewType === 'Yearly' ? 'active' : ''}`}
              onClick={() => setViewType('Yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                dy={10}
                tick={{ fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}k`}
                dx={-10}
                tick={{ fill: '#666' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(134, 118, 255, 0.1)' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '8px'
                }}
                formatter={(value) => [`${value}k`, 'Amount']}
              />
              <Bar
                dataKey="amount"
                fill="#A17EF2"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;


*/