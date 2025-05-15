import { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { Tooltip, Button } from 'antd';
import { DeleteOutlined, EyeOutlined, KeyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getUsers, deleteUsers, exportUsers, resetUserPassword } from '../services/api';
import SearchInput from '../components/SearchInput';

const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: { current: 1, pageSize: 20, },
  });
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModalView, setShowModalView] = useState(false);
  const [showModalResetPassword, setShowModalResetPassword] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    'title': null,
    'onOk': null,
    "onImport": null,
    'onCancel': null,
    "onClose": null,
    'formContent': null,
    "formUpload": null,
    'footer': null,
    "isCreateForm": false,
  });

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const fetchData = async (params = tableParams) => {
    setLoading(true);
    const response = await getUsers(params.pagination.current - 1, params.pagination.pageSize, false, searchText, false);
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

  const exporting = async (params = tableParams) => {
    handleSetNotification('info', 'Đang xử lý', 'Quá trình trích xuất dữ liệu đang được tiến hành, bạn hãy lưu file sau khi hoàn tất.')
    const response = await exportUsers(
      params.pagination.current - 1, 999999999, false, searchText, false
    );
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', }
      ));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({ pagination, filters, ...sorter, });
    fetchData({ pagination, filters, ...sorter, });
  };

  const deleteUser = async (record) => {
    setLoading(true);
    setShowModalDelete(false);
    const response = await deleteUsers({ ids: [record.code] });
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', 'Xóa thông tin tài khoản thành công')
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const deleteMultipleUsers = async () => {
    setLoading(true);
    const ids = selectedRows.map(row => row.code);
    setShowModalDelete(false);
    const response = await deleteUsers({ ids: ids });
    if (response.status === 200) {
      setSelectedRows([]);
      handleSetNotification('success', 'Thành công', `Đã xóa thành công ${ids.length} tài khoản người dùng`)
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
    setLoading(false)
  };

  const handleView = (record) => {
    setShowModalView(true);
    setModal({
      title: `Thông tin tài khoản người dùng`,
      formContent: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={record.photo ? record.photo : `/avatar.png`}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{record.name}</h3>
              <p className="text-gray-600">Mã số: {record.code}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Email:</p>
              <p>{record.email || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="font-medium">Ngày tạo:</p>
              <p>{record.createdAt || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="font-medium">Đăng nhập lần cuối:</p>
              <p>{record.lastLogin || "Chưa cập nhật"}</p>
            </div>
          </div>
        </div>
      ),
      footer: [
        <Button key="close" onClick={() => setShowModalView(false)}>Đóng</Button>
      ],
      onCancel: () => setShowModalView(false),
      onClose: () => setShowModalView(false)
    });
  };

  const handleDelete = async (record) => {
    setShowModalDelete(true);
    setModal({
      title: `Xóa tài khoản người dùng hệ thống`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa tài khoản <strong>{record.name}</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary"
          className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
          onClick={() => deleteUser(record)}
        >Xóa</Button>
      ],
      onOk: () => deleteUser(record),
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
      title: `Xóa tài khoản người dùng`,
      formContent: (
        <p>Bạn có chắc chắn muốn xóa <strong>{selectedRows.length}</strong> tài khoản đã chọn không?</p>
      ),
      footer: [
        <Button key="cancel" onClick={() => setShowModalDelete(false)}>Hủy</Button>,
        <Button key="delete" type="primary" danger
          onClick={deleteMultipleUsers}
        >Xóa</Button>,
      ],
      onOk: () => deleteMultipleUsers(),
      onCancel: () => setShowModalDelete(false),
      onClose: () => setShowModalDelete(false)
    });
  };

  const handleSearch = (value) => {
    if (value.trim() === "") return;
    setSearchText(value);
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
    fetchData({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: id => `${id}`,
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      render: email => `${email}`,
      width: 250,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: date => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
      width: 250,
    },
    {
      title: 'Đăng nhập gần nhất',
      dataIndex: 'lastedLoginAt',
      render: date => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
      width: 250,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Đặt lại mật khẩu">
            <Button
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
              type="link"
              style={{ color: 'orange' }}
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
      with: 110,
    },
  ];

  const handleResetPassword = (id, email) => {
    const resetPW = async (id, email) => {
      setLoading(true);
      const response = await resetUserPassword(id, email);
      setLoading(false);
      if (response.status === 200) {
        handleSetNotification('success', 'Đặt lại mật khẩu thành công', null);
      } else {
        handleSetNotification('error', 'Thất bại', response.data.message || null)
      }
    };

    setShowModalResetPassword(true);
    setModal({
      title: `Đặt lại mật khẩu tài khoản người dùng hệ thống`,
      formContent: (
        <p>Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng có mã <strong>{id}</strong> là <strong>địa chỉ email</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalResetPassword(false)}>Hủy</Button>,
        <Button key="delete" type="primary"
          className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
          onClick={() => resetPW(id, email)}
        >Đặt lại</Button>
      ],
      onOk: () => resetPW(id, email),
      onCancel: () => setShowModalResetPassword(false),
      onClose: () => setShowModalResetPassword(false)
    });
  };

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
        <Modal showModal={showModalDelete} modal={modal} />
        <Modal showModal={showModalView} modal={modal} />
        <Modal showModal={showModalResetPassword} modal={modal} />
        <Table
          title={'Tài khoản người dùng hệ thống'}
          columns={columns}
          loading={loading}
          data={data}
          tableParams={tableParams}
          onCreate={() => { }}
          onExport={exporting}
          onDeleteMultiple={handleDeleteMultiple}
          setSelectedRows={setSelectedRows}
          fetchData={fetchData}
          onChange={handleTableChange}
          onRow={handleView}
          rowKey="id"
        />
      </div>
    </>
  );
};

export default UserPage;