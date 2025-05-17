import { useState, useEffect } from "react";
import { getStaffs, createStaff, updateStaff, deleteStaffs, importStaffs, exportStaffs, getDepartments, getStaffById, uploadPhoto } from "../services/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import SearchInput from "../components/SearchInput";
import { Button, Form, Tooltip, Input, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import DepartmentSelect from '../components/DepartmentSelect';
import Photo from "../components/Photo";

const StaffPage = () => {
  const [showModal, setShowModal] = useState(false);
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
    "isCreateForm": false,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loadingUploadPhoto, setLoadingUploadPhoto] = useState(false);

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const fetchData = async (params = tableParams) => {
    setLoading(true);
    const response = await getStaffs(
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

  const fetchDeptments = async () => {
    const response = await getDepartments(0, 1000, true, null, false, null);
    if (response.status === 200) {
      setDepartments(response.data.data)
    } else { setDepartments([]) }
  };

  useEffect(() => {
    fetchData();
    fetchDeptments();
  }, []);

  const exporting = async (params = tableParams) => {
    handleSetNotification('info', 'Đang xử lý', 'Quá trình trích xuất dữ liệu đang được tiến hành, bạn hãy lưu file sau khi hoàn tất.')
    const response = await exportStaffs(
      params.pagination.current - 1, 999999999, false, searchText, false
    );
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', }
      ));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'staffs.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    let sort = sorter.order === "ascend" ? true : (sorter.order === "descend" ? false : true)
    setTableParams({
      pagination, filters,
      sorting: sort
    });
    fetchData({ pagination, filters, sorting: sort, });
  };

  const handleView = (record) => {
    setShowModalView(true);
    setModal({
      title: `Thông tin cán bộ, giảng viên`,
      formContent: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Photo loadingUploadPhoto={loadingUploadPhoto} record={record} upload={uploadStaffPhoto} />
            <div>
              <h3 className="text-lg font-semibold">{record.name}</h3>
              <p className="text-gray-600">Mã số: {record.id}</p>
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
              <p className="font-medium">Đơn vị:</p>
              {record.departments && record.departments.length > 0 ? (
                <ul className="list-disc pl-5 mt-1">
                  {record.departments.map((dep, index) => (
                    <li key={index} className='text-blue-600 cursor-pointer'>{dep.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </div>
            <div>
              <p><span className="font-medium">Chức vụ:</span> {record.position}</p>
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

  const columns = [
    {
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
      title: 'Đơn vị',
      dataIndex: 'departments',
      // filters: departments.map(record => ({ text: record.name, value: record.id })),
      render: departments => {
        if (!Array.isArray(departments)) return '';
        return departments.map(dep => dep.name).join(', ');
      },
      width: 180,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      render: position => `${position}`,
      width: 200,
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
      width: 120,
    },
  ];

  const create = async (values) => {
    setLoading(true);
    const formattedData = {
      ...values,
      departments: values.departmentIds.map(code => ({ code }))
    };
    const response = await createStaff(formattedData);
    if (response.status === 201 || response.status === 200) {
      form.resetFields();
      setShowModal(false);
      handleSetNotification("success", "Thành công", "Thêm thông tin cán bộ, giảng viên mới thành công.");
      fetchData();
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra khi thêm thông tin đơn vị mới. Vui lòng thử lại sau.');
    }
    setLoading(false)
  }

  const importing = async (file) => {
    setLoading(true);
    setShowModal(false);
    const response = await importStaffs(file);
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Import thành công!')
      fetchData();
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setShowModal(true);
    form.resetFields();
    setModal({
      ...modal,
      isCreateForm: true,
      title: `Thêm cán bộ, giảng viên mới`,
      form: form,
      formContent: getFormContent(create),
      footer: [
        <Button key="cancle" onClick={() => {
          setShowModal(false);
          form.resetFields();
        }}>Hủy</Button>,
        <Button key="submit" onClick={() => form.submit()}
          className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'
        >Ok</Button>
      ],
      onOk: () => form.submit(),
      onImport: importing,
      onCancel: () => {
        setShowModal(false);
        form.resetFields();
      },
      onClose: () => {
        setShowModal(false);
        form.resetFields();
      },
    });
  }

  const uploadStaffPhoto = async (file, id) => {
    setLoadingUploadPhoto(true)
    const response = await uploadPhoto(file, 'staff', id);
    setLoadingUploadPhoto(false);
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Cập nhật ảnh thành công')
      const updated = await getStaffById(id);
      if (updated.status == 200) {
        // Cập nhật lại modal view với record mới nhất

        handleView(updated.data.data);
      }
      fetchData(tableParams);
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  }

  const getFormContent = (onFinish) => (
    <Form form={form} layout="vertical" onFinish={onFinish}
      initialValues={{
        id: '',
        name: '',
        position: '',
        phone: '',
        email: '',
        departmentIds: [],
        userID: '',
      }}
    >
      <Form.Item label="Mã số" name="id"
        rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Họ và tên" name="name"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Đơn vị" name="departmentIds"
        rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
      >
        <DepartmentSelect mode="multiple" />
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
    </Form>
  )

  const fillData = (record) => {
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      position: record.position,
      phone: record.phone,
      email: record.email,
      departmentIds: record.departments?.map(dep => dep.code) || [],
      userID: record.userID,
    });
  }

  const deleteStaff = async (record) => {
    setLoading(true);
    setShowModalDelete(false);
    const response = await deleteStaffs({ ids: [record.id] });
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Xóa thông tin cán bộ, giảng viên thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const handleDelete = async (record) => {
    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin cán bộ, giảng viên`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa thông tin CBGV <strong>{record.name}</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button type="primary" key="delete"
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
      isCreateForm: false,
      title: `Cập nhật thông tin cán bộ, giảng viên`,
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

  const update = async (values) => {
    setLoading(true);
    const formattedData = {
      ...values,
      departments: values.departmentIds.map(code => ({ code }))
    };
    const response = await updateStaff(values.id, formattedData);
    if (response.status === 200) {
      setShowModalUpdate(false);
      handleSetNotification('success', 'Thành công', 'Cập nhật thông tin cán bộ, giảng viên thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  }

  const deleteMultipleStaffs = async () => {
    setLoading(true);
    const ids = selectedRows.map(row => row.id);
    setShowModalDelete(false);
    const response = await deleteStaffs({ ids: ids });
    if (response.status === 200) {
      setSelectedRows([]);
      handleSetNotification('success', 'Thành công', `Đã xóa thành công ${ids.length} cán bộ, giảng viên`)
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const handleDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      setNotification({ type: 'warning', message: 'Cảnh báo', desc: 'Vui lòng chọn ít nhất một bản ghi để xóa!' });
      return;
    }
    setShowModalDelete(true);
    setModal({
      title: `Xóa thông tin cán bộ, giảng viên`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa <strong>{selectedRows.length}</strong> cán bộ, giảng viên đã chọn không?</p>
      ),
      footer: [
        <Button key="cancel" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary" danger
          onClick={deleteMultipleStaffs}
        >Xóa</Button>,
      ],
      onOk: () => deleteMultipleStaffs(),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false),
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

  return (
    <>
      <div className="px-12 py-8">
        <div className="mb-4 flex justify-between items-center">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Tìm tên, số điện thoại, email..."
            loading={loading}
          />
        </div>
        <Notification noti={notification} />
        <Modal showModal={showModal} modal={modal} />
        <Modal showModal={showModalDelete} modal={modal} />
        <Modal showModal={showModalUpdate} modal={modal} />
        <Modal showModal={showModalView} modal={modal} />
        <Table
          title={'Danh bạ cán bộ, giảng viên'}
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

export default StaffPage;