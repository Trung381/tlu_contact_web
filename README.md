# TLU Contact Web

Ứng dụng web quản lý danh bạ xây dựng bằng React, Tailwind CSS và DaisyUI.

## Tính năng

- Giao diện người dùng hiện đại và thân thiện
- Hệ thống xác thực đăng nhập/đăng ký
- Quản lý danh bạ cá nhân
- Tìm kiếm và lọc danh bạ
- Giao diện responsive trên nhiều thiết bị
- Chế độ sáng/tối và nhiều theme khác nhau

## Công nghệ sử dụng

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Axios](https://axios-http.com/)

## Cấu trúc dự án

```
src/
  ├── assets/        # Hình ảnh, styles, v.v.
  ├── components/    # Các component tái sử dụng
  ├── config/        # Cấu hình routes, constants, v.v.
  ├── contexts/      # React contexts (auth, theme, v.v.)
  ├── hooks/         # Custom hooks
  ├── layouts/       # Layout components
  ├── pages/         # Các trang của ứng dụng
  ├── services/      # Services cho API, auth, v.v.
  └── utils/         # Các utility functions
```

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/Trung381/tlu_contact_web.git
cd tlu_contact_web
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000).

## Scripts có sẵn

- `npm start`: Chạy ứng dụng ở chế độ development
- `npm build`: Build ứng dụng để sẵn sàng triển khai
- `npm test`: Chạy test suite
- `npm eject`: Eject từ create-react-app (không khuyến khích)

## License

[MIT](LICENSE)
