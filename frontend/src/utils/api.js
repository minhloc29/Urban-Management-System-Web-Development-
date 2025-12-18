import axios from 'axios';

const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiGet = async (path) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiPost = async (path, body) => {
  try {
    const config = {};
    
    if (body instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }

    const response = await api.post(path, body, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiPatch = async (path, body) => {
  try {
    const config = {};

    if (body instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }

    const response = await api.patch(path, body, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiPut = async (path, body) => {
    try {
      const response = await api.put(path, body);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

export default api;
