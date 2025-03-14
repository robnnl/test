import React, { useState, useEffect } from 'react';
import { ApiCredential, Platform, ApiResponse } from '../../types';
import './Configuration.css';

interface ApiCredentialFormProps {
  onSave: (credential: Omit<ApiCredential, 'id' | 'created_at' | 'updated_at' | 'organization_id'>) => Promise<{ success: boolean; data?: ApiCredential; error?: string }>;
}

const ApiCredentialForm: React.FC<ApiCredentialFormProps> = ({ onSave }) => {
  const [platform, setPlatform] = useState<Platform>(Platform.GOOGLE_ANALYTICS);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [errors, setErrors] = useState<{ apiKey?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setPlatform(Platform.GOOGLE_ANALYTICS);
    setApiKey('');
    setApiSecret('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!apiKey) {
      setErrors({ apiKey: 'API Key is verplicht' });
      setIsSubmitting(false);
      return;
    }

    try {
      const saveResult = await onSave({
        platform,
        api_key: apiKey,
        api_secret: apiSecret
      });

      if (!saveResult.success) {
        setErrors({ apiKey: saveResult.error || 'Er is een fout opgetreden' });
      } else {
        resetForm();
      }
    } catch (error) {
      setErrors({ apiKey: 'Er is een fout opgetreden bij het opslaan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="api-credential-form">
      <h3>Nieuwe API Credentials toevoegen</h3>
      
      <div className="form-group">
        <label htmlFor="platform">Platform</label>
        <select 
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          {Object.values(Platform).map(p => (
            <option key={p} value={p}>{p.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className={errors.apiKey ? 'error' : ''}
        />
        {errors.apiKey && <div className="error-message">{errors.apiKey}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="apiSecret">API Secret (optioneel)</label>
        <input
          id="apiSecret"
          type="text"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
        />
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Bezig met opslaan...' : 'Opslaan'}
      </button>
    </form>
  );
};

const Configuration: React.FC = () => {
  const [credentials, setCredentials] = useState<ApiCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api-credentials`);
        
        if (!response.ok) {
          throw new Error('Kon API credentials niet ophalen');
        }
        
        const rawData = await response.json();
        
        const typedCredentials: ApiCredential[] = rawData.map((item: any) => ({
          id: item.id,
          platform: item.platform as Platform,
          api_key: item.api_key,
          api_secret: item.api_secret,
          organization_id: item.organization_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        setCredentials(typedCredentials);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de API credentials');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCredentials();
  }, []);

  const handleSaveCredential = async (credential: Omit<ApiCredential, 'id' | 'created_at' | 'updated_at' | 'organization_id'>) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credential),
        credentials: 'include'
      });
      
      const rawData = await response.json();
      
      if (response.ok && rawData.success && rawData.data) {
        const newCredential: ApiCredential = {
          id: rawData.data.id,
          platform: rawData.data.platform as Platform,
          api_key: rawData.data.api_key,
          api_secret: rawData.data.api_secret,
          organization_id: rawData.data.organization_id,
          created_at: rawData.data.created_at,
          updated_at: rawData.data.updated_at
        };
        
        setCredentials(prev => [...prev, newCredential]);
        return { success: true, data: newCredential };
      } else {
        return { 
          success: false, 
          error: (rawData && rawData.error) ? rawData.error : 'Kon API credential niet opslaan' 
        };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Er is een fout opgetreden bij het opslaan' };
    }
  };

  return (
    <div className="configuration">
      <h1>API Configuratie</h1>
      
      {isLoading ? (
        <p>Laden...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="credentials-list">
            <h2>Huidige API Credentials</h2>
            {credentials.length === 0 ? (
              <p>Geen API credentials gevonden. Voeg er hieronder een toe.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>API Key</th>
                    <th>Aangemaakt op</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map(cred => (
                    <tr key={cred.id}>
                      <td>{cred.platform.replace('_', ' ').toUpperCase()}</td>
                      <td>{cred.api_key.substring(0, 5)}...{cred.api_key.substring(cred.api_key.length - 5)}</td>
                      <td>{new Date(cred.created_at || '').toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <ApiCredentialForm onSave={handleSaveCredential} />
        </>
      )}
    </div>
  );
};

export default Configuration; 