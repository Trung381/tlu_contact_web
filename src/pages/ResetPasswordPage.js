import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoTLU from '../assets/images/logo-tlu.png'; // Đảm bảo bạn có file logo trong thư mục assets


const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!email || !email.includes('@')) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }
  
    setIsLoading(true);
  
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Đã gửi link đặt lại mật khẩu đến ${email}`);
      setIsSent(true);
    } catch (error) {
      console.error("Firebase error details:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
  
      let errorMessage = "Đã có lỗi xảy ra";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/user-not-found":
          errorMessage = "Không tìm thấy tài khoản với email này";
          break;
        case "auth/too-many-requests":
          errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau";
          break;
        default:
          errorMessage = `Lỗi hệ thống: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Logo và tiêu đề */}
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src={logoTLU}
              alt="Logo TLU"
              className="h-24 mb-4" // Điều chỉnh kích thước logo tại đây
            />
          </div>
          <h2 className="text-2xl font-semibold text-blue-600">TLU Contact</h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p> */}

          {isSent && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              <p>Chúng tôi đã gửi email đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.</p>
              <p className="mt-1">Nếu không thấy email, hãy kiểm tra thư mục spam.</p>
            </div>
          )}
        </div>

        {!isSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Nút gửi */}
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "THAY ĐỔI MẬT KHẨU"
                )}
              </Button>
            </div>
          </form>
        ) : null}

        {/* Liên kết quay lại đăng nhập */}
        <div className="text-center mt-4">
          <span className="text-gray-500">Quay lại màn hình </span>
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 text-sm"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;