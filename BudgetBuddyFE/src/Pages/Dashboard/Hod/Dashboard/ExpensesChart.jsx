import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/ExpenseChart.css';
import { useAuth } from '../../../../Auth/AuthContext';
import { API_URL } from '../../../../config/api';

const ExpenseChart = () => {
  const [viewType, setViewType] = useState('Monthly');
  const [expenseData, setExpenseData] = useState({ monthly: [], yearly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!currentUser || !currentUser.department_id) {
        console.error("No departmentId found in currentUser");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/departments/${currentUser.department_id}/dashboard/expense-chart`);
        
        setExpenseData({
          monthly: response.data.monthly,
          yearly: response.data.yearly
        });

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

  const data = viewType === 'Monthly' ? expenseData.monthly : expenseData.yearly;

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
                dataKey={viewType === 'Monthly' ? 'month' : 'year'}
                axisLine={false}
                tickLine={false}
                dy={10}
                tick={{ fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value/1000}k`}
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
                formatter={(value) => [`$${(value/1000).toFixed(1)}k`, 'Amount']}
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