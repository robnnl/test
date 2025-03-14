import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import Sidebar from './components/navigation/Sidebar';
import Dashboard1 from './components/dashboard/Dashboard1';
import Dashboard2 from './components/dashboard/Dashboard2';
import Settings from './components/settings/Settings';
import Configuration from './components/configuration/Configuration';

interface LoginCredentials {
  domain: string;
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = ({ domain, email, password }: LoginCredentials) => {
    // Implementeer login logica hier
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app">
        {!isAuthenticated ? (
          <LoginForm onSubmit={handleLogin} />
        ) : (
          <div className="app-container">
            <Sidebar />
            <main>
              <Routes>
                <Route path="/home" element={<Dashboard1 />} />
                <Route path="/dashboard1" element={<Dashboard1 />} />
                <Route path="/dashboard2" element={<Dashboard2 />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/configuration" element={<Configuration />} />
              </Routes>
            </main>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App; 