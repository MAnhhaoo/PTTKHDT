import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ShippingPage.css"; 

const API_PROVINCES = "https://provinces.open-api.vn/api/?depth=3";
const API_ORDER_CREATE = "http://localhost:3002/api/order/create";

const ShippingPage = () => {
    const { cartItems: cart, clearCart } = useCart();
    const navigate = useNavigate();

    // State cho dữ liệu API
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // State cho thông tin giao hàng
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        phone: "",
        provinceCode: "", // Mã code Tỉnh/Thành phố
        districtCode: "", // Mã code Quận/Huyện
        wardCode: "",      // Mã code Phường/Xã
        streetAddress: "",
        paymentMethod: "COD", 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- KIỂM TRA GIỎ HÀNG ---
    useEffect(() => {
        if (cart.length === 0) {
            navigate("/Orderdetail");
        }
    }, [cart, navigate]);


    // --- LẤY DANH SÁCH TỈNH/THÀNH PHỐ ---
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(API_PROVINCES);
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tỉnh thành:", error);
                alert("Không thể tải danh sách Tỉnh/Thành phố.");
            }
        };
        fetchProvinces();
    }, []);

    // --- CẬP NHẬT QUẬN/HUYỆN KHI TỈNH THAY ĐỔI ---
    useEffect(() => {
        const provinceCodeNumber = Number(shippingInfo.provinceCode); 
        
        const selectedProvince = provinces.find(p => p.code === provinceCodeNumber);
        const newDistricts = selectedProvince ? selectedProvince.districts : [];
        
        setDistricts(newDistricts);
        setWards([]); 
        
        // Reset state cho Huyện và Xã nếu mã cũ không còn hợp lệ
        if (!newDistricts.some(d => d.code === Number(shippingInfo.districtCode))) {
             setShippingInfo(prev => ({ ...prev, districtCode: "", wardCode: "" }));
        } else {
             setShippingInfo(prev => ({ ...prev, wardCode: "" }));
        }
    }, [shippingInfo.provinceCode, provinces]);

    // --- CẬP NHẬT PHƯỜNG/XÃ KHI QUẬN/HUYỆN THAY ĐỔI ---
    useEffect(() => {
        const districtCodeNumber = Number(shippingInfo.districtCode);

        const selectedDistrict = districts.find(d => d.code === districtCodeNumber);
        const newWards = selectedDistrict ? selectedDistrict.wards : [];
        
        setWards(newWards);

        // Reset state cho Xã nếu mã cũ không còn hợp lệ
        if (!newWards.some(w => w.code === Number(shippingInfo.wardCode))) {
             setShippingInfo(prev => ({ ...prev, wardCode: "" }));
        }
        
    }, [shippingInfo.districtCode, districts]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    // --- TÍNH TOÁN TỔNG TIỀN ---
    const itemPrice = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
    const shippingPrice = 20000;
    const taxPrice = 0;
    const totalPrice = itemPrice + shippingPrice + taxPrice;

    // --- Hàm xử lý đường dẫn ảnh an toàn ---
    const getProductImageUrl = (imagePath) => {
        if (!imagePath) {
            // Thay thế bằng đường dẫn ảnh placeholder của bạn
            return ""; 
        }
        
        // Kiểm tra nếu đường dẫn đã là URL đầy đủ (ví dụ: bắt đầu bằng http)
        if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
            return imagePath;
        }
        
        // Kiểm tra nếu đường dẫn là tương đối (ví dụ: /images/abc.jpg)
        // Nếu không có '/', ta thêm '/' để nối đúng: http://localhost:3002/images/abc.jpg
        const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `http://localhost:3002${path}`;
    };

    // --- HÀM GỌI API ĐẶT HÀNG ---
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { fullName, phone, provinceCode, districtCode, wardCode, streetAddress, paymentMethod } = shippingInfo;
        
        // Lấy tên địa chỉ
        const provinceName = provinces.find(p => p.code === Number(provinceCode))?.name || "";
        const districtName = districts.find(d => d.code === Number(districtCode))?.name || "";
        const wardName = wards.find(w => w.code === Number(wardCode))?.name || "";
        
        // 🚨 Kiểm tra thông tin bắt buộc
        if (!fullName || !phone || !provinceCode || !districtCode || !wardCode || !streetAddress) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            setIsSubmitting(false);
            return;
        }

        const orderItems = cart.map((item) => ({
            product: item.product || item._id, // Ưu tiên trường 'product' nếu có (khi mua lại), hoặc '_id'
            name: item.name,
            qty: item.quantity,
            // Sử dụng đường dẫn ảnh đã được xử lý (hoặc giữ nguyên để BE xử lý)
            image: item.image, 
            price: item.price,
        }));
        
        // Chuẩn bị dữ liệu orderData cho BE
        const orderData = {
            orderItems,
            shippingAddress: {
                fullName: fullName, 
                phone: phone, 
                address: `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`, // Địa chỉ đầy đủ 4 cấp
                city: provinceName, // Tỉnh/Thành phố
            },
            itemPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            paymentMethod, 
        };
        
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(API_ORDER_CREATE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok && data.status === 201) {
                alert("Đặt hàng thành công! Đơn hàng ID: " + data.data._id);
                clearCart();
                navigate("/myorders"); 
            } else {
                alert(`Đặt hàng thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            alert("Lỗi kết nối hoặc server không phản hồi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="shipping-page-container">
            <h1>🚚 Thông tin giao hàng và Thanh toán</h1>
            <div className="checkout-grid">
                
                {/* 1. FORM ĐIỀN THÔNG TIN */}
                <div className="shipping-form-section">
                    <h2>1. Chi tiết người nhận</h2>
                    <form onSubmit={handlePlaceOrder}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Họ và tên người nhận (*)"
                            value={shippingInfo.fullName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại (*)"
                            value={shippingInfo.phone}
                            onChange={handleChange}
                            required
                        />

                        {/* Dropdown cho Tỉnh/Thành phố */}
                        <select name="provinceCode" value={shippingInfo.provinceCode} onChange={handleChange} required>
                            <option value="">Chọn Tỉnh/Thành phố (*)</option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>

                        {/* Dropdown cho Quận/Huyện */}
                        <select 
                            name="districtCode" 
                            value={shippingInfo.districtCode} 
                            onChange={handleChange} 
                            required 
                            disabled={!shippingInfo.provinceCode || districts.length === 0}
                        >
                            <option value="">Chọn Quận/Huyện (*)</option>
                            {districts.map(d => (
                                <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                        </select>
                        
                        {/* Dropdown cho Phường/Xã */}
                        <select 
                            name="wardCode" 
                            value={shippingInfo.wardCode} 
                            onChange={handleChange} 
                            required 
                            disabled={!shippingInfo.districtCode || wards.length === 0}
                        >
                            <option value="">Chọn Phường/Xã (*)</option>
                            {wards.map(w => (
                                <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                        </select>
                        
                        <input
                            type="text"
                            name="streetAddress"
                            placeholder="Số nhà, Tên đường (*)"
                            value={shippingInfo.streetAddress}
                            onChange={handleChange}
                            required
                        />
                    
                        <h2>2. Phương thức thanh toán</h2>
                        <div className="payment-options">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={shippingInfo.paymentMethod === "COD"}
                                    onChange={handleChange}
                                />
                                Thanh toán khi nhận hàng (COD)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Bank Transfer"
                                    checked={shippingInfo.paymentMethod === "Bank Transfer"}
                                    onChange={handleChange}
                                />
                                Chuyển khoản ngân hàng
                            </label>
                        </div>

                        {/* 3. TỔNG KẾT VÀ NÚT ĐẶT HÀNG */}
                        <div className="summary-section">
                            <h3>Tóm tắt đơn hàng</h3>
                            <div className="summary-row"><span>Tạm tính:</span><span>{itemPrice.toLocaleString()}₫</span></div>
                            <div className="summary-row"><span>Phí vận chuyển:</span><span>{shippingPrice.toLocaleString()}₫</span></div>
                            <hr/>
                            <div className="summary-total"><span>Tổng cộng:</span><span>{totalPrice.toLocaleString()}₫</span></div>
                        </div>
                        
                        <button type="submit" className="place-order-btn" disabled={isSubmitting || cart.length === 0}>
                            {isSubmitting ? "Đang xử lý..." : "HOÀN TẤT ĐẶT HÀNG"}
                        </button>
                    </form>
                </div>
                
                {/* 2. HIỂN THỊ DANH SÁCH SẢN PHẨM */}
                <div className="order-items-section">
                    <h2>3. Các sản phẩm</h2>
                    <ul className="cart-list-preview">
                        {cart.map((item) => (
                            <li key={item._id}>
                                <div className="item-detail">
                                    {/* 🚨 ĐÃ SỬA LỖI ẢNH BỊ LỖI KHI MUA LẠI */}
                                    <img 
                                        src={getProductImageUrl(item.image)} 
                                        alt={item.name} 
                                        // Thêm thuộc tính onError để xử lý trường hợp ảnh lỗi, hiển thị ảnh placeholder
                                        onError={(e) => { 
                                            e.target.onerror = null; // Tránh loop vô hạn
                                            e.target.src = ''; // Hoặc đường dẫn ảnh mặc định khác
                                        }}
                                    />
                                    <div>
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-qty-price">{item.quantity} x {item.price.toLocaleString()}₫</p>
                                    </div>
                                </div>
                                <span className="item-subtotal">{(item.price * item.quantity).toLocaleString()}₫</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default ShippingPage;