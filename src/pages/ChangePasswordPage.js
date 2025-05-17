import { useState, useEffect } from 'react'
import Notification from '../components/Notification';
import authService from '../services/authService';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Button } from 'antd';

const ChangePasswordPage = () => {
  const [notification, setNotification] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [buttonHidden, setButtonHidden] = useState(false);
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const handleChangePw = () => {
    const sendEmail = async () => {
      setLoading(true);
      try {
        const email = sessionStorage.getItem('email')
        await sendPasswordResetEmail(auth, email);
      } catch (error) { }
      finally {
        setLoading(false);
        setButtonHidden(true);
        handleSetNotification(
          "success",
          "Thành công!",
          "Hướng dẫn thay đổi mật khẩu đã được gửi đến email của bạn. Hãy kiểm tra hòm thư và làm theo hướng dẫn."
        );
        setCountdown(7);
      }
    }
    sendEmail();
  }

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      authService.logout();
    }
  }, [countdown]);

  return (
    <>
      <Notification noti={notification} />
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-base w-[50vw]">Xin chào, chúng tôi sẽ gửi đến bạn một email hướng dẫn <strong>Thay đổi mật khẩu</strong> tài khoản hệ thống đến địa chỉ email của bạn.
          Hãy nhấp vào nút bên dưới để nhận email, sau đó kiểm tra hộp thư và làm theo hướng dẫn.
        </p>
        {!buttonHidden && (
          <Button type="primary" loading={loading} onClick={handleChangePw}
            className='mt-4 w-[20%] bg-blue-500 text-white rounded-3xl active:bg-blue-600 hover:bg-[#2563eb]'
          >
            NHẬN EMAIL
          </Button>
        )}
        {countdown !== null && (
          <p className="text-lg font-semibold mt-4 text-red-600">
            Bạn sẽ tự động đăng xuất khỏi hệ thống sau {countdown} giây...
          </p>
        )}
      </div>
    </>
  )
}

export default ChangePasswordPage;