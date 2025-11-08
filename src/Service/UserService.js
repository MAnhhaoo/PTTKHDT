import axios from "axios"

export const loginUser = async (data) =>{
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/signin` , data)
    return res.data
}
export const signupUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/signup` , data)
    return res.data
}
export const updateser = async (id ,data) => {
    const res = await axios.put(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/updateUser/${id}`, data)
    return res.data
}

export const updateUserStatus = async (id, isBlocked) => {
  const res = await axios.put(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/updateUserStatus/${id}`, { isBlocked });
  return res.data;
};
// File: UserService.js (Frontend Service)

// import axios, { BASE_URL }...
// Giả sử BASE_URL đã được định nghĩa

export const getAllUser = async (search = '') => {
    // ✅ Đảm bảo tham số được đặt tên là 'search' như Backend Controller mong đợi
    const params = search ? { search } : {}; 
    
    // ✅ Kiểm tra lại URL: ${import.meta.env.VITE_API_URL_BACKEND}/api/user/getAlluser
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/getAlluser`, { params });
    return res.data;
};

export const deleteUser = async (id) =>{
    const res = await axios.delete(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/deleteUser/${id}`)
    return res.data
}

