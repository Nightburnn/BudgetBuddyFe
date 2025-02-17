import React from 'react';
import './Styles/BudgetCard.css'

const MetricCard = ({ title, value, colorClass }) => (
  <div className="col-12 col-md-6 col-lg-4 mb-4">
    <div className="card metric-card">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
        <h2 className={`card-title ${colorClass}`}>{value}</h2>
      </div>
    </div>
  </div>
);

const BudgetCard = () => {
  const metrics = [
    {
      title: 'Total Budgets',
      value: '5',
      colorClass: 'text-purple'
    },
    {
      title: 'Total Recurring',
      value: '8',
      colorClass: 'text-purple'
    },
    {
      title: 'Total Departments',
      value: '8',
       colorClass: 'text-purple'
    }
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            colorClass={metric.colorClass}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetCard;