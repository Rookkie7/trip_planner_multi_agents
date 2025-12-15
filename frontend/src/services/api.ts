import axios from 'axios';
import type { TripRequest, TripPlanResponse, ParseRequestResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tripApi = {
  async createPlan(request: TripRequest): Promise<TripPlanResponse> {
    const response = await apiClient.post<TripPlanResponse>('/trip/plan', request);
    return response.data;
  },

  async parseRequest(userInput: string): Promise<ParseRequestResponse> {
    const response = await apiClient.post<ParseRequestResponse>('/request/parse-request', {
      user_input: userInput,
    });
    return response.data;
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/trip/health');
    return response.data;
  },
};

export default apiClient;
