import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getDepartmentTypes } from '../services/api';
import authService from '../services/authService';

const DepartmentTypeSelect = ({ value, onChange, placeholder = "Chọn loại đơn vị", mode = "single" }) => {
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartmentTypes = async () => {
      setLoading(true);
      const response = await getDepartmentTypes();
      if (response.status === 200) {
        const formattedTypes = response.data.data.map(type => ({
          label: type.name,
          value: type.id
        }));
        setDepartmentTypes(formattedTypes);
      } else if (response.status === 401) {
        authService.refreshToken();
        fetchDepartmentTypes()
      }
      setLoading(false);
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