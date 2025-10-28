import React, {
  useState,
  forwardRef,
  useRef,
  useEffect,
} from "react";
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide,
  Snackbar, // +++ 1. IMPORT THÊM SNACKBAR
  Alert,     // +++ 1. IMPORT THÊM ALERT
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";

// Slide animation cho dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    // ... (dữ liệu đơn hàng giữ nguyên) ...
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      date: "2025-10-20",
      total: 560000,
      status: "Đang giao",
      items: [
        { name: "Pizza Hải Sản", qty: 1, price: 220000 },
        { name: "Bia Heineken", qty: 2, price: 170000 },
      ],
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      date: "2025-10-22",
      total: 320000,
      status: "Hoàn thành",
      items: [
        { name: "Pizza Phô Mai", qty: 1, price: 180000 },
        { name: "Pepsi", qty: 2, price: 70000 },
      ],
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      date: "2025-10-25",
      total: 240000,
      status: "Đã hủy",
      items: [{ name: "Pizza Bò BBQ", qty: 1, price: 240000 }],
    },
  ]);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const formControlRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  // +++ 2. THÊM STATE CHO SNACKBAR +++
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (openUpdateDialog && formControlRef.current) {
      setDropdownWidth(formControlRef.current.clientWidth);
    }
  }, [openUpdateDialog]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenUpdateDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenViewDialog(false);
    setOpenUpdateDialog(false);
  };

  // +++ 2. THÊM HÀM ĐÓNG SNACKBAR +++
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // +++ 3. CHỈNH SỬA HÀM CẬP NHẬT +++
  const handleUpdateStatus = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      )
    );
    setOpenUpdateDialog(false); // Đóng dialog

    // Kích hoạt thông báo
    setSnackbarMessage("Cập nhật trạng thái thành công!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const getStatusColor = (status) => {
    // ... (giữ nguyên)
    switch (status) {
      case "Đang giao":
        return "warning";
      case "Hoàn thành":
        return "success";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    // ... (giữ nguyên)
    switch (status) {
      case "Đang giao":
        return <LocalShippingIcon />;
      case "Hoàn thành":
        return <DoneAllIcon />;
      case "Đã hủy":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4, zoom: 1.15 }}>
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
            <TableCell>
              <strong>Mã đơn</strong>
            </TableCell>
            <TableCell>
              <strong>Khách hàng</strong>
            </TableCell>
            <TableCell>
              <strong>Ngày đặt</strong>
            </TableCell>
            <TableCell>
              <strong>Tổng tiền</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
            </TableCell>
          	<TableCell align="center">
          	  <strong>Thao tác</strong>
          	</TableCell>
          </TableRow>
    	</TableHead>
    	<TableBody>
    	  {orders.map((order) => (
    		<TableRow key={order.id} hover>
    		  <TableCell>{order.id}</TableCell>
    		  <TableCell>{order.customer}</TableCell>
    		  <TableCell>{order.date}</TableCell>
    		  <TableCell>{order.total.toLocaleString()} ₫</TableCell>
    		  <TableCell>
    			<Chip
    			  label={order.status}
    			  color={getStatusColor(order.status)}
    			  icon={getStatusIcon(order.status)}
    			  sx={{ fontWeight: "bold", fontSize: "1rem" }}
    			/>
    		  </TableCell>
    		  <TableCell align="center">
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
    			  sx={{ fontSize: "1rem", fontWeight: "bold" }}
    			>
    			  Cập nhật
    			</Button>
    		  </TableCell>
    		</TableRow>
    	  ))}
    	</TableBody>
      </Table>

      {/* Dialog Xem chi tiết */}
      <Dialog
  	open={openViewDialog}
  	onClose={handleCloseDialogs}
  	maxWidth="lg"
    	fullWidth
    	TransitionComponent={Transition}
    	PaperProps={{ sx: { p: 4, borderRadius: 3, zoom: 1.25 } }}
    >
  	{selectedOrder && (
  	  <>
  		<DialogTitle
  		  sx={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", mb: 2 }}
  		>
  		  Chi tiết đơn hàng {selectedOrder.id}
  		</DialogTitle>
  		<DialogContent sx={{ fontSize: "1.3rem", "& p": { mb: 2 } }}>
  		  {/* ... (Nội dung dialog này giữ nguyên) ... */}
  		</DialogContent>
  		<DialogActions sx={{ justifyContent: "center", mt: 2 }}>
  		  {/* ... (Nội dung dialog này giữ nguyên) ... */}
  		</DialogActions>
  	  </>
  	)}
    </Dialog>

    {/* Dialog Cập nhật trạng thái */}
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
  		<InputLabel
  		  sx={{
  			fontSize: "1.4rem",
  			top: -8,
  		  }}
  		>
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
  			  sx: {
  				width: dropdownWidth,
  				minWidth: 200,
  			  },
  			},
  		  }}
  		>
  		  <MenuItem value="Đang giao">Đang giao</MenuItem>
  		  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
  		  <MenuItem value="Đã hủy">Đã hủy</MenuItem>
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

    {/* +++ 4. THÊM COMPONENT SNACKBAR VÀO ĐÂY +++ */}
    <Snackbar
  	open={openSnackbar}
  	autoHideDuration={3000} // Tự động ẩn sau 3 giây
  	onClose={handleCloseSnackbar}
  	anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị ở góc trên bên phải
    >
  	<Alert
  	  onClose={handleCloseSnackbar}
  	  severity={snackbarSeverity} // Sẽ là "success"
  	  sx={{ width: "100%", fontSize: "1.1rem" }}
  	>
  	  {snackbarMessage}
  	</Alert>
    </Snackbar>
  </Box>
  );
};

export default OrderManagement;