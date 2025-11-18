import React, { useState, useEffect, useRef, forwardRef } from 'react';
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
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useNavigate } from 'react-router-dom';
import * as employeeService from '../../Service/employeeService';
import EmployeeFormModal from './EmployeeFormModal';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EmployeeManagement = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAllEmployees();
      const employeesFromBE = res?.data?.data || [];
      const formatted = employeesFromBE.map(emp => ({
        ...emp,
        salaryPerDay: Number(emp.salaryPerDay) || 0,
      }));
      setEmployees(formatted);
    } catch (error) {
      console.error('❌ Lỗi tải nhân viên:', error);
      setSnackbarMessage('Không thể tải danh sách nhân viên!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData, isEditing) => {
    try {
      if (!isEditing) {
        await employeeService.createEmployee(formData);
        setSnackbarMessage('✅ Thêm nhân viên thành công!');
      } else {
        await employeeService.updateEmployee(selectedEmployee._id, formData);
        setSnackbarMessage('✅ Cập nhật nhân viên thành công!');
      }
      setSnackbarSeverity('success');
      await fetchEmployees();
    } catch (error) {
      console.error('❌ Lỗi submit:', error);
      setSnackbarMessage('Lỗi xử lý dữ liệu!');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
      handleCloseModal();
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhân viên này không?')) return;
    try {
      await employeeService.deleteEmployee(id);
      setSnackbarMessage('🗑️ Xóa nhân viên thành công!');
      setSnackbarSeverity('success');
      fetchEmployees();
    } catch (error) {
      console.error('❌ Lỗi xóa nhân viên:', error);
      setSnackbarMessage('Không thể xóa nhân viên!');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCalculateSalary = (employee) => {
    const salaryPerDay = Number(employee.salaryPerDay);
    if (!salaryPerDay || salaryPerDay <= 0) {
      alert(`Lương/Ngày không hợp lệ cho ${employee.fullName}`);
      return;
    }
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const salary = salaryPerDay * daysInMonth;
    alert(`Lương tháng (${daysInMonth} công) của ${employee.fullName}: ${salary.toLocaleString('vi-VN')} VND`);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'sales_staff': return 'primary';
      case 'kitchen_staff': return 'success';
      case 'manager': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4, zoom: 1 }}>  {/* 🔥 Thu nhỏ toàn bộ giao diện */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        👨‍💼 Quản lý Nhân viên
      </Typography>

      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        sx={{ mb: 2 }}
        onClick={() => handleOpenModal()}
      >
        Thêm nhân viên
      </Button>

      <Table sx={{
        backgroundColor: '#fff',
        boxShadow: 3,
        borderRadius: 2,
        "& th,& td": { fontSize: '1rem', padding: '10px 14px' }
      }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>Mã NV</TableCell>
            <TableCell>Họ & Tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Lương/Ngày</TableCell>
            <TableCell>Tuổi</TableCell>
            <TableCell>SĐT</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.map(emp => (
            <TableRow key={emp._id} hover>
              <TableCell>{emp.employeeCode || 'Chưa rõ'}</TableCell>
              <TableCell>{emp.fullName || 'Chưa rõ'}</TableCell>
              <TableCell>{emp.email || 'Chưa rõ'}</TableCell>
              <TableCell>
                <Chip label={emp.role} color={getRoleColor(emp.role)} />
              </TableCell>
              <TableCell>{emp.salaryPerDay.toLocaleString('vi-VN')} VND</TableCell>
              <TableCell>{emp.age || 'Chưa rõ'}</TableCell>
              <TableCell>{emp.phone || 'Chưa rõ'}</TableCell>
              <TableCell>{emp.address || 'Chưa rõ'}</TableCell>
              <TableCell align="center">
                <Button size="small" color="warning" startIcon={<EditIcon />} onClick={() => handleOpenModal(emp)} sx={{ mr: 1 }}>Sửa</Button>
                <Button size="small" color="success" startIcon={<AttachMoneyIcon />} onClick={() => handleCalculateSalary(emp)} sx={{ mr: 1 }}>Lương</Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteEmployee(emp._id)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EmployeeFormModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        employeeData={selectedEmployee}
        handleSubmit={handleFormSubmit}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%', fontSize: '1.1rem' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeManagement;
