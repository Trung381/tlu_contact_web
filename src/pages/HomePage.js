import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const HomePage = () => {
  const features = [
    {
      id: 1,
      title: 'Tính năng 1',
      description: 'Mô tả chi tiết về tính năng 1 của sản phẩm.',
      icon: '🚀',
    },
    {
      id: 2,
      title: 'Tính năng 2',
      description: 'Mô tả chi tiết về tính năng 2 của sản phẩm.',
      icon: '⚡',
    },
    {
      id: 3,
      title: 'Tính năng 3',
      description: 'Mô tả chi tiết về tính năng 3 của sản phẩm.',
      icon: '🔍',
    },
    {
      id: 4,
      title: 'Tính năng 4',
      description: 'Mô tả chi tiết về tính năng 4 của sản phẩm.',
      icon: '🔒',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-base-200 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Chào mừng đến với ứng dụng</h1>
            <p className="py-6">
              Đây là mô tả ngắn gọn về ứng dụng của bạn. Giới thiệu các tính năng chính và giá trị mà người dùng sẽ nhận được.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg">Bắt đầu ngay</Button>
              <Button variant="outline" size="lg">Tìm hiểu thêm</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Tính năng nổi bật</h2>
          <p className="mt-4 text-lg">Khám phá những tính năng tuyệt vời của ứng dụng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="card-title">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="card bg-primary text-primary-content">
          <div className="card-body text-center">
            <h2 className="card-title text-3xl mx-auto mb-4">Sẵn sàng để bắt đầu?</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Tham gia cùng hàng nghìn người dùng đã sử dụng ứng dụng của chúng tôi để nâng cao hiệu suất công việc.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="accent" size="lg">Đăng ký ngay</Button>
              <Button variant="ghost" size="lg">Xem demo</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 