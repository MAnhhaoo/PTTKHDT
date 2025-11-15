import React, { useEffect, useState } from "react";
import { Col, Row, Pagination, Input } from "antd"; 
import "./Title.css";
import h1 from "../../assets/img/3.jpg";
import * as ProductService from "../../Service/ProductService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const { Search } = Input; 

const Title = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleDetailProduct = (id) => {
        navigate(`/detailProduct/${id}`);
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    // 🌟 STATE MỚI: ID danh mục được chọn
    const [selectedCategory, setSelectedCategory] = useState(""); 
    const [isSearching, setIsSearching] = useState(false); 

    const limit = 12;

    // --- LẤY DANH MỤC ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await ProductService.getAllCategory();
                setCategories(res.data || []);
            } catch (err) {
                console.error("Lỗi khi lấy danh mục:", err);
            }
        };
        fetchCategories();
    }, []);

    // --- LẤY SẢN PHẨM (Kích hoạt khi currentPage, searchKey, HOẶC selectedCategory thay đổi) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsSearching(true);
                
                // 💡 LƯU Ý: Đảm bảo hàm ProductService.getAllProduct của bạn
                // chấp nhận tham số 'type' (mã danh mục)
                const res = await ProductService.getAllProduct({
                    limit,
                    page: currentPage - 1,
                    name: searchKey, 
                    type: selectedCategory // ✅ Gửi mã danh mục được chọn
                });

                setProducts(res.data || []);
                setTotalProducts(res.total || 0);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setIsSearching(false);
            }
        };
        fetchData();
    }, [currentPage, searchKey, selectedCategory]); // ✅ Dependencies MỚI

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleAddToCart = (product) => {
        const productToAdd = {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            type: product.type,
        };
        addToCart(productToAdd, 1);
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    };
    
    // --- XỬ LÝ TÌM KIẾM ---
    const onSearch = (value) => {
        // Reset về trang 1 và bỏ chọn danh mục khi tìm kiếm
        setCurrentPage(1);
        setSelectedCategory(""); // ✅ Xóa lọc danh mục khi tìm kiếm
        setSearchKey(value);
    };

    // --- 🌟 HÀM XỬ LÝ CHỌN DANH MỤC MỚI ---
    const handleCategoryClick = (categoryName) => {
        // 1. Nếu đang chọn lại danh mục đó, thì bỏ chọn
        if (selectedCategory === categoryName) {
            setSelectedCategory(""); // Bỏ lọc
        } else {
            // 2. Chọn danh mục mới
            setSelectedCategory(categoryName);
        }
        
        // Luôn reset trang và xóa từ khóa tìm kiếm khi lọc theo danh mục
        setCurrentPage(1);
        setSearchKey(""); 
    };

    // Hàm kiểm tra xem danh mục đang được chọn hay không
    const isCategorySelected = (categoryName) => selectedCategory === categoryName;


    return (
        <div className="container">
            <Row style={{ marginBottom: "60px" }}>
                {/* --- Cột danh mục & Tìm kiếm --- */}
                <Col span={6}>
                    <div style={{ padding: "20px" }}>
                        
                        {/* 🌟 Ô TÌM KIẾM SẢN PHẨM */}
                        <div style={{ marginBottom: "20px" }}>
                            <Search
                                placeholder="Tìm kiếm tên món ăn..."
                                allowClear
                                enterButton="Tìm"
                                size="large"
                                onSearch={onSearch}
                                loading={isSearching}
                                // Hiển thị từ khóa hiện tại (nếu có)
                                value={searchKey} 
                                onChange={(e) => setSearchKey(e.target.value)}
                            />
                        </div>

                        {/* Danh mục */}
                        <div style={{ border: "1px solid #e3e5ec", padding: "20px" }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Danh Mục</h3>
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <div 
                                        key={index} 
                                        className="h2c" 
                                        style={{ 
                                            backgroundColor: isCategorySelected(cat.name) ? '#ffeedd' : 'transparent',
                                            padding: '5px 0',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleCategoryClick(cat.name)} // ✅ Kích hoạt lọc
                                    >
                                        <h2>
                                            <a style={{ 
                                                color: isCategorySelected(cat.name) ? '#F37004' : '#333', 
                                                fontWeight: isCategorySelected(cat.name) ? 'bold' : 'normal' 
                                            }}>
                                                {cat.name}
                                            </a>
                                        </h2>
                                    </div>
                                ))
                            ) : (
                                <p>Không có danh mục</p>
                            )}
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <img src={h1} width={"100%"} alt="Banner quảng cáo" />
                        </div>
                    </div>
                </Col>

                {/* --- Cột sản phẩm --- */}
                <Col span={18}>
                    {/* Tiêu đề hiển thị lọc/tìm kiếm */}
                    {searchKey || selectedCategory ? (
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#F37004', paddingLeft: '20px' }}>
                            {selectedCategory && !searchKey ? `Danh mục: "${selectedCategory}"` : `Kết quả tìm kiếm cho: "${searchKey}"`}
                        </h2>
                    ) : (
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333', paddingLeft: '20px' }}>
                            Tất Cả Món Ăn
                        </h2>
                    )}
                    
                    {isSearching ? (
                        <div style={{ padding: '50px', textAlign: 'center' }}>
                            Đang tải sản phẩm...
                        </div>
                    ) : (
                        <Row gutter={[20, 20]}>
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <Col key={item._id} span={6}>
                                        <div
                                            style={{
                                                border: "1px solid #e3e5ec",
                                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                                borderRadius: "10px",
                                                padding: "6px 13px",
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:3002${item.image}`}
                                                alt={item.name}
                                                style={{ width: "100%", borderRadius: "10px", height: '180px', objectFit: 'cover' }}
                                            />
                                            <h2 style={{ fontSize: "18px", marginTop: "10px", height: '45px', overflow: 'hidden' }}>
                                                <a onClick={() => handleDetailProduct(item._id)} style={{ cursor: 'pointer', color: 'black' }}>{item.name}</a>
                                            </h2>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                }}
                                            >
                                                <p style={{ fontSize: "15px", fontWeight: 'bold', color: '#b91c1c' }}>{item.price.toLocaleString('vi-VN')}₫</p>

                                                <div style={{ display: "flex", gap: "5px" }}>
                                                    <button
                                                        className="btn_cart"
                                                        onClick={() => handleAddToCart(item)}
                                                        style={{ background: '#fff', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 8px', cursor: 'pointer' }}
                                                    >
                                                        🛒
                                                    </button>

                                                    <button
                                                        className="btn_order"
                                                        onClick={() => handleDetailProduct(item._id)}
                                                        style={{ background: '#F37004', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '14px' }}
                                                    >
                                                        Đặt món +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <p style={{ paddingLeft: '20px' }}>
                                    Không tìm thấy sản phẩm nào
                                    {searchKey && ` cho từ khóa "${searchKey}"`}
                                    {selectedCategory && !searchKey && ` trong danh mục "${selectedCategory}"`}.
                                </p>
                            )}
                        </Row>
                    )}

                    {/* Phân trang chỉ hiển thị khi có nhiều hơn 1 trang */}
                    {totalProducts > limit && (
                        <div style={{ textAlign: "center", marginTop: "40px" }}>
                            <Pagination
                                current={currentPage}
                                pageSize={limit}
                                total={totalProducts}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Title;