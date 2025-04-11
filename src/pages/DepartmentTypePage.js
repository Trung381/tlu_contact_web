import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Tooltip, Button, Input } from 'antd';
import { getAllDepartmentTypes, createDepartmentType, updateDepartmentType, deleteDepartmentTypes } from '../services/api';

const DepartmentTypePage = () => {
  const [showModalCreate, setShowModalCreate] = useState(false);
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
    "footer": null
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllDepartmentTypes();
      setData(result.data);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: result.data.length,
        },
      });
    } catch (error) {
      console.error('Error fetching department types:', error);
      setNotification({
        type: 'error',
        message: 'Lỗi tải dữ liệu',
        desc: error.message || 'Có lỗi xảy ra khi lấy dữ liệu',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const create = async (values) => {
    setLoading(true);
    try {
      const result = await createDepartmentType(values);
      if (result.code === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Thêm mới thành công' });
        setShowModalCreate(false);
        form.resetFields();
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Thất bại!', desc: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification({ type: null, message: null, desc: null });
      }, 3000);
    }
  };

  const update = async (values) => {
    setLoading(true);
    try {
      console.log('Updating department type with values:', values);
      const result = await updateDepartmentType(values.id, { name: values.name });
      if (result.code === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Cập nhật thông tin thành công' });
        setShowModalUpdate(false);
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
      }
    } catch (error) {
      console.error('Error updating department type:', error);
      setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể cập nhật thông tin của loại phòng ban này' });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification({ type: null, message: null, desc: null });
      }, 3000);
    }
  };

  const deleteDepartmentType = async (record) => {
    setLoading(true);
    try {
      const result = await deleteDepartmentTypes({ ids: [record.id] });
      if (result.code === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Xóa thành công' });
      } else {
        setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể xóa loại phòng ban này' });
    } finally {
      setLoading(false);
      setShowModalDelete(false);
      setTimeout(() => {
        setNotification({ type: null, message: null, desc: null });
      }, 3000);
    }
  };

  const deleteMultipleDepartmentTypes = async () => {
    setLoading(true);
    try {
      const ids = selectedRows.map(row => row.id);
      const result = await deleteDepartmentTypes({ ids: ids });
      if (result.code === 200) {
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

  const handleCreate = () => {
    setShowModalCreate(true);
    form.resetFields();
    setModal({
      ...modal,
      title: "Thêm mới loại phòng ban",
      onOk: () => form.submit(),
      onCancel: () => {
        setShowModalCreate(false);
        form.resetFields();
      },
      onClose: () => {
        setShowModalCreate(false);
        form.resetFields();
      },
      form: form,
      formContent: getFormContent(create),
      footer: [
        <Button key="cancle" onClick={() => {
          setShowModalCreate(false);
          form.resetFields();
        }}>Hủy</Button>,
        <Button key="submit" loading={loading} onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Ok
        </Button>
      ]
    });
  };

  const handleEdit = (record) => {
    setShowModalUpdate(true);
    fillData(record);
    setModal({
      ...modal,
      title: `Cập nhật thông tin loại phòng ban`,
      form: form,
      formContent: getFormContent((values) => {
        console.log('Form submitted with values:', values);
        console.log('Record ID:', record.id);
        update({ ...values, id: record.id });
      }),
      footer: [
        <Button key="cancle" onClick={() => setShowModalUpdate(false)}>Hủy</Button>,
        <Button key="submit" loading={loading} onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Lưu
        </Button>
      ],
      onOk: () => form.submit(),
      onCancel: () => setShowModalUpdate(false),
      onClose: () => setShowModalUpdate(false),
    });
  };

  const handleDelete = async (record) => {
    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin loại phòng ban`,
      formContent: (
        <div>
          <p>Bạn có chắc chắn muốn xóa thông tin loại phòng ban này không?</p>
          <p><strong>{record.name}</strong></p>
        </div>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>
          Hủy
        </Button>,
        <Button type="primary"
          className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
          onClick={() => deleteDepartmentType(record)}
        >Xóa</Button>
      ],
      onOk: () => deleteDepartmentType(record),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      setNotification({ type: 'warning', message: 'Cảnh báo', desc: 'Vui lòng chọn ít nhất một bản ghi để xóa!' });
      return;
    }

    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin loại phòng ban`,
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
          onClick={deleteMultipleDepartmentTypes}
        >Xóa
        </Button>,
      ],
      onOk: () => deleteMultipleDepartmentTypes(),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    });
  };

  const fillData = (record) => {
    form.setFieldsValue({
      id: record.id,
      name: record.name,
    });
  };

  const getFormContent = (onFinish) => (
    <Form form={form} layout="vertical" onFinish={onFinish}
      initialValues={{
        name: '',
      }}
    >
      <Form.Item label="Tên loại phòng ban" name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên loại phòng ban!' }]}
      ><Input />
      </Form.Item>
    </Form>
  );

  const columns = [{
    title: 'Tên loại phòng ban',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name}`,
    width: '80%',
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
      </div>
    ),
  }];

  return (
    <>
      <Notification noti={notification} />
      <Modal showModal={showModalCreate} modal={modal} />
      <Modal showModal={showModalDelete} modal={modal} />
      <Modal showModal={showModalUpdate} modal={modal} />
      <Table
        title={'loại phòng ban'}
        columns={columns}
        loading={loading}
        data={data}
        tableParams={tableParams}
        onCreate={handleCreate}
        onDeleteMultiple={handleDeleteMultiple}
        setSelectedRows={setSelectedRows}
        fetchData={fetchData}
        rowKey="id" />
    </>
  );
};

export default DepartmentTypePage; 