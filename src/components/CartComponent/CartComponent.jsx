// File: src/components/CartComponent/CartComponent.js (Đã sửa logic hiển thị ảnh)

import React, {  useEffect } from "react"; 
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "./CartComponent.css";
import { useNavigate } from "react-router-dom"; 

// 💡 ĐẶT BASE URL ẢNH Ở ĐÂY
const BASE_URL = "http://localhost:3002"; 
const DEFAULT_IMAGE_PATH = "/default_product.png"; // Thay bằng đường dẫn ảnh mặc định nếu có

const CartComponent = () => {
    const { cartItems: cart, updateQuantity, removeItem,  addMultipleItems } = useCart();
    const navigate = useNavigate(); 
    // const [paymentMethod, setPaymentMethod] = useState("COD"); 

    // 🟢 LOGIC MUA LẠI: ĐỌC DỮ LIỆU TỪ LOCAL STORAGE
    useEffect(() => {
        const reorderItemsJson = localStorage.getItem('reorderItems');
        
        if (reorderItemsJson) {
            try {
                const itemsToReorder = JSON.parse(reorderItemsJson);
                if (itemsToReorder.length > 0) {
                    addMultipleItems(itemsToReorder); 
                }
                localStorage.removeItem('reorderItems');
            } catch (error) {
                console.error("Lỗi khi phân tích dữ liệu mua lại:", error);
                localStorage.removeItem('reorderItems'); 
                alert("Lỗi tải đơn hàng mua lại. Vui lòng thử lại.");
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addMultipleItems]); 

    // 💡 HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH CHUẨN HÓA
    const getImageUrl = (imagePath) => {
        // Nếu không có đường dẫn hoặc đường dẫn không hợp lệ
        if (!imagePath || typeof imagePath !== 'string' || imagePath.length < 5 || imagePath.toLowerCase().includes('default')) {
             return `${BASE_URL}${DEFAULT_IMAGE_PATH}`;
        }
        
        // 1. Kiểm tra nếu imagePath đã là đường dẫn tuyệt đối (có http/https)
        if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
            return imagePath;
        }
        
        // 2. Nếu là đường dẫn tương đối (ví dụ: /uploads/...)
        const cleanedPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
        return `${BASE_URL}${cleanedPath}`;
    };


    const increaseQty = (id) =>
        updateQuantity(id, cart.find((item) => item._id === id).quantity + 1);

    const decreaseQty = (id) => {
        const currentQty = cart.find((item) => item._id === id).quantity;
        if (currentQty > 1) {
            updateQuantity(id, currentQty - 1);
        }
    };

    const handleRemove = (id) => removeItem(id);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("Bạn cần đăng nhập để đặt hàng!");
            return;
        }

        navigate("/ship"); 
    };

    return (
        <div className="cart-container">
            <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>

            {cart.length === 0 ? (
                <p className="cart-empty">Giỏ hàng của bạn đang trống.</p>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item._id} className="cart-item">
                                <div className="item-info">
                                    {/* 🟢 SỬ DỤNG HÀM getImageUrl ĐÃ CẢI TIẾN */}
                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.name}
                                    />
                                    <div>
                                        <h2>{item.name}</h2>
                                        <p>{item.price.toLocaleString()}₫</p>
                                    </div>
                                </div>

                                <div className="item-quantity">
                                    <button onClick={() => decreaseQty(item._id)}>
                                        <Minus size={16} />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQty(item._id)}>
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="item-total">
                                    <p>{(item.price * item.quantity).toLocaleString()}₫</p>
                                    <button onClick={() => handleRemove(item._id)}>
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Tổng đơn hàng</h2>
                        <div className="summary-row">
                            <span>Tạm tính:</span>
                            <span>{total.toLocaleString()}₫</span>
                        </div>
                        <div className="summary-row">
                            <span>Phí vận chuyển:</span>
                            <span>20.000₫</span>
                        </div>
                        <hr />

                        <div className="payment-method">
                            <h3>Phương thức thanh toán</h3>
                            <label>Thanh toán khi nhận hàng (COD)</label>
                            <label>Chuyển khoảng</label>
                        </div>

                        <hr />
                        <div className="summary-total">
                            <span>Tổng cộng:</span>
                            <span>{(total + 20000).toLocaleString()}₫</span>
                        </div>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Tiến hành đặt hàng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartComponent;