import React, { useState, useEffect } from "react";
import { getStaffs, getStaffById, createStaff, updateStaff, deleteStaffs } from "../services/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import { Button, Form, Space, Tooltip, Input, Upload, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

const StaffPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: null, desc: null });
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [form] = Form.useForm();
  const [modal, setModal] = useState({
    "title": null,
    "onOk": null,
    "onCancel": null,
    "onClose": null,
    "form": null,
    "formContent": null,
    "formUpload": null,
    "footer": null
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getStaffs();
    setData(result)
    setLoading(false);
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: result.length,
      },
    });
  };

  useEffect(() => { fetchData(); }, []);

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
          src={base64 ? `data:image/png;base64,${base64}` : `/avatar.png`}
          alt="avatar"
          style={{ borderRadius: '50%', width: 28, height: 28 }}
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

  const create = async (values) => {
    setCreateLoading(true);
    try {
      const result = await createStaff(values);
      if (result.status === 201 || result.status === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Thêm mới thành công' });
        setShowModal(false);
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Thất bại', desc: 'Có lỗi xảy ra khi thêm mới' });
    } finally {
      setCreateLoading(false);
      setTimeout(() => {
        setNotification({ type: null, message: null, desc: null });
      }, 3000);
    }
  }

  const handleCreate = () => {
    setShowModal(true);
    setModal({
      ...modal,
      title: `Thêm mới CBGV`,
      form: form,
      formContent: getFormContent(create),
      footer: [
        <Button key="cancle" onClick={() => setShowModal(false)}>Hủy</Button>,
        <Button key="submit" loading={createLoading} onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Ok
        </Button>
      ],
      onOk: () => form.submit(),
      onCancel: () => setShowModal(false),
      onClose: () => setShowModal(false),
    });
  }

  const getFormContent = (onFinish) => (
    <Form form={form} layout="vertical" onFinish={onFinish}
      initialValues={{
        staffId: '',
        fullName: '',
        position: '',
        phone: '',
        email: '',
        departmentIds: [],
      }}
    >
      <Form.Item label="Mã nhân viên" name="staffId"
        rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Họ và tên" name="fullName"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Chức vụ" name="position"
        rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phone"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Email" name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      ><Input />
      </Form.Item>
      <Form.Item label="Ảnh" name="photo" valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Upload action="/upload.do" listType="picture" maxCount={1} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Đơn vị" name="departmentIds"
        rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
      >
        <Select mode="multiple" placeholder="Chọn đơn vị"
          options={[
            { label: 'Phòng IT', value: 'IT' },
            { label: 'Phòng HR', value: 'HR' },
            { label: 'Phòng Marketing', value: 'Marketing' },
          ]}
        />
      </Form.Item>
    </Form>
  )

  const fillData = (record) => {
    form.setFieldsValue({
      staffId: record.staffId,
      fullName: record.fullName,
      position: record.position,
      phone: record.phone,
      email: record.email,
      departmentIds: record.departments?.map(dep => dep.id) || [],
    });
  }

  const deleteStaff = async (record) => {
    setLoading(true);
    try {
      const result = await deleteStaffs({ ids: [record.staffId] });
      if (result.status === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Xóa thành công' });
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể xóa CBGV này' });
    } finally {
      setLoading(false);
      setShowModalDelete(false);
      setTimeout(() => {
        setNotification({ type: null, message: null, desc: null });
      }, 3000);
    }
  };

  const handleDelete = async (record) => {
    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin CBGV`,
      showModal: showModalDelete,
      formContent: (
        <div>
          <p>Bạn có chắc chắn muốn xóa thông tin CBGV này không?</p>
          <p><strong>{record.fullName}</strong></p>
        </div>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>
          Hủy
        </Button>,
        <Button type="primary"
          className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
          onClick={() => deleteStaff(record)}
        >Xóa</Button>
      ],
      onOk: () => deleteStaff(record),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    })
  }

  const handleEdit = (record) => {
    setShowModalUpdate(true);
    fillData(record);
    setModal({
      ...modal,
      title: `Cập nhật thông tin CBGV`,
      form: form,
      formContent: getFormContent(update),
      footer: [
        <Button key="cancle" onClick={() => setShowModalUpdate(false)}>Hủy</Button>,
        <Button key="submit" loading={createLoading} onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Lưu
        </Button>
      ],
      onOk: () => form.submit(),
      onCancel: () => setShowModalUpdate(false),
      onClose: () => setShowModalUpdate(false),
    });
  }

  const update = async (record) => {
    try {
      const result = await updateStaff(record.staffId, record);
      if (result.status === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Cập nhật thông tin thành công' });
        setShowModalUpdate(false);
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể cập nhật thông tin của CBGV này' });
    } finally {
      setTimeout(() => {
        setNotification({ type: null, message: null, desc: null });
      }, 3000);
    }
  }

  const deleteMultipleStaffs = async () => {
    setLoading(true);
    try {
      const ids = selectedRows.map(row => row.staffId);
      const result = await deleteStaffs({ ids: ids });
      if (result.status === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: `Đã xóa ${ids.length} bản ghi thành công` });
        setShowModal(false);
        setSelectedRows([]);
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể xóa các bản ghi đã chọn' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      setNotification({ type: 'warning', message: 'Cảnh báo', desc: 'Vui lòng chọn ít nhất một bản ghi để xóa!' });
      return;
    }

    setModal({
      title: `Xóa thông tin CBGV`,
      formContent: (
        <div>
          <p>Bạn có chắc chắn muốn xóa {selectedRows.length} bản ghi đã chọn không?</p>
        </div>
      ),
      footer: [
        <Button key="cancel" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={deleteMultipleStaffs}
        >Xóa
        </Button>,
      ],
      onCancel: () => setShowModalDelete(false),
    });
    setShowModal(true);
  };

  return (
    <>
      <Notification noti={notification} />
      <Modal showModal={showModal} modal={modal} />
      <Modal showModal={showModalDelete} modal={modal} />
      <Modal showModal={showModalUpdate} modal={modal} />
      <Table
        title={'CBGV'}
        columns={columns}
        loading={loading}
        data={data}
        tableParams={tableParams}
        onCreate={handleCreate}
        onDeleteMultiple={handleDeleteMultiple} 
        setSelectedRows={setSelectedRows}
        fetchData={fetchData}
        rowKey="staffId"/>
    </>
  );
};

export default StaffPage;