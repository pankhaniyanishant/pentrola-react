import axios from 'axios';

interface StoredUser {
    token?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr) as StoredUser;
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch {
            // Ignore malformed localStorage and continue request without auth header.
        }
    }
    return config;
});

export const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage;
        }
    }
    return fallback;
};
