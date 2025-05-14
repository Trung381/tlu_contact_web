import { Link } from 'react-router-dom';
import routes from '../config/routes';
import { FaUsers, FaUserTie, FaGraduationCap, FaBuilding } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[88vh] bg-base-200" style={{ backgroundImage: `url('/tlu_background.png')`}}>
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold">Hệ thống Danh bạ điện tử</h1>
            <div className="flex justify-center gap-4 py-4">
              <Link to={routes.department} className="btn btn-primary text-base">Danh bạ đơn vị</Link>
              <Link to={routes.staff} className="btn btn-primary text-base">Danh bạ CBGV</Link>
              <Link to={routes.student} className="btn btn-primary text-base">Danh bạ sinh viên</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-14 py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <FaBuilding className="text-4xl text-primary mb-4" />
                <h3 className="card-title">Quản lý đơn vị</h3>
                <p>Quản lý thông tin các đơn vị, phòng ban trong trường</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <FaUserTie className="text-4xl text-primary mb-4" />
                <h3 className="card-title">Quản lý CBGV</h3>
                <p>Quản lý thông tin cán bộ, giảng viên trong trường</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <FaGraduationCap className="text-4xl text-primary mb-4" />
                <h3 className="card-title">Quản lý sinh viên</h3>
                <p>Quản lý thông tin sinh viên các khoa, ngành</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <FaUsers className="text-4xl text-primary mb-4" />
                <h3 className="card-title">Quản lý người dùng</h3>
                <p>Quản lý thông tin tài khoản người dùng hệ thống</p>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default HomePage; 