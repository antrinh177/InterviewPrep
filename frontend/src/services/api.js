import axios from 'axios';
const hostname = process.env.REACT_APP_HOSTNAME || "127.0.0.2";
const port = process.env.REACT_APP_PORT || 3002;
const API_BASE_URL = `http://${hostname}:${port}`;
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Questions API
export const questionAPI = {
  getAll: (params) => api.get('/questions', { params }),
  search: (params) => api.get('/questions/search', { params })
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get('/categories')
};

export default api;