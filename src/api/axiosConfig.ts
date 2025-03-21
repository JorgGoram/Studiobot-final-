// src/api/axiosConfig.ts  
import axios from 'axios';
import { supabase } from '../lib/supabase';

// Create axios instance  
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3457/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token  
api.interceptors.request.use(
    async (config) => {
        // Get current session  
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        // Add token to request headers if exists  
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling  
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling  
        if (error.response) {
            // The request was made and the server responded with a status code  
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login or refresh token  
                    console.error('Unauthorized access');
                    break;
                case 403:
                    console.error('Forbidden access');
                    break;
                case 500:
                    console.error('Server error');
                    break;
            }
        } else if (error.request) {
            console.error('No response received');
        } else {
            console.error('Error', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;