import axios from 'axios';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl) return 'http://localhost:5000/api';
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const API_URL = getApiUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
