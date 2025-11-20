// src/components/AdminRouteGuard.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { logout } from "../redux/userSlide"; // <-- action xóa user khỏi redux + sessionStorage

const AdminRouteGuard = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const isAuthenticated = !!userState.user && !!userState.token;
  const isAdmin = userState.user?.isAdmin;

  // 🔒 Nếu chưa đăng nhập hoặc không phải Admin
  if (!isAuthenticated || !isAdmin) {
    // Xóa dữ liệu sessionStorage cho chắc chắn
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    dispatch(logout());
    return <Navigate to="/admin-login" replace />;
  }

  // Cho phép truy cập
  return <Outlet />;
};

export default AdminRouteGuard;
