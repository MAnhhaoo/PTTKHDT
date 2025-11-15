import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getDashboard } from "../../Service/DashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setStats({
          totalRevenue: data.totalRevenue,
          totalProducts: data.totalProducts,
          totalUsers: data.totalUsers,
          totalOrders: data.totalOrders,
        });
        if (data.revenueByMonth) setRevenueData(data.revenueByMonth);
      } catch (error) {
        console.error("Lỗi khi tải dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  const data = revenueData.length > 0 ? revenueData : [
    { month: "Jan", revenue: stats.totalRevenue / 6 },
    { month: "Feb", revenue: stats.totalRevenue / 6 },
    { month: "Mar", revenue: stats.totalRevenue / 6 },
    { month: "Apr", revenue: stats.totalRevenue / 6 },
    { month: "May", revenue: stats.totalRevenue / 6 },
    { month: "Jun", revenue: stats.totalRevenue / 6 },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard tổng quan
      </Typography>

     <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
  {[
    { title: "Tổng doanh thu", value: `${stats.totalRevenue?.toLocaleString() ?? 0}₫` },
    { title: "Sản phẩm", value: stats.totalProducts ?? 0 },
    { title: "Khách hàng", value: stats.totalUsers ?? 0 },
    { title: "Đơn hàng", value: stats.totalOrders ?? 0 },
  ].map((item, idx) => (
    <Grid key={idx} xs={4} sm={4} md={3}>
      <Card sx={{ textAlign: "center", p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary">
            {item.title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {item.value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      <Box sx={{ mt: 4, height: 350, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "90%", maxWidth: 1000 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
            Biểu đồ doanh thu 6 tháng gần nhất
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
