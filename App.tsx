import React, { useState, useEffect } from 'react';
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

// Globale error boundary component
const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Onbehandelde fout:', error);
      setHasError(true);
      setError(error.error || new Error(error.message));
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="error-page">
        <h1>Er is iets misgegaan</h1>
        <p>Probeer de pagina te vernieuwen of neem contact op met support.</p>
        {process.env.NODE_ENV !== 'production' && error && (
          <div className="error-details">
            <h3>Technische details:</h3>
            <p>{error.message}</p>
            <pre>{error.stack}</pre>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App; 