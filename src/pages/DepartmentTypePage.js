import { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Tooltip, Button, Input } from 'antd';
import { getAllDepartmentTypes, createDepartmentType, updateDepartmentType, deleteDepartmentTypes } from '../services/api';

const DepartmentTypePage = () => {
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: null, desc: null });
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
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
    "footer": null,
    "isCreateForm": false,
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const fetchData = async () => {
    setLoading(true);
    const response = await getAllDepartmentTypes();
    setLoading(false);
    if (response.status === 200) {
      setData(response.data.data)
      // setTableParams({
      //   ...params,
      //   pagination: {
      //     ...params.pagination,
      //     total: response.data.total_record, current: response.data.current_page + 1,
      //   },
      // })
    } else {
      handleSetNotification(
        "error", response.data.message || "Đã có lỗi khi tải dữ liệu. Vui lòng thử lại sau.", null
      )
    }
  };

  useEffect(() => { fetchData(); }, []);

  const create = async (values) => {
    setLoading(true);
    const response = await createDepartmentType(values);
    if (response.status === 201 || response.status === 200) {
      form.resetFields();
      setShowModalCreate(false);
      handleSetNotification("success", "Thành công", "Thêm thông tin loại đơn vị mới thành công.");
      fetchData();
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra khi thêm thông tin loại đơn vị mới. Vui lòng thử lại sau.');
    }
    setLoading(false)
  };

  const update = async (values) => {
    setLoading(true);
    const response = await updateDepartmentType(values.id, { name: values.name });
    if (response.status === 200) {
      setShowModalUpdate(false);
      handleSetNotification('success', 'Thành công', 'Cập nhật thông tin loại đơn vị thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const deleteDepartmentType = async (record) => {
    setLoading(true);
    setShowModalDelete(false);
    const response = await deleteDepartmentTypes({ ids: [record.id] });
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Xóa thông tin loại đơn vị thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const deleteMultipleDepartmentTypes = async () => {
    setLoading(true);
    const ids = selectedRows.map(row => row.id);
    setShowModalDelete(false);
    const response = await deleteDepartmentTypes({ ids: ids });
    if (response.status === 200) {
      setSelectedRows([]);
      handleSetNotification('success', 'Thành công', `Đã xóa thành công ${ids.length} loại đơn vị` )
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
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
          <p>Bạn có chắc chắn muốn xóa thông tin loại phòng ban <strong>{record.name}</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>
          Hủy
        </Button>,
        <Button type="delete"
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
        <p>Bạn có chắc chắn muốn xóa <strong>{selectedRows.length}</strong> loại đơn vị đã chọn không?</p>
      ),
      footer: [
        <Button key="cancel" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary" danger
          onClick={deleteMultipleDepartmentTypes}
        >Xóa</Button>,
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
      initialValues={{ name: '', }}
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
            onClick={(e) => { e.stopPropagation(); handleEdit(record) }}
            type="link"
            style={{ color: 'blue' }}
          />
        </Tooltip>
        <Tooltip title="Xóa">
          <Button
            icon={<DeleteOutlined />}
            onClick={(e) => { e.stopPropagation(); handleDelete(record) }}
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
        title={'Loại phòng ban'}
        columns={columns}
        loading={loading}
        data={data}
        tableParams={tableParams}
        onCreate={handleCreate}
        onDeleteMultiple={handleDeleteMultiple}
        setSelectedRows={setSelectedRows}
        fetchData={fetchData}
        onRow={handleEdit}
        onExport={() => {}}
        rowKey="id" />
    </>
  );
};

export default DepartmentTypePage; 