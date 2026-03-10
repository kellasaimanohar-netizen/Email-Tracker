import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000, // 2 minutes for email sync
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth endpoints
export const getAuthStatus = () => api.get('/auth/status');
export const logout = () => api.post('/auth/logout');
export const getLoginUrl = () => `${API_BASE_URL}/auth/login`;

// Email sync
export const syncEmails = () => api.get('/sync-emails');

// Applications
export const getApplicationsCount = () => api.get('/applications/count');
export const getApplications = (page = 1, pageSize = 20, search = '', source = '') => {
    const params = { page, page_size: pageSize };
    if (search) params.search = search;
    if (source) params.source = source;
    return api.get('/applications', { params });
};
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;
