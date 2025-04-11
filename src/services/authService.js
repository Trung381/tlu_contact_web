// Service xử lý xác thực người dùng
import { apiClient } from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/v1/auth/login', { email, password });
      
      // Lưu thông tin vào localStorage
      localStorage.setItem("idToken", response.data.idToken);
      localStorage.setItem("localId", response.data.localId);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      return { 
        success: true, 
        user: {
          id: response.data.localId,
          email: response.data.email
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Đăng ký thất bại' };
    }
  },

  logout: () => {
    // Xóa tất cả thông tin xác thực
    localStorage.removeItem('idToken');
    localStorage.removeItem('localId');
    localStorage.removeItem('email');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const email = localStorage.getItem('email');
    const localId = localStorage.getItem('localId');
    return email && localId ? { email, id: localId } : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('idToken');
  }
};

export default authService; 