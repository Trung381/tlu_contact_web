import { useState, useEffect, useRef } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Tooltip, Button, Input, Upload, Image, Spin } from 'antd';
import { getDepartments, createDepartments, updateDepartments, deleteDepartments, getChildDepartments, importDepartments, exportDepartments, getDepartmentById, uploadPhoto } from '../services/api';
import DepartmentSelect from '../components/DepartmentSelect';
import DepartmentTypeSelect from '../components/DepartmentTypeSelect';
import SearchInput from '../components/SearchInput';
import Photo from '../components/Photo';

const DepartmentPage = () => {
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: { current: 1, pageSize: 20, },
    sorting: true,
    filter: null
  });
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
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
    "isCreateForm": false
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [parentDepartmentId, setParentDepartmentId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [showModalView, setShowModalView] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loadingUploadPhoto, setLoadingUploadPhoto] = useState(false);

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const fetchData = async (params = tableParams) => {
    setLoading(true);
    const response = await getDepartments(params.pagination.current - 1, params.pagination.pageSize, params.sorting, searchText, false, params.filter);
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

  useEffect(() => { fetchData(); }, []);

  const create = async (values) => {
    setLoading(true);
    const response = await createDepartments(values);
    if (response.status === 201 || response.status === 200) {
      form.resetFields();
      setShowModalCreate(false);
      handleSetNotification("success", "Thành công", "Thêm thông tin đơn vị mới thành công.");
      fetchData();
    } else {
      handleSetNotification("error", "Thất bại", response.data.message || 'Đã có lỗi xảy ra khi thêm thông tin đơn vị mới. Vui lòng thử lại sau.');
    }
    setLoading(false)
  }

  const importing = async (file) => {
    setLoading(true);
    setShowModalCreate(false);
    const response = await importDepartments(file);
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
    const response = await exportDepartments(
      params.pagination.current - 1, 999999999, false, searchText, false
    );
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', }
      ));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'departments.xlsx');
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
    setParentDepartmentId(record.parentDepartmentId);
    setTypeId(record.typeId);
    form.setFieldsValue({
      id: record.id,
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
    const response = await updateDepartments(values.id, values);
    if (response.status === 200) {
      setShowModalUpdate(false);
      handleSetNotification('success', 'Thành công', 'Cập nhật thông tin đơn vị thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  }

  const deleteDepartment = async (record) => {
    setLoading(true);
    setShowModalDelete(false);
    const response = await deleteDepartments({ ids: [record.id] });
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Xóa thông tin đơn vị thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const deleteMultipleDepartments = async () => {
    setLoading(true);
    const ids = selectedRows.map(row => row.id);
    setShowModalDelete(false);
    const response = await deleteDepartments({ ids: ids });
    if (response.status === 200) {
      setSelectedRows([]);
      handleSetNotification('success', 'Thành công', `Đã xóa thành công ${ids.length} đơn vị`)
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const uploadDepartmentPhoto = async (file, id) => {
    setLoadingUploadPhoto(true);
    const response = await uploadPhoto(file, 'department', id);
    setLoadingUploadPhoto(false);
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Cập nhật ảnh thành công')
      const updated = await getDepartmentById(id);
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
      title: `Thông tin đơn vị`,
      formContent: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Photo loadingUploadPhoto={loadingUploadPhoto} record={record} upload={uploadDepartmentPhoto} />
            <div>
              <h3 className="text-lg font-semibold">{record.name}</h3>
              <p><span className="font-medium">Mã đơn vị: </span>{record.id}</p>
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
              <p><span className="font-medium">Địa chỉ: </span>{record.address || "Chưa cập nhật"}</p>
            </div>
            <div className="col-span-2">
              <p><span className="font-medium">Thuộc đơn vị: </span><ParentDepartment id={record.parentDepartmentId} /></p>
            </div>
            <div className="col-span-2">
              <p className="font-medium">Đơn vị trực thuộc:</p>
              <div className="ms-2 mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                <ChildDepartmentsList parentId={record.id} viewDetail={handleView} />
              </div>
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

  const ChildDepartmentsList = ({ parentId, viewDetail }) => {
    const [childDepartments, setChildDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadChildDepartments = async () => {
        setLoading(true);
        const response = await getChildDepartments(parentId);
        setLoading(false);
        if (response.status === 200) {
          setChildDepartments(response.data.data || []);
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
          <li key={dept.id} className="py-2">
            <div className="flex justify-between">
              <div>
                <p
                  className="text-blue-600 cursor-pointer"
                  onClick={() => viewDetail(dept)}
                >{dept.name}</p>
                {/* <p className="text-sm text-gray-500">{dept.id}</p> */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const columns = [{
    title: '',
    dataIndex: 'photo',
    key: 'photo',
    render: photo => (
      <img
        src={photo ? photo : `/tlu.png`}
        alt="photo"
        style={{ borderRadius: '50%', width: 28, height: 28, objectFit: 'cover' }}
      />
    ),
    width: 50,
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'name',
    sorter: true,
    showSorterTooltip: {
      title: 'Sắp xếp theo tên đơn vị',
    },
    render: name => `${name}`,
    width: 180,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    render: address => `${address || 'Chưa cập nhật'}`,
    width: 250,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: email => `${email || 'Chưa cập nhật'}`,
    width: 230,
  },
  {
    title: 'Điện thoại',
    dataIndex: 'phone',
    render: phone => `${phone || 'Chưa cập nhật'}`,
    width: 120,
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

  const getFormContent = (onFinish) => (
    <Form form={form} layout="vertical" onFinish={onFinish}
      initialValues={{
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        parentDepartmentId: null,
        typeId: null,
      }}
    >
      <Form.Item label="Mã đơn vị" name="id"
        rules={[{ required: true, message: 'Vui lòng nhập mã đơn vị!' }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Loại đơn vị" name="typeId"
        rules={[{ required: true, message: 'Vui lòng chọn loại đơn vị!' }]}
      >
        <DepartmentTypeSelect value={typeId} onChange={setTypeId} />
      </Form.Item>

      <Form.Item label='Tên đơn vị' name="name"
        rules={[{ required: true, message: `Vui lòng nhập tên đơn vị!` }]}
      ><Input />
      </Form.Item>

      <Form.Item label="Thuộc đơn vị" name="parentDepartmentId">
        <DepartmentSelect value={parentDepartmentId} onChange={setParentDepartmentId} />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address"
      // rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
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

  const handleCreate = () => {
    setShowModalCreate(true);
    form.resetFields();
    setModal({
      ...modal,
      isCreateForm: true,
      title: "Thêm đơn vị mới",
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
      title: `Cập nhật thông tin đơn vị`,
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
      title: `Xóa thông tin đơn vị`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa thông tin đơn vị <strong>{record.name}</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary"
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
      title: `Xóa thông tin đơn vị`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa <strong>{selectedRows.length}</strong> đơn vị đã chọn không?</p>
      ),
      footer: [
        <Button key="cancel" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary" danger
          onClick={deleteMultipleDepartments}
        >Xóa</Button>,
      ],
      onOk: () => deleteMultipleDepartments(),
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

  const ParentDepartment = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState(null);

    useEffect(() => {
      const getDepartment = async (id) => {
        if (!id) {
          setDepartment(null);
          return;
        }
        setLoading(true);
        const response = await getDepartmentById(id);
        setLoading(false);
        if (response.status === 200) {
          setDepartment(response.data.data);
        } else {
          setDepartment(null);
        }
      }

      getDepartment(id);
    }, [id]);

    if (loading) {
      return (<span className="text-center py-4">Đang tải...</span>);
    }

    if (!department) {
      return (<span>Không trực thuộc đơn vị nào.</span>);
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
      <div className='px-12 py-10'>
        <div className="mb-4 flex justify-between items-center">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Tìm mã số, tên, số điện thoại, email..."
            loading={loading}
          />
        </div>
        <Notification noti={notification} />
        <Modal showModal={showModalCreate} modal={modal} />
        <Modal showModal={showModalDelete} modal={modal} />
        <Modal showModal={showModalUpdate} modal={modal} />
        <Modal showModal={showModalView} modal={modal} loadingUploadPhoto={loadingUploadPhoto} />
        <Table
          title={'Danh bạ đơn vị'}
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

export default DepartmentPage;