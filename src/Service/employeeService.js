import axios from "axios";

// Đảm bảo VITE_API_URL_BACKEND được thiết lập đúng trong file .env
const BASE_URL = `${import.meta.env.VITE_API_URL_BACKEND}/api/employees`;

// Lấy tất cả nhân viên
export const getAllEmployees = async () => {
    const response = await axios.get(`${BASE_URL}/getAll`);
    return { data: response.data };
};

// Tạo nhân viên mới
export const createEmployee = async (employeeData) => {
    const response = await axios.post(`${BASE_URL}/create`, employeeData);
    return { data: response.data };
};

// Cập nhật nhân viên theo id
export const updateEmployee = async (id, updateData) => {
    const response = await axios.put(`${BASE_URL}/update/${id}`, updateData);
    return { data: response.data };
};

// Xóa nhân viên theo id
export const deleteEmployee = async (id) => {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return { data: response.data };
};