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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Pizza", description: "Các loại pizza đặc biệt" },
    { id: 2, name: "Đồ uống", description: "Bia, nước ngọt, nước trái cây" },
    { id: 3, name: "Món ăn kèm", description: "Khoai tây chiên, salad..." },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
    description: "",
  });

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({ id: null, name: "", description: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveCategory = () => {
    if (editMode) {
      setCategories((prev) =>
        prev.map((c) => (c.id === currentCategory.id ? currentCategory : c))
      );
    } else {
      const newCategory = {
        ...currentCategory,
        id: categories.length + 1,
      };
      setCategories([...categories, newCategory]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        zoom: 1.15,
        transformOrigin: "top left",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Quản lý danh mục
      </Typography>

      {/* Nút thêm */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            px: 3,
            py: 1.3,
          }}
        >
          Thêm danh mục
        </Button>
      </Box>

      {/* Bảng danh mục */}
      <Table
        sx={{
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          "& th, & td": { fontSize: "1.05rem", padding: "16px 18px" },
        }}
      >
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Tên danh mục</strong></TableCell>
            <TableCell><strong>Mô tả</strong></TableCell>
            <TableCell align="center"><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} hover>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell align="center">
                <Button
                  color="warning"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(category)}
                  sx={{ mr: 1, fontWeight: "bold" }}
                >
                  Sửa
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(category.id)}
                  sx={{ fontWeight: "bold" }}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
        <DialogTitle sx={{ fontSize: "1.6rem", fontWeight: "bold", textAlign: "center" }}>
          {editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={currentCategory.name}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, name: e.target.value })
            }
            InputProps={{ style: { fontSize: "1.2rem", padding: "10px" } }}
            InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={currentCategory.description}
            onChange={(e) =>
              setCurrentCategory({
                ...currentCategory,
                description: e.target.value,
              })
            }
            InputProps={{ style: { fontSize: "1.1rem", padding: "10px" } }}
            InputLabelProps={{ style: { fontSize: "1rem" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ fontSize: "1.1rem" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
