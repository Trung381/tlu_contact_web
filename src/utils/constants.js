// Các hằng số sử dụng trong ứng dụng

// Trạng thái API
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Các loại thông báo
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Kích thước phân trang
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

// Định dạng thời gian
export const DATE_FORMATS = {
  FULL_DATE: 'DD/MM/YYYY HH:mm:ss',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm:ss'
};

// Các quyền và vai trò người dùng
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
  GUEST: 'guest'
};

// Các key lưu trữ trong localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
}; 