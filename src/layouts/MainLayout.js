import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import routes from '../config/routes';

const MainLayout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigation */}
      <header className="bg-base-100 shadow-md">
        <div className="navbar container mx-auto">
          <div className="flex-1">
            <Link to={routes.home} className="btn btn-ghost text-2xl">Logo</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><NavLink to={routes.home} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Trang chủ</NavLink></li>
              <li><NavLink to={routes.department} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Danh bạ đơn vị</NavLink></li>
              <li><NavLink to={routes.staff} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Danh bạ CBGV</NavLink></li>
              <li><NavLink to={routes.student} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Danh bạ sinh viên</NavLink></li>
              {isAuthenticated ? (
                <>
                  <li><NavLink to={routes.profile} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Tài khoản</NavLink></li>
                  <li><button onClick={logout}>Đăng xuất</button></li>
                </>
              ) : (
                <>
                  <li><NavLink to={routes.login} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Đăng nhập</NavLink></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-base-200 p-10">
        <div className="container mx-auto">
          <div className="footer">
            <div>
              <span className="footer-title">Dịch vụ</span> 
              <Link to="/" className="link link-hover">Tính năng</Link>
              <Link to="/" className="link link-hover">Giá cả</Link>
              <Link to="/" className="link link-hover">Hỗ trợ</Link>
            </div> 
            <div>
              <span className="footer-title">Công ty</span> 
              <Link to={routes.about} className="link link-hover">Giới thiệu</Link>
              <Link to={routes.contact} className="link link-hover">Liên hệ</Link>
              <Link to="/" className="link link-hover">Tuyển dụng</Link>
            </div> 
            <div>
              <span className="footer-title">Pháp lý</span> 
              <Link to="/" className="link link-hover">Điều khoản sử dụng</Link>
              <Link to="/" className="link link-hover">Chính sách bảo mật</Link>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p>© {new Date().getFullYear()} - Bản quyền thuộc về Công ty ABC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 