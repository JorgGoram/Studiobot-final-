/**
 * API client for interacting with Netlify serverless functions
 */

// Base URL for API calls
const API_BASE_URL = '/api';

/**
 * Make a GET request to the API
 * @param endpoint - The API endpoint to call
 * @returns The response data
 */
export async function fetchFromApi(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API fetch error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Make a POST request to the API
 * @param endpoint - The API endpoint to call
 * @param data - The data to send in the request body
 * @returns The response data
 */
export async function postToApi(endpoint: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API post error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Make a serverless auth request
 * @param action - The auth action to perform (signup, login, logout)
 * @param data - The auth data (email, password)
 * @returns The response data
 */
export async function authRequest(action: 'signup' | 'login' | 'logout', data?: { email: string; password: string }) {
  try {
    const response = await fetch('/.netlify/functions/supabase-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...data,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Auth error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Auth request error (${action}):`, error);
    throw error;
  }
}