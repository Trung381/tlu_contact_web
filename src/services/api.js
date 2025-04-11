// Các hàm xử lý gọi API
import axios from 'axios';

// const baseURL = process.env.BASE_URL || 'http://localhost:8080';
const baseURL = 'https://tlu-contact-1-0-0.onrender.com';

// Cấu hình axios instance
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Xử lý interceptor cho request
apiClient.interceptors.request.use(
  (config) => {
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
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
      localStorage.removeItem('idToken');
      localStorage.removeItem('localId');
      localStorage.removeItem('email');
      localStorage.removeItem('refreshToken');
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
    return {
      data: response.data.data,
      total: response.data.total_record,
      currentPage: response.data.current_page
    };
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


let getDepartments = async (page = 0, size = 20, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/departments', {
      params: { page, size, search, deleted, filterId },
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
    const response = await apiClient.post('/api/v1/department/create', data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}


let updateDepartments = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/department/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

let deleteDepartments = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/department/delete`, ids);
    console.log('Response:', response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

let getDepartmentTypes = async () => {
  try {
    const response = await apiClient.get('/api/v1/department-types');
    return response.data;
  } catch (error) {
    console.error("getDepartmentTypes error:", error);
    throw error.response?.data || { message: 'Server error' };
  }
};

// Get child departments by parent ID
export const getChildDepartments = async (parentId) => {
  try {
    const response = await apiClient.get(`/api/v1/department-types/filter`, {
      params: { parentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching child departments:', error);
    throw error;
  }
};

export {
  apiClient, getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs, login,
  getStudents, createStudent, updateStudent, deleteStudents, getDepartments, createDepartments, updateDepartments, deleteDepartments,
  getDepartmentTypes
};
