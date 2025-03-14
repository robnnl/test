import React from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Home' },
  { path: '/dashboard1', label: 'Dashboard 1' },
  { path: '/dashboard2', label: 'Dashboard 2' },
  { path: '/settings', label: 'Instellingen' },
  { path: '/configuration', label: 'API Configuratie' }
];

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <ul>
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <Link to={path}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar; 