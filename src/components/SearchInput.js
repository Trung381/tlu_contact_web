import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

const { Search } = Input;

const SearchInput = ({ onSearch, placeholder = "Tìm kiếm...", loading = false }) => {
  // Debounce search function to avoid too many API calls
  const debouncedSearch = debounce((value) => {
    onSearch(value);
  }, 500); // Wait 500ms after last change before calling API

  const handleSearch = (value) => {
    // Call search even when value is empty string
    debouncedSearch(value);
  };

  return (
    <>
      <Search
        placeholder="Tìm mã số, tên, số điện thoại, email..."
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={handleSearch}
        loading={loading}
        allowClear
        enterButton
        style={{
          width: '100vw',
          minWidth: '200px',
          maxWidth: '350px',
          backgroundColor: '#1677ff',
          borderRadius: '6px',
        }}
      />
    </>
  );
};

export default SearchInput; 