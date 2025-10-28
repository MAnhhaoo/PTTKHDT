import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button, // ✅ THÊM: import Button để dùng nút Đăng xuất
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout"; // ✅ THÊM: icon đăng xuất
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"; // ✅ SỬA: thêm useNavigate để điều hướng sau khi logout

const drawerWidth = 260;

/* ✅ THÊM: phần mixin & styled component bị thiếu (AppBar, Drawer, DrawerHeader) */
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

/* ✅ PHẦN CÒN LẠI LÀ CODE CỦA MÀY (giữ nguyên hoàn toàn) */
export default function LayoutAdmin() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      text: "Quản Lý Danh Mục",
      icon: <CategoryIcon />,
      path: "/admin/Category-Management",
    },
    {
      text: "Quản Lý Sản Phẩm",
      icon: <ProductionQuantityLimitsIcon />,
      path: "/admin/Product-Management",
    },
    {
      text: "Quản Lý Đơn Hàng",
      icon: <ShoppingCartIcon />,
      path: "/admin/Order-Management",
    },
    {
      text: "Quản Lý Khách Hàng",
      icon: <PeopleIcon />,
      path: "/admin/Customer-Management",
    },
    // {
    //   text: "Quản Lý Thanh Toán",
    //   icon: <PaymentIcon />,
    //   path: "/admin/payment",
    // },
    // {
    //   text: "Shipping Management",
    //   icon: <LocalShippingIcon />,
    //   path: "/admin/shipping",
    // },
    // {
    //   text: "System Settings",
    //   icon: <SettingsIcon />,
    //   path: "/admin/settings",
    // },
  ];

return (
  <Box
    sx={{
      display: "flex",
      zoom: 1.2, // ✅ DÙNG zoom thay cho transform để phóng to toàn bộ
    }}
  >
    <CssBaseline />
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 5, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          PIZZA & BIA
        </Typography>
      </Toolbar>
    </AppBar>

    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  mr: open ? 3 : "auto",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ mt: "auto", mb: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            width: open ? "80%" : "auto",
            mx: open ? "auto" : 1,
  	  display: "flex",
  	  justifyContent: open ? "center" : "flex-start",

  	  "&:hover": {
    	    backgroundColor: "error.main", 
    	    color: "white", 
  	  },
  	}}>
          {open && "Đăng xuất"}
        </Button>
      </Box>
    </Drawer>

    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
      <Outlet />
    </Box>
  </Box>
);

}
