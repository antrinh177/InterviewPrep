import axios from 'axios';
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = process.env.PORT || 3001;
const API_BASE_URL = `http://${hostname}:${port}`; // Backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Questions API
export const questionAPI = {
  search: (params) => api.get('/questions/search', { params })
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get('/categories')
};

export default api;