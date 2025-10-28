import React, { useState, forwardRef, useRef, useEffect } from "react";
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
  TextField, // Thêm TextField cho form
  Stack, // Thêm Stack để xếp form
} from "@mui/material";

// Thêm các icon cần thiết
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star"; // Icon cho hạng VIP
import PersonIcon from "@mui/icons-material/Person"; // Icon cho hạng Thường

// Slide animation cho dialog (giữ nguyên)
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Dữ liệu form mặc định
const defaultFormData = {
  id: "",
  name: "",
  phone: "",
  email: "",
  status: "Thường",
  address: "",
};

const CustomerManagement = () => {
  // State chứa danh sách khách hàng
  const [customers, setCustomers] = useState([
    {
      id: "KH001",
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "a.nguyen@email.com",
      status: "VIP",
      address: "123 Đường ABC, Quận 1, TP. HCM",
    },
    {
      id: "KH002",
      name: "Trần Thị B",
      phone: "0987654321",
      email: "b.tran@email.com",
      status: "Thường",
      address: "456 Đường XYZ, Quận 3, TP. HCM",
    },
    {
      id: "KH003",
      name: "Lê Văn C",
      phone: "0333444555",
      email: "c.le@email.com",
      status: "Thường",
      address: "789 Đường DEF, Quận Tân Bình, TP. HCM",
    },
  ]);

  // State cho các dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false); // Dialog cho cả Add và Edit
  const [isEditMode, setIsEditMode] = useState(false); // Cờ để biết đang Add hay Edit
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  // State cho độ rộng dropdown (copy từ code trước)
  const formControlRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  useEffect(() => {
    if (openFormDialog && formControlRef.current) {
      setDropdownWidth(formControlRef.current.clientWidth);
    }
  }, [openFormDialog]);

  // === HÀM XỬ LÝ DIALOG ===

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setOpenViewDialog(true);
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData(defaultFormData); // Reset form
    setOpenFormDialog(true);
  };

  const handleOpenEdit = (customer) => {
    setIsEditMode(true);
    setSelectedCustomer(customer);
    setFormData(customer); // Load data của khách hàng vào form
    setOpenFormDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenViewDialog(false);
    setOpenFormDialog(false);
    setSelectedCustomer(null);
  };

  // === HÀM XỬ LÝ CRUD ===

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isEditMode) {
      // Logic Sửa
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? formData : c))
      );
    } else {
      // Logic Thêm
      const newId = `KH${(customers.length + 1).toString().padStart(3, "0")}`;
      setCustomers((prev) => [...prev, { ...formData, id: newId }]);
    }
    handleCloseDialogs();
  };

  const handleDelete = (id) => {
    // Thêm một bước xác nhận đơn giản
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // === HÀM HỖ TRỢ HIỂN THỊ ===

  const getStatusColor = (status) => {
    switch (status) {
      case "VIP":
        return "success";
      case "Thường":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "VIP":
        return <StarIcon />;
      case "Thường":
        return <PersonIcon />;
      default:
        return null;
    }
  };

  // === RENDER ===

  return (
    <Box sx={{ p: 4, zoom: 1.15 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý khách hàng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ fontSize: "1rem", fontWeight: "bold", px: 3, py: 1.2 }}
        >
          Thêm mới
        </Button>
      </Stack>

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
            <TableCell><strong>Mã KH</strong></TableCell>
            <TableCell><strong>Tên khách hàng</strong></TableCell>
            <TableCell><strong>Điện thoại</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Hạng</strong></TableCell>
            <TableCell align="center"><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} hover>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <Chip
                  label={customer.status}
                  color={getStatusColor(customer.status)}
                  icon={getStatusIcon(customer.status)}
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                />
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(customer)}
                  sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                >
                  Xem
                </Button>

                <Button
                  variant="contained"
                  color="primary" // Đổi màu Sửa
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenEdit(customer)}
                  sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                >
                  Sửa
                </Button>

                <Button
                  variant="contained"
                  color="error" // Đổi màu Xóa
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(customer.id)}
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* === Dialog Xem chi tiết === */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseDialogs}
        maxWidth="md" // Thu nhỏ dialog xem chi tiết
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{ sx: { p: 4, borderRadius: 3, zoom: 1.25 } }}
      >
        {selectedCustomer && (
          <>
            <DialogTitle
              sx={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", mb: 2 }}
            >
              Chi tiết khách hàng {selectedCustomer.id}
            </DialogTitle>

            <DialogContent sx={{ fontSize: "1.3rem" }}>
              <Typography sx={{ fontSize: "1.4rem", mb: 2 }}>
                <strong>Tên khách hàng:</strong> {selectedCustomer.name}
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", mb: 2 }}>
                <strong>Điện thoại:</strong> {selectedCustomer.phone}
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", mb: 2 }}>
                <strong>Email:</strong> {selectedCustomer.email}
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", mb: 2 }}>
                <strong>Địa chỉ:</strong> {selectedCustomer.address}
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", display: "flex", alignItems: "center" }}>
                <strong>Hạng:</strong>{" "}
                <Chip
                  label={selectedCustomer.status}
                  color={getStatusColor(selectedCustomer.status)}
                  icon={getStatusIcon(selectedCustomer.status)}
                  sx={{ fontSize: "1.2rem", height: 40, ml: 2 }}
                />
              </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", mt: 3 }}>
              <Button
                onClick={handleCloseDialogs}
                variant="contained"
                color="primary"
                sx={{ px: 4, py: 1.5, fontSize: "1.3rem", fontWeight: "bold" }}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* === Dialog Thêm/Sửa Khách hàng === */}
      <Dialog
        open={openFormDialog}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{ sx: { p: 4, borderRadius: 3, zoom: 1.2 } }}
      >
        <DialogTitle
          sx={{ fontSize: "1.8rem", fontWeight: "bold", textAlign: "center", mb: 2 }}
        >
          {isEditMode ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        </DialogTitle>

        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Tên khách hàng"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl fullWidth ref={formControlRef}>
                <InputLabel
                  sx={{
                    fontSize: "1.1rem", // Chỉnh lại font cho hợp lý
                  }}
                >
                  Hạng
                </InputLabel>
                <Select
                  name="status" // Thêm name để handleFormChange bắt được
                  value={formData.status}
                  onChange={handleFormChange} // Dùng chung 1 hàm
                  label="Hạng" // Cần có label để InputLabel hoạt động đúng
                  sx={{
                    fontSize: "1.1rem",
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
                  <MenuItem value="Thường">Thường</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 2, gap: 2 }}>
          <Button
            sx={{ fontSize: "1.2rem", fontWeight: "bold", px: 4 }}
            onClick={handleCloseDialogs}
            variant="outlined"
            color="secondary"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ fontSize: "1.2rem", fontWeight: "bold", px: 4 }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;