import { createSlice } from "@reduxjs/toolkit";

// 🔹 Lấy dữ liệu từ localStorage khi khởi tạo
const savedUser = JSON.parse(localStorage.getItem("user")) || null;
const savedToken = localStorage.getItem("access_token") || null;

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("access_token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    },

    // ...
    // 🆕 Cập nhật thông tin user (sau khi chỉnh sửa hồ sơ)
    updateUser: (state, action) => {
      // action.payload là object chứa các trường (name, email, phone, ...)
      state.user = { ...state.user, ...action.payload }; // Merge dữ liệu mới
      localStorage.setItem("user", JSON.stringify(state.user)); // cập nhật vào localStorage
      // Lưu ý: hàm này KHÔNG CẬP NHẬT state.token
    },
// ...
  },
});

export const { setUser, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
