export interface ApiCredential {
  id: string;
  platform: string;
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