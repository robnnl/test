import axios from 'axios';
import { encryptData } from '../utils/encryption';
import { config } from '../config/env';
import { ApiCredential } from '../types/api';

const API_BASE_URL = config.API_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiService = {
  async saveCredentials(credentials: ApiCredential): Promise<ApiResponse<ApiCredential>> {
    try {
      const encryptedData = {
        ...credentials,
        apiKey: encryptData(credentials.apiKey),
        apiSecret: credentials.apiSecret ? encryptData(credentials.apiSecret) : undefined
      };

      const response = await axios.post(
        `${API_BASE_URL}/credentials`, 
        encryptedData,
        { withCredentials: true }
      );
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Fout bij het opslaan van credentials'
      };
    }
  },

  async validateCredentials(platform: string, apiKey: string, apiSecret?: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/validate-credentials`,
        { platform, apiKey, apiSecret },
        { withCredentials: true }
      );
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Fout bij het valideren van credentials'
      };
    }
  }
}; 