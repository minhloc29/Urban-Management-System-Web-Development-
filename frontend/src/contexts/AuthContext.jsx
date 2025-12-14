import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');

    if (storedRole) setRole(storedRole);
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setRole(userData.role);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);

    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
