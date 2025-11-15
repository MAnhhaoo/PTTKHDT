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
 Chip,
 Slide,
 TextField,
 Stack,
 InputAdornment,
 CircularProgress,
} from "@mui/material";

import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; 

import * as UserService from "../../Service/UserService";

const Transition = forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

const CustomerManagement = () => {
 const [customers, setCustomers] = useState([]);
 const [searchTerm, setSearchTerm] = useState("");
 const [loading, setLoading] = useState(false);
 const initialLoadRef = useRef(true);

 // 🔹 Fetch users: Thêm thuộc tính isAdmin từ API
 const fetchUsers = async (key = "") => {
  setLoading(true);
  try {
   const res = await UserService.getAllUser(key);
   if (res?.data) {
    setCustomers(
     res.data.map((user, index) => ({
      id: user._id,
      code: `KH${(index + 1).toString().padStart(3, "0")}`,
      name: user.name || "Chưa có tên",
      phone: user.phone || "Chưa có",
      email: user.email || "Chưa có",
      isBlocked: !!user.isBlocked,
      rank: user.rank || "Thường",
      address: user.address || "Chưa cập nhật",
      isAdmin: !!user.isAdmin, // <-- Đã thêm
     }))
    );
   } else {
    setCustomers([]);
   }
  } catch (error) {
   console.error("❌ Lỗi khi tải danh sách người dùng:", error);
   setCustomers([]);
  } finally {
   setLoading(false);
  }
 };

 // ✅ Debounce search
 useEffect(() => {
  if (initialLoadRef.current) {
   fetchUsers("");
   initialLoadRef.current = false;
   return;
  }
  const delayDebounceFn = setTimeout(() => {
   fetchUsers(searchTerm.trim());
  }, 500);
  return () => clearTimeout(delayDebounceFn);
 }, [searchTerm]);

 const handleSearchChange = (e) => setSearchTerm(e.target.value);

 // 🔒 Toggle block / unblock: Ngăn chặn thao tác với tài khoản Admin
 const handleToggleBlock = async (id, isBlocked, isAdmin) => {
  const action = isBlocked ? "mở khóa" : "khóa";

  // KIỂM TRA QUẢN TRỊ VIÊN
  if (isAdmin) {
   alert("🚫 Không thể Khóa/Mở khóa tài khoản Quản trị viên (Admin)!");
   return; // Dừng thao tác
  }

  if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này không?`)) return;

  try {
   const res = await UserService.updateUserStatus(id, !isBlocked);
   if (res && res.message) {
    setCustomers((prev) =>
     prev.map((c) =>
      c.id === id ? { ...c, isBlocked: !isBlocked } : c
     )
    );
    alert(`✅ Đã ${action} thành công!`);
   } else {
    alert(res.message || `❌ ${action} thất bại!`);
   }
  } catch (error) {
   console.error(`❌ Lỗi khi ${action}:`, error);
   alert(`Không thể ${action}. Vui lòng thử lại!`);
  }
 };

 const getRankColor = (rank) => (rank === "VIP" ? "secondary" : "default");
 const getRankIcon = (rank) => (rank === "VIP" ? <StarIcon sx={{ color: '#ffc107' }} /> : <PersonIcon />); 

 return (
  <Box sx={{ p: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
   <Stack 
    direction={{ xs: 'column', sm: 'row' }} 
    justifyContent="space-between" 
    alignItems={{ xs: 'flex-start', sm: 'center' }} 
    mb={4}
    spacing={2}
   >
    <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
     👥 Quản lý khách hàng
    </Typography>
    <TextField
     label="Tìm kiếm theo Tên, SĐT, Email..."
     variant="outlined"
     size="small"
     value={searchTerm}
     onChange={handleSearchChange}
     sx={{ width: { xs: '100%', sm: 400 }, backgroundColor: '#fff', borderRadius: 1 }}
     InputProps={{
      startAdornment: (
       <InputAdornment position="start">
        <SearchIcon color="action" />
       </InputAdornment>
      ),
     }}
    />
   </Stack>

   {loading ? (
    <Box sx={{ py: 10, textAlign: "center", backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
     <CircularProgress color="primary" size={50} />
     <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
      Đang tải dữ liệu khách hàng...
     </Typography>
    </Box>
   ) : (
    <Box sx={{ overflowX: 'auto' }}>
     <Table
      sx={{
       minWidth: 800,
       backgroundColor: "#fff",
       boxShadow: 6,
       borderRadius: 2,
       borderCollapse: 'separate',
       '& th, & td': { 
        fontSize: "1rem", 
        padding: "16px 20px", 
        borderBottom: '1px solid #eee'
       },
      }}
     >
      <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
       <TableRow>
        <TableCell sx={{ color: '#1a237e' }}><strong>Mã KH</strong></TableCell>
        <TableCell sx={{ color: '#1a237e' }}><strong>Tên khách hàng</strong></TableCell>
        <TableCell sx={{ color: '#1a237e' }}><strong>Điện thoại</strong></TableCell>
        <TableCell sx={{ color: '#1a237e' }}><strong>Email</strong></TableCell>
        <TableCell sx={{ color: '#1a237e' }}><strong>Hạng</strong></TableCell>
        <TableCell sx={{ color: '#1a237e' }}><strong>Trạng thái</strong></TableCell>
        <TableCell align="center" sx={{ color: '#1a237e' }}><strong>Thao tác</strong></TableCell>
       </TableRow>
      </TableHead>

      <TableBody>
       {customers.length > 0 ? (
        customers.map((customer) => (
         <TableRow 
          key={customer.id} 
          hover 
          sx={{ 
           '&:last-child td': { borderBottom: 0 },
           // Nhấn mạnh hàng Admin bằng màu nền
           ...(customer.isAdmin && { backgroundColor: '#fffbe5' }) 
          }}
         >
          <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{customer.code}</TableCell>
          <TableCell>{customer.name}</TableCell>
          <TableCell>{customer.phone}</TableCell>
          <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{customer.email}</TableCell>
          <TableCell>
           <Chip
            label={customer.rank}
            color={getRankColor(customer.rank)}
            icon={getRankIcon(customer.rank)}
            sx={{ fontWeight: "bold", fontSize: "0.9rem", height: 32 }}
           />
          </TableCell>
          <TableCell>
           <Chip
            label={customer.isBlocked ? "Bị khóa" : "Hoạt động"}
            color={customer.isBlocked ? "error" : "success"}
            size="small"
            sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
           />
          </TableCell>
          <TableCell align="center">
           <Button
            // Vô hiệu hóa nút nếu là Admin
            disabled={customer.isAdmin} 
            // Button style
            variant={customer.isAdmin || customer.isBlocked ? "contained" : "outlined"}
            size="small"
            // Màu sắc
            color={customer.isAdmin ? "primary" : (customer.isBlocked ? "success" : "error")}
            // Icon
            startIcon={
             customer.isAdmin ? <AdminPanelSettingsIcon /> : (customer.isBlocked ? <LockOpenIcon /> : <BlockIcon />)
            }
            // Truyền isAdmin vào hàm xử lý
            onClick={() => handleToggleBlock(customer.id, customer.isBlocked, customer.isAdmin)}
            sx={{ 
             fontSize: "0.9rem", 
             fontWeight: "bold", 
             padding: '6px 12px',
             minWidth: '120px'
            }}
           >
            {customer.isAdmin ? "Quản trị viên" : (customer.isBlocked ? "Mở khóa" : "Khóa")}
           </Button>
          </TableCell>
         </TableRow>
        ))
       ) : (
        <TableRow>
         <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
          <Typography variant="subtitle1" color="textSecondary" sx={{ fontSize: '1.1rem' }}>
           {searchTerm
            ? `Không tìm thấy khách hàng nào với từ khóa "${searchTerm}".`
            : "Chưa có dữ liệu khách hàng."}
          </Typography>
         </TableCell>
        </TableRow>
       )}
      </TableBody>
     </Table>
    </Box>
   )}
  </Box>
 );
};

export default CustomerManagement;