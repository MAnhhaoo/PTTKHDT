# 🍕 Pizza Website Project

## Overview
This is a modern web application for a pizza restaurant built using React and Vite. The application provides a complete solution for pizza ordering, user management, and administration.

## Features
- 🏠 **Home Page** with featured products
- 🍽️ **Menu Management** with detailed product views
- 🛒 **Shopping Cart** functionality
- 👤 **User Authentication** (Login/Signup)
- 📱 **Responsive Design**
- 🔐 **Admin Dashboard** with:
  - Product Management
  - Category Management
  - Order Management
  - Customer Management
- 📖 **Order History**
- 💳 **Order Processing**
- 📞 **Contact Page**
- ℹ️ **About Page**

## Tech Stack
- ⚛️ React + Vite
- 🚀 Fast Refresh with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) (Babel)
- 📦 Redux for state management
- 🌐 Axios for API calls
- 🔄 React Query for data fetching
- 🎨 CSS Modules
- 🛒 Context API for cart management
- 📝 ESLint for code quality

## Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── context/        # React Context providers
├── redux/          # Redux store and slices
├── routes/         # Route configurations
├── Service/        # API services
└── assets/         # Static assets
```

## Getting Started

### Yêu Cầu Hệ Thống
- Node.js (v14 trở lên)
- npm hoặc yarn

### Cài Đặt
1. Clone dự án về máy
```bash
git clone https://github.com/MAnhhaoo/PTTKHDT.git
```

2. Cài đặt các thư viện cần thiết
```bash
npm install
# Các gói bắt buộc:
npm install dotenv axios @tanstack/react-query
```

3. Khởi chạy môi trường phát triển
```bash
npm run dev
```

### Build Cho Production
```bash
npm run build
```

## Các Lệnh Có Sẵn
- `dev` - Khởi chạy môi trường phát triển
- `build` - Build cho production
- `preview` - Xem trước bản build

## Các Component Chính
- **CartComponent**: Chức năng giỏ hàng
- **LoginComponent**: Xác thực người dùng
- **MenuComponent**: Hiển thị danh sách sản phẩm
- **OrderComponent**: Xử lý đơn hàng
- **AdminPage**: Bảng điều khiển quản trị
- **ProfilePage**: Quản lý thông tin cá nhân

## Đóng Góp
1. Fork dự án
2. Tạo branch cho tính năng của bạn (`git checkout -b feature/TinhNangMoi`)
3. Commit các thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

## Giấy Phép
Dự án này được cấp phép theo giấy phép MIT.

## Tác Giả
- MAnhhaoo

## Lời Cảm Ơn
- Đội ngũ React cho framework tuyệt vời
- Đội ngũ Vite cho công cụ build hiệu quả
- Tất cả những người đóng góp cho dự án
