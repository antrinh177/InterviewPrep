import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:3001'; // Backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Questions API
export const questionAPI = {
  getAll: (params) => api.get('/questions', { params })
};

export default api;