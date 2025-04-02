import { useState, useEffect } from 'react';

// Hook để đọc và lưu dữ liệu vào localStorage
function useLocalStorage(key, initialValue) {
  // Khởi tạo state với giá trị từ localStorage hoặc initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy từ localStorage bằng key
      const item = window.localStorage.getItem(key);
      // Parse giá trị lưu trữ hoặc trả về initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Nếu có lỗi, trả về initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Cập nhật localStorage khi state thay đổi
  useEffect(() => {
    try {
      // Lưu state vào localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Xử lý lỗi khi lưu vào localStorage
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage; 