import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const clearAuthData = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  };

  const clearAuthData = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const verifyTokenAndLoadUser = async () => {
      const token = localStorage.getItem('userToken'); 
      const storedUser = localStorage.getItem('user');

      // Kiểm tra kỹ token có phải undefined string không
      if (token && token !== "undefined" && token !== "null") {
        try {
          setToken(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Nếu có user lưu trong local rồi thì load lên luôn cho nhanh (Optimistic UI)
          if (storedUser && storedUser !== "undefined") {
             const parsedUser = JSON.parse(storedUser);
             setUser(parsedUser);
             setRole(parsedUser.role);
          }

          console.log("✅ Token verified via LocalStorage.");

        } catch (error) {
          console.error("Token invalid. Logging out.");
          clearAuthData();
        }
      } else {
          // Nếu token rác thì xóa đi
          if (token) clearAuthData();
      }
      
      setLoading(false); 
    };

    verifyTokenAndLoadUser();
  }, []); 

  const login = (userData, token) => {
    // --- KIỂM TRA AN TOÀN ---
    if (!token || typeof token !== 'string') {
        console.error("❌ Login Error: Token không hợp lệ!", token);
        return;
    }
    // ------------------------

    setUser(userData);
    setRole(userData.role);
    setToken(token);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userToken', token); 

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("✅ Đăng nhập và lưu Token thành công!");
  };

  const logout = () => {
    clearAuthData();
    setLoading(false);
    window.location.href = '/login'; // Force reload về trang login
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);