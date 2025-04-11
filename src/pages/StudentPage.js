import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import SearchInput from '../components/SearchInput';
//import { Button, Form, Space, Tooltip, Input, Upload, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Tooltip, Button, Input, Upload, Select } from 'antd';
import { getStudents, createStudent, deleteStudents, updateStudent } from '../services/api';
import DepartmentSelect from '../components/DepartmentSelect';


const StudentPage = () => {
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
	const [showModalView, setShowModalView] = useState(false);
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
	const [searchText, setSearchText] = useState("");

	const fetchData = async (params = tableParams) => {
		setLoading(true);
		try {
			const result = await getStudents(
				params.pagination.current - 1,
				params.pagination.pageSize,
				false,
				searchText,
				false
			);
			console.log("student result", result);
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
			console.error('Lỗi khi gọi getStudents:', error);
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
			// Format the data to match the API structure
			const formattedData = {
				studentId: values.studentId,
				fullName: values.fullName,
				address: values.address,
				phone: values.phone,
				email: values.email,
				userId: values.userId,
				photo: values.photo,
				departmentId: values.department
			};
			
			const result = await createStudent(formattedData);
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
		form.setFieldsValue({
			studentId: record.studentId,
			fullName: record.fullName,
			address: record.address,
			phone: record.phone,
			email: record.email,
			userId: record.userId,
			department: record.department?.code
		});
	}

	const update = async (values) => {
		setLoading(true);
		console.log("Update function called with values:", values);
		try {
			// Format the data to match the API structure
			const formattedData = {
				studentId: values.studentId,
				fullName: values.fullName,
				address: values.address,
				phone: values.phone,
				email: values.email,
				userId: values.userId,
				photo: values.photo,
				departmentId: values.department
			};
			console.log("formattedData student update", formattedData);
			const result = await updateStudent(values.studentId, formattedData);
			console.log("Update result:", result);
			if (result.status === 200) {
				fetchData();
				setNotification({ type: 'success', message: 'Thành công', desc: 'Cập nhật thông tin thành công' });
				setShowModalUpdate(false);
			} else {
				setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
			}
		} catch (error) {
			console.error("Error updating student:", error);
			setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể cập nhật thông tin của sinh viên này' });
		} finally {
			setLoading(false);
			setTimeout(() => {
				setNotification({ type: null, message: null, desc: null });
			}, 3000);
		}
	}

	const deleteStudent = async (record) => {
		setLoading(true);
		try {
			const result = await deleteStudents({ ids: [record.studentId] });
			if (result.status === 200) {
				fetchData();
				setNotification({ type: 'success', message: 'Thành công', desc: 'Xóa thành công' });
			} else {
				setNotification({ type: 'error', message: 'Thất bại', desc: result?.message || null });
			}
		} catch (error) {
			setNotification({ type: 'error', message: 'Thất bại', desc: 'Không thể xóa sinh viên này' });
		} finally {
			setLoading(false);
			setShowModalDelete(false);
			setTimeout(() => {
				setNotification({ type: null, message: null, desc: null });
			}, 3000);
		}
	};

	const deleteMultipleStudents = async () => {
		setLoading(true);
		try {
			const ids = selectedRows.map(row => row.studentId);
			const result = await deleteStudents({ ids: ids });
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
		setShowModalView(true);
		setModal({
			title: `Chi tiết sinh viên`,
			formContent: (
				<div className="space-y-4">
					<div className="flex items-center space-x-4">
						<img
							src={record.photoBase64 ? `data:image/png;base64,${record.photoBase64}` : `/avatar.png`}
							alt="avatar"
							className="w-24 h-24 rounded-full object-cover"
						/>
						<div>
							<h3 className="text-lg font-semibold">{record.fullName}</h3>
							<p className="text-gray-600">Mã sinh viên: {record.studentId}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="font-medium">Email:</p>
							<p>{record.email}</p>
						</div>
						<div>
							<p className="font-medium">Số điện thoại:</p>
							<p>{record.phone}</p>
						</div>
						<div>
							<p className="font-medium">Địa chỉ:</p>
							<p>{record.address || "Chưa cập nhật"}</p>
						</div>
						<div>
							<p className="font-medium">User ID:</p>
							<p>{record.userId || "Chưa cập nhật"}</p>
						</div>
						<div>
							<p className="font-medium">Đơn vị:</p>
							<p>{record.department?.name || "Chưa cập nhật"}</p>
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

	const getFormContent = (onFinish) => {
		return (
			<Form form={form} layout="vertical" onFinish={(values) => {
				onFinish(values);
			}}
				initialValues={{
					studentId: '',
					fullName: '',
					address: '',
					phone: '',
					email: '',
					userId: '',
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

				<Form.Item label="User ID" name="userId">
					<Input />
				</Form.Item>

				<Form.Item label="Ảnh" name="photo" valuePropName="fileList"
					getValueFromEvent={(e) => e?.fileList}
				>
					<Upload action="/upload.do" listType="picture" maxCount={1} showUploadList={false}>
						<Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
					</Upload>
				</Form.Item>

				<Form.Item label="Đơn vị" name="department"
					rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
				>
					<DepartmentSelect />
				</Form.Item>
			</Form>
		);
	}

	const handleCreate = () => {
		form.resetFields();
		setShowModalCreate(true);
		setModal({
			...modal,
			title: "Thêm mới sinh viên",
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
		
		// Create a wrapper function to ensure update is called with the form values
		const handleUpdate = (values) => {
			console.log("handleUpdate called with values:", values);
			update(values);
		};
		
		setModal({
			...modal,
			title: `Cập nhật thông tin sinh viên`,
			form: form,
			formContent: getFormContent(handleUpdate),
			footer: [
				<Button key="cancle" onClick={() => setShowModalUpdate(false)}>Hủy</Button>,
				<Button key="submit" loading={createLoading} onClick={() => {
					form.submit();
				}}
					className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
				>Lưu
				</Button>
			],
			onOk: () => {
				form.submit();
			},
			onCancel: () => setShowModalUpdate(false),
			onClose: () => setShowModalUpdate(false),
		});
	}

	const handleDelete = async (record) => {
		setShowModalDelete(true);
		setModal({
			title: `Xóa thông tin sinh viên`,
			showModal: showModalDelete,
			formContent: (
				<div>
					<p>Bạn có chắc chắn muốn xóa thông tin sinh viên này không?</p>
					<p><strong>{record.fullName}</strong></p>
				</div>
			),
			footer: [
				<Button key="cancle" onClick={() => {
					setShowModalDelete(false);
					form.resetFields();
				}}>
					Hủy
				</Button>,
				<Button type="primary"
					className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
					onClick={() => deleteStudent(record)}
				>Xóa</Button>
			],
			onOk: () => deleteStudent(record),
			onCancel: () => {
				setShowModalDelete(false);
				form.resetFields();
			},
			onClose: () => {
				setShowModalDelete(false);
				form.resetFields();
			}
		})
	}

	const handleDeleteMultiple = () => {
		if (selectedRows.length === 0) {
			setNotification({ type: 'warning', message: 'Cảnh báo', desc: 'Vui lòng chọn ít nhất một bản ghi để xóa!' });
			return;
		}

		setShowModalDelete(true);
		setModal({
			title: `Xóa thông tin sinh viên`,
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
					onClick={deleteMultipleStudents}
				>Xóa
				</Button>,
			],
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
					placeholder="Tìm kiếm sinh viên..."
					loading={loading}
				/>
			</div>
			<Notification noti={notification} />
			<Modal showModal={showModalCreate} modal={modal} />
			<Modal showModal={showModalDelete} modal={modal} />
			<Modal showModal={showModalUpdate} modal={modal} />
			<Modal showModal={showModalView} modal={modal} />
			<Table
				title={'sinh viên'}
				columns={columns}
				loading={loading}
				data={data}
				tableParams={tableParams}
				onCreate={handleCreate}
				onDeleteMultiple={handleDeleteMultiple}
				setSelectedRows={setSelectedRows}
				fetchData={fetchData}
				onChange={handleTableChange}
				rowKey="studentId" />
		</>
	);
};

export default StudentPage;