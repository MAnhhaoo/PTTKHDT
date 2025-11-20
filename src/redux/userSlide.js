import { createSlice } from "@reduxjs/toolkit";

// 🔹 Khởi tạo từ sessionStorage
let savedUser = null;
try {
  const stored = sessionStorage.getItem("user");
  savedUser = stored ? JSON.parse(stored) : null;

  if (savedUser?.id && !savedUser._id) {
    savedUser._id = savedUser.id;
    delete savedUser.id;
  }
} catch (error) {
  console.error("❌ JSON parse error in user:", error);
  savedUser = null;
}

const savedToken = sessionStorage.getItem("access_token") || null;

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ==========================
    // ✔ SET USER (Đăng nhập)
    // ==========================
    setUser: (state, action) => {
      let user = action.payload.user;

      if (user.id && !user._id) {
        user = { ...user, _id: user.id };
        delete user.id;
      }

      state.user = user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("access_token", action.payload.token);
    },

    // ==========================
    // ✔ LOGOUT
    // ==========================
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
    },

    // ==========================
    // ✔ UPDATE USER INFO
    // ==========================
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };

      if (state.user.id && !state.user._id) {
        state.user._id = state.user.id;
        delete state.user.id;
      }

      sessionStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUser, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
