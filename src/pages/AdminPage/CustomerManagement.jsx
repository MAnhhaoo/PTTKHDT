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
  TextField,
  Stack,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";

import * as UserService from "../../Service/UserService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultFormData = {
  id: "",
  name: "",
  phone: "",
  email: "",
  status: "Thường",
  address: "",
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
//   const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [formData, setFormData] = useState(defaultFormData);

  const formControlRef = useRef(null);
//   const [dropdownWidth, setDropdownWidth] = useState(0);

  // 🔹 Lấy danh sách user từ API
  const fetchUsers = async () => {
    try {
      const res = await UserService.getAllUser();
      if (res?.data) {
        setCustomers(
          res.data.map((user, index) => ({
            id: user._id, // ✅ dùng _id thật từ MongoDB
            code: `KH${(index + 1).toString().padStart(3, "0")}`,
            name: user.name || "Chưa có tên",
            phone: user.phone || "Chưa có",
            email: user.email || "Chưa có",
            status: user.status || "Thường",
            address: user.address || "Chưa cập nhật",
          }))
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (openFormDialog && formControlRef.current) {
    //   setDropdownWidth(formControlRef.current.clientWidth);
    }
  }, [openFormDialog]);

  // === HÀM XỬ LÝ DIALOG ===
//   const handleViewDetails = (customer) => {
//     // setSelectedCustomer(customer);
//     setOpenViewDialog(true);
//   };

//   const handleOpenAdd = () => {
//     setIsEditMode(false);
//     setFormData(defaultFormData);
//     setOpenFormDialog(true);
//   };

//   const handleOpenEdit = (customer) => {
//     setIsEditMode(true);
//     setSelectedCustomer(customer);
//     setFormData(customer);
//     setOpenFormDialog(true);
//   };

//   const handleCloseDialogs = () => {
//     setOpenViewDialog(false);
//     setOpenFormDialog(false);
//     setSelectedCustomer(null);
//   };

  // === Cập nhật form ===
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

  // === Thêm/Sửa LOCAL (chưa gọi API) ===
//   const handleSubmit = () => {
//     if (isEditMode) {
//       setCustomers((prev) =>
//         prev.map((c) => (c.id === selectedCustomer.id ? formData : c))
//       );
//     } else {
//       const newId = `KH${(customers.length + 1).toString().padStart(3, "0")}`;
//       setCustomers((prev) => [...prev, { ...formData, id: newId }]);
//     }
//     handleCloseDialogs();
//   };

  // ✅ === Xóa khách hàng thật từ API ===
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        const res = await UserService.deleteUser(id);
        if (res.status === 200) {
          alert("✅ Xóa khách hàng thành công!");
          fetchUsers(); // Gọi lại danh sách
        } else {
          alert(res.message || "❌ Xóa thất bại!");
        }
      } catch (error) {
        console.error("❌ Lỗi khi xóa khách hàng:", error);
        alert("Xóa thất bại. Vui lòng thử lại!");
      }
    }
  };

  // === HỖ TRỢ HIỂN THỊ ===
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
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ fontSize: "1rem", fontWeight: "bold", px: 3, py: 1.2 }}
        >
          Thêm mới
        </Button> */}
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
              <TableCell>{customer.code}</TableCell>
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
                {/* <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(customer)}
                  sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                >
                  Xem
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenEdit(customer)}
                  sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                >
                  Sửa
                </Button> */}

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(customer.id)} // ✅ gọi API
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CustomerManagement;
