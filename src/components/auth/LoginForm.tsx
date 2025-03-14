import React, { useState, FormEvent, ChangeEvent } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { domain: string; email: string; password: string }) => void;
}

interface FormFields {
  domain: string;
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormFields>({
    domain: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof FormFields) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev: FormFields) => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  return (
    <div className="login-form">
      <h2>Inloggen</h2>
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
        <button type="submit">Inloggen</button>
      </form>
    </div>
  );
};

export default LoginForm; 