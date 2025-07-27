import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Only redirect to login if we're not already on login/register pages
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    getProfile: () => api.get('/auth/profile/'),
    getDashboard: () => api.get('/auth/dashboard/'),
};

// YouTubers API
export const youtubersAPI = {
    getList: (params) => api.get('/youtubers/', { params }),
    getDetail: (id) => api.get(`/youtubers/${id}/`),
    getFeatured: () => api.get('/youtubers/featured/'),
    submitInquiry: (data) => api.post('/youtubers/inquiry/', data),
};

// Content API
export const contentAPI = {
    getHomeData: () => api.get('/home/'),
    getTeam: () => api.get('/team/'),
    getSliders: () => api.get('/sliders/'),
    getContactInfo: () => api.get('/contact-info/'),
    submitContactPage: (data) => api.post('/contactpage/', data),
};

// Static data API
export const staticAPI = {
    getCategories: () => api.get('/categories/'),
    getCrewTypes: () => api.get('/crew-types/'),
    getCameraTypes: () => api.get('/camera-types/'),
};

export default api; 