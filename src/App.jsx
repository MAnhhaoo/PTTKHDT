import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  // import {
  //   useQuery,
  // } from '@tanstack/react-query'

import { routes } from "./routes/index"
import Default from "./components/DefaultComponent/Default";
import LayoutAdmin from "./pages/AdminPage/LayoutAdmin";
import Dashboard from "./pages/AdminPage/Dashboard";
import CategoryManagement from "./pages/AdminPage/CategoryManagement";
import ProductManagement from "./pages/AdminPage/ProductManagement";
import React from "react";
import OrderManagement from "./pages/AdminPage/OrderManagement";
import CustomerManagement from "./pages/AdminPage/CustomerManagement";
// import axios from "axios";

function App() {

  // useEffect(() => {
  //     fetchApi();
  //   }, []);

  // const fetchApi = async () => {
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/api/product/getAllProduct`);
  //     console.log("res", res.data);
  //     return res.data
  //   } catch (err) {
  //     console.error("Lỗi gọi API:", err);
  //   }
  // };

  //  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi , retry: false })
  //  console.log("query" , query)

  return (
    <>
     <div>
      <Router>
        <Routes>
          {/* ✅ Bỏ route /admin trong mảng routes để tránh bị trùng */}
          {routes
            .filter((r) => r.path !== "/admin")
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

          {/* ✅ Route riêng cho admin với các trang con */}
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="Category-Management" element={<CategoryManagement />} />
          <Route path="Product-Management" element={<ProductManagement />} /> 
          <Route path="Order-Management" element={<OrderManagement />} />
          <Route path="Customer-Management" element={<CustomerManagement />} />
        </Route>

        <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
      </Routes>
      </Router>
     </div>
    </>
  )
}

export default App;
