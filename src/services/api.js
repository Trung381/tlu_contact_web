// Các hàm xử lý gọi API
import axios from 'axios';
import authService from './authService';

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
    const idToken = sessionStorage.getItem('idToken');
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
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; //cho phép retry

      try {
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          const newToken = sessionStorage.getItem('idToken');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest)
        } else {
          authService.logout();
          return;
        }
      } catch (error) {
        authService.logout();
        return;
      }
    }
    return Promise.reject(error);
  }
);

let login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/v1/auth/login', { email, password });
    // const response = await apiClient.post('/api/v1/auth/admin/login', { email, password });
    return response;
  } catch (error) {
    return error.response;
  }
};

let getStaffs = async (page = 0, size = 20, sort = true, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/staff', {
      params: { page, size, sort, search, deleted, filterId }
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

let getStaffById = async (id) => {
  try {
    const response = await apiClient.get(`/api/v1/staffs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
}

let createStaff = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/staff/create', data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let updateStaff = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/staff/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let deleteStaffs = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/staff/delete`, ids);
    return response;
  } catch (error) {
    throw error.response;
  }
}

let importStaffs = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/staff/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let exportStaffs = async (page = 0, size = 20, sort = true, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/staff/export-excel', {
      params: { page, size, sort, search, deleted, filterId },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let getStudents = async (page = 0, size = 20, sort = true, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/students', {
      params: { page, size, sort, search, deleted, filterId }
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

let createStudent = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/student/create', data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let updateStudent = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/student/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let deleteStudents = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/student/delete`, ids);
    return response;
  } catch (error) {
    throw error.response;
  }
}

let importStudents = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/student/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let exportStudents = async (page = 0, size = 20, sort = true, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/students/export-excel', {
      params: { page, size, sort, search, deleted, filterId },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let getDepartments = async (page = 0, size = 20, sort = true, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/departments', {
      params: { page, size, sort, search, deleted, filterId },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

let getDepartmentById = async (id) => {
  try {
    const response = await apiClient.get(`/api/v1/department/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
}

let createDepartments = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/department/create', data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let updateDepartments = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/department/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let deleteDepartments = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/department/delete`, ids);
    return response;
  } catch (error) {
    throw error.response;
  }
}

let importDepartments = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/department/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let exportDepartments = async (page = 0, size = 20, sort = true, search = null, deleted = false, filterId = null) => {
  try {
    const response = await apiClient.get('/api/v1/departments/export-excel', {
      params: { page, size, sort, search, deleted, filterId },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let getDepartmentTypes = async () => {
  try {
    const response = await apiClient.get('/api/v1/department-types');
    return response;
  } catch (error) {
    return error.response;
  }
};

// Get child departments by parent ID
export const getChildDepartments = async (parentId) => {
  try {
    const response = await apiClient.get(`/api/v1/department-types/filter`, {
      params: { parentId }
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

// Department Type APIs
export const getAllDepartmentTypes = async () => {
  try {
    const response = await apiClient.get('/api/v1/department-types');
    return response;
  } catch (error) {
    return error.response;
  }
};

export const createDepartmentType = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/department-types/create', data);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateDepartmentType = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/department-types/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteDepartmentTypes = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/department-types/delete', data);
    return response;
  } catch (error) {
    return error.response;
  }
};

let getUsers = async (page = 0, size = 20, sort = true, search = null, deleted = false) => {
  try {
    const response = await apiClient.get('/api/v1/users', {
      params: { page, size, sort, search, deleted },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

let updateUser = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/v1/users/update/${id}`, data);
    return response;
  } catch (error) {
    return error.response;
  }
}

let deleteUsers = async (ids) => {
  try {
    const response = await apiClient.post(`/api/v1/users/delete`, ids);
    return response;
  } catch (error) {
    throw error.response;
  }
}

let exportUsers = async (page = 0, size = 20, sort = true, search = null, deleted = false) => {
  try {
    const response = await apiClient.get('/api/v1/users/export-excel', {
      params: { page, size, sort, search, deleted },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

let resetUserPassword = async (uid, email) => {
  try {
    const response = await apiClient.post('/api/v1/users/reset-password', {
      uid, email
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
}

let uploadPhoto = async (file, type) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    let endpoint = null;
    switch (type) {
      case 'department': endpoint = '/api/v1/department/avatar/upload'; break;
      case 'staff': endpoint = '/api/v1/staff/avatar/upload'; break;
      case 'student': endpoint = '/api/v1/student/avatar/upload'; break;
    }
    if (!endpoint) {
      return {status: 404};
    }
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

export {
  apiClient, getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs, importStaffs, exportStaffs, login,
  getStudents, createStudent, updateStudent, deleteStudents, importStudents, exportStudents,
  getDepartments, createDepartments, updateDepartments, deleteDepartments, importDepartments, exportDepartments, getDepartmentById,
  getDepartmentTypes,
  getUsers, updateUser, deleteUsers, exportUsers, resetUserPassword,
  uploadPhoto
};
