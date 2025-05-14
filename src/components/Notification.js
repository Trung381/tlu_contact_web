import React from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const Enumerators = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

const NotificationCustom = ({ noti }) => {
  const openNotification = () => {
    let icon;
    if (noti.type == Enumerators.success) {
      icon = <CheckCircleOutlined style={{ color: '#52c41a', width: '22px' }} />;
    } else if (noti.type == Enumerators.error) {
      icon = <CloseCircleOutlined style={{ color: '#f5222d', width: '22px' }} />;
    } else if (noti.type == Enumerators.info) {
      icon = <InfoCircleOutlined style={{ color: '#1890ff', width: '22px' }} />;
    } else if (noti.type == Enumerators.warning) {
      icon = <ExclamationCircleOutlined style={{ color: '#faad14', width: '22px' }} />;
    }

    notification.open({
      message: noti.message,
      description: noti.desc,
      icon: icon,
      placement: 'topRight',
      duration: 3
    });
  };

  React.useEffect(() => {
    if (noti != null && noti.type && noti.message) {
      openNotification();
    }
  }, [noti]);

  return null;
};

export default NotificationCustom;
