import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL_BACKEND}/api/product`;

// ---------- PRODUCT ----------
export const getAllProduct = async (params) =>
    (await axios.get(`${BASE_URL}/getAllProduct`, { params })).data;
export const getProductById = async (id) =>
  (await axios.get(`${BASE_URL}/getProduct/${id}`)).data;

export const getAllTypes = async () =>
  (await axios.get(`${BASE_URL}/getAllTypes`)).data;

export const createProduct = async (data) =>
  (await axios.post(`${BASE_URL}/creatProduct`, data, { headers: { "Content-Type": "multipart/form-data" } })).data;

export const updateProduct = async (id, data) => {
  const isFormData = data instanceof FormData;
  return (
    await axios.put(`${BASE_URL}/updateProduct/${id}`, data, {
      headers: { "Content-Type": isFormData ? "multipart/form-data" : "application/json" },
    })
  ).data;
};

export const deleteProduct = async (id) =>
  (await axios.delete(`${BASE_URL}/deleteProduct/${id}`)).data;

// ---------- CATEGORY ----------
export const getAllCategory = async () =>
  (await axios.get(`${BASE_URL}/getAllCategory`)).data;

export const createCategory = async (data) =>
  (await axios.post(`${BASE_URL}/createCategory`, data)).data;

export const updateCategory = async (id, data) =>
  (await axios.put(`${BASE_URL}/updateCategory/${id}`, data)).data;

export const deleteCategory = async (id) =>
  (await axios.delete(`${BASE_URL}/deleteCategory/${id}`)).data;

