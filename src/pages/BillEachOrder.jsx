// File: frontend/src/pages/BillEachOrder.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
// Đảm bảo đường dẫn import Service là chính xác so với cấu trúc dự án của bạn
import { getOrderDetails } from '../Service/OrderService'; 
import styles from './BillEachOrder.module.css'; // CSS module

const BillEachOrder = () => {
    const { orderId } = useParams(); 
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userState = useSelector(state => state.user); 
    const accessToken = userState?.token; 
    const isAuthenticated = userState?.isAuthenticated; 

    const getStatusClass = (status) => {
        switch (status) {
            case 'Giao thành công': return styles.statusSuccess;
            case 'Hủy đơn': return styles.statusCancelled;
            case 'Đang giao': return styles.statusShipping;
            case 'Đã xác nhận': return styles.statusConfirmed;
            case 'Chờ xác nhận': return styles.statusPending;
            default: return styles.statusDefault;
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            setError("Lỗi xác thực: Vui lòng đăng nhập hoặc phiên làm việc đã hết hạn.");
            setLoading(false);
            return;
        }

        if (!orderId) {
            setError("Không tìm thấy ID đơn hàng.");
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await getOrderDetails(orderId, accessToken); 
                
                setOrder(response.data || response); 
            } catch (err) {
                console.error("Lỗi tải chi tiết đơn hàng:", err);
                const errorMessage = err.response?.data?.message || "Không thể tải chi tiết đơn hàng.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [orderId, accessToken, isAuthenticated]);

    // 🌟 ĐÃ SỬA LỖI CÚ PHÁP: Hiển thị UI Loading/Error đầy đủ
    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Đang tải hóa đơn chi tiết...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorBox}>
            <h2 className={styles.errorTitle}> Lỗi Tải Dữ Liệu</h2>
            <p className={styles.errorDetail}>{error}</p>
            <button 
                className={styles.backButton}
                onClick={() => navigate('/orderhistory')} 
            >
                Quay lại Lịch sử đơn hàng
            </button>
        </div>
    );
    
    if (!order) return <div className={styles.emptyContainer}><p>Không tìm thấy dữ liệu hóa đơn.</p></div>;

    // 🌟 ĐÃ SỬA LỖI LOGIC: Tự tính toán lại tổng tiền hàng
    const calculatedItemsPrice = order.orderItems?.reduce((total, item) => 
        total + (item.price * item.qty), 0
    ) || 0;
    
    // Tính tổng cộng hóa đơn chính xác
    const finalCalculatedTotal = calculatedItemsPrice + (order.shippingPrice || 0);


    return (
        <div className={styles.detailContainer}>
            <button className={styles.backButtonTop} onClick={() => navigate('/Orderdetail')}>
                &larr; Quay lại Lịch sử đơn hàng
            </button>
            <h1 className={styles.mainTitle}>📄 Hóa Đơn Chi Tiết Đơn Hàng</h1>
            
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Mã Đơn Hàng</p>
                    <strong className={styles.orderIdText}>#{order._id.slice(-8)}</strong>
                </div>
                <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Ngày Đặt Hàng</p>
                    <strong>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</strong>
                </div>
                <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Trạng Thái</p>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Phương thức TT</p>
                    <strong>{order.paymentMethod || 'Thanh toán khi nhận hàng'}</strong>
                </div>
            </div>

            <div className={styles.sectionWrapper}>
                <h2 className={styles.sectionTitle}>Thông tin Giao Hàng</h2>
                <div className={styles.shippingBox}>
                    <p><strong>👤 Người nhận:</strong> {order.shippingAddress?.fullName || order.user?.name}</p>
                    <p><strong>🏠 Địa chỉ:</strong> {order.shippingAddress?.address || 'Chưa cung cấp'}</p>
                    <p><strong>📞 Điện thoại:</strong> {order.shippingAddress?.phone || 'Chưa cung cấp'}</p>
                </div>
            </div>
            
            <div className={styles.sectionWrapper}>
                <h2 className={styles.sectionTitle}>🛒 Danh sách Sản Phẩm ({order.orderItems?.length || 0})</h2>
                <div className={styles.itemList}>
                    {order.orderItems?.map((item) => (
                        <div key={item.product} className={styles.itemCard}>
                            {/* Hiển thị ảnh nếu có, nếu không thì bỏ qua */}
                            {item.image && <img src={item.image} alt={item.name} className={styles.itemImage} />}
                            
                            <div className={styles.itemInfo}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={styles.itemPrice}>
                                    {item.price.toLocaleString('vi-VN')} VNĐ / SP
                                </p>
                            </div>
                            
                            {/* 🌟 Hiển thị Số lượng và Thành tiền */}
                            <div className={styles.itemQuantity}>
                                <p>Số lượng: {item.qty}</p>
                                <p>Thành tiền: 
                                    <strong className={styles.itemSubtotal}>
                                        {(item.price * item.qty).toLocaleString('vi-VN')} VNĐ
                                    </strong>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.totalBox}>
                <div className={styles.totalRow}>
                    <span>Tổng tiền hàng:</span>
                    {/* Sử dụng giá trị tự tính toán */}
                    <strong>{calculatedItemsPrice.toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div className={styles.totalRow}>
                    <span>Phí vận chuyển:</span>
                    <strong>{(order.shippingPrice || 0).toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div className={styles.totalRowTotal}>
                    <span>TỔNG CỘNG HÓA ĐƠN:</span>
                    {/* Sử dụng giá trị tổng cộng tự tính */}
                    <strong className={styles.finalTotal}>{finalCalculatedTotal.toLocaleString('vi-VN')} VNĐ</strong>
                </div>
            </div>
            
        </div>
    );
};

export default BillEachOrder;