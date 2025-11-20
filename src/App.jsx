// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react"; // <-- Import useEffect
import { useDispatch } from "react-redux"; // <-- Import useDispatch
import { jwtDecode } from "jwt-decode";

 

// Redux action
import { setUser } from "./redux/userSlide"; // <-- Đảm bảo đường dẫn đúng

// Components Admin
import AdminLogin from "./pages/AdminPage/AdminLogin";
import LayoutAdmin from "./pages/AdminPage/LayoutAdmin";
import Dashboard from "./pages/AdminPage/Dashboard";
import CategoryManagement from "./pages/AdminPage/CategoryManagement";
import ProductManagement from "./pages/AdminPage/ProductManagement";
import OrderManagement from "./pages/AdminPage/OrderManagement";
import CustomerManagement from "./pages/AdminPage/CustomerManagement";
import AdminRouteGuard from "./components/AdminRouteGuard";
import EmployeeManagement from "./pages/AdminPage/EmployeeManagement";
// Components chung
import { routes } from "./routes/index"
import Default from "./components/DefaultComponent/Default";

function App() {
  const dispatch = useDispatch();

  // ✅ LOGIC TẢI LẠI USER TỪ LOCAL STORAGE KHI ỨNG DỤNG TẢI LẠI
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const decoded = jwtDecode(token);
        const user = JSON.parse(savedUser);
        
        // Kiểm tra token có hợp lệ không
        if (decoded && user) {
          dispatch(setUser({ user, token }));
          console.log('✅ Khôi phục user từ localStorage thành công');
        }
      } catch (e) {
        console.error("❌ Token hoặc user invalid:", e);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);


  return (
    <>
      <div>
        <Router>
          <Routes>
            {/* 1. Tuyến đường công khai và user thông thường */}
            {routes
              .filter((r) => r.path !== "/admin" && r.path !== "/admin-login")
              .map((route) => {
                const Layout = route.isShowHeader ? Default : React.Fragment;
                const Page = route.page;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page /> 
                      </Layout>
                    }
                  />
                );
              })}

            {/* 2. Tuyến đường Đăng nhập Admin (Không cần bảo vệ) */}
            <Route path="/admin-login" element={<AdminLogin />} /> 

            {/* ---------------------------------------------------- */}
            {/* ✅ 3. Tuyến đường Bảo vệ Admin (Áp dụng AdminRouteGuard) */}
            <Route element={<AdminRouteGuard />}>
              <Route path="/admin" element={<LayoutAdmin />}>
                <Route index element={<Dashboard />} />

                <Route path="Category-Management" element={<CategoryManagement />} />
                <Route path="Employee-Management" element={<EmployeeManagement />} />
                <Route path="Product-Management" element={<ProductManagement />} /> 
                <Route path="Order-Management" element={<OrderManagement />} />
                <Route path="Customer-Management" element={<CustomerManagement />} />
              </Route>
            </Route>
            {/* ---------------------------------------------------- */}

            <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App;