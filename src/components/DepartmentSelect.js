import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getDepartments } from '../services/api';

const DepartmentSelect = ({ value, onChange, placeholder = "Chọn đơn vị", mode = "single" }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const result = await getDepartments(0, 100, null, false);
        console.log("Department select data:", result);
        const formattedDepartments = result.data.map(dept => ({
          label: dept.name,
          value: dept.code
        }));
        setDepartments(formattedDepartments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={departments}
      loading={loading}
      mode={mode === "multiple" ? "multiple" : undefined}
    />
  );
};

export default DepartmentSelect; 