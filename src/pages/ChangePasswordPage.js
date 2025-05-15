import { useState, useEffect } from 'react'
import Notification from '../components/Notification';
import authService from '../services/authService';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ChangePasswordPage = () => {
  const [notification, setNotification] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const auth = getAuth();

  const handleSetNotification = (type, msg, desc) => {
    setNotification({ type: type, message: msg, desc: desc })
  }

  const handleChangePw = async () => {
    try {
      const email = sessionStorage.getItem('email')
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
    }
  }

  useEffect(() => {
    handleChangePw()
    const timer = setTimeout(() => {
      handleSetNotification(
        "success",
        "Thành công!",
        "Hướng dẫn thay đổi mật khẩu đã được gửi đến email của bạn. Hãy kiểm tra hòm thư và làm theo hướng dẫn."
      );
      setCountdown(7);
    }, 3000);

    // Dọn dẹp timeout khi component bị unmount
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Dọn dẹp interval khi component bị unmount hoặc countdown thay đổi
      return () => clearInterval(interval);
    } else {
      // Khi countdown kết thúc, gọi hàm logout
      authService.logout();
    }
  }, [countdown]);

  return (
    <>
      <Notification noti={notification} />
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-base w-[50vw]">Xin chào, chúng tôi sẽ gửi đến bạn một email hướng dẫn <strong>Thay đổi mật khẩu</strong> tài khoản hệ thống đến địa chỉ email của bạn.
          Hãy kiểm tra hộp thư email và làm theo hướng dẫn, sau đó thực hiện <strong>Đăng nhập</strong> lại.
        </p>
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