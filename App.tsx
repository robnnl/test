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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ongeldige inloggegevens');
      }

      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
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