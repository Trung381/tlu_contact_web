import React from "react";

import { getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs } from "../services/api";

import Table from "../components/Table";
import { Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const StaffPage = () => {
  const handleEdit = (record) => {
    console.log("Sửa:", record);
    // Thực hiện logic sửa tại đây
  };

  const handleDelete = (record) => {
    console.log("Xóa:", record);
    // Thực hiện logic xóa tại đây
  };

  const handleView = (record) => {
    console.log("Xem:", record);
    // Thực hiện logic xem chi tiết tại đây
  };

  const columns = [
    {
      title: '',
      dataIndex: 'photoBase64',
      key: 'avatar',
      render: base64 => (
        <img
          src={`data:image/png;base64,${base64}`}
          alt="avatar"
          style={{ borderRadius: '50%', width: 32, height: 32 }}
        />
      ),
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      sorter: true,
      render: name => `${name}`,
      width: '15%',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: phone => `${phone}`,
      width: '12%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: email => `${email}`,
      width: '18%',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      render: position => `${position}`,
      width: '15%',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'departments',
      render: departments => {
        if (!Array.isArray(departments)) return '';
        return departments.map(dep => dep.name).join('\n');
      },
      width: '20%',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            style={{ color: 'blue' }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            type="link"
            style={{ color: 'red' }} 
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            type="link"
            style={{ color: 'green' }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Table columns={columns} getData={getStaffs} />
    </div>
  );
};

export default StaffPage;