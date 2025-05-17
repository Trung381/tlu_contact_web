import { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { Tooltip, Button } from 'antd';
import { DeleteOutlined, KeyOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getUsers, deleteUsers, exportUsers, resetUserPassword, verifyUser } from '../services/api';
import SearchInput from '../components/SearchInput';

const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: { current: 1, pageSize: 20, },
    sorting: true,
  });
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModalVerify, setShowModalVerify] = useState(false);
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
    const response = await getUsers(params.pagination.current - 1, params.pagination.pageSize, params.sorting, searchText, false);
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
    let sort = sorter.order === "ascend" ? true : (sorter.order === "descend" ? false : true)
    setTableParams({
      pagination, filters,
      sorting: sort
    });
    fetchData({ pagination, sorting: sort });
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

  const verify = async (id) => {
    setShowModalVerify(true);
    const response = await verifyUser(id);
    setShowModalVerify(false);
    if (response.status === 200) {
      handleSetNotification('success', 'Thành công', response.data.message || null)
      fetchData();
    } else {
      handleSetNotification('error', 'Thất bại', response.data.message || null)
    }
  }

  const handleVerifyEmail = (record) => {
    setShowModalVerify(true);
    setModal({
      title: `Xác thực email cho tài khoản người dùng hệ thống`,
      formContent: (
        <p>Bạn có chắc chắn muốn xác thực email cho tài khoản <strong>{record.email}</strong> không?</p>
      ),
      footer: [
        <Button key="cancle" onClick={() => setShowModalVerify(false)}>Hủy</Button>,
        <Button key="verify" type="primary"
          className="!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]"
          onClick={() => verify(record.id)}
        >Xác thực</Button>
      ],
      onOk: () => verify(record.id),
      onCancel: () => setShowModalVerify(false),
      onClose: () => setShowModalVerify(false)
    });
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: id => `${id}`,
      width: 270,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: email => `${email}`,
      width: 220,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isEmailVerified',
      filters: [
        { text: 'Chưa xác thực', value: false },
        { text: 'Đã xác thực', value: true },
      ],
      onFilter: (value, record) => record.isEmailVerified === value,
      render: verified => verified
        ? <span className="text-green-600">Đã xác thực</span>
        : <span className="text-red-600">Chưa xác thực</span>,
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: date => date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : 'Chưa cập nhật',
      width: 170,
    },
    {
      title: 'Đăng nhập gần nhất',
      dataIndex: 'lastedLoginAt',
      render: date => date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : 'Chưa cập nhật',
      width: 170,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Đặt lại mật khẩu">
            <Button
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record.id, record.email)}
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
          <Tooltip title="Xác thực email">
            <Button
              icon={<CheckOutlined />}
              onClick={() => handleVerifyEmail(record)}
              type="link"
              style={{ color: 'blue' }}
            />
          </Tooltip>
        </div>
      ),
      // with: 120,
    },
  ];

  const handleResetPassword = (id, email) => {
    console.log(id, email);
    const resetPW = async (id, email) => {
      setLoading(true);
      const response = await resetUserPassword(id, email);
      setLoading(false);
      if (response.status == 200) {
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
        <Modal showModal={showModalVerify} modal={modal} />
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
          // onRow={handleView}
          rowKey="id"
        />
      </div>
    </>
  );
};

export default UserPage;