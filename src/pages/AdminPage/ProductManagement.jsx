import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductManagement = () => {
  // Dữ liệu giả lập
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Pizza Hải Sản",
      category: "Pizza",
      price: 159000,
      description: "Pizza hải sản tươi ngon phô mai béo ngậy",
    },
    {
      id: 2,
      name: "Bia Heineken",
      category: "Đồ uống",
      price: 25000,
      description: "Bia lon Heineken 330ml mát lạnh",
    },
    {
      id: 3,
      name: "Khoai Tây Chiên",
      category: "Món ăn kèm",
      price: 39000,
      description: "Khoai tây chiên giòn rụm ăn kèm sốt",
    },
  ]);

  // Danh mục mẫu
  const categories = ["Pizza", "Đồ uống", "Món ăn kèm"];

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    description: "",
  });

  // Mở dialog thêm/sửa
  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentProduct(product);
    } else {
      setEditMode(false);
      setCurrentProduct({
        id: null,
        name: "",
        category: "",
        price: "",
        description: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Lưu sản phẩm
  const handleSaveProduct = () => {
    if (editMode) {
      setProducts((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? currentProduct : p))
      );
    } else {
      const newProduct = {
        ...currentProduct,
        id: products.length + 1,
      };
      setProducts([...products, newProduct]);
    }
    setOpenDialog(false);
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        zoom: 1.15, // ✅ Phóng to toàn bộ giao diện
        transformOrigin: "top left",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Quản lý sản phẩm
      </Typography>

      {/* Nút thêm */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            px: 3,
            py: 1.2,
          }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Bảng sản phẩm */}
      <Table
        sx={{
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          "& th, & td": { fontSize: "1rem", padding: "14px 16px" },
        }}
      >
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Tên sản phẩm</strong></TableCell>
            <TableCell><strong>Danh mục</strong></TableCell>
            <TableCell><strong>Giá (₫)</strong></TableCell>
            <TableCell><strong>Mô tả</strong></TableCell>
            <TableCell align="center"><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price.toLocaleString()}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell align="center">
                <Button
                  color="warning"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(product)}
                  sx={{ mr: 1, fontWeight: "bold" }}
                >
                  Sửa
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(product.id)}
                  sx={{ fontWeight: "bold" }}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog thêm/sửa sản phẩm */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 3,
            zoom: 1.15,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.6rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {editMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 1,
            px: 2,
          }}
        >
          <TextField
            label="Tên sản phẩm"
            fullWidth
            variant="outlined"
            value={currentProduct.name}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
            InputProps={{
              style: { fontSize: "1.2rem", padding: "10px" },
            }}
            InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          />

          <TextField
            select
            label="Danh mục"
            fullWidth
            variant="outlined"
            value={currentProduct.category}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, category: e.target.value })
            }
            InputProps={{
              style: { fontSize: "1.2rem", padding: "10px" },
            }}
            InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: "1.1rem" }}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Giá (₫)"
            fullWidth
            type="number"
            variant="outlined"
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                price: Number(e.target.value),
              })
            }
            InputProps={{
              style: { fontSize: "1.2rem", padding: "10px" },
            }}
            InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          />

          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentProduct.description}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                description: e.target.value,
              })
            }
            InputProps={{
              style: { fontSize: "1.1rem", padding: "10px" },
            }}
            InputLabelProps={{ style: { fontSize: "1rem" } }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            variant="outlined"
            sx={{
              fontSize: "1.1rem",
              px: 3,
              py: 1,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              px: 3,
              py: 1,
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
