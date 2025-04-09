// Các hàm xử lý gọi API
import axios from 'axios';

// const baseURL = process.env.BASE_URL || 'http://localhost:8080';
const baseURL = 'https://tlu-contact-1-0-0.onrender.com'; // Địa chỉ API của bạn
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTE1MjM1YTZjNjE0NTRlZmRlZGM0NWE3N2U0MzUxMzY3ZWViZTAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGx1LWNvbnRhY3QtYzBjNjkiLCJhdWQiOiJ0bHUtY29udGFjdC1jMGM2OSIsImF1dGhfdGltZSI6MTc0NDIwNjQzOCwidXNlcl9pZCI6ImprQTJFWkZXYjJXNGsweDNEQVlWVmZhUDc2TjIiLCJzdWIiOiJqa0EyRVpGV2IyVzRrMHgzREFZVlZmYVA3Nk4yIiwiaWF0IjoxNzQ0MjA2NDM4LCJleHAiOjE3NDQyMTAwMzgsImVtYWlsIjoiMjI1MTE3MjM2N0BlLnRsdS5lZHUudm4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyIyMjUxMTcyMzY3QGUudGx1LmVkdS52biJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.VdiE0pihV7iuZ2eI8F5W-4t7WS3n0Uie_oHgNzzTHFWFPyMdeDqo2Dv5-GdgqLT558J1zSzKj4Kb6eVCDhG1o6hdc05Q1gBlS078HScIeSnnWRzm-bkZcJHlwi9n9Y14P_Of1YpzJtHl3FTd2rnm91oFDHnl3RGJN6qObLwcI07vVCj9xi5VFRRYjUIZ0uCrRKxv7x-7EIvBK1s1iK9f8vAS3E-20m0ub-0AhwLVVgdlfRHObwtySKQRUZDoq8q1y-Gm38XrM7iv1wf-CVv9OqwtvVbbHBl99B7o6vQVtznj0-05Mlwp81d8F8IgxpDOzRBUwfC4gvOKXv4487zs0Q"

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

let updateStudent = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/student/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

let deleteStudents = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/student/delete`, ids);
    console.log('Response:', response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
}


let getDepartments = async (page = 0, size = 20, search = null, deleted = false) => {
  try {
    const response = await apiClient.get('/api/v1/departments', {
      params: { page, size, search, deleted },
    });

    const resData = response.data?.data || [];
    const total = response.data?.total || resData.length;

    return {
      content: resData,
      total,
    };
  } catch (error) {
    console.error("getDepartments error:", error);
    throw error.response?.data || { message: 'Server error' };
  }
};





let createDepartments = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/departments/create', data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}


let updateDepartments = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/departments/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

let deleteDepartments = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/departments/delete`, ids);
    console.log('Response:', response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

export {
  apiClient, getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs, login,
  getStudents, createStudent, updateStudent, deleteStudents, getDepartments, createDepartments, updateDepartments,deleteDepartments
};
