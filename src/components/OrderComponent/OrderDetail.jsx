// File: frontend/src/pages/OrderHistory.jsx

import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../../Service/OrderService';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import styles from './OrderHistory.module.css'; // CSS module

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userState = useSelector(state => state.user); 
    const accessToken = userState?.token; 
    const isAuthenticated = userState?.isAuthenticated; 

    // Hàm xác định class CSS cho trạng thái đơn hàng
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
            setError("Lỗi xác thực: Vui lòng đăng nhập để xem lịch sử đơn hàng.");
            setLoading(false);
            return;
        }

        const fetchOrders = async (token) => {
            try {
                setLoading(true);
                setError(null);
                
                // Giả định getMyOrders trả về object có thuộc tính .data là mảng đơn hàng
                const response = await getMyOrders(token); 
                
                const ordersArray = response.data || response;
                const sortedOrders = ordersArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
                
            } catch (err) {
                console.error("Lỗi khi tải đơn hàng:", err);
                const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi kết nối máy chủ.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders(accessToken);
    }, [accessToken, isAuthenticated]);

    
    // --- HIỂN THỊ TRẠNG THÁI LOADING/ERROR/EMPTY ---
    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Đang tải lịch sử đơn hàng...</p>
        </div>
    );
    
    if (error) return (
        <div className={styles.errorBox}>
            <h2 className={styles.errorTitle}>❌ Lỗi Tải Dữ Liệu</h2>
            <p className={styles.errorDetail}>{error}</p>
        </div>
    );

    if (orders.length === 0) return (
        <div className={styles.emptyContainer}>
            <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            <h2 className={styles.emptyTitle}>Bạn chưa có đơn hàng nào.</h2>
            <p className={styles.emptyText}>Hãy bắt đầu đặt hàng ngay!</p>
        </div>
    );


    // --- GIAO DIỆN HIỂN THỊ DANH SÁCH ĐƠN HÀNG ---
    return (
        <div className={styles.orderHistoryContainer}>
            <h1 className={styles.mainTitle}>📜 Lịch Sử Đơn Hàng Của Tôi</h1>
            <div className={styles.orderList}>
                {orders.map((order) => (
                    <div 
                        key={order._id} 
                        className={styles.orderCard}
                        // CHUYỂN HƯỚNG SANG TRANG BILL (BillEachOrder.jsx)
                        onClick={() => navigate(`/orderEachProduct/${order._id}`)}
                    >
                        <div className={styles.cardHeader}>
                            <div>
                                <h2 className={styles.orderId}>
                                    Đơn hàng # {order._id.slice(-8)}
                                </h2>
                                <p className={styles.orderDate}>
                                    Ngày Đặt: **{format(new Date(order.createdAt), 'dd/MM/yyyy')}** lúc **{format(new Date(order.createdAt), 'HH:mm')}**
                                </p>
                            </div>
                            
                            <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.detailItem}>
                                <span className={styles.icon}>💰</span>
                                <span className={styles.detailLabel}>Tổng Tiền:</span>
                                {/* Kiểm tra giá trị an toàn */}
                                <span className={styles.totalPrice}>
                                    {(order.totalPrice || 0).toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.icon}>📦</span>
                                <span className={styles.detailLabel}>Sản phẩm:</span>
                                <span className={styles.itemCount}>{order.orderItems?.length || 0} loại</span>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                             <span className={styles.detailLink}>Xem chi tiết đơn hàng &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;