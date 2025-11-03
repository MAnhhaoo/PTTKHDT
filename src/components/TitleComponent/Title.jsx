import React, { useEffect, useState } from "react";
import { Col, Row, Pagination } from "antd";
import "./Title.css";
import h1 from "../../assets/img/3.jpg";
import * as ProductService from "../../Service/ProductService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // ✅ Thêm dòng này

const Title = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ Lấy hàm từ context

  const handleDetailProduct = (id) => {
    navigate(`/detailProduct/${id}`);
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductService.getAllProduct({
          limit,
          page: currentPage - 1,
        });
        setProducts(res.data || []);
        setTotalProducts(res.total || 0);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Hàm thêm sản phẩm vào giỏ hàng
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

  return (
    <div className="container">
      <Row style={{ marginBottom: "60px" }}>
        {/* --- Cột danh mục --- */}
        <Col span={6}>
          <div style={{ padding: "20px" }}>
            <div style={{ border: "1px solid #e3e5ec", padding: "20px" }}>
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
              <img src={h1} width={"100%"} alt="" />
            </div>
          </div>
        </Col>

        {/* --- Cột sản phẩm --- */}
        <Col span={18}>
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
                      style={{ width: "100%", borderRadius: "10px" }}
                    />
                    <h2 style={{ fontSize: "18px", marginTop: "10px" }}>
                      <a href="#">{item.name}</a>
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <p style={{ fontSize: "15px" }}>{item.price}₫</p>

                      {/* ✅ 2 nút nằm cạnh nhau */}
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          className="btn_cart"
                          onClick={() => handleAddToCart(item)}
                        >
                          🛒
                        </button>

                        <button
                          className="btn_order"
                          onClick={() => handleDetailProduct(item._id)}
                        >
                          Đặt món +
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <p>Không có dữ liệu sản phẩm</p>
            )}
          </Row>

          {/* ✅ Phân trang */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Pagination
              current={currentPage}
              pageSize={limit}
              total={totalProducts}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Title;
