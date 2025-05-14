import { apiClient, login } from './api';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const authService = {
  login: async (email, password) => {
    const response = await login(email, password);
    if (response.status === 200) {
      const data = response.data;
      sessionStorage.setItem('idToken', data?.idToken);
      sessionStorage.setItem('email', data?.email);

      try {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        sessionStorage.setItem('idToken', idToken);
      } catch (error) {
        return { status: 400, }
      }
    }
    return response;
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
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('email');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const email = sessionStorage.getItem('email');
    return email ? { email } : null;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('idToken');
  },

  refreshToken: async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user == null) {
      return false;
    }

    try {
      const idToken = await user.getIdToken(true);
      sessionStorage.setItem('idToken', idToken);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
};

export default authService; 