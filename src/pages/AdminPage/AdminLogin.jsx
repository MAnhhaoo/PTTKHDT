import React, { useState } from "react";
import {
 Avatar,
 Button,
 TextField,
 Box,
 Typography,
 Container,
 Paper,
 Snackbar,
 Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

import bgAdmin from "../../assets/img/admin_background.png";

const AdminLogin = () => {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const navigate = useNavigate();

 const [openSnackbar, setOpenSnackbar] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [snackbarSeverity, setSnackbarSeverity] = useState("success");

 const handleCloseSnackbar = (event, reason) => {
  if (reason === "clickaway") {
   return;
  }
  setOpenSnackbar(false);
 };

 const handleSubmit = (event) => {
  event.preventDefault();
  console.log("Đăng nhập với:", { username, password });

  if (username === "admin" && password === "admin") {
   setSnackbarMessage("Đăng nhập thành công! Đang chuyển hướng...");
   setSnackbarSeverity("success");
   setOpenSnackbar(true);

   setTimeout(() => {
    navigate("/admin");
   }, 1000);
  } else {
   setSnackbarMessage("Sai tên đăng nhập hoặc mật khẩu!");
   setSnackbarSeverity("error");
   setOpenSnackbar(true);
  }
 };

 return (
  <Box
   sx={{
    // ... (giữ nguyên style Box)
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
   	justifyContent: "center",
   	minHeight: "100vh",
   	backgroundImage: `url(${bgAdmin})`,
   	backgroundSize: "cover",
   	backgroundPosition: "center",
   	backgroundRepeat: "no-repeat",
   	position: "relative",
   	"&::before": {
   	  content: '""',
   	  position: "absolute",
   	  top: 0,
   	  left: 0,
   	  width: "100%",
   	  height: "100%",
   	  backgroundColor: "rgba(0, 0, 0, 0.35)",
   	  zIndex: 0,
   	},
    }}
 	>
  <Container
   component="main"
   maxWidth="sm"
   sx={{ zIndex: 1 }}
  >
   <Paper
    elevation={10}
    sx={{
     padding: 5,
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     borderRadius: 3,
     backgroundColor: "rgba(255, 255, 255, 0.95)",
    }}
   >
    <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
     <LockOutlinedIcon sx={{ fontSize: 32 }} />
    </Avatar>
    <Typography
     component="h1"
     variant="h3"
   	fontWeight="bold"
   	sx={{ mb: 3 }}
     >
   	Đăng nhập
     </Typography>
     <Box
   	component="form"
   	onSubmit={handleSubmit}
   	noValidate
   	sx={{ mt: 1, width: '100%' }}
     >
   	<TextField
   	  margin="normal"
   	  required
   	  fullWidth
   	  id="username"
   	  label="Tên đăng nhập"
   	  name="username"
   	  autoComplete="username"
   	  autoFocus
   	  value={username}
   	  onChange={(e) => setUsername(e.target.value)}
   	  sx={{ "& .MuiInputBase-root": { fontSize: "1.2rem" }, mb: 2 }}
   	/>
   	<TextField
   	  margin="normal"
   	  required
   	  fullWidth
   	  name="password"
   	  label="Mật khẩu"
   	  type="password"
   	  id="password"
   	  autoComplete="current-password"
   	  value={password}
   	  onChange={(e) => setPassword(e.target.value)}
   	  sx={{ "& .MuiInputBase-root": { fontSize: "1.2rem" }, mb: 3 }}
   	/>
   	<Button
   	  type="submit"
   	  fullWidth
   	  variant="contained"
   	  size="large"
   	  sx={{
   		mt: 2,
   		mb: 1,
   		py: 1.5,
   		fontSize: "1.2rem",
   		fontWeight: "bold",
   	  }}
   	>
   	  Đăng nhập
   	</Button>
     </Box>
   </Paper>
  </Container>

  {/* +++ 4. THÊM COMPONENT SNACKBAR VÀO ĐÂY +++ */}
  <Snackbar
    open={openSnackbar}
    autoHideDuration={3000}
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <Alert
  	onClose={handleCloseSnackbar}
  	severity={snackbarSeverity}
  	// +++ SỬA SX DƯỚI ĐÂY ĐỂ TO HƠN +++
  	sx={{
  	  width: "100%",
  	  fontSize: "1.3rem", // <-- Tăng font chữ
  	  py: 1.5,       // <-- Tăng padding dọc
  	  px: 2.5,       // <-- Tăng padding ngang
  	  alignItems: "center", // Căn giữa icon và chữ
  	  "& .MuiAlert-icon": {
  		fontSize: "2rem", // <-- Tăng kích thước icon
  	  },
  	}}
    >
  	{snackbarMessage}
    </Alert>
  </Snackbar>
 </Box>
 );
};

export default AdminLogin;