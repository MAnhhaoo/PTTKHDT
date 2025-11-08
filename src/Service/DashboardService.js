// src/Service/DashboardService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_BACKEND;

export const getDashboard = async () => {
  const res = await axios.get(`${API_URL}/api/dashboard/das`);
  return res.data;
};
