import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Grid, Divider, Alert } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto'
};

const defaultFormData = {
    employeeCode: '',
    fullName: '',
    email: '',
    role: 'sales_staff',
    salaryPerDay: '',
    age: '',
    address: '',
    phone: '',
    hireDate: new Date().toISOString().split("T")[0]
};

const EmployeeFormModal = ({ isOpen, handleClose, employeeData, handleSubmit }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [error, setError] = useState('');

    useEffect(() => {
        if (employeeData) {
            const formattedHireDate = employeeData.hireDate
                ? new Date(employeeData.hireDate).toISOString().split("T")[0]
                : defaultFormData.hireDate;

            setFormData({
                employeeCode: employeeData.employeeCode,
                fullName: employeeData.fullName,
                email: employeeData.email || '',
                role: employeeData.role || 'sales_staff',
                salaryPerDay: employeeData.salaryPerDay ? String(employeeData.salaryPerDay) : '',
                age: employeeData.age ? String(employeeData.age) : '',
                address: employeeData.address || '',
                phone: employeeData.phone || '',
                hireDate: formattedHireDate
            });
        } else {
            setFormData(defaultFormData);
        }
        setError('');
    }, [employeeData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const internalSubmit = (e) => {
        e.preventDefault();

        // ✅ Kiểm tra email trong validation
        if (!formData.employeeCode || !formData.fullName || !formData.email || !formData.salaryPerDay) {
            setError("Vui lòng nhập đầy đủ Mã NV, Họ tên, Email và Lương/ngày!");
            return;
        }

        const finalData = {
            ...formData,
            salaryPerDay: Number(formData.salaryPerDay),
            age: formData.age ? Number(formData.age) : undefined,
            role: formData.role || "sales_staff",
            hireDate: formData.hireDate ? new Date(formData.hireDate) : new Date(),
        };

        handleSubmit(finalData, !!employeeData);
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={internalSubmit}>
                <Typography variant="h5" fontWeight="bold">
                    {employeeData ? "✏️ Cập nhật nhân viên" : "➕ Thêm nhân viên mới"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {error && <Alert severity="error">{error}</Alert>}

                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Mã NV" name="employeeCode" value={formData.employeeCode} onChange={handleChange} InputProps={{ readOnly: !!employeeData }} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Họ tên" name="fullName" value={formData.fullName} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required type="email" label="Email" name="email" value={formData.email} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required type="number" label="Lương/ngày *" name="salaryPerDay" value={formData.salaryPerDay} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField select fullWidth name="role" label="Vai trò" value={formData.role} onChange={handleChange}>
                            <MenuItem value="sales_staff">sales_staff</MenuItem>
                            <MenuItem value="kitchen_staff">kitchen_staff</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth type="number" name="age" label="Tuổi" value={formData.age} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth type="date" name="hireDate" label="Ngày vào làm" InputLabelProps={{ shrink: true }} value={formData.hireDate} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth name="phone" label="SĐT" value={formData.phone} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth name="address" label="Địa chỉ" value={formData.address} onChange={handleChange} />
                    </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button variant="outlined" onClick={handleClose} sx={{ mr: 1 }}>Hủy</Button>
                    <Button variant="contained" type="submit">{employeeData ? "Lưu thay đổi" : "Thêm mới"}</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EmployeeFormModal;