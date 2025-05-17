import { LoadingOutlined } from '@ant-design/icons';
import { Tooltip, Spin } from 'antd';
import { useRef } from 'react';

const Photo = ({ loadingUploadPhoto, record, upload }) => {
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await upload(file, record.id);
    }
  };

  return (
    <>
      <Tooltip title='Nhấp để cập nhật ảnh'>
        <Spin spinning={loadingUploadPhoto} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
          <img
            onClick={handlePhotoClick}
            src={record.photo ? record.photo : `/tlu.png`}
            alt="photo"
            className={`w-32 h-32 rounded-full object-cover border-2 border-solid border-blue-600 cursor-pointer ${loadingUploadPhoto ? 'animate-pulse' : ''}`}
          />
        </Spin>
      </Tooltip>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  )
};

export default Photo;