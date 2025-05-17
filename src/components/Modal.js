import { useState } from 'react';
import { Button, Modal, Form, Upload, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../App.css';
import Notification from './Notification';

const ModalCustom = ({ showModal, modal, loadingUploadPhoto }) => {
  const [file, setFile] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleUploadChange = (info) => {
    if (info != null && info.file != null) {
      const file = info.file;
      const isExcel = file.type === 'application/vnd.ms-excel'
        || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || file.name.endsWith('.xls')
        || file.name.endsWith('.xlsx');

      if (!isExcel) {
        setNotification({ type: 'error', message: 'Lỗi', desc: 'Vui lòng chọn file Excel (.xls, .xlsx) để import!' })
        setFile(null);
        return;
      }
      setFile(info.file);
    } else {
      setFile(null);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await modal?.onOk?.();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'content',
      render: (content) => content,
    },
  ];

  const handleCancel = () => {
  setFile(null);
  setIsUpload(false);
  setNotification(null);
  modal?.onCancel && modal.onCancel();
};

  const dataSource = [
    {
      key: '1',
      content: !isUpload ? modal?.formContent : (
        <Form
          layout="vertical"
          onFinish={() => modal?.onImport(file)} // Xử lý API cho upload file ở đây
        >
          <Form.Item label="Tải file lên" name="file" valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[{ required: true, message: 'Vui lòng tải lên file!' }]}>
            <Upload listType="text" maxCount={1}
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleUploadChange}
            >
              {file ? (<Button>{file?.name}</Button>) : (<Button icon={<UploadOutlined />}>Tải lên file Excel chứa dữ liệu cần import</Button>)}
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <>
      {notification && <Notification noti={notification} />}
      <Modal
        title={modal?.title}
        open={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={modal?.footer}
        confirmLoading={confirmLoading}
        style={{ padding: 0 }}
      >
        <Table className='table-custom'
          size='small'
          cellPaddingBlock={0}
          loading={confirmLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: '55vh' }}
          title={() => (
            modal?.isCreateForm && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  onClick={() => setIsUpload(false)}
                  style={{
                    marginRight: 4,
                    backgroundColor: isUpload ? '' : '#60B5FF',
                  }}
                ><span style={{ color: 'black' }}>Nhập dữ liệu</span></Button>
                <Button
                  onClick={() => setIsUpload(true)}
                  style={{
                    backgroundColor: isUpload ? '#60B5FF' : '',
                  }}
                ><span style={{ color: 'black' }}>Tải file lên</span></Button>
              </div>
            )
          )}
          style={{ padding: 0 }}
        />
      </Modal>
    </>
  );
};

export default ModalCustom;