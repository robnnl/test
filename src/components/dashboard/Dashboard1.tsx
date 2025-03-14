import React from 'react';
import DateRangePicker from '../common/DateRangePicker';

interface ScoreCardProps {
  title: string;
  value: string | number;
  change: number;
}

interface ScoreCardData {
  id: string;
  title: string;
  value: string | number;
  change: number;
}

const scoreCards: ScoreCardData[] = [
  { id: '1', title: 'Totale Omzet', value: '€45.678', change: 12.5 },
  { id: '2', title: 'Aantal Orders', value: 1234, change: -2.3 },
  { id: '3', title: 'Gemiddelde Orderwaarde', value: '€89.99', change: 5.7 },
  { id: '4', title: 'Conversie Ratio', value: '3.45%', change: 0.8 }
];

const ScoreCard: React.FC<ScoreCardProps> = ({ title, value, change }) => (
  <div className="score-card">
    <h3>{title}</h3>
    <div className="value">{value}</div>
    <div className={`change ${change >= 0 ? 'positive' : 'negative'}`}>
      {change >= 0 ? '+' : ''}{change}%
    </div>
  </div>
);

const Dashboard1: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard 1</h1>
      <DateRangePicker />
      
      <div className="score-cards">
        {scoreCards.map(card => (
          <ScoreCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard1; 