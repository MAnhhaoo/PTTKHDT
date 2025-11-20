// src/utils/axiosInstance.js
import axios from "axios";

// 1. Khởi tạo instance với BASE_URL
const instance = axios.create({
  // Sử dụng biến môi trường cho URL backend
  baseURL: import.meta.env.VITE_API_URL_BACKEND, 
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Thêm Interceptor cho Request (Đảm bảo token được gửi đi)
instance.interceptors.request.use(
  (config) => {
    // 💡 Luôn lấy token từ localStorage (Dữ liệu sau khi F5)
    const token = localStorage.getItem("access_token");

    // Nếu token tồn tại, đính kèm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor cho Response (Xử lý lỗi Token hết hạn/Không hợp lệ - 401)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      const message = error.response.data?.message || "";

      if (message.includes("expired") || message.includes("invalid")) {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }

      // ❗ Không return logout ở mọi lỗi 401
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);


export default instance;