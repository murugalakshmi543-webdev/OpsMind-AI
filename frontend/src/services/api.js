import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const register = async (email, password) => {
    try {
        const response = await api.post('/auth/register', { email, password });
        return {
            success: true,
            user: response.data.user,
            token: response.data.token
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || 'Registration failed'
        };
    }
};

// Document APIs
export const uploadDocument = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || 'Upload failed'
        };
    }
};

export const getDocuments = async () => {
    try {
        const response = await api.get('/upload');
        return response.data.documents || [];
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
};

export const deleteDocument = async (id) => {
    try {
        await api.delete(`/upload/${id}`);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || 'Delete failed'
        };
    }
};

// Chat APIs
export const sendQuery = async (question) => {
    try {
        const response = await api.post('/chat/query', { question });
        return response.data;
    } catch (error) {
        console.error('Chat query error:', error);
        throw new Error(error.response?.data?.error || 'Failed to get response');
    }
};

export default api;