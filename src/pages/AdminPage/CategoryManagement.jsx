import React, { useEffect, useState } from "react";
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
import * as ProductService from "../../Service/ProductService";
import { message } from "antd";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: "", description: "" });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await ProductService.getAllCategory();
      setCategories(res.data || []);
    } catch {
      message.error("Không thể tải danh mục!");
    }
  };

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

  const handleSaveCategory = async () => {
    if (!currentCategory.name.trim()) {
      message.warning("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      if (editMode) {
        await ProductService.updateCategory(currentCategory._id, currentCategory);
        message.success("Cập nhật danh mục thành công!");
      } else {
        await ProductService.createCategory(currentCategory);
        message.success("Thêm danh mục thành công!");
      }
      setOpenDialog(false);
      fetchCategories();
    } catch {
      message.error("Lưu danh mục thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      try {
        await ProductService.deleteCategory(id);
        message.success("Xóa danh mục thành công!");
        fetchCategories();
      } catch {
        message.error("Xóa thất bại!");
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Quản lý danh mục</Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Thêm danh mục
      </Button>

      <Table sx={{ mt: 3 , zoom: 1.3 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên danh mục</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c._id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(c)} startIcon={<EditIcon />}>Sửa</Button>
                  <Button onClick={() => handleDelete(c._id)} color="error" startIcon={<DeleteIcon />}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={4} align="center">Không có danh mục</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            fullWidth
            margin="dense"
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            margin="dense"
            value={currentCategory.description}
            onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveCategory}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
