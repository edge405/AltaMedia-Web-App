// API Configuration for Alta Web App
// This file handles API base URL configuration for different environments

const getApiBaseUrl = () => {
  // In production, use your deployed backend URL
  if (import.meta.env.PROD) {
    return 'https://builder.altamedia.ai';
  }
  
  // In development, use localhost
  return 'http://localhost:3000';
};

const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User endpoints
  USER_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  
  // Package endpoints
  PACKAGES: '/packages',
  PACKAGE_FEATURES: '/packages/features',
  
  // Purchase endpoints
  PURCHASES: '/purchases',
  CREATE_PURCHASE: '/purchases/create',
  
  // Addon endpoints
  ADDONS: '/addons',
  ADDON_PURCHASES: '/addon-purchases',
  
  // Brand Kit endpoints
  BRAND_KITS: '/brand-kits',
  BRAND_KIT_QUESTIONNAIRE: '/brand-kit-questionnaire',
  
  // Organization endpoints
  ORGANIZATIONS: '/organizations',
  
  // AI Suggestions endpoints
  AI_SUGGESTIONS: '/ai-suggestions',
  
  // Deliverable endpoints
  DELIVERABLES: '/deliverables',
  
  // Health check
  HEALTH: '/health',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API requests with error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    timeout: API_CONFIG.TIMEOUT,
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_CONFIG;
