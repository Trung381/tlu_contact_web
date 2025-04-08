// Các hàm xử lý gọi API
import axios from 'axios';

// const baseURL = process.env.BASE_URL || 'http://localhost:8080';
const baseURL = 'http://localhost:8080'; // Địa chỉ API của bạn
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTE1MjM1YTZjNjE0NTRlZmRlZGM0NWE3N2U0MzUxMzY3ZWViZTAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGx1LWNvbnRhY3QtYzBjNjkiLCJhdWQiOiJ0bHUtY29udGFjdC1jMGM2OSIsImF1dGhfdGltZSI6MTc0NDEwOTU0MywidXNlcl9pZCI6IkdmZ0o3M1RqVmpoSHB6c0tKbUZhNzNRdUJEZjIiLCJzdWIiOiJHZmdKNzNUalZqaEhwenNLSm1GYTczUXVCRGYyIiwiaWF0IjoxNzQ0MTA5NTQzLCJleHAiOjE3NDQxMTMxNDMsImVtYWlsIjoiMjI1MTA2MTc2M0BlLnRsdS5lZHUudm4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyIyMjUxMDYxNzYzQGUudGx1LmVkdS52biJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.pozx7o9inlTR1rN-YdVketcdIAxuiozoYl9KonyJtAblGxlWka5WphcXEVERu2aTwK5HfeEzO-RoPnrO03-QBoVKGjeVe98seqU4WpRgZwyKWzNzkaYNv13RfmRTS1stihWcmfJi1vprRUFLEVCvo5bmXzkHN4DM-C5yZjGIX8QT8yDzVp5M1TtI9PKLhudxuJY9G1sMTEF9cVs72DKigTwK77XPimoNU-onFYtgEiBNm7ux4nIGJIQPpH0-22fw4_PfeVluLzBIOL1GwYVDYtZZbaO4N8a8F2zuDstBGv21O7jgLEbZ31tHN3Ug43fI92carpszDXcnavrFtNcsCA"

// Cấu hình axios instance
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

// Xử lý interceptor cho request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý interceptor cho response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi response
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401 Unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

let login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/v1/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * 
 * @param {number} page 
 * @param {number} size 
 * @param {boolean} sort 
 * @param {string} search 
 * @param {boolean} deleted 
 * @returns {Promise<Object>}
 */
let getStaffs = async (page = 0, size = 20, sort = false, search = null, deleted = false) => {
  try {
    const response = await apiClient.get('/api/v1/staff');
    if (response.status !== 200) {
      console.error('Error fetching data:', response.statusText);
      throw new Error('Failed to fetch data');
    }
    console.log('Data fetched successfully:', response.data);
    return response.data.data.content;

  } catch (error) {
    throw error.response.data;
  }
};

/**
 * @param {string} id 
 */
let getStaffById = async (id) => {
  try {
    const response = await apiClient.get(`/api/v1/staffs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

let createStaff = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/staff/create', data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

let updateStaff = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/staff/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

let deleteStaffs = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/staff/delete`, ids);
    console.log('Response:', response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

let getStudents = async (page = 0, size = 20, sort = true, search = null, deleted = false) => {
  try {
    const response = await apiClient.get('/api/v1/students', {
      params: { page, size, sort, search, deleted }
    });
    console.log('Response:', response.data);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
}

let createStudent = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/student/create', data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

export {
  apiClient, getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs, login,
  getStudents, createStudent
};
