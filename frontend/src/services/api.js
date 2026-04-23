import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the JWT token
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
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (userData) => api.post('/login', userData),
};

export const grievanceAPI = {
  getAll: () => api.get('/grievances'),
  search: (title) => api.get(`/grievances/search?title=${title}`),
  create: (data) => api.post('/grievances', data),
  update: (id, data) => api.put(`/grievances/${id}`, data),
  delete: (id) => api.delete(`/grievances/${id}`),
};

export default api;
