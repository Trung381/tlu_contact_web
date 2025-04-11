import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import logoTLU from '../assets/images/logo-tlu.png';
import authService from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Xóa lỗi cũ nếu có

        try {
            const result = await authService.login(email, password);
            
            if (result.success) {
                // Chuyển hướng về trang chủ
                navigate("/");
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
                {/* Logo và tiêu đề */}
                <div className="flex flex-col items-center">
                    <img
                        src={logoTLU} // Đảm bảo bạn có file logo phù hợp
                        alt="TLU Contact Logo"
                        className="h-24 mb-4"
                    />
                    <h2 className="text-2xl font-semibold text-blue-600">TLU Contact</h2>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Form đăng nhập */}
                <form onSubmit={handleLogin} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <div className="relative">
                            <MailOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg pl-10"
                                required
                            />
                            {/* <span className="absolute left-3 top-2.5 text-gray-500">📧</span> */}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Mật khẩu</label>
                        <div className="relative">
                            <LockOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg pl-10"
                                required
                            />
                            {/* <span className="absolute left-3 top-2.5 text-gray-500">🔒</span> */}
                        </div>
                    </div>

                    {/* Ghi nhớ mật khẩu và quên mật khẩu */}
                    <div className="flex justify-between items-center mb-4 text-sm">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="mr-2"
                            />
                            Ghi nhớ mật khẩu
                        </label>
                        {/* <a href="/ResetPasswordPage" className="text-blue-600">
              Quên mật khẩu
            </a>
            <Link
            to="/resetPassword"
            className="font-medium text-blue-600 hover:text-blue-500 text-sm"
          ></Link> */}
                        <Link
                            to="/resetPassword"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Quên mật khẩu?
                        </Link>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        ĐĂNG NHẬP
                    </button>
                </form>

                {/* Điều khoản & chính sách */}
                <p className="text-center text-xs mt-4 text-gray-600">
                    Bằng cách đăng nhập, bạn đồng ý với{" "}
                    <a href="/terms" className="text-blue-600">
                        Điều khoản và Chính sách
                    </a>{" "}
                    của chúng tôi.
                </p>
            </div>
        </div>
    );
};


export default LoginPage;
