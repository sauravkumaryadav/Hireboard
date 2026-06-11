// Interceptor means Run code automatically before/after requests , req interceptors - before request, response interceptors - after response

import axios from 'axios';

// 1. Create axios instance
const api = axios.create({
    baseURL: '/api'
});


// 2. Request Interceptor
// Automatically attach token to every request
api.interceptors.request.use(

    // Runs before request is sent
    (config) => {

        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists
        if (token) {

            // Attach Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Must return config
        return config;
    },

    // Handle request error
    (error) => {
        return Promise.reject(error);
    }
);


// 3. Response Interceptor
// Handle global response errors
api.interceptors.response.use(

    // If response successful
    (response) => {
        return response;
    },

    // If response has error
    (error) => {

        // Check if error status is 401
        if (error.response?.status === 401) {

            // Remove invalid token
            localStorage.removeItem('token');

            // Redirect user to login page
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);


// Export axios instance
export default api;


// LOGIN
// ↓
// Backend returns token
// ↓
// Frontend saves token
// ↓
// User opens protected page
// ↓
// Axios interceptor attaches token
// ↓
// Backend protect middleware verifies
// ↓
// req.user attached
// ↓
// Controller executes