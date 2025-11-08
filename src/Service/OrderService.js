import axios from "axios";
const axiosInstance = axios.create();
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
export const getOrderDetails = async (orderId, token) => {
    try {
        const response = await axios.get(`${BASE_URL_Order}/getDetailOrder/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về data (chứa thông tin đơn hàng)
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        throw error;
    }
};

export const getMyOrders = async (accessToken) => {
    const config = {
        headers: {
            // RẤT QUAN TRỌNG: Gửi token để Backend xác thực user
            'Authorization': `Bearer ${accessToken}`, 
        },
    };
    return (await axiosInstance.get(`${BASE_URL_Order}/getMyOrders`, config)).data;
};