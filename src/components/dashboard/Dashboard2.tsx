import React from 'react';
import DateRangePicker from '../common/DateRangePicker';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const metricCards: MetricCard[] = [
  {
    id: '1',
    title: 'Retour Percentage',
    value: '2.3%',
    change: '-0.5%',
    isPositive: true
  },
  {
    id: '2',
    title: 'Klanttevredenheid',
    value: '4.8/5.0',
    change: '+0.2',
    isPositive: true
  }
];

const Dashboard2: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard 2</h1>
      <DateRangePicker />
      
      <div className="score-cards">
        {metricCards.map(({ id, title, value, change, isPositive }) => (
          <div key={id} className="score-card">
            <h3>{title}</h3>
            <div className="value">{value}</div>
            <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
              {change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard2; 