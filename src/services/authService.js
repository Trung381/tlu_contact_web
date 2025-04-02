// Service xử lý xác thực người dùng
import apiClient from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Đăng nhập thất bại' };
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 