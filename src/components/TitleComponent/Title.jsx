import React, { useEffect, useState } from "react";
import { Col, Row, Pagination, Input } from "antd"; // ✅ Thêm Input
import "./Title.css";
import h1 from "../../assets/img/3.jpg";
import * as ProductService from "../../Service/ProductService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const { Search } = Input; // Lấy component Search từ Ant Design

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
    const [searchKey, setSearchKey] = useState(""); // 🌟 STATE MỚI: Từ khóa tìm kiếm
    const [isSearching, setIsSearching] = useState(false); 

    const limit = 12;

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

    // 🌟 useEffect CẬP NHẬT: Kích hoạt khi currentPage HOẶC searchKey thay đổi
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsSearching(true);
                
                // ✅ Gửi tham số name (searchKey) vào ProductService
                const res = await ProductService.getAllProduct({
                    limit,
                    page: currentPage - 1,
                    name: searchKey, 
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
    }, [currentPage, searchKey]); // ✅ Dependencies: currentPage và searchKey

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
    
    // 🌟 HÀM XỬ LÝ TÌM KIẾM
    const onSearch = (value) => {
        // Đặt lại về trang 1 và cập nhật từ khóa (kích hoạt useEffect)
        setCurrentPage(1);
        setSearchKey(value);
    };

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
                                onSearch={onSearch} // Xử lý tìm kiếm
                                loading={isSearching} // Hiện loading khi đang tìm
                            />
                        </div>

                        {/* Danh mục */}
                        <div style={{ border: "1px solid #e3e5ec", padding: "20px" }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Danh Mục</h3>
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <div key={index} className="h2c">
                                        <h2>
                                            <a href="#">{cat.name}</a>
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
                    {/* Hiển thị tiêu đề tìm kiếm nếu có từ khóa */}
                    {searchKey && (
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#F37004' }}>
                            Kết quả tìm kiếm cho: "{searchKey}"
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
                                    Không tìm thấy sản phẩm nào {searchKey ? `cho từ khóa "${searchKey}"` : ''}.
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