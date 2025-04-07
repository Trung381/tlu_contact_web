import React from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const Enumerators = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

const NotificationCustom = ({ type, message, desc }) => {
  console.log('Notifycation props:', { type, message, desc });
  const openNotification = () => {
    let icon;
    if (type === Enumerators.success) {
      icon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (type === Enumerators.error) {
      icon = <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    } else if (type === Enumerators.info) {
      icon = <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    } else if (type === Enumerators.warning) {
      icon = <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    }

    notification.open({
      message: message,
      description: desc,
      icon: icon,
      placement: 'topRight',
      duration: 3,
    });
  };

  React.useEffect(() => {
    openNotification();
  }, [type, message, desc]);

  return null;
};

export default NotificationCustom;
