import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getDepartmentTypes } from '../services/api';

const DepartmentTypeSelect = ({ value, onChange, placeholder = "Chọn loại đơn vị", mode = "single" }) => {
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartmentTypes = async () => {
      setLoading(true);
      try {
        const result = await getDepartmentTypes();
        const formattedTypes = result.data.map(type => ({
          label: type.name,
          value: type.id
        }));
        setDepartmentTypes(formattedTypes);
      } catch (error) {
        console.error('Error fetching department types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentTypes();
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={departmentTypes}
      loading={loading}
      mode={mode === "multiple" ? "multiple" : undefined}
    />
  );
};

export default DepartmentTypeSelect; 