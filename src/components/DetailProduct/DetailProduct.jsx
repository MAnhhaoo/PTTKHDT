import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as ProductService from "../../Service/ProductService"; // Cần đảm bảo đường dẫn đúng
import { useCart } from "../../context/CartContext"; // ⬅️ IMPORT useCart
import "./DetailProduct.css";

const DetailProduct = () => {
  const { id } = useParams();
  const { addToCart } = useCart(); // ⬅️ Lấy hàm
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
    
  useEffect(() => {
    const fetchData = async () => {
      // Giả sử ProductService.getProductById(id) trả về { data: productData }
      const res = await ProductService.getProductById(id);
      setProduct(res.data?.data || res.data); // Lấy product object từ response
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product._id) {
        alert("Thông tin sản phẩm không đầy đủ.");
        return;
    }
    
    // Chuẩn bị object sản phẩm để thêm vào giỏ hàng
    const productToAdd = { 
        _id: product._id, // Quan trọng: sử dụng _id của MongoDB
        name: product.name, 
        price: product.price,
        image: product.image,
        type: product.type,
        // Có thể thêm countInStock, rating nếu cần hiển thị trong giỏ
    };

    addToCart(productToAdd, 1); // Thêm 1 sản phẩm
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    navigate('/cart');
  };

  if (!product || Object.keys(product).length === 0 || !product._id) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }
  
  // Dựng URL ảnh cho frontend
  const imageUrl = product.image?.startsWith("/")
        ? `http://localhost:3002${product.image}`
        : `http://localhost:3002/${product.image}`;

  return (
    <div className="container">
      <div className="detail-box">
        <div className="detail-content">
          {/* Ảnh sản phẩm */}
          <div className="detail-image">
            <img src={imageUrl} alt={product.name} />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="detail-info">
            <h2>{product.name}</h2>
            <p className="price">Giá: {product.price.toLocaleString()}₫</p>
            <p><strong>Loại:</strong> {product.type}</p>
            {/* <p><strong>Còn lại:</strong> {product.countInStock ?? 0}</p> */}
            <p><strong>Đánh giá:</strong> {product.rating ?? 0} ⭐</p>
            <p className="description">
              <strong>Mô tả:</strong> {product.description || "Không có mô tả."}
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