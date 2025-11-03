import React, { useState, useEffect } from "react";
import {
 // Đảm bảo import đầy đủ 6 hàm từ Service
 getAllProduct, getAllCategory,updateProduct, createProduct, deleteProduct 
} from "../../Service/ProductService"; 

import {
 Box, Typography, Button, Table, TableHead, TableRow, TableCell, 
 TableBody, Dialog, DialogTitle, DialogContent, DialogActions, 
 TextField, MenuItem, Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit"; 
import DeleteIcon from "@mui/icons-material/Delete";

// Base URL để hiển thị ảnh từ backend (ví dụ: http://localhost:3000)
const IMAGE_BASE_URL = import.meta.env.VITE_API_URL_BACKEND; 

const ProductManagement = () => {
 // --- 1. State cho Dữ liệu và Phân trang/Query ---
 const [products, setProducts] = useState([]);
 const [totalPage, setTotalPage] = useState(1);
 const limit = 10; 
 const [categories, setCategories] = useState([]); 
 const [query, setQuery] = useState({ limit, page: 0, filter: null, sort: null }); 

 const [openDialog, setOpenDialog] = useState(false);
 const [editMode, setEditMode] = useState(false);
 const [currentProduct, setCurrentProduct] = useState({
  id: null, name: "", category: "", price: "", description: "", image: null, imageUrl: null, 
 });

 // --- 2. Hàm Tải Sản phẩm ---
 const fetchProducts = async () => {
  try {
   const res = await getAllProduct(query); 
   if (res.message === "ok" && Array.isArray(res.data)) {
    const mappedProducts = res.data.map((product) => ({
     id: product._id, 
     name: product.name,
     category: product.type, 
     price: product.price,
     description: product.description || "Không có mô tả",
     // Xây dựng URL ảnh: BaseURL + /uploads/ten_file.jpg
     imageUrl: product.image ? `${IMAGE_BASE_URL}${product.image}` : null, 
    }));
    setProducts(mappedProducts);
    setTotalPage(res.totalPage); 
   } else {
    console.error("Không thể tải sản phẩm:", res.message);
    setProducts([]);
    setTotalPage(1);
   }
  } catch (err) {
   console.error("Lỗi khi tải sản phẩm:", err);
   setProducts([]);
   setTotalPage(1);
  }
 };

 // --- 3. Hàm Tải Danh mục từ API ---
 const fetchCategories = async () => {
   try {
     const res = await getAllCategory(); 
     
     if (res.message === "ok" && Array.isArray(res.data)) {
       const typeNames = res.data.map(item => item.name).filter(name => name); 
       const uniqueTypeNames = [...new Set(typeNames)];
       setCategories(uniqueTypeNames);

              // Đặt danh mục mặc định cho sản phẩm mới
       if (currentProduct.category === "" && uniqueTypeNames.length > 0) {
        setCurrentProduct(prev => ({ ...prev, category: uniqueTypeNames[0] }));
       }
     } else {
       console.warn("Không thể tải danh mục. Phản hồi API không hợp lệ.");
       setCategories([]); 
     }
   } catch (err) {
     console.error("Lỗi khi tải danh mục (getAllTypes):", err);
     setCategories([]);
   }
 };

 // --- 4. useEffect để Load Dữ liệu ---
 useEffect(() => {
  fetchProducts();
 }, [query]); 
 
 useEffect(() => {
  fetchCategories();
 }, []); 

 // Xử lý thay đổi trang
 const handlePageChange = (event, value) => {
  setQuery(prev => ({ ...prev, page: value - 1 })); 
 };

 // Mở dialog thêm/sửa
 const handleOpenDialog = (product = null) => {
  if (product) {
   setEditMode(true);
   setCurrentProduct({ 
    ...product, 
    image: null, // Đảm bảo image file luôn là null khi mở edit
   }); 
  } else {
   setEditMode(false);
   const defaultCategory = categories.length > 0 ? categories[0] : "";
   setCurrentProduct({
    id: null, name: "", category: defaultCategory, price: "", 
    description: "", image: null, imageUrl: null,
   });
  }
  setOpenDialog(true);
 };

 // Đóng dialog
 const handleCloseDialog = () => setOpenDialog(false);

 // --- 5. Logic Lưu sản phẩm (Tạo mới HOẶC Chỉnh sửa) ---
 const handleSaveProduct = async () => {
  // 1. Validation cơ bản
  if (!currentProduct.name || !currentProduct.category || !currentProduct.price) {
    alert("Vui lòng nhập đầy đủ Tên, Danh mục và Giá sản phẩm!");
    return;
  }
  // Kiểm tra ảnh cho chế độ tạo mới HOẶC nếu ảnh hiện tại đã bị xóa và chưa có ảnh mới
  if (!editMode && !currentProduct.image) {
    alert("Vui lòng chọn hình ảnh cho sản phẩm mới!");
    return;
  }

  // 2. Chuẩn bị FormData
  const formData = new FormData();
  formData.append("name", currentProduct.name);
  formData.append("type", currentProduct.category); 
  formData.append("price", currentProduct.price);
  formData.append("description", currentProduct.description || "");

  if (currentProduct.image) {
    formData.append("image", currentProduct.image); 
  }

  try {
    let res;
    if (editMode) {
      res = await updateProduct(currentProduct.id, formData);
    } else {
      res = await createProduct(formData);
    }
    
    if (res.message.includes("thành công") || res.message === "ok") { 
      alert(`✅ ${editMode ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thành công!`);
      setOpenDialog(false);
      fetchProducts(); 
    } else {
      alert(`⚠️ ${res.message || "Lỗi thao tác sản phẩm."}`);
    }
  } catch (error) {
    console.error("❌ Lỗi khi thao tác sản phẩm:", error);
    alert(`Lỗi kết nối khi ${editMode ? 'chỉnh sửa' : 'tạo mới'} sản phẩm! Vui lòng kiểm tra console.`);
  }
 };

 // --- 6. Xóa sản phẩm ---
 const handleDelete = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
    try {
      const res = await deleteProduct(id);
      if (res.message === "Xóa thành công" || res.message === "ok") { 
        alert("✅ Xóa sản phẩm thành công!");
        fetchProducts(); 
      } else {
        alert(`⚠️ Lỗi khi xóa: ${res.message}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi kết nối khi xóa sản phẩm!");
    }
  }
 };
 
 // Tính toán STT cho từng sản phẩm
 const getProductSTT = (index) => {
  return query.page * limit + index + 1;
 };
 const displayPage = query.page + 1;

 return (
  <Box
   sx={{
    p: 4, zoom: 1.15, transformOrigin: "top left",
   }}
  >
   <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
    Quản lý sản phẩm
   </Typography>

   {/* Nút thêm */}
   <Box sx={{ mb: 3 }}>
    <Button
     variant="contained" color="primary" startIcon={<AddIcon />}
     onClick={() => handleOpenDialog()}
     sx={{ fontSize: "1.1rem", fontWeight: "bold", px: 3, py: 1.2 }}
    >
     Thêm sản phẩm
    </Button>
   </Box>

   {/* Bảng sản phẩm */}
   <Table sx={{ backgroundColor: "#fff", boxShadow: 3, borderRadius: 2, "& th, & td": { fontSize: "1rem", padding: "14px 16px" } }}>
    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
     <TableRow>
      <TableCell><strong>STT</strong></TableCell>
      <TableCell><strong>Ảnh</strong></TableCell> 
      <TableCell><strong>Tên sản phẩm</strong></TableCell>
      <TableCell><strong>Danh mục</strong></TableCell>
      <TableCell><strong>Giá (₫)</strong></TableCell>
      <TableCell><strong>Mô tả</strong></TableCell>
      <TableCell align="center"><strong>Thao tác</strong></TableCell>
     </TableRow>
    </TableHead>
    <TableBody>
     {products.map((product, index) => (
      <TableRow key={product.id || index} hover>
       <TableCell><strong>{getProductSTT(index)}</strong></TableCell>
       <TableCell>
        {/* HIỂN THỊ ẢNH TRONG BẢNG */}
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <Box sx={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', fontSize: '0.75rem', textAlign: 'center' }}>
            No Image
          </Box>
        )}
       </TableCell>
       <TableCell>{product.name}</TableCell>
       <TableCell>{product.category}</TableCell>
       <TableCell>{product.price.toLocaleString()}</TableCell>
       <TableCell>{product.description}</TableCell>
       <TableCell align="center">
        <Button
         color="warning" variant="outlined" startIcon={<EditIcon />}
         onClick={() => handleOpenDialog(product)}
         sx={{ mr: 1, fontWeight: "bold" }}
        > Sửa
        </Button>
        <Button
         color="error" variant="outlined" startIcon={<DeleteIcon />}
         onClick={() => handleDelete(product.id)}
         sx={{ fontWeight: "bold" }}
        > Xóa
        </Button>
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
   
   {/* Component Phân trang */}
   <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pb: 2 }}>
    <Pagination
     count={totalPage} page={displayPage} onChange={handlePageChange}
     color="primary" size="large"
    />
   </Box>

   {/* Dialog thêm/sửa sản phẩm */}
   <Dialog
    open={openDialog} 
    onClose={handleCloseDialog} 
    maxWidth="md" fullWidth
    PaperProps={{ sx: { p: 3, borderRadius: 3, zoom: 1.15 } }}
   >
    <DialogTitle sx={{ fontSize: "1.6rem", fontWeight: "bold", textAlign: "center" }}>
     {editMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
    </DialogTitle>

    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1, px: 2 }}>
     <TextField
      label="Tên sản phẩm" fullWidth variant="outlined" value={currentProduct.name}
      onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
      InputProps={{ style: { fontSize: "1.2rem", padding: "10px" } }}
      InputLabelProps={{ style: { fontSize: "1.1rem" } }}
     />

     <TextField
      select label="Danh mục" fullWidth variant="outlined"
      value={currentProduct.category || (categories.length > 0 ? categories[0] : "")} 
      onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
      InputProps={{ style: { fontSize: "1.2rem", padding: "10px" } }}
      InputLabelProps={{ style: { fontSize: "1.1rem" } }}
     >
      {categories.map((cat) => (
       <MenuItem key={cat} value={cat} sx={{ fontSize: "1.1rem" }}>
        {cat}
       </MenuItem>
      ))}
     </TextField>

     <TextField
      label="Giá (₫)" fullWidth type="number" variant="outlined" value={currentProduct.price}
      onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
      InputProps={{ style: { fontSize: "1.2rem", padding: "10px" } }}
      InputLabelProps={{ style: { fontSize: "1.1rem" } }}
     />

     <TextField
      label="Mô tả" fullWidth multiline rows={4} variant="outlined" value={currentProduct.description}
      onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
      InputProps={{ style: { fontSize: "1.1rem", padding: "10px" } }}
      InputLabelProps={{ style: { fontSize: "1rem" } }}
     />
     
     {(editMode && currentProduct.imageUrl && !currentProduct.image) && (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="body1" sx={{mb: 1, fontWeight: 'bold'}}>Ảnh hiện tại:</Typography>
        <img 
          src={currentProduct.imageUrl} alt="Ảnh sản phẩm hiện tại" 
          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain', border: '1px dashed #ccc' }}
        />
      </Box>
     )}

     <Button
      variant="outlined" component="label" color={currentProduct.image ? "success" : "primary"}
      sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
     >
      {editMode ? "Chọn ảnh MỚI (nếu muốn thay đổi)" : "Chọn hình ảnh"}
      <input
       type="file" hidden accept="image/*"
       onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.files[0] })}
      />
     </Button>

     {currentProduct.image && (
      <Typography variant="body2" color="success.main" sx={{ mt: -2 }}>
       📸 Đã chọn: **{currentProduct.image.name}**
      </Typography>
     )}

    </DialogContent>

    <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
     <Button
      onClick={handleCloseDialog} color="inherit" variant="outlined"
      sx={{ fontSize: "1.1rem", px: 3, py: 1 }}
     >
      Hủy
     </Button>
     <Button
      variant="contained" onClick={handleSaveProduct}
      sx={{ fontSize: "1.1rem", fontWeight: "bold", px: 3, py: 1 }}
     >
      {editMode ? "Lưu thay đổi" : "Lưu"}
     </Button>
    </DialogActions>
   </Dialog>
  </Box>
 );
};

export default ProductManagement;