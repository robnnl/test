import React, { useState, FormEvent, ChangeEvent } from 'react';
import { apiService } from '../../services/api';
import { Platform, ApiCredential, PlatformConfig } from '../../types';

const PLATFORMS: Platform[] = ['bol.com', 'amazon', 'amazon-usa', 'zalando', 'walmart'];

const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  'bol.com': {
    name: 'bol.com',
    fields: {
      apiSecret: true
    },
    validation: {
      apiKeyPattern: /^[A-Za-z0-9-]{32}$/,
      apiSecretPattern: /^[A-Za-z0-9-]{32}$/
    }
  },
  'amazon': {
    name: 'amazon',
    fields: {
      clientId: true,
      merchantId: true,
      marketplaceId: true
    },
    validation: {
      apiKeyPattern: /^AKIA[0-9A-Z]{16}$/
    }
  },
  'amazon-usa': {
    name: 'amazon-usa',
    fields: {
      clientId: true,
      merchantId: true,
      marketplaceId: true
    },
    validation: {
      apiKeyPattern: /^AKIA[0-9A-Z]{16}$/
    }
  },
  'zalando': {
    name: 'zalando',
    fields: {
      clientId: true
    },
    validation: {
      apiKeyPattern: /^[A-Za-z0-9]{32}$/
    }
  },
  'walmart': {
    name: 'walmart',
    fields: {
      clientId: true,
      merchantId: true
    },
    validation: {
      apiKeyPattern: /^[A-Za-z0-9]{40}$/
    }
  }
};

interface ValidationErrors {
  apiKey?: string;
  apiSecret?: string;
  [key: string]: string | undefined;
}

const Configuration: React.FC = () => {
  const [credentials, setCredentials] = useState<ApiCredential[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('bol.com');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accountName, setAccountName] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});

  const validateFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    const config = PLATFORM_CONFIGS[selectedPlatform];

    if (config.validation.apiKeyPattern && !config.validation.apiKeyPattern.test(apiKey)) {
      newErrors.apiKey = 'Ongeldige API key format';
    }

    if (config.fields.apiSecret && config.validation.apiSecretPattern && 
        !config.validation.apiSecretPattern.test(apiSecret)) {
      newErrors.apiSecret = 'Ongeldige API secret format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateFields()) {
      return;
    }

    setIsValidating(true);

    try {
      const validationResult = await apiService.validateCredentials(
        selectedPlatform,
        apiKey,
        apiSecret
      );

      if (!validationResult.success) {
        setErrors({ apiKey: validationResult.error });
        return;
      }

      const newCredential: ApiCredential = {
        id: Date.now().toString(),
        platform: selectedPlatform,
        apiKey,
        apiSecret: apiSecret || undefined,
        accountName,
        extraFields
      };

      const saveResult = await apiService.saveCredentials(newCredential);

      if (saveResult.success && saveResult.data) {
        setCredentials([...credentials, saveResult.data]);
        resetForm();
      } else {
        setErrors({ apiKey: saveResult.error });
      }
    } finally {
      setIsValidating(false);
    }
  };

  const resetForm = () => {
    setApiKey('');
    setApiSecret('');
    setAccountName('');
    setExtraFields({});
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setCredentials(credentials.filter(cred => cred.id !== id));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExtraFields((prev: Record<string, string>) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiSecretChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiSecret(e.target.value);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(e.target.value as Platform);
  };

  return (
    <div className="configuration">
      <h1>API Configuratie</h1>

      <section className="add-credentials">
        <h2>Nieuwe API Credentials Toevoegen</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Platform</label>
            <select
              value={selectedPlatform}
              onChange={handleSelectChange}
            >
              {PLATFORMS.map(platform => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Account Naam</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="bijv. Hoofdaccount"
              required
            />
          </div>

          <div className="form-group">
            <label>API Key</label>
            <input
              type="text"
              name="apiKey"
              value={apiKey}
              onChange={handleApiKeyChange}
              required
            />
          </div>

          <div className="form-group">
            <label>API Secret (indien nodig)</label>
            <input
              type="password"
              name="apiSecret"
              value={apiSecret}
              onChange={handleApiSecretChange}
            />
          </div>

          {PLATFORM_CONFIGS[selectedPlatform].fields.clientId && (
            <div className="form-group">
              <label>Client ID</label>
              <input
                type="text"
                name="clientId"
                value={extraFields.clientId || ''}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {PLATFORM_CONFIGS[selectedPlatform].fields.merchantId && (
            <div className="form-group">
              <label>Merchant ID</label>
              <input
                type="text"
                value={extraFields.merchantId || ''}
                onChange={(e) => setExtraFields({
                  ...extraFields,
                  merchantId: e.target.value
                })}
                required
              />
            </div>
          )}

          {Object.entries(errors).map(([field, error]) => (
            error && (
              <div key={field} className="error-message">
                {error}
              </div>
            )
          ))}

          <button 
            type="submit" 
            disabled={isValidating}
            className={isValidating ? 'loading' : ''}
          >
            {isValidating ? 'Valideren...' : 'Toevoegen'}
          </button>
        </form>
      </section>

      <section className="credentials-list">
        <h2>Huidige API Credentials</h2>
        <div className="platform-groups">
          {PLATFORMS.map(platform => {
            const platformCredentials = credentials.filter((cred: ApiCredential) => cred.platform === platform);
            if (platformCredentials.length === 0) return null;

            return (
              <div key={platform} className="platform-group">
                <h3>{platform}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>API Key</th>
                      <th>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformCredentials.map(cred => (
                      <tr key={cred.id}>
                        <td>{cred.accountName}</td>
                        <td>
                          {cred.apiKey.substring(0, 6)}...
                        </td>
                        <td>
                          <button 
                            onClick={() => handleDelete(cred.id)}
                            className="delete-btn"
                          >
                            Verwijderen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Configuration; 