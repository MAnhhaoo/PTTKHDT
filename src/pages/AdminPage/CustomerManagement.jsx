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
} from "@mui/material";

import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

import * as UserService from "../../Service/UserService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const initialLoadRef = useRef(true);

  // 🔹 Fetch users
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

  // 🔒 Toggle block / unblock
  const handleToggleBlock = async (id, isBlocked) => {
    const action = isBlocked ? "mở khóa" : "khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này không?`)) return;

    try {
      const res = await UserService.updateUserStatus(id, !isBlocked);
      if (res && res.message) {
        // Cập nhật trạng thái trực tiếp trong state mà không gọi lại API
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

  const getRankColor = (rank) => (rank === "VIP" ? "success" : "default");
  const getRankIcon = (rank) => (rank === "VIP" ? <StarIcon /> : <PersonIcon />);

  return (
    <Box sx={{ p: 4, zoom: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý khách hàng
        </Typography>
        <TextField
          label="Tìm kiếm theo Tên, SĐT, Email..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {loading ? (
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography variant="h6">Đang tải dữ liệu khách hàng...</Typography>
        </Box>
      ) : (
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
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell align="center"><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.code}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.rank}
                      color={getRankColor(customer.rank)}
                      icon={getRankIcon(customer.rank)}
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.isBlocked ? "Bị khóa" : "Hoạt động"}
                      color={customer.isBlocked ? "error" : "success"}
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color={customer.isBlocked ? "success" : "error"}
                      startIcon={customer.isBlocked ? <LockOpenIcon /> : <BlockIcon />}
                      onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                      sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    >
                      {customer.isBlocked ? "Mở khóa" : "Khóa"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    {searchTerm
                      ? `Không tìm thấy khách hàng nào với từ khóa "${searchTerm}".`
                      : "Chưa có dữ liệu khách hàng."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default CustomerManagement;
