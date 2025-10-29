import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as ProductService from "../../Service/ProductService";
import "./DetailProduct.css"; // 👈 import file CSS

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
    const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const res = await ProductService.getProductById(id);
      setProduct(res.data?.data || res.data);
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    navigate('/cart')
  };

  if (!product || Object.keys(product).length === 0) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="container">
      <div className="detail-box">
        <div className="detail-content">
          {/* Ảnh sản phẩm */}
          <div className="detail-image">
            <img
              src={
                product.image?.startsWith("/")
                  ? `http://localhost:3002${product.image}`
                  : `http://localhost:3002/${product.image}`
              }
              alt={product.name}
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="detail-info">
            <h2>{product.name}</h2>
            <p className="price">Giá: {product.price.toLocaleString()}₫</p>
            <p>
              <strong>Loại:</strong> {product.type}
            </p>
            <p>
              <strong>Còn lại:</strong> {product.countInStock ?? 0}
            </p>
            <p>
              <strong>Đánh giá:</strong> {product.rating ?? 0} ⭐
            </p>
            <p className="description">
              <strong>Mô tả:</strong>{" "}
              {product.description || "Không có mô tả."}
            </p>

            <button onClick={handleAddToCart} className="add-btn">
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
