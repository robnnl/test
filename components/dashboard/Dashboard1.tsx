import React, { useState } from 'react';
import DateRangePicker from '../common/DateRangePicker';
import './Dashboard.css';

const Dashboard1: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  const metrics = [
    { title: 'Totale Omzet', value: '€ 24,532', change: '+15%' },
    { title: 'Conversie Ratio', value: '3.2%', change: '+0.8%' },
    { title: 'Gemiddelde Orderwaarde', value: '€ 97', change: '-2%' },
    { title: 'Nieuwe Gebruikers', value: '356', change: '+12%' }
  ];
  
  const MetricCard: React.FC<{ title: string, value: string, change: string }> = ({ title, value, change }) => (
    <div className="metric-card">
      <h3>{title}</h3>
      <div className="metric-value">{value}</div>
      <div className={`metric-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
        {change}
      </div>
    </div>
  );
  
  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard Overzicht</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </header>
      
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard1; 