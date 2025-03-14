export interface User {
  id: string;
  email: string;
  role: 'admin' | 'standard';
}

export type Platform = 'bol.com' | 'amazon' | 'amazon-usa' | 'zalando' | 'walmart';

export interface PlatformConfig {
  name: Platform;
  fields: {
    apiSecret?: boolean;
    clientId?: boolean;
    merchantId?: boolean;
    marketplaceId?: boolean;
  };
  validation: {
    apiKeyPattern?: RegExp;
    apiSecretPattern?: RegExp;
  };
}

export interface ApiCredential {
  id: string;
  platform: Platform;
  apiKey: string;
  apiSecret?: string;
  accountName: string;
  extraFields: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 