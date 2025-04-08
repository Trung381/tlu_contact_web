import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { Form, Tooltip, Button, Input, Upload, Select } from 'antd';
import { getStudents, createStudent } from '../services/api';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

const StudentPage = () => {
	const [showModalCreate, setShowModalCreate] = useState(false);
	const [loading, setLoading] = useState(false);
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
		const result = await getStudents();
		setData(result)
		setLoading(false);
		setTableParams({
			pagination: {
				...tableParams.pagination,
				total: result.length,
			},
		});
	};

	const create = async (values) => {
		setLoading(true);
		try {
			const result = await createStudent(values);
			if (result.status === 201 || result.status === 200) {
        fetchData();
        setNotification({ type: 'success', message: 'Thành công', desc: 'Thêm mới thành công' });
        setShowModalCreate(false);
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

	const handleEdit = (record) => {
	}

	const handleDelete = (record) => {
	}

	const handleView = (record) => {
	}

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
		title: 'Địa chỉ',
		dataIndex: 'address',
		render: address => `${address || ""}`,
		width: '15%',
	},
	{
		title: 'Đơn vị',
		dataIndex: 'department',
		render: department => `${department?.name}`,
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
				studentId: '',
				fullName: '',
				address: '',
				phone: '',
				email: '',
				department: '',
			}}
		>
			<Form.Item label="Mã sinh viên" name="studentId"
				rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
			><Input />
			</Form.Item>

			<Form.Item label="Họ và tên" name="fullName"
				rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
			><Input />
			</Form.Item>

			<Form.Item label="Địa chỉ" name="address"><Input /></Form.Item>

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
				<Select placeholder="Chọn đơn vị"
					options={[
						{ label: 'Phòng IT', value: 'IT' },
						{ label: 'Phòng HR', value: 'HR' },
						{ label: 'Phòng Marketing', value: 'Marketing' },
					]}
				/>
			</Form.Item>
		</Form>
	)

	const handleCreate = () => {
		setShowModalCreate(true);
		setModal({
			...modal,
			title: "Thêm mới sinh viên",
			onOk: () => form.submit(),
			onCancel: () => setShowModalCreate(false),
			onClose: () => setShowModalCreate(false),
			form: form,
			formContent: getFormContent(create),
			footer: [
				<Button key="cancle" onClick={() => setShowModalCreate(false)}>Hủy</Button>,
				<Button key="submit" loading={loading} onClick={() => form.submit()}
					className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
				>Ok
				</Button>
			]
		});
	}

	const handleDeleteMultiple = () => {

	}

	return (
		<>
			<Notification noti={notification} />
			<Modal showModal={showModalCreate} modal={modal} />
			<Modal showModal={showModalDelete} modal={modal} />
			<Modal showModal={showModalUpdate} modal={modal} />
			<Table
				title={'sinh viên'}
				columns={columns}
				loading={loading}
				data={data}
				tableParams={tableParams}
				onCreate={handleCreate}
				onDeleteMultiple={handleDeleteMultiple}
				setSelectedRows={setSelectedRows}
				fetchData={fetchData} />
		</>
	);
};

export default StudentPage;