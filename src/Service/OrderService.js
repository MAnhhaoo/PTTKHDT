import axios from "axios";

const BASE_URL_Order = `${import.meta.env.VITE_API_URL_BACKEND}/api/order`;

// 🟢 Lấy danh sách tất cả đơn hàng
export const getAllOrder = async () =>
  (await axios.get(`${BASE_URL_Order}/getAll`)).data;

// 🟡 Cập nhật trạng thái đơn hàng
export const updateStatus = async (id, data) =>
  (await axios.put(`${BASE_URL_Order}/updateStatus/${id}`, data)).data;

// 🔴 Xóa đơn hàng
export const deleteOrder = async (id) =>
  (await axios.delete(`${BASE_URL_Order}/delete/${id}`)).data;

// xem don hang chi tiet
export const getDeatilOrder = async (id) => (
    (await axios.get(`${BASE_URL_Order}/getDetailOrder/${id}`)).data
)