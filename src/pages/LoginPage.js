import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { MailTwoTone, LockTwoTone } from "@ant-design/icons";
import logoTLU from '../assets/images/logo-tlu.png';
import { useAuth } from '../contexts/AuthContext';
import Notification from '../components/Notification';
import { Button, Input, Checkbox } from 'antd';

const LoginPage = () => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("000000");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedRemember = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('email');

    if (savedRemember === 'true' && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (email.trim() === "" || password.trim() === "") {
      setNotification({
        type: "error",
        message: "Vui lòng nhập email và mật khẩu.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await login(email, password);
      if (response.status === 200) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('email');
        }
        navigate("/");
        setNotification({
          type: "success",
          message: "Đăng nhập thành công!",
        });
      } else {
        setNotification({
          type: "error",
          message: response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err?.message || "Đăng nhập thất bại. Vui lòng thử lại.",
        desc: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && <Notification noti={notification} />}
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{backgroundImage: `url('/tlu_background.png')`}}>
        <div className="bg-white p-8 rounded-lg shadow-md w-[80vw]" style={{ maxWidth: "400px" }}>
          {/* Logo và tiêu đề */}
          <div className="flex flex-col items-center">
            <img
              src={logoTLU}
              alt="TLU Contact Logo"
              className="h-24 mb-2"
            />
            <h2 className="text-2xl font-semibold text-blue-600">TLU Contact - AMS</h2>
          </div>
          {/* Form đăng nhập */}
          <form onSubmit={handleLogin} className="mt-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-base pb-1">Email</label>
              <div className="relative">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} size="large" placeholder="Nhập địa chỉ email" prefix={<MailTwoTone className="mr-1" />} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-base pb-1">Mật khẩu</label>
              <div className="relative">
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} size="large" placeholder="Nhập mật khẩu đăng nhập" prefix={<LockTwoTone />} className="mr-1" />
              </div>
            </div>

            {/* Ghi nhớ mật khẩu và quên mật khẩu */}
            <div className="flex justify-between items-center mb-4 text-sm">
                <Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}>
                  Ghi nhớ tài khoản
                </Checkbox>
              <Link
                to="/reset-password"
                className="text-blue-600 hover:underline text-sm"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="primary" loading={loading} onClick={(e) => handleLogin(e)}
              className='w-full bg-blue-500 text-white rounded-3xl active:bg-blue-600 hover:bg-[#2563eb]'
            >
              ĐĂNG NHẬP
            </Button>
          </form>

          <p className="text-center text-xs mt-4 text-gray-600">Đăng nhập với quyền Quản trị viên hệ thống.</p>
        </div>
      </div>
    </>
  );
};


export default LoginPage;
