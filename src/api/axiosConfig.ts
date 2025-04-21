
import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://0.0.0.0:5000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const session = await supabase.auth.getSession();
    if (session?.data?.session?.access_token) {
      config.headers.Authorization = `Bearer ${session.data.session.access_token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth token error:', error);
    return config;
  }
});

// Handle errors with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message === 'Network Error') {
      console.error('Network error - server may be down');
      return Promise.reject(new Error('Unable to connect to server. Please check if the server is running.'));
    }
    return Promise.reject(error);
  }
);

export default api;
