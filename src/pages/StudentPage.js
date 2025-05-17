import { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import SearchInput from '../components/SearchInput';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Tooltip, Button, Input, Upload } from 'antd';
import { getStudents, createStudent, deleteStudents, updateStudent, importStudents, exportStudents, uploadPhoto, getStudentById } from '../services/api';
import DepartmentSelect from '../components/DepartmentSelect';
import Photo from '../components/Photo';

const StudentPage = () => {
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: null, desc: null });
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: { current: 1, pageSize: 20, },
    sorting: true,
    filter: null
  });
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [form] = Form.useForm();
  const [modal, setModal] = useState({
    "title": null,
    "onOk": null,
    "onImport": null,
    "onCancel": null,
    "onClose": null,
    "form": null,
    "formContent": null,
    "formUpload": null,
    "footer": null,
    'isCreateForm': false,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const fetchData = async (params = tableParams) => {
    setLoading(true);
    const response = await getStudents(
      params.pagination.current - 1, params.pagination.pageSize, params.sorting, searchText, false, params.filter
    );
    setLoading(false);
    if (response.status === 200) {
      setData(response.data.data)
      setTableParams({
        ...params,
        pagination: {
          ...params.pagination,
          total: response.data.total_record, current: response.data.current_page + 1,
        },
      })
    } else {
      handleSetNotification(
        "error", response.data.message || "Đã có lỗi khi tải dữ liệu. Vui lòng thử lại sau.", null
      )
    }
  };

  const create = async (values) => {
    setLoading(true);
    const formattedData = {
      id: values.id,
      name: values.name,
      address: values.address,
      phone: values.phone,
      email: values.email,
      photo: values.photo,
      departmentId: values.department
    };

    const response = await createStudent(formattedData);
    if (response.status === 201 || response.status === 200) {
      form.resetFields();
      setShowModalCreate(false);
      handleSetNotification("success", "Thành công", "Thêm thông tin sinh viên mới thành công.");
      fetchData();
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra khi thêm thông tin sinh viên mới. Vui lòng thử lại sau.');
    }
    setLoading(false)
  }

  useEffect(() => { fetchData(); }, []);

  const importing = async (file) => {
    setLoading(true);
    setShowModalCreate(false);
    const response = await importStudents(file);
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Import thành công!')
      fetchData();
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
    setLoading(false)
  }

  const exporting = async (params = tableParams) => {
    handleSetNotification('info', 'Đang xử lý', 'Quá trình trích xuất dữ liệu đang được tiến hành, bạn hãy lưu file sau khi hoàn tất.')
    const response = await exportStudents(
      params.pagination.current - 1, 999999999, false, searchText, false
    );
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', }
      ));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
  }

  const handleTableChange = (pagination, filters, sorter) => {
    let sort = sorter.order === "ascend" ? true : (sorter.order === "descend" ? false : true)
    setTableParams({ 
      pagination, filters,
      sorting: sort
    });
    fetchData({ pagination, filters, sorting: sort, });
  };

  const fillData = (record) => {
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      address: record.address,
      phone: record.phone,
      email: record.email,
      department: record.department?.code
    });
  }

  const update = async (values) => {
    setLoading(true);
    const formattedData = {
      id: values.id,
      name: values.name,
      address: values.address,
      phone: values.phone,
      email: values.email,
      photo: values.photo,
      departmentId: values.department
    };
    const response = await updateStudent(values.id, formattedData);
    if (response.status === 200) {
      setShowModalUpdate(false);
      handleSetNotification('success', 'Thành công', 'Cập nhật thông tin sinh viên thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  }

  const deleteStudent = async (record) => {
    setLoading(true);
    setShowModalDelete(false);
    const response = await deleteStudents({ ids: [record.id] });
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Xóa thông tin sinh viên thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const deleteMultipleStudents = async () => {
    setLoading(true);
    const ids = selectedRows.map(row => row.id);
    setShowModalDelete(false);
    const response = await deleteStudents({ ids: ids });
    if (response.status === 200) {
      setSelectedRows([]);
      handleSetNotification('success', 'Thành công', `Đã xóa thành công ${ids.length} sinh viên`)
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const uploadStudentPhoto = async (file, id) => {
    // setLoadingUploadPhoto(true)
    const response = await uploadPhoto(file, 'student', id);
    // setLoadingUploadPhoto(false);
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Cập nhật ảnh thành công')
      const updated = await getStudentById(id);
      if (updated.status == 200) {
        // Cập nhật lại modal view với record mới nhất

        handleView(updated.data.data);
      }
      fetchData(tableParams);
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  }

  const handleView = (record) => {
    setShowModalView(true);
    setModal({
      title: `Thông tin sinh viên`,
      formContent: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Photo loadingUploadPhoto={loading} record={record} upload={uploadStudentPhoto} />
            <div>
              <h3 className="text-lg font-semibold">{record.name}</h3>
              <p><span className="font-medium">Mã sinh viên: </span>{record.id}</p>
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
            <div className="col-span-2">
              <p><span className="font-medium">Địa chỉ: </span>{record.address || "Chưa cập nhật"}</p>
            </div>
            <div className="col-span-2">
              <p><span className="font-medium">Thuộc đơn vị: </span>{record.department.name || "Chưa cập nhật"}</p>
            </div>
          </div>
        </div>
      ),
      footer: [
        <Button key="edit" onClick={() => { setShowModalView(false); handleEdit(record) }}>Chỉnh sửa</Button>,
        <Button key="close" onClick={() => setShowModalView(false)}>Đóng</Button>
      ],
      onCancel: () => setShowModalView(false),
      onClose: () => setShowModalView(false)
    });
  };

  const columns = [{
    title: '',
    dataIndex: 'photo',
    key: 'avatar',
    render: url => (
      <img
        src={url ? url : `/avatar.png`}
        alt="avatar"
        style={{ borderRadius: '50%', width: 28, height: 28, objectFit: 'cover' }}
      />
    ),
    width: 50,
  },
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    sorter: true,
    showSorterTooltip: {
      title: 'Sắp xếp theo họ và tên',
    },
    render: name => `${name}`,
    width: 180,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'department',
    render: department => `${department?.name}`,
    width: 150,
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    render: phone => `${phone}`,
    width: 120,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: email => `${email}`,
    width: 230,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    render: address => `${address || ""}`,
    width: 270,
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
        <Tooltip title="Chi tiết">
          <Button
            icon={<EyeOutlined />}
            onClick={(e) => { e.stopPropagation(); handleView(record) }}
            type="link"
            style={{ color: 'green' }}
          />
        </Tooltip>
      </div>
    ),
    width: 110,
  },
  ];

  const getFormContent = (onFinish) => {
    return (
      <Form form={form} layout="vertical" onFinish={(values) => {
        onFinish(values);
      }}
        initialValues={{
          id: '',
          name: '',
          address: '',
          phone: '',
          email: '',
        }}
      >
        <Form.Item label="Mã sinh viên" name="id"
          rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
        ><Input />
        </Form.Item>

        <Form.Item label="Họ và tên" name="name"
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
      isCreateForm: true,
      title: "Thêm sinh viên mới",
      onOk: () => form.submit(),
      onImport: importing,
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
        <Button key="submit" onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Ok</Button>
      ]
    });
  }

  const handleEdit = (record) => {
    setShowModalUpdate(true);
    fillData(record);

    setModal({
      ...modal,
      isCreateForm: false,
      title: `Cập nhật thông tin sinh viên`,
      form: form,
      formContent: getFormContent(update),
      footer: [
        <Button key="cancle" onClick={() => setShowModalUpdate(false)}>Hủy</Button>,
        <Button key="submit" loading={loading} onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Lưu</Button>
      ],
      onOk: () => form.submit(),
      onCancel: () => setShowModalUpdate(false),
      onClose: () => setShowModalUpdate(false),
    });
  }

  const handleDelete = async (record) => {
    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin sinh viên`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa thông tin sinh viên <strong>{record.name}</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button type="primary"
          className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
          onClick={() => deleteStudent(record)}
        >Xóa</Button>
      ],
      onOk: () => deleteStudent(record),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
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
        <p>Bạn có chắc chắn muốn xóa <strong>{selectedRows.length}</strong> bản ghi đã chọn không?</p>
      ),
      footer: [
        <Button key="cancel" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary" danger
          onClick={deleteMultipleStudents}
        >Xóa</Button>,
      ],
      onOk: () => deleteMultipleStudents(),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    });
  };

  const handleSearch = (value) => {
    value = value.trim();
    setSearchText(value);
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
  };

  useEffect(() => {
    fetchData({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
  }, [searchText]);

  const Department = ({ department }) => {
    if (!department) {
      return <span>Không trực thuộc đơn vị nào.</span>;
    }

    return (
      <>
        <span className='text-blue-500 hover:text-violet-700 hover:cursor-pointer' onClick={() => handleView(department)}>
          <Tooltip title="Xem chi tiết">{department.name}</Tooltip>
        </span>
      </>
    )
  }

  return (
    <>
      <div className='px-12 py-8'>
        <div className="mb-4 flex justify-between items-center">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Tìm tên, số điện thoại, email..."
            loading={loading}
          />
        </div>
        <Notification noti={notification} />
        <Modal showModal={showModalCreate} modal={modal} />
        <Modal showModal={showModalDelete} modal={modal} />
        <Modal showModal={showModalUpdate} modal={modal} />
        <Modal showModal={showModalView} modal={modal} />
        <Table
          title={'Danh bạ sinh viên'}
          columns={columns}
          loading={loading}
          data={data}
          tableParams={tableParams}
          onCreate={handleCreate}
          onExport={exporting}
          onDeleteMultiple={handleDeleteMultiple}
          setSelectedRows={setSelectedRows}
          fetchData={fetchData}
          onChange={handleTableChange}
          onRow={handleView}
          rowKey="id" />
      </div>
    </>
  );
};

export default StudentPage;