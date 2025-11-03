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
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlide";
import { loginUser } from "../../Service/UserService";
import bgAdmin from "../../assets/img/admin_background.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");      // đổi sang email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { user, access_token } = res;

      if (!user.isAdmin) {
        setSnackbarMessage("Tài khoản này không có quyền Admin!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      // ✅ Lưu Redux + localStorage
      dispatch(setUser({ user, token: access_token }));

      setSnackbarMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/admin"); // chuyển hướng đến trang admin
      }, 1000);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Đăng nhập thất bại!"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
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
      <Container component="main" maxWidth="sm" sx={{ zIndex: 1 }}>
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
          <Typography component="h1" variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
            Đăng nhập Admin
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              disabled={loading}
              sx={{
                mt: 2,
                mb: 1,
                py: 1.5,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            fontSize: "1.3rem",
            py: 1.5,
            px: 2.5,
            alignItems: "center",
            "& .MuiAlert-icon": {
              fontSize: "2rem",
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
