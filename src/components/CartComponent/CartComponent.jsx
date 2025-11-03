import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext"; // ⬅️ IMPORT useCart
import "./CartComponent.css";

const API_URL = "http://localhost:3002/api/order/create"; // Đảm bảo URL Backend đúng

const CartComponent = () => {
    const { 
        cartItems: cart, 
        updateQuantity, 
        removeItem,
        clearCart
    } = useCart(); // ⬅️ SỬ DỤNG CONTEXT
    
    // Helper functions sử dụng Context
    const increaseQty = (id) => updateQuantity(id, cart.find(item => item._id === id).quantity + 1);
    const decreaseQty = (id) => {
        const currentQty = cart.find(item => item._id === id).quantity;
        if (currentQty > 1) {
             updateQuantity(id, currentQty - 1);
        }
    }
    const handleRemove = (id) => removeItem(id);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 🌟 HÀM XỬ LÝ THANH TOÁN VÀ GỌI API
    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        // Chuẩn bị dữ liệu `orderItems`
        const orderItems = cart.map((item) => ({
    product: item._id, 
    name: item.name,
    qty: item.quantity, // 🟢 ĐÃ ĐỔI THÀNH qty
    image: item.image,
    price: item.price,
}));

        const itemPrice = total;
        const shippingPrice = 20000;
        const taxPrice = 0; 
        const totalPrice = itemPrice + shippingPrice + taxPrice;
        
        // ⚠️ Lưu ý: Bạn cần thay thế thông tin shippingAddress cứng bằng dữ liệu từ form
        const orderData = {
            orderItems,
            shippingAddress: {
                fullName: "Khách hàng Test",
                address: "Số 123, Đường ABC, TP HCM",
                phone: "0901234567",
            }, 
            itemPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            // user ID sẽ được Backend lấy từ token
        };
        
        // Lấy token từ localStorage (Cần có chức năng Login)
        const token = localStorage.getItem('access_token'); 
        if (!token) {
            alert("Bạn cần đăng nhập để đặt hàng!");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`, // ⬅️ GỬI TOKEN
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok && data.status === 201) {
                alert("Đặt hàng thành công! Đơn hàng ID: " + data.data._id);
                clearCart(); // Xóa giỏ hàng sau khi đặt hàng
            } else {
                alert(`Đặt hàng thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            alert("Lỗi kết nối hoặc server không phản hồi.");
        }
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
                                    <img src={`http://localhost:3002${item.image}`} alt={item.name} />
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