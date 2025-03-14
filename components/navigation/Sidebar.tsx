import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>Dashboard</h2>
      </div>
      <ul className="nav-links">
        <li className={isActive('/dashboard1') ? 'active' : ''}>
          <Link to="/dashboard1">Dashboard 1</Link>
        </li>
        <li className={isActive('/dashboard2') ? 'active' : ''}>
          <Link to="/dashboard2">Dashboard 2</Link>
        </li>
        <li className={isActive('/settings') ? 'active' : ''}>
          <Link to="/settings">Instellingen</Link>
        </li>
        <li className={isActive('/configuration') ? 'active' : ''}>
          <Link to="/configuration">Configuratie</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 