import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import thư viện axios

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyTokenAndLoadUser = async () => {
      const token = localStorage.getItem('userToken'); // Lấy token từ localStorage

      if (token) {
        try {
          // --- GỌI API XÁC MINH TOKEN VỚI BACKEND ---
          // Gửi token trong header Authorization cho mỗi request xác thực
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Nếu API xác minh thành công:
          const userData = response.data;
          setUser(userData);
          setRole(userData.role);
          
          // Cài đặt token mặc định cho các request axios sau này
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        } catch (error) {
          // Nếu token không hợp lệ, hết hạn, hoặc backend báo lỗi 401/403:
          console.error("Token invalid or expired. Logging out automatically.");
          
          // Xóa sạch dữ liệu cũ
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          
          // Reset state
          setUser(null);
          setRole(null);
          // Xóa header mặc định nếu có
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      // Kết thúc trạng thái loading CHỈ sau khi quá trình kiểm tra hoàn tất
      setLoading(false); 
    };

    verifyTokenAndLoadUser();
  }, []); // [] đảm bảo chỉ chạy 1 lần khi app load

  const login = (userData, token) => {
    // Lưu token và user vào state và localStorage
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userToken', token); // LƯU TOKEN VÀO ĐÂY

    // Cài đặt token mặc định cho axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setLoading(false);

    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userToken');
    
    // Xóa header mặc định
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
