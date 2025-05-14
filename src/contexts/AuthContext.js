import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Tạo context cho authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập khi component mount
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Đăng nhập
  const login = async (email, password) => {
    setIsLoading(true);
    const response = await authService.login(email, password);
    
    if (response.status === 200) {
      setUser(authService.getCurrentUser());
      setIsAuthenticated(authService.isAuthenticated());
    }
    setIsLoading(false);
    return response;
  }

  // Đăng ký
  const register = async (userData) => {
    setIsLoading(true);
    const result = await authService.register(userData);
    setIsLoading(false);
    return result;
  };

  // Đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 