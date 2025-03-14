import React, { useState, FormEvent, ChangeEvent } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
}

interface LoginCredentials {
  domain: string;
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    domain: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginCredentials) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  return (
    <div className="login-form">
      <h2>Inloggen</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="domain">Domein</label>
          <input
            id="domain"
            type="text"
            value={formData.domain}
            onChange={handleChange('domain')}
            placeholder="bedrijf.nl"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Wachtwoord</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 