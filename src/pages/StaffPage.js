import React, { useState } from "react";

import { getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs } from "../services/api";

import Table from "../components/Table";
import Modal from "../components/Modal";
import Notifycation from "../components/Notifycation";

import { Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const StaffPage = () => {

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifycationType, setNotifycationType] = useState('');
  const [notifycationMsg, setNotifycationMsg] = useState('');
  const [notifycationDesc, setNotifycationDesc] = useState('');

  const handleCreateBtnClick = () => {
    setShowModal(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      setNotifycationType('success');
      setNotifycationMsg('Thành công');
      setNotifycationDesc('Thêm mới thành công');
      console.log('Notifycation state updated');
    }, 3000);
  }

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
        <div style={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="link"
              style={{ color: 'blue' }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              type="link"
              style={{ color: 'red' }}
            />
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              type="link"
              style={{ color: 'green' }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const title = 'CBGV';

  return (
    <>
      <Notifycation
        type={notifycationType}
        message={notifycationMsg}
        desc={notifycationDesc}
      />
      {showModal && (
        <Modal
          title={`Thêm mới ${title}`}
          showModal={showModal}
          onOk={() => handleOk()}
          onCancel={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      )}
      <Table
        title={title}
        columns={columns}
        getData={getStaffs}
        onCreate={handleCreateBtnClick} />
    </>
  );
};

export default StaffPage;