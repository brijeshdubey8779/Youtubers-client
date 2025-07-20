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
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/api/auth/refresh/', {
                        refresh: refreshToken,
                    });

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);

                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
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
    search: (params) => api.get('/youtubers/search/', { params }),
};

// Content API
export const contentAPI = {
    getHomeData: () => api.get('/home-data/'),
    getTeam: () => api.get('/team/'),
    getSliders: () => api.get('/sliders/'),
    getContactInfo: () => api.get('/contactinfo/'),
    submitContact: (data) => api.post('/contact/', data),
    submitContactPage: (data) => api.post('/contactpage/', data),
};

// Static data API
export const staticAPI = {
    getCategories: () => api.get('/categories/'),
    getCrewTypes: () => api.get('/crew-types/'),
    getCameraTypes: () => api.get('/camera-types/'),
};

export default api; 