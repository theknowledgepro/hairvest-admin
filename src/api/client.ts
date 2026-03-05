import axios from 'axios';

// The Hairvest API base URL will go here. For now, it defaults to a local or env var endpoint.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for auth tokens
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: response interceptor to handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., clear state and redirect to login)
            localStorage.removeItem('auth_token');
            // For a proper React integration, this is usually handled within the components/auth layer 
            // or by firing an event that the router listens to.
        }
        return Promise.reject(error);
    }
);
