import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
//import { Button, Form, Space, Tooltip, Input, Upload, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Tooltip, Button, Input, Upload, Select } from 'antd';
import { getDepartments, createDepartments, updateDepartments,deleteDepartments, getChildDepartments } from '../services/api';
import DepartmentSelect from '../components/DepartmentSelect';
import DepartmentTypeSelect from '../components/DepartmentTypeSelect';
import SearchInput from '../components/SearchInput';

const DepartmentPage = () => {
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
    "formUpload": null,
    "footer": null
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [parentDepartmentId, setParentDepartmentId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [showModalView, setShowModalView] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchData = async (params = tableParams) => {
    setLoading(true);
    try {
      const result = await getDepartments(
        params.pagination.current - 1,
        params.pagination.pageSize,
        searchText,
        false,
        null
      );
      console.log("department result", result);
      setData(result.data);
      setTableParams({
        ...params,
        pagination: {
          ...params.pagination,
          total: result.total,
          current: result.currentPage + 1,
        },
      });
    } catch (error) {
      console.error('Lỗi khi gọi getDepartments', error);
      setNotification({
        type: 'error',
        message: 'Lỗi tải dữ liệu',
        desc: error.message || 'Có lỗi xảy ra khi lấy dữ liệu',
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const create = async (values) => {
		setLoading(true);
		try {
			const result = await createDepartments(values);
			if (result.status === 201 || result.status === 200) {
				fetchData();
				setNotification({ type: 'success', message: 'Thành công', desc: 'Thêm mới thành công' });
				setShowModalCreate(false);
        form.resetFields(); // Reset form after successful creation
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
	}
  

  useEffect(() => { fetchData(); }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    fetchData({
      pagination,
      filters,
      ...sorter,
    });
  };

  const fillData = (record) => {
    setParentDepartmentId(record.parentDepartmentId);
    setTypeId(record.typeId);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      address: record.address,
      phone: record.phone,
      email: record.email,
      parentDepartmentId: record.parentDepartmentId,
      typeId: record.typeId,
    });
    }

    const update = async (values) => {
      setLoading(true);
      try {
        const result = await updateDepartments(values.code, values);
        if (result.status === 200) {
          fetchData();
          setNotification({ type: 'success', message: 'Thành công', desc: 'Cập nhật thông tin thành công' });
          setShowModalUpdate(false);
        } else {
          setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
        }
      } catch (error) {
        setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể cập nhật thông tin của phòng ban này' });
      } finally {
        setLoading(false);
        setTimeout(() => {
          setNotification({ type: null, message: null, desc: null });
        }, 3000);
      }
    }
    

    const deleteDepartment = async (record) => {
      setLoading(true);
		try {
			const result = await deleteDepartments({ ids: [record.code] });
			if (result.status === 200) {
				fetchData();
				setNotification({ type: 'success', message: 'Thành công', desc: 'Xóa thành công' });
			} else {
				setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
			}
		} catch (error) {
        setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể xóa phòng ban này' });
		} finally {
			setLoading(false);
			setShowModalDelete(false);
			setTimeout(() => {
				setNotification({ type: null, message: null, desc: null });
			}, 3000);
		}
    };
    





    const deleteMultipleDepartments = async () => {
      setLoading(true);
		try {
			const ids = selectedRows.map(row => row.code);
			const result = await deleteDepartments({ ids: ids });
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
    


  const handleView = (record) => {
    
    // Fetch child departments
    const fetchChildDepartments = async () => {
      try {
        const result = await getChildDepartments(record.code);
        return result.data || [];
        console.log("result child", result);
      } catch (error) {
        console.error('Error fetching child departments:', error);
        return [];
      }
    };
    
    // Show loading state first
    setShowModalView(true);
    setModal({
      title: `Chi tiết phòng ban`,
      formContent: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={record.logoBase64 ? `data:image/png;base64,${record.logoBase64}` : `/avatar.png`}
              alt="logo"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{record.name}</h3>
              <p className="text-gray-600">Mã phòng ban: {record.code}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Email:</p>
              <p>{record.email || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="font-medium">Số điện thoại:</p>
              <p>{record.phone || "Chưa cập nhật"}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium">Địa chỉ:</p>
              <p>{record.address || "Chưa cập nhật"}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium">Phòng ban cha:</p>
              <p>{record.parentDepartmentId ? "Có" : "Không có"}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium">Đơn vị trực thuộc:</p>
              <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                <ChildDepartmentsList parentId={record.code} />
              </div>
            </div>
          </div>
        </div>
      ),
      footer: [
        <Button key="close" onClick={() => setShowModalView(false)}>
          Đóng
        </Button>
      ],
      onCancel: () => setShowModalView(false),
      onClose: () => setShowModalView(false)
    });
  };

  // Component to display child departments
  const ChildDepartmentsList = ({ parentId }) => {
    const [childDepartments, setChildDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadChildDepartments = async () => {
        setLoading(true);
        try {
          const result = await getChildDepartments(parentId);
          setChildDepartments(result.data || []);
        } catch (error) {
          console.error('Error loading child departments:', error);
        } finally {
          setLoading(false);
        }
      };

      loadChildDepartments();
    }, [parentId]);

    if (loading) {
      return <div className="text-center py-4">Đang tải...</div>;
    }

    if (childDepartments.length === 0) {
      return <div className="text-center py-4 text-gray-500">Không có đơn vị trực thuộc</div>;
    }

    return (
      <ul className="divide-y divide-gray-200">
        {childDepartments.map((dept) => (
          <li key={dept.code} className="py-2">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-gray-500">{dept.code}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const columns = [{
	title: '',
	dataIndex: 'photoBase64',
	key: 'avatar',
	render: base64 => (
		<img
			src={base64 ? `data:image/png;base64,${base64}` : `/avatar.png`}
			alt="avatar"
			style={{ borderRadius: '50%', width: 28, height: 28, objectFit: 'cover' }}
		/>
	),
	width: 80,
},
{
	title: 'Tên phòng ban',
	dataIndex: 'name',
	sorter: true,
	render: name => `${name}`,
	width: '20%',
},
{
	title: 'Địa chỉ',
	dataIndex: 'address',
	render: address => `${address || 'Chưa cập nhật'}`,
	width: '25%',
},
{
	title: 'Số điện thoại',
	dataIndex: 'phone',
	render: phone => `${phone || 'Chưa cập nhật'}`,
	width: '15%',
},
{
	title: 'Email',
	dataIndex: 'email',
	render: email => `${email || 'Chưa cập nhật'}`,
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

  const getFormContent = (onFinish) => (
    <Form form={form} layout="vertical" onFinish={onFinish}
      initialValues={{
        code: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        parentDepartmentId: null,
        typeId: null,
      }}
    >
      <Form.Item label="Mã phòng ban" name="code"
        rules={[{ required: true, message: 'Vui lòng nhập mã phòng ban!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Tên phòng ban" name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
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

      <Form.Item label="Phòng ban cha" name="parentDepartmentId">
        <DepartmentSelect value={parentDepartmentId} onChange={setParentDepartmentId}/>
      </Form.Item>

      <Form.Item label="Loại phòng ban" name="typeId"
        rules={[{ required: true, message: 'Vui lòng chọn loại phòng ban!' }]}
      >
        <DepartmentTypeSelect value={typeId} onChange={setTypeId}/>
      </Form.Item>

      <Form.Item label="Ảnh" name="photo" valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Upload action="/upload.do" listType="picture" maxCount={1} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>
    </Form>
  )

  const handleCreate = () => {
    setShowModalCreate(true);
    form.resetFields(); // Reset form before showing modal
    setModal({
      ...modal,
      title: "Thêm mới phòng ban",
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
  }

  const handleEdit = (record) => {
    setShowModalUpdate(true);
    fillData(record);
    setModal({
      ...modal,
      title: `Cập nhật thông tin phòng ban`,
      form: form,
      formContent: getFormContent(update),
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
  }

  const handleDelete = async (record) => {
    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin phòng ban`,
      formContent: (
        <div>
          <p>Bạn có chắc chắn muốn xóa thông tin phòng ban này không?</p>
          <p><strong>{record.name}</strong></p>
        </div>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>
          Hủy
        </Button>,
        <Button type="primary"
          className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
          onClick={() => deleteDepartment(record)}
        >Xóa</Button>
      ],
      onOk: () => deleteDepartment(record),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    });
  }

  const handleDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      setNotification({ type: 'warning', message: 'Cảnh báo', desc: 'Vui lòng chọn ít nhất một bản ghi để xóa!' });
      return;
    }

    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin phòng ban`,
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
          onClick={deleteMultipleDepartments}
        >Xóa
        </Button>,
      ],
      onOk: () => deleteMultipleDepartments(),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1, // Reset to first page when searching
      },
    });
    fetchData({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Tìm kiếm phòng ban..."
          loading={loading}
        />
      </div>
      <Notification noti={notification} />
      <Modal showModal={showModalCreate} modal={modal} />
      <Modal showModal={showModalDelete} modal={modal} />
      <Modal showModal={showModalUpdate} modal={modal} />
      <Modal showModal={showModalView} modal={modal} />
      <Table
        title={'phòng ban'}
        columns={columns}
        loading={loading}
        data={data}
        tableParams={tableParams}
        onCreate={handleCreate}
        onDeleteMultiple={handleDeleteMultiple}
        setSelectedRows={setSelectedRows}
        fetchData={fetchData}
        onChange={handleTableChange}
        rowKey="code" />
    </>
  );
};

export default DepartmentPage;