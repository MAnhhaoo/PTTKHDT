// src/components/AdminRouteGuard.jsx (Code đã đúng)

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRouteGuard = () => {
  const userState = useSelector((state) => state.user); 

  // Kiểm tra đã đăng nhập (có user object và token)
  const isAuthenticated = !!userState.user && !!userState.token;
  
  // Kiểm tra quyền Admin
  const isAdmin = userState.user?.isAdmin;

  if (!isAuthenticated || !isAdmin) {
    // Nếu không phải Admin hoặc chưa đăng nhập, chuyển hướng về login
    return <Navigate to="/admin-login" replace />; 
  }

  // Nếu là Admin, cho phép truy cập
  return <Outlet />;
};

export default AdminRouteGuard;