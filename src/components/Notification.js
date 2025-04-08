import React from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const Enumerators = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

const NotificationCustom = ({noti}) => {
  const openNotification = () => {
    let icon;
    if (noti.type === Enumerators.success) {
      icon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (noti.type === Enumerators.error) {
      icon = <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    } else if (noti.type === Enumerators.info) {
      icon = <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    } else if (noti.type === Enumerators.warning) {
      icon = <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    }

    notification.open({
      message: noti.message,
      description: noti.desc,
      icon: icon,
      placement: 'topRight',
      duration: 3,
    });
  };

  React.useEffect(() => {
    if (noti.type && noti.message) {
      openNotification();
    }
  }, [noti.type, noti.message, noti.desc]);

  return null;
};

export default NotificationCustom;
