import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { getOrderDetails, cancelOrder } from '../Service/OrderService'; 
import styles from './BillEachOrder.module.css'; 

// 💡 CẤU HÌNH BASE URL ẢNH
const BASE_URL = "http://localhost:3002"; // THAY BẰNG URL BACKEND CỦA BẠN NẾU KHÁC
const DEFAULT_IMAGE_PATH = "/default_product.png"; 

const BillEachOrder = () => {
    const { orderId } = useParams(); 
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false); 
    const [isReordering, setIsReordering] = useState(false); 

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
    
    // 🟢 HÀM CHUẨN HÓA ĐƯỜNG DẪN ẢNH (DÙNG CHO HIỂN THỊ VÀ MUA LẠI)
    const getImageUrl = (imagePath) => {
        // Kiểm tra nếu không có đường dẫn hợp lệ
        if (!imagePath || typeof imagePath !== 'string' || imagePath.length < 5 || imagePath.toLowerCase().includes('default')) {
            return `${BASE_URL}${DEFAULT_IMAGE_PATH}`;
        }
        
        // Nếu đã là đường dẫn tuyệt đối (có http/https), trả về ngay
        if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
            return imagePath;
        }
        
        // Nếu là đường dẫn tương đối (ví dụ: uploads/...), thêm BASE_URL
        const cleanedPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
        return `${BASE_URL}${cleanedPath}`;
    };


    const fetchDetail = async () => {
        if (!isAuthenticated || !accessToken || !orderId) {
            setError("Lỗi xác thực hoặc thiếu ID đơn hàng.");
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const response = await getOrderDetails(orderId, accessToken); 
            
            // 💡 FIX LỖI TẢI DỮ LIỆU: Ưu tiên lấy order object từ trường 'data'
            const orderData = response.data || response;
            
            if (orderData && orderData.data) {
                // Trường hợp API trả về { status, message, data: order_object }
                setOrder(orderData.data);
            } else if (orderData && orderData._id) {
                // Trường hợp API trả về thẳng object order
                setOrder(orderData);
            } else {
                 setError("Dữ liệu đơn hàng không hợp lệ.");
            }

        } catch (err) {
            console.error("Lỗi tải chi tiết đơn hàng:", err);
            const errorMessage = err.response?.data?.message || "Không thể tải chi tiết đơn hàng.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [orderId, accessToken, isAuthenticated]);


    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.")) {
            return;
        }

        setIsCancelling(true);
        try {
            const result = await cancelOrder(orderId, accessToken);

            if (result.status === 200) {
                alert("Hủy đơn hàng thành công!");
                setOrder(prev => ({ ...prev, status: "Hủy đơn" }));
            } else {
                alert(result.message || "Hủy đơn hàng thất bại.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Lỗi server khi hủy đơn.";
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsCancelling(false);
        }
    };

    // 🟢 HÀM XỬ LÝ MUA LẠI SẢN PHẨM (ĐÃ SỬA LỖI ẢNH VÀ ID)
    const handleReorder = () => {
        if (!order || !order.orderItems || order.orderItems.length === 0) {
            alert("Không có sản phẩm nào để mua lại.");
            return;
        }

        setIsReordering(true);
        
        const itemsToReorder = order.orderItems.map(item => {
            // Chuẩn hóa ID sản phẩm
            const productId = item.product?._id || item.product;
            
            // Lấy đường dẫn ảnh TỪ NGUỒN ĐÁNG TIN CẬY NHẤT VÀ CHUẨN HÓA
            const rawImagePath = item.image && typeof item.image === 'string' && item.image.length > 5
                ? item.image 
                : (item.product?.image || DEFAULT_IMAGE_PATH); 
                
            // CHUẨN HÓA LẠI ĐƯỜNG DẪN TRƯỚC KHI LƯU VÀO CART
            const imagePath = getImageUrl(rawImagePath);

            return {
                product: productId, 
                name: item.name,
                image: imagePath, // Đường dẫn ảnh đã được chuẩn hóa tuyệt đối
                price: item.price,
                qty: item.qty, 
            };
        });

        try {
            localStorage.setItem('reorderItems', JSON.stringify(itemsToReorder));
            alert(`Đang chuẩn bị thêm ${itemsToReorder.length} sản phẩm vào giỏ hàng...`);
            
            navigate('/cart'); 
        } catch (error) {
            console.error("Lỗi khi chuẩn bị đơn hàng mua lại:", error);
            alert("Lỗi khi chuẩn bị đơn hàng mua lại. Vui lòng thử lại.");
        } finally {
            setIsReordering(false);
        }
    };


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

    
    const calculatedItemsPrice = order.orderItems?.reduce((total, item) => 
        total + (item.price * item.qty), 0
    ) || 0;
    
    const finalCalculatedTotal = calculatedItemsPrice + (order.shippingPrice || 0);

    const isCancelable = order.status === 'Chờ xác nhận' || order.status === 'Đã xác nhận';
    const isReorderable = order.status === 'Giao thành công';


    return (
        <div className={styles.detailContainer}>
            <button className={styles.backButtonTop} onClick={() => navigate('/Orderdetail')}>
                &larr; Quay lại Lịch sử đơn hàng
            </button>
            <h1 className={styles.mainTitle}>📄 Hóa Đơn Chi Tiết Đơn Hàng</h1>
            
            <div className={styles.actionButtons}>
                {isCancelable && (
                    <button 
                        className={styles.cancelButton} 
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                    >
                        {isCancelling ? 'Đang hủy...' : '🛑 HỦY ĐƠN HÀNG'}
                    </button>
                )}
                
                {isReorderable && (
                    <button 
                        className={styles.reorderButton} 
                        onClick={handleReorder}
                        disabled={isReordering}
                    >
                        {isReordering ? 'Đang chuẩn bị...' : '🛒 MUA LẠI ĐƠN HÀNG'}
                    </button>
                )}
            </div>
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
                        <div key={item.product?._id || item.product} className={styles.itemCard}>
                            {/* 🟢 FIX LỖI ẢNH HIỂN THỊ: Luôn dùng getImageUrl để đảm bảo URL tuyệt đối */}
                            <img 
                                src={getImageUrl(item.image || item.product?.image)} 
                                alt={item.name} 
                                className={styles.itemImage} 
                            />
                            
                            <div className={styles.itemInfo}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={styles.itemPrice}>
                                    {item.price.toLocaleString('vi-VN')} VNĐ / SP
                                </p>
                            </div>
                            
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
                    <strong>{calculatedItemsPrice.toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div className={styles.totalRow}>
                    <span>Phí vận chuyển:</span>
                    <strong>{(order.shippingPrice || 0).toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div className={styles.totalRowTotal}>
                    <span>TỔNG HÓA ĐƠN:</span>
                    <strong className={styles.finalTotal}>{finalCalculatedTotal.toLocaleString('vi-VN')} VNĐ</strong>
                </div>
            </div>
            
        </div>
    );
};

export default BillEachOrder;