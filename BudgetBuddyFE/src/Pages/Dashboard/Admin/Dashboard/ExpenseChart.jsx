import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_URL } from '../../../../config/api';

const ExpenseChart = () => {
  const [viewType, setViewType] = useState('Monthly');
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        // Single API endpoint with query parameter for data type
        const response = await axios.get(`${API_URL}/admin/dashboard/get-expense-chart`, {
          params: { type: 'all' }
        });

        // Set monthly data
        setMonthlyData(
          response.data.monthly && response.data.monthly.length > 0
            ? response.data.monthly.map(item => ({
                name: item.month,
                amount: item.amount // Corrected property name
              }))
            : [] // Empty array if no data
        );

        // Set yearly data
        setYearlyData(
          response.data.yearly && response.data.yearly.length > 0
            ? response.data.yearly.map(item => ({
                name: item.year.toString(), // Ensure year is a string
                amount: item.amount // Corrected property name
              }))
            : [] // Empty array if no data
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

  console.log("this is the expense chart data:", data);
  
  // Create empty data for when there's no data
  // This ensures the chart is still displayed but empty
  const emptyData = viewType === 'Monthly' 
    ? [{ name: 'Jan', amount: 0 }, { name: 'Feb', amount: 0 }, { name: 'Mar', amount: 0 }]
    : [{ name: '2022', amount: 0 }, { name: '2023', amount: 0 }, { name: '2024', amount: 0 }];

  // Use actual data if available, otherwise use empty data
  const displayData = data.length > 0 ? data : emptyData;

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
            <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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