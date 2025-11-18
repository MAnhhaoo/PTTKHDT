import axios from "axios";
const axiosInstance = axios.create();
// Đảm bảo biến môi trường VITE_API_URL_BACKEND đã được cấu hình
const BASE_URL_Order = `${import.meta.env.VITE_API_URL_BACKEND}/api/order`;

// 🟢 Lấy danh sách tất cả đơn hàng (Admin/Management)
export const getAllOrder = async () =>
  (await axios.get(`${BASE_URL_Order}/getAll`)).data;

// 👁️ Lấy chi tiết đơn hàng (Cần dùng trong handleViewDetails)
export const getDetailOrder = async (orderId) =>
  (await axios.get(`${BASE_URL_Order}/getDetailOrder/${orderId}`)).data;

// 🟡 Cập nhật trạng thái đơn hàng (Admin)
export const updateStatus = async (id, data) =>
  (await axios.put(`${BASE_URL_Order}/updateStatus/${id}`, data)).data;

// 🔴 Xóa đơn hàng (Admin)
export const deleteOrder = async (id) =>
  (await axios.delete(`${BASE_URL_Order}/delete/${id}`)).data;

// ----------------------------------------------------
// Các hàm sau thường dùng cho phía User, tôi giữ lại:
// ----------------------------------------------------

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


export const cancelOrder = async (orderId, token) => {
    try {
        const response = await axiosInstance.put(
            `${BASE_URL_Order}/updateStatus/${orderId}`, 
            { status: "Hủy đơn" }, // Gửi trạng thái mới
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        throw error;
    }
};

export const reviewProduct = async ({ orderId, productId, rating, comment }, token) => {
    try {
        const response = await axiosInstance.post(
            `${BASE_URL_Order}/review`, // Endpoint Backend đã thiết lập
            {
                orderId,
                productId,
                rating,
                comment,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Yêu cầu token xác thực người dùng
                },
            }
        );
        // Trả về toàn bộ response data (bao gồm status: 201)
        return { status: response.status, data: response.data }; 
    } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        // Trả về chi tiết lỗi để component FE xử lý thông báo
        return { 
            status: error.response?.status || 500, 
            message: error.response?.data?.message || "Lỗi server khi gửi đánh giá.",
            error: error 
        };
    }
};