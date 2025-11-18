// File: src/components/CartComponent/CartComponent.js

import React, { useEffect } from "react"; 
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "./CartComponent.css";
import { useNavigate } from "react-router-dom"; 

// 💡 ĐẶT BASE URL ẢNH Ở ĐÂY
const BASE_URL = "http://localhost:3002"; 
const DEFAULT_IMAGE_PATH = "/default_product.png"; 

const CartComponent = () => {
    const { cartItems: cart, updateQuantity, removeItem, addMultipleItems } = useCart();
    const navigate = useNavigate(); 

    // 🟢 LOGIC MUA LẠI: ĐỌC DỮ LIỆU TỪ LOCAL STORAGE (Giữ nguyên)
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

    // 💡 HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH CHUẨN HÓA (ĐÃ CẢI TIẾN)
    const getImageUrl = (imagePath) => {
        let finalPath = imagePath;

        // 1. Xử lý trường hợp imagePath là chuỗi JSON (dù đã cố gắng giải quyết ở BillEachOrder, vẫn nên giữ ở đây để bảo vệ)
        if (typeof finalPath === 'string' && finalPath.startsWith('[')) {
            try {
                const parsed = JSON.parse(finalPath);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    finalPath = parsed[0]; // Lấy ảnh đầu tiên
                }
            } catch (e) {
                // Nếu parse lỗi, giữ nguyên finalPath
            }
        }
        
        // 2. Kiểm tra nếu path rỗng hoặc không hợp lệ
        if (!finalPath || typeof finalPath !== 'string' || finalPath.length < 5) {
            return `${BASE_URL}${DEFAULT_IMAGE_PATH}`;
        }
        
        // 3. Kiểm tra nếu đã có URL đầy đủ (http/https)
        if (finalPath.startsWith('http') || finalPath.startsWith('https')) {
            return finalPath;
        }
        
        // 4. Ghép với BASE URL (cho đường dẫn tương đối: /uploads/...)
        const cleanedPath = finalPath.startsWith('/') ? finalPath : '/' + finalPath;
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