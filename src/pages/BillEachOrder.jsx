import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { getOrderDetails, cancelOrder, reviewProduct } from '../Service/OrderService'; 
import { useCart } from '../context/CartContext'; 
import styles from './BillEachOrder.module.css'; 

// CẤU HÌNH BASE URL ẢNH
const BASE_URL = "http://localhost:3002"; 
const DEFAULT_IMAGE_PATH = "/default_product.png"; 


const getBestImagePathToReorder = (item) => {
    // Ưu tiên ảnh lưu trong đơn hàng (item.image), nếu không có thì lấy ảnh từ product object
    let path = item.image || item.product?.image || DEFAULT_IMAGE_PATH;
    
    // Xử lý chuỗi JSON 
    if (typeof path === 'string' && path.startsWith('[')) {
        try {
            const parsed = JSON.parse(path);
            if (Array.isArray(parsed) && parsed.length > 0) {
                path = parsed[0]; // Lấy ảnh đầu tiên
            }
        } catch (e) {
            // Lỗi parse, giữ nguyên path
        }
    }
    
    // Đảm bảo path là chuỗi tương đối và bắt đầu bằng '/'
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }

    return path.startsWith('/') ? path : '/' + path;
};

const getImageUrl = (imagePath) => {
    let finalPath = imagePath;
    
    // 1. Xử lý trường hợp imagePath là chuỗi JSON (chứa mảng URL)
    if (typeof finalPath === 'string' && (finalPath.startsWith('[') || finalPath.startsWith('{'))) {
        try {
            const parsed = JSON.parse(finalPath);
            if (Array.isArray(parsed) && parsed.length > 0) {
                finalPath = parsed[0]; 
            } else if (typeof parsed === 'string') {
                 finalPath = parsed; 
            } else {
                 finalPath = imagePath; 
            }
        } catch (e) {
            // Giữ nguyên finalPath nếu parse lỗi
        }
    }

    // 2. Kiểm tra nếu path rỗng hoặc không phải chuỗi
    if (!finalPath || typeof finalPath !== 'string') {
        finalPath = DEFAULT_IMAGE_PATH;
    }

    // 3. Kiểm tra nếu đã có URL đầy đủ (http/https)
    if (finalPath.startsWith('http') || finalPath.startsWith('https')) {
        return finalPath;
    }

    // 4. Ghép với BASE URL (cho đường dẫn tương đối)
    return `${BASE_URL}${finalPath.startsWith('/') ? finalPath : '/' + finalPath}`;
};

// --- CÁC HÀM KHÁC (GIỮ NGUYÊN) ---
const getStatusClass = (status) => {
    switch (status) {
        case 'Chờ xác nhận':
            return styles.statusPending;
        case 'Đã xác nhận':
            return styles.statusConfirmed;
        case 'Đang giao hàng':
            return styles.statusShipping;
        case 'Giao thành công':
            return styles.statusCompleted;
        case 'Đã hủy':
            return styles.statusCancelled;
        default:
            return styles.statusDefault;
    }
};

const createInitialReviews = (items) => items.reduce((acc, item) => {
    const id = item.product?._id || item.product;
    acc[id] = { 
        rating: item.reviewData?.rating || 0, 
        comment: item.reviewData?.comment || "" 
    };
    return acc;
}, {});

// ⚙️ COMPONENT FORM ĐÁNH GIÁ TỔNG QUÁT (Giữ nguyên)
const OverallReviewForm = ({ orderItems, onReviewSubmit, isSubmitting }) => {
    const [reviews, setReviews] = useState(createInitialReviews(orderItems));
    const reviewedCount = orderItems.filter(item => item.isReviewed).length;

    const handleRatingChange = (productId, newRating) => {
        setReviews(prev => ({
            ...prev,
            [productId]: { 
                ...prev[productId], 
                rating: newRating 
            }
        }));
    };
    
    const handleCommentChange = (productId, newComment) => {
         setReviews(prev => ({
            ...prev,
            [productId]: { 
                ...prev[productId], 
                comment: newComment
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const reviewsToSend = orderItems
            .map(item => {
                const id = item.product?._id || item.product;
                const review = reviews[id];
                
                const currentRating = review?.rating || 0; 
                
                if (item.isReviewed || currentRating === 0) {
                    return null; 
                }
                
                return {
                    productId: id,
                    rating: currentRating,
                    comment: review?.comment || ""
                };
            })
            .filter(review => review !== null); 

        if (reviewsToSend.length === 0) {
            alert("Vui lòng đánh giá các sản phẩm chưa được đánh giá (chọn sao) để gửi.");
            return;
        }
        
        onReviewSubmit(reviewsToSend);
    };

    return (
        <div className={styles.overallReviewContainer}>
            <h3 className={styles.overallReviewTitle}>
                ⭐ Đánh Giá Lần Đầu ({reviewedCount}/{orderItems.length} sản phẩm đã đánh giá)
            </h3>
            <form onSubmit={handleSubmit} className={styles.overallReviewForm}>
                
                {orderItems.map((item) => {
                    const productId = item.product?._id || item.product;
                    const currentReview = reviews[productId] || { rating: 0, comment: '' };
                    const isAlreadyReviewed = item.isReviewed;

                    return (
                        <div key={productId} className={styles.singleItemReview}>
                            <img src={getImageUrl(item.image || item.product?.image)} alt={item.name} className={styles.reviewItemImage}/>
                            <div className={styles.reviewItemDetails}>
                                <p className={styles.reviewItemName}>
                                    {item.name} 
                                    {isAlreadyReviewed && <span className={styles.reviewedLabel}>(Đã đánh giá, không sửa được)</span>}
                                </p>
                                <div className={styles.ratingInput}>
                                    {[...Array(5)].map((_, i) => (
                                        <span 
                                            key={i} 
                                            className={i < currentReview.rating ? styles.starFilledInteractive : styles.starEmptyInteractive}
                                            onClick={() => !isAlreadyReviewed && handleRatingChange(productId, i + 1)}
                                            role="button"
                                            style={{ cursor: isAlreadyReviewed ? 'default' : 'pointer' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className={styles.ratingSelection}>
                                        {currentReview.rating > 0 ? `${currentReview.rating} Sao` : "Chọn sao"}
                                    </span>
                                </div>
                                <textarea
                                    value={currentReview.comment}
                                    onChange={(e) => handleCommentChange(productId, e.target.value)}
                                    placeholder="Bình luận riêng cho sản phẩm này (Tùy chọn)"
                                    rows="1"
                                    className={styles.commentTextareaInline}
                                    disabled={isAlreadyReviewed}
                                />
                            </div>
                        </div>
                    );
                })}
                
                <button type="submit" disabled={isSubmitting} className={styles.submitOverallButton}>
                    {isSubmitting ? 
                        <span className={styles.spinner}></span> : 
                        `Gửi Đánh Giá Các Sản Phẩm Chưa Đánh Giá`
                    }
                </button>
            </form>
        </div>
    );
};


// --- COMPONENT CHÍNH: BILL EACH ORDER ---

const BillEachOrder = () => {
    const { orderId } = useParams(); 
    const navigate = useNavigate();
    
    const [order, setOrder] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false); 
    const [isReordering, setIsReordering] = useState(false); 
    const [isReviewing, setIsReviewing] = useState(false); 

    const userState = useSelector(state => state.user); 
    const accessToken = userState?.token; 
    const [isSubmittingAll, setIsSubmittingAll] = useState(false); 
    
    // ⭐ SỬ DỤNG CONTEXT
    const { addMultipleItems } = useCart(); 

    // --- LOGIC GỌI API ---
    const fetchDetail = async () => {
        if (!orderId || !accessToken) return;

        setLoading(true);
        setError(null);
        try {
            const result = await getOrderDetails(orderId, accessToken);
            const updatedOrderItems = result.data.orderItems.map(item => ({
                ...item,
                isReviewed: !!item.reviewData,
            }));
            setOrder({ ...result.data, orderItems: updatedOrderItems });
        } catch (err) {
            console.error("Lỗi khi tải chi tiết đơn hàng:", err);
            setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [orderId, accessToken]); 
    
    // 1. HÀM XỬ LÝ HỦY ĐƠN HÀNG (Giữ nguyên)
    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
        setIsCancelling(true);
        try {
            await cancelOrder(orderId, accessToken);
            alert("Đã hủy đơn hàng thành công!");
            // Cập nhật lại state sau khi hủy
            setOrder(prev => ({ ...prev, status: 'Đã hủy' }));
        } catch (e) {
            alert("Lỗi khi hủy đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsCancelling(false);
        }
    };

    // 2. 🛒 HÀM XỬ LÝ MUA LẠI ĐƠN HÀNG (Giữ nguyên)
    const handleReorder = () => { 
        if (!order || !order.orderItems || order.orderItems.length === 0) {
            alert("Đơn hàng rỗng, không thể mua lại.");
            return;
        }

        setIsReordering(true);
        
        // CHUẨN BỊ DỮ LIỆU ẢNH SẠCH SẼ
        const itemsToReorder = order.orderItems.map(item => {
            const productId = item.product?._id || item.product; 
            
            // SỬ DỤNG HÀM MỚI ĐỂ LẤY CHUỖI ĐƯỜNG DẪN TƯƠNG ĐỐI SẠCH
            const imagePathForCart = getBestImagePathToReorder(item); 
            
            return {
                _id: productId, 
                quantity: item.qty, 
                name: item.name, 
                price: item.price,
                image: imagePathForCart, // <-- Đường dẫn tương đối
            };
        });
        
        try {
            // GỌI HÀM CONTEXT
            addMultipleItems(itemsToReorder); 
            
            alert(`✅ Đã thêm ${itemsToReorder.length} sản phẩm vào giỏ hàng. Chuyển hướng đến giỏ hàng...`);
            
            // Chuyển hướng sau khi thêm thành công
            setTimeout(() => { 
                navigate('/cart');
            }, 500);

        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng (Context):", error);
            alert("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
        } finally {
            setIsReordering(false);
        }
    };

    // 3. ⭐️ HÀM XỬ LÝ GỬI ĐÁNH GIÁ (ĐÃ SỬA ĐỂ CẬP NHẬT GIAO DIỆN TỨC THỜI)
    const handleOverallReviewSubmit = async (reviewsToSend) => {
        setIsSubmittingAll(true);
        
        try {
            // Gửi lần lượt từng đánh giá
            const reviewPromises = reviewsToSend.map(review => 
                reviewProduct(orderId, review.productId, review.rating, review.comment, accessToken)
                .then(response => {
                    // Trả về dữ liệu cần thiết để cập nhật UI
                    return {
                        productId: review.productId,
                        rating: review.rating,
                        comment: review.comment,
                        // Thêm dữ liệu review trả về từ API nếu có (ví dụ: _id, createdAt)
                        reviewData: response.data 
                    };
                })
            );

            const results = await Promise.all(reviewPromises);
            
            alert(`Đã gửi thành công ${results.length} đánh giá!`);

            // Cập nhật trạng thái 'order' cục bộ
            setOrder(prevOrder => {
                if (!prevOrder) return prevOrder;

                // Tạo mảng sản phẩm mới đã được cập nhật
                const updatedOrderItems = prevOrder.orderItems.map(item => {
                    const productId = item.product?._id || item.product;
                    const sentReview = results.find(r => r.productId === productId);

                    if (sentReview) {
                        return {
                            ...item,
                            isReviewed: true,
                            // Cập nhật reviewData bằng dữ liệu vừa gửi thành công
                            reviewData: {
                                rating: sentReview.rating,
                                comment: sentReview.comment,
                                ...sentReview.reviewData 
                            }
                        };
                    }
                    return item;
                });
                
                // Ẩn form đánh giá sau khi gửi thành công
                setIsReviewing(false); 

                return { ...prevOrder, orderItems: updatedOrderItems };
            });

        } catch (e) {
            console.error("Lỗi khi gửi đánh giá:", e);
            alert("Lỗi khi gửi đánh giá. Vui lòng thử lại.");
        } finally {
            setIsSubmittingAll(false);
        }
    };
    
    // --- KIỂM TRA LOADING & ERROR ---
    if (loading) {
        return <div className={styles.detailContainer}><div className={styles.loading}>Đang tải chi tiết đơn hàng...</div></div>;
    }
    
    if (error) {
        return <div className={styles.detailContainer}><div className={styles.error}>Lỗi: {error}</div></div>;
    }
    
    if (!order || !order.orderItems || order.orderItems.length === 0) {
        return <div className={styles.detailContainer}><div className={styles.notFound}>Không tìm thấy chi tiết đơn hàng hoặc đơn hàng rỗng.</div></div>;
    }
    // --- KẾT THÚC KIỂM TRA ---

    const calculatedItemsPrice = order.orderItems.reduce((total, item) => 
        total + (item.price * item.qty), 0
    );
    const finalCalculatedTotal = calculatedItemsPrice + (order.shippingPrice || 0);

    const isCancelable = order.status === 'Chờ xác nhận' || order.status === 'Đã xác nhận';
    const isReorderable = order.status === 'Giao thành công';
    const isReviewAvailable = order.status === 'Giao thành công';
    
    return (
        <div className={styles.detailContainer}>
            <button className={styles.backButtonTop} onClick={() => navigate('/Orderdetail')}>
                &larr; Quay lại Lịch sử đơn hàng
            </button>
            <h1 className={styles.mainTitle}>📄 Hóa Đơn Chi Tiết Đơn Hàng</h1>
            
            {/* --- ACTION BUTTONS --- */}
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
                
                {isReviewAvailable && (
                    <button 
                        className={styles.reviewToggleButton} 
                        onClick={() => setIsReviewing(prev => !prev)}
                    >
                        {isReviewing ? '⬆️ ẨN FORM ĐÁNH GIÁ' : '⭐ ĐÁNH GIÁ'}
                    </button>
                )}
            </div>
            {/* --- END ACTION BUTTONS --- */}

            {/* 🟢 HIỂN THỊ FORM ĐÁNH GIÁ TỔNG QUÁT */}
            {isReviewAvailable && isReviewing && (
                <OverallReviewForm
                    key={order._id + order.orderItems.length} 
                    orderItems={order.orderItems}
                    onReviewSubmit={handleOverallReviewSubmit}
                    isSubmitting={isSubmittingAll}
                />
            )}
            
            {/* ... (Phần Summary) ... */}
            <div className={styles.summaryGrid}>
                {/* Summary Info */}
                <div className={styles.summaryBox}>
                    <p>Mã đơn hàng: **{order._id}**</p>
                    <p>Ngày đặt: **{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}**</p>
                    <p>Trạng thái: <span className={getStatusClass(order.status)}>**{order.status}**</span></p>
                    <p>Phương thức TT: **{order.paymentMethod}**</p>
                </div>
                {/* Shipping Info */}
                <div className={styles.shippingBox}>
                    <h3 className={styles.boxTitle}>Địa chỉ giao hàng</h3>
                    <p>Người nhận: **{order.shippingAddress?.fullName}**</p>
                    <p>SĐT: **{order.shippingAddress?.phone}**</p>
                    <p>Địa chỉ: **{order.shippingAddress?.address}, {order.shippingAddress?.city}**</p>
                </div>
            </div>
            
            <div className={styles.sectionWrapper}>
                <h2 className={styles.sectionTitle}>🛒 Danh sách Sản Phẩm ({order.orderItems.length})</h2>
                <div className={styles.itemList}>
                    {order.orderItems.map((item) => (
                        <div key={item.product?._id || item.product} className={styles.itemCard}>
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
                                <p>Số lượng: **{item.qty}**</p>
                                <p>Thành tiền: 
                                    <strong className={styles.itemSubtotal}>
                                        {(item.price * item.qty).toLocaleString('vi-VN')} VNĐ
                                    </strong>
                                </p>
                            </div>
                            
                            {/* Hiển thị Tóm Tắt Đánh Giá Đã Gửi nếu có */}
                            {item.isReviewed && (
                                <div className={styles.itemReviewSummary}>
                                    <p>Đã Đánh Giá: 
                                        <span className={styles.reviewSummaryRating}>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < item.reviewData.rating ? styles.starSummaryFilled : styles.starSummaryEmpty}>★</span>
                                            ))}
                                            ({item.reviewData.rating} Sao)
                                        </span>
                                    </p>
                                    <p className={styles.reviewSummaryComment}>
                                        Bình luận: *{item.reviewData.comment || "Không có bình luận"}*
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Box */}
            <div className={styles.totalBox}>
                <p>Tổng tiền hàng: <span>{calculatedItemsPrice.toLocaleString('vi-VN')} VNĐ</span></p>
                <p>Phí vận chuyển: <span>{order.shippingPrice?.toLocaleString('vi-VN') || 0} VNĐ</span></p>
                <p className={styles.finalTotal}>Tổng thanh toán: 
                    <span className={styles.finalAmount}>
                        {finalCalculatedTotal.toLocaleString('vi-VN')} VNĐ
                    </span>
                </p>
            </div>
            
        </div>
    );
};

export default BillEachOrder;