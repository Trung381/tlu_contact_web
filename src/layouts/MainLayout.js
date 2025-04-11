import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import routes from '../config/routes';
import logo from '../assets/images/logo-tlu.png';

const MainLayout = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigation */}
      <header className="bg-base-100 shadow-md">
        <div className="navbar container mx-auto">
          <div className="flex-1">
            <Link to={routes.home} className=" text-2xl">
              <img src={logo} alt="TLU Logo" className="h-8" />
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><NavLink to={routes.home} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Trang chủ</NavLink></li>
              <li><NavLink to={routes.department} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Danh bạ đơn vị</NavLink></li>
              <li><NavLink to={routes.departmentType} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Loại phòng ban</NavLink></li>
              <li><NavLink to={routes.staff} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Danh bạ CBGV</NavLink></li>
              <li><NavLink to={routes.student} className={({ isActive }) => (isActive ? 'btn px-3 btn-soft btn-primary' : 'btn px-3 btn-ghost')}>Danh bạ sinh viên</NavLink></li>
              {isAuthenticated ? (
                <li>
                  <button onClick={handleLogout} className="btn btn-ghost">
                    Đăng xuất
                  </button>
                </li>
              ) : (
                <li>
                  <Link to={routes.login} className="btn btn-ghost">
                    Đăng nhập
                  </Link>
                </li>
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
              <span className="footer-title">Trường Đại học Thủy lợi</span> 
              <p>175 Tây Sơn, Đống Đa, Hà Nội</p>
              <p>Điện thoại: (024) 38522201</p>
              <p>Email: phonghcth@tlu.edu.vn</p>
            </div> 
            <div>
              <span className="footer-title">Liên kết</span> 
              <a href="https://www.tlu.edu.vn" target="_blank" rel="noopener noreferrer" className="link link-hover">Website trường</a>
              <a href="https://www.tlu.edu.vn/lien-he" target="_blank" rel="noopener noreferrer" className="link link-hover">Liên hệ</a>
              <a href="https://www.tlu.edu.vn/dao-tao" target="_blank" rel="noopener noreferrer" className="link link-hover">Đào tạo</a>
            </div> 
            <div>
              <span className="footer-title">Hệ thống</span> 
              <Link to={routes.department} className="link link-hover">Danh bạ đơn vị</Link>
              <Link to={routes.staff} className="link link-hover">Danh bạ CBGV</Link>
              <Link to={routes.student} className="link link-hover">Danh bạ sinh viên</Link>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p>© {new Date().getFullYear()} - Bản quyền thuộc về Trường Đại học Thủy lợi</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 