import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import routes from '../config/routes';
import logo from '../assets/images/logo-tlu.png';
import { DownOutlined } from '@ant-design/icons';

const ITEM = {
  department: 'department',
  departmentType: 'department-type',
  staff: 'staff',
  student: 'student',
  user: 'user',
}

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const managementRoutes = {
      'department': routes.department,
      'department-type': routes.departmentType,
      'staff': routes.staff,
      'student': routes.student,
      'user': routes.user
    };

    const matchedKey = Object.keys(managementRoutes).find(key =>
      location.pathname === managementRoutes[key]
    );

    setSelected(matchedKey ?? null);
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigation */}
      <header className="bg-[#ffffff] shadow-md px-1">
        <div className="flex justify-between navbar px-6">
          <div className="ps-2">
            <Link to={routes.home} className="text-2xl">
              <img src={logo} alt="TLU Logo" className="h-16"
                onClick={() => setIsOpen(false)} />
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 m-0 text-base gap-2">
              <li><NavLink to={routes.home} className={({ isActive }) => `link-custom font-semibold px-2 py-1 rounded-md hover:bg-[#4096ff] hover:text-white ${isActive && `bg-[#1677ff] text-white font-semibold`}`} onClick={() => setIsOpen(false)}>Trang chủ</NavLink></li>
              <li className="relative inline-block text-left">
                <label
                  onClick={toggleDropdown}
                  className={`link-custom inline-flex justify-center gap-x-1.5 font-semibold px-2 py-1 rounded-md hover:bg-[#4096ff] hover:text-white ${(selected && `text-white`) || (isOpen && `text-[#1677ff]`)}  ${selected && `bg-[#1677ff] text-white`}`}
                >Quản lý danh bạ <DownOutlined style={{ width: '14px', height: '14px' }} /></label>
                {isOpen && (
                  <div className="menu-custom flex flex-col items-start absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden" aria-orientation="vertical" tabIndex="-1" >
                    <NavLink
                      to={routes.department}
                      className={`item-menu-custom w-full hover:text-[#1677ff] ${(selected === ITEM.department) && `text-[#0f6ef4] font-medium`}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Danh bạ đơn vị
                    </NavLink>
                    <NavLink to={routes.departmentType} className={`item-menu-custom w-full hover:text-[#1677ff] ${(selected === ITEM.departmentType) && `text-[#0f6ef4] font-medium`}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Loại phòng ban
                    </NavLink>
                    <NavLink to={routes.staff} className={`item-menu-custom w-full hover:text-[#1677ff]  ${(selected === ITEM.staff) && `text-[#0f6ef4] font-medium`}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Danh bạ CBGV
                    </NavLink>
                    <NavLink to={routes.student} className={`item-menu-custom w-full hover:text-[#1677ff] ${(selected === ITEM.student) && `text-[#0f6ef4] font-medium`}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Danh bạ sinh viên
                    </NavLink>
                    <NavLink to={routes.user} className={`item-menu-custom w-full hover:text-[#1677ff] ${(selected === ITEM.user) && `text-[#0f6ef4] font-medium`}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Người dùng
                    </NavLink>
                  </div>
                )}
              </li>
              {isAuthenticated ? (
                <li>
                  <button onClick={() => { setIsOpen(false); handleLogout() }} className={`font-semibold px-2 py-1 hover:bg-[#4096ff] hover:text-white`}>
                    Đăng xuất
                  </button>
                </li>
              ) : (
                <li>
                  <Link to={routes.login} className="font-semibold px-2 py-1 hover:bg-[#4096ff] hover:text-white">
                    Đăng nhập
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-100vw">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-base-200 px-12 py-8">
        <div className="container mx-auto">
          <div className='footer flex flex-wrap gap-10'>
            <div className='gap-3'>
              <span className="font-bold uppercase">Trường Đại học Thủy lợi</span>
              <div>
                <p className='mb-2'>175 Tây Sơn, Đống Đa, Hà Nội</p>
                <p className='mb-2'>Điện thoại: (024) - 38522201</p>
                <p className='mb-2'>Email: phonghcth@tlu.edu.vn</p>
              </div>
            </div>
            <div className='gap-3'>
              <span className="font-bold uppercase">Liên kết</span>
              <div>
                <p className='mb-2'><a href="https://www.tlu.edu.vn" target="_blank" rel="noopener noreferrer" className="link link-hover">Website trường</a></p>
                <p className='mb-2'><a href="https://www.tlu.edu.vn/lien-he" target="_blank" rel="noopener noreferrer" className="link link-hover">Liên hệ</a></p>
                <p className='mb-2'><a href="https://www.tlu.edu.vn/dao-tao" target="_blank" rel="noopener noreferrer" className="link link-hover">Đào tạo</a></p>
              </div>
            </div>
            <div className='gap-3'>
              <span className="font-bold uppercase">Hệ thống</span>
              <div>
                <p className='mb-2'><Link to={routes.department} className="link link-hover">Danh bạ đơn vị</Link></p>
                <p className='mb-2'><Link to={routes.staff} className="link link-hover">Danh bạ CBGV</Link></p>
                <p className='mb-2'><Link to={routes.student} className="link link-hover">Danh bạ sinh viên</Link></p>
              </div>
            </div>
            <div className='gap-3'>
              <span className="font-bold uppercase">Liên hệ hỗ trợ</span>
              <div>
                <p className='mb-2'>Phòng Công tác sinh viên</p>
                <p className='mb-2'>Điện thoại: (024) - 38522201</p>
                <p className='mb-2'>Email: phonghcth@tlu.edu.vn</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-sm">
          <p>© {new Date().getFullYear()} - Bản quyền thuộc về Trường Đại học Thủy lợi</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 