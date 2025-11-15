import React, { useState, useEffect, forwardRef, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide,
  Snackbar,
  Alert,
  Divider, // Thêm Divider để ngăn cách các phần trong Dialog
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Icon cho địa chỉ
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Icon cho sản phẩm

import * as OrderService from "../../Service/OrderService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const formControlRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  // 🟢 Lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    try {
      const res = await OrderService.getAllOrder();
      setOrders(res.data || []); // đảm bảo dữ liệu có dạng mảng
    } catch (error) {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
      setSnackbarMessage("Không thể tải danh sách đơn hàng!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (openUpdateDialog && formControlRef.current) {
      setDropdownWidth(formControlRef.current.clientWidth);
    }
  }, [openUpdateDialog]);

  // ✨ ĐÃ CẬP NHẬT: Xử lý xem chi tiết đơn hàng (lấy detail)
  const handleViewDetails = async (order) => {
    try {
      // ⚠️ Giả định OrderService.getDetailOrder(id) trả về dữ liệu đơn hàng chi tiết
      // bao gồm cả thông tin người dùng, địa chỉ và items (danh sách sản phẩm)
      const res = await OrderService.getDetailOrder(order._id); 
      setSelectedOrder(res.data); // dữ liệu chi tiết
      setOpenViewDialog(true);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", error);
      setSnackbarMessage("Không thể tải chi tiết đơn hàng!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenUpdateDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenViewDialog(false);
    setOpenUpdateDialog(false);
    setSelectedOrder(null);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // 🟡 Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    try {
      if (!selectedOrder?._id) return;

      await OrderService.updateStatus(selectedOrder._id, { status: newStatus });

      setSnackbarMessage("✅ Cập nhật trạng thái thành công!");
      setSnackbarSeverity("success");

      // 🔁 Cập nhật ngay trạng thái trong state mà không cần gọi lại API
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      setSnackbarMessage("Cập nhật trạng thái thất bại!");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setOpenUpdateDialog(false);
    }
  };

  // 🔴 Xóa đơn hàng
  const handleDeleteOrder = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
      try {
        await OrderService.deleteOrder(id);
        setSnackbarMessage("🗑️ Xóa đơn hàng thành công!");
        setSnackbarSeverity("success");
        fetchOrders();
      } catch (error) {
        console.error("❌ Lỗi khi xóa:", error);
        setSnackbarMessage("Xóa đơn hàng thất bại!");
        setSnackbarSeverity("error");
      } finally {
        setOpenSnackbar(true);
      }
    }
  };

  // Hàm hỗ trợ hiển thị màu Chip
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "warning"; // vàng
      case "Đã xác nhận":
        return "info"; // xanh dương nhạt
      case "Đang giao":
        return "primary"; // xanh nước biển
      case "Giao thành công":
        return "success"; // xanh lá
      case "Giao thất bại":
        return "secondary"; // xám
      case "Hủy đơn":
        return "error"; // đỏ
      default:
        return "default";
    }
  };

  // Hàm hỗ trợ hiển thị Icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Đang giao":
        return <LocalShippingIcon />;
      case "Giao thành công":
        return <DoneAllIcon />;
      case "Giao thất bại":
        return <CancelIcon />;
      case "Hủy đơn":
        return <CancelIcon />;
      case "Đã xác nhận":
        return <VisibilityIcon />;
      case "Chờ xác nhận":
        return <UpdateIcon />;
      default:
        return null;
    }
  };

  // Hàm hỗ trợ định dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") + " ₫" : "0 ₫";
  };


  return (
    <Box sx={{ p: 4, zoom: 1.1 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Quản lý đơn hàng
      </Typography>

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
            <TableCell><strong>Mã đơn</strong></TableCell>
            <TableCell><strong>Khách hàng</strong></TableCell>
            <TableCell><strong>Ngày đặt</strong></TableCell>
            <TableCell><strong>Tổng tiền</strong></TableCell>
            <TableCell><strong>Trạng thái</strong></TableCell>
            <TableCell align="center"><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.user ? order.user.name : "Không rõ"}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  icon={getStatusIcon(order.status)}
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                />
              </TableCell>
              <TableCell align="center">
                {/* ✨ ĐÃ THÊM: Nút xem chi tiết */}
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(order)}
                  sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                >
                  Xem
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<UpdateIcon />}
                  onClick={() => handleOpenUpdate(order)}
                  sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                >
                  Cập nhật
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteOrder(order._id)}
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

      {/* ✨ ĐÃ THÊM: Dialog xem chi tiết đơn hàng */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{ sx: { p: 4, borderRadius: 3, zoom: 1.1 } }}
      >
        <DialogTitle
          sx={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            textAlign: "center", 
            color: 'primary.main',
            pb: 1
          }}
        >
          Chi Tiết Đơn Hàng #{selectedOrder?._id.substring(0, 8)}...
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />

        <DialogContent dividers>
          {selectedOrder ? (
            <Box>
              {/* Thông tin chung */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.secondary", display: 'flex', alignItems: 'center', mb: 1 }}>
                  <UpdateIcon sx={{ mr: 1 }} color="warning" />
                  THÔNG TIN CHUNG
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Mã đơn:</TableCell><TableCell>{selectedOrder._id}</TableCell></TableRow>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Khách hàng:</TableCell><TableCell>{selectedOrder.user ? selectedOrder.user.name : "Không rõ"}</TableCell></TableRow>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Email:</TableCell><TableCell>{selectedOrder.user ? selectedOrder.user.email : "Không rõ"}</TableCell></TableRow>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Ngày đặt:</TableCell><TableCell>{new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</TableCell></TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái:</TableCell>
                      <TableCell>
                        <Chip
                          label={selectedOrder.status}
                          color={getStatusColor(selectedOrder.status)}
                          icon={getStatusIcon(selectedOrder.status)}
                          sx={{ fontWeight: "bold", fontSize: "1rem" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tổng tiền:</TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {formatCurrency(selectedOrder.totalPrice)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <Divider sx={{ my: 3 }} />

              {/* Địa chỉ giao hàng */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.secondary", display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1 }} color="info" />
                  ĐỊA CHỈ GIAO HÀNG
                </Typography>
                <Typography variant="body1">
                  Người nhận: {selectedOrder.shippingAddress.fullName}
                </Typography>
                <Typography variant="body1">
                  SĐT: {selectedOrder.shippingAddress.phone}
                </Typography>
                <Typography variant="body1">
                  Địa chỉ: {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                </Typography>
              </Box>
              <Divider sx={{ my: 3 }} />

              {/* Danh sách sản phẩm */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.secondary", display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ShoppingCartIcon sx={{ mr: 1 }} color="success" />
                  DANH SÁCH SẢN PHẨM
                </Typography>
                <Table size="medium" sx={{ '& th, & td': { fontSize: '1rem' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Sản phẩm</strong></TableCell>
                      <TableCell align="center"><strong>SL</strong></TableCell>
                      <TableCell align="right"><strong>Giá</strong></TableCell>
                      <TableCell align="right"><strong>Thành tiền</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderItems.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">{item.qty}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price * item.qty)}</TableCell>
                      </TableRow>
                    ))}
                    {/* Hàng tổng cộng */}
                    <TableRow>
                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>TỔNG CỘNG:</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'error.main' }}>{formatCurrency(selectedOrder.totalPrice)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>

            </Box>
          ) : (
            <Typography>Đang tải chi tiết đơn hàng...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", mt: 2 }}>
          <Button 
            sx={{ fontSize: "1.2rem", px: 3 }} 
            onClick={handleCloseDialogs} 
            variant="contained" 
            color="primary"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>


      {/* Dialog cập nhật trạng thái */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{ sx: { p: 4, borderRadius: 3, zoom: 1.2 } }}
      >
        <DialogTitle
          sx={{ fontSize: "1.6rem", fontWeight: "bold", textAlign: "center" }}
        >
          Cập nhật trạng thái đơn hàng
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 3 }} ref={formControlRef}>
            <InputLabel sx={{ fontSize: "1.4rem", top: -8 }}>
              Trạng thái
            </InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              sx={{
                fontSize: "1.4rem",
                minHeight: 56,
                "& .MuiSelect-select": { padding: "12px 14px" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: { width: dropdownWidth, minWidth: 200 },
                },
              }}
            >
              <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
              <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
              <MenuItem value="Đang giao">Đang giao</MenuItem>
              <MenuItem value="Giao thành công">Giao thành công</MenuItem>
              <MenuItem value="Giao thất bại">Giao thất bại</MenuItem>
              <MenuItem value="Hủy đơn">Hủy đơn</MenuItem>
            </Select>

          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button sx={{ fontSize: "1.2rem" }} onClick={handleCloseDialogs}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateStatus}
            sx={{ fontSize: "1.2rem", fontWeight: "bold", px: 4 }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: "1.1rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderManagement;