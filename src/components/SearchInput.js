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
    debouncedSearch(value || "");
  };

  return (
    <Search
      placeholder={placeholder}
      onChange={(e) => handleSearch(e.target.value)}
      style={{ width: 250 }}
      loading={loading}
      prefix={<SearchOutlined />}
      allowClear
      onSearch={handleSearch} // Add onSearch handler for when user hits enter or clicks search button
    />
  );
};

export default SearchInput; 