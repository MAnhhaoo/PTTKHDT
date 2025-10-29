import axios from "axios";

export const getAllProduct = async ({ limit, page }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/api/product/getAllProduct` , {
        params: { limit, page }
    }
  );
  console.log("🌐 API Response:", res.data);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/api/product/getProduct/${id}`);
  console.log("🌐 API Response:", res.data);
  return res.data; // ✅ đây là toàn bộ object { message, data }
};
