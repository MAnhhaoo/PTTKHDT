// src/pages/admin/Dashboard.jsx
import React from "react";
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

const Dashboard = () => {
  const data = [
    { month: "Jan", revenue: 120000000 },
    { month: "Feb", revenue: 98000000 },
    { month: "Mar", revenue: 110000000 },
    { month: "Apr", revenue: 125000000 },
    { month: "May", revenue: 100000000 },
    { month: "Jun", revenue: 135000000 },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard tổng quan
      </Typography>

      {/* Cards thống kê */}
      <Grid container spacing={3}>
        {[
          { title: "Tổng doanh thu", value: "1.250.000.000₫" },
          { title: "Sản phẩm", value: "152" },
          { title: "Khách hàng", value: "1.028" },
          { title: "Đơn hàng", value: "317" },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
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

      {/* Biểu đồ doanh thu */}
      <Box
        sx={{ mt: 4, height: 350, display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ width: "90%", maxWidth: 1000 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", mb: 2 }}
          >
            Biểu đồ doanh thu 6 tháng gần nhất
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
            >
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
