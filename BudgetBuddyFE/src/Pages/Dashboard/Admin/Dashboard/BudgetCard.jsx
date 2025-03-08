import React, { useState, useEffect } from 'react';
import './Styles/BudgetCard.css';
import { API_URL } from '../../../../config/api';

const MetricCard = ({ title, value, colorClass, isLoading }) => (
  <div className="col-12 col-md-6 col-lg-4 mb-4">
    <div className="card metric-card">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
        {isLoading ? (
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <h2 className={`card-title ${colorClass}`}>{value}</h2>
        )}
      </div>
    </div>
  </div>
);

const BudgetCard = () => {
  const [metrics, setMetrics] = useState({
    totalBudgets: null,
    totalRecurring: null,
    totalDepartments: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {

        const response = await fetch(`${API_URL}/admin/dashboard/get-budget-statistics`);
  
       
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
  
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid content type. Expected JSON.');
        }
  
        const data = await response.json();
        console.log('this is budget card total data:', data);
  
        setMetrics({
          totalBudgets: data?.budgets ?? 5,
          totalDepartments: data?.departments ?? 3,
          totalRecurring: data?.recExpenses ?? 1,
        });
  
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMetrics();
  }, []);
  

  const metricsArray = [
    {
      title: 'Total Budgets',
      value: metrics.totalBudgets,
      colorClass: 'text-purple'
    },
    {
      title: 'Total Recurring',
      value: metrics.totalRecurring,
      colorClass: 'text-purple'
    },
    {
      title: 'Total Departments',
      value: metrics.totalDepartments,
      colorClass: 'text-purple'
    }
  ];

  return (
    <div className="container mt-4">
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="row">
          {metricsArray.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value || '0'}
              colorClass={metric.colorClass}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;