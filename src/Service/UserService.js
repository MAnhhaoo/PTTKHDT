// src/Service/UserService.js
// THAY THẾ 'axios' BẰNG 'instance'
import instance from "../utils/axiosInstance"; // ✅ Import instance đã cấu hình

// ********** API PUBLIC (Không cần token) **********

export const loginUser = async (data) => {
  const res = await instance.post(`/api/user/signin`, data); 
  return res.data;
};
export const signupUser = async (data) => {
  const res = await instance.post(`/api/user/signup`, data); 
  return res.data;
};

// ********** API CẦN XÁC THỰC (Token được gửi tự động) **********

export const updateser = async (id, data) => {
  const res = await instance.put(`/api/user/updateUser/${id}`, data); 
  return res.data;
};

export const updateUserStatus = async (id, isBlocked) => {
  const res = await instance.put(`/api/user/updateUserStatus/${id}`, {
    isBlocked,
  }); 
  return res.data;
};

export const getAllUser = async (search = "") => {
  const params = search ? { search } : {};
  // Request này sẽ tự động đính kèm token nhờ Interceptor
  const res = await instance.get(`/api/user/getAlluser`, { params }); 
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await instance.delete(`/api/user/deleteUser/${id}`); 
  return res.data;
};