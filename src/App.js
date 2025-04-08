import './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import routes from './config/routes';
// Layouts
import MainLayout from './layouts/MainLayout';

// Pages 
import HomePage from './pages/HomePage';
import ResetPasswordPage from './pages/ResetPasswordPage'; // Giữ nguyên component hoàn chỉnh
import LoginPage from './pages/LoginPage';
import Staff from './pages/StaffPage';
import Student from './pages/StudentPage';
import Department from './pages/DepartmentPage';

// Các trang mẫu giữ nguyên như cũ
const AboutPage = () => <div className="min-h-[60vh] flex items-center justify-center"><h1 className="text-3xl font-bold">Trang Giới Thiệu</h1></div>;
const ContactPage = () => <div className="min-h-[60vh] flex items-center justify-center"><h1 className="text-3xl font-bold">Trang Liên Hệ</h1></div>;
const RegisterPage = () => <div className="min-h-[60vh] flex items-center justify-center"><h1 className="text-3xl font-bold">Trang Đăng Ký</h1></div>;
const ProfilePage = () => <div className="min-h-[60vh] flex items-center justify-center"><h1 className="text-3xl font-bold">Trang Cá Nhân</h1></div>;
const NotFoundPage = () => <div className="min-h-[60vh] flex items-center justify-center"><h1 className="text-3xl font-bold">404 - Không Tìm Thấy Trang</h1></div>;

// Protected Route component (giữ nguyên)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }
  
  return children;
};

function App() {
  const [theme, setTheme] = useState("light");

  // Giữ nguyên phần toggle theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <AuthProvider>
      <Router>
        {/* Giữ nguyên nút chuyển theme */}
        <div className="fixed top-4 right-4 z-50">
          <button onClick={toggleTheme} className="btn btn-sm btn-outline gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
            </svg>
            {theme}
          </button>
        </div>
        
        <Routes>
          {/* Các route chính sử dụng MainLayout - giữ nguyên cấu trúc cũ */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={routes.about} element={<AboutPage />} />
            <Route path={routes.staff} element={<Staff />} />
            <Route path={routes.student} element={<Student />} />
            <Route path={routes.department} element={<Department />} />
            <Route path={routes.contact} element={<ContactPage />} />
            
            {/* Route cần xác thực */}
            <Route path={routes.profile} element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
          
        
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path={routes.resetPassword} element={<ResetPasswordPage />} />
          
          {/* Route 404 */}
          <Route path={routes.notFound} element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;