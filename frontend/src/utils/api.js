import axios from 'axios';

// 1. Cấu hình Base URL
// Ưu tiên lấy từ biến môi trường, nếu không có thì fallback về localhost
const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';

// 2. Tạo instance Axios
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Interceptor: Tự động gắn Token trước khi gửi request
api.interceptors.request.use(
  (config) => {
    // --- SỬA QUAN TRỌNG: Dùng đúng key 'userToken' ---
    const token = localStorage.getItem('userToken'); 
    // -------------------------------------------------
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Các hàm wrapper (để tương thích với code cũ của bạn)
export const apiGet = async (path) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    // Ném lỗi ra để component xử lý (hiển thị alert...)
    throw error.response ? error.response.data : error;
  }
};

export const apiPost = async (path, body) => {
  try {
    const config = {};
    
    // Nếu là FormData (upload ảnh), để axios tự xử lý Content-Type
    if (body instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }

    const response = await api.post(path, body, config);
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

// Export mặc định để dùng linh hoạt nếu cần
export default api;