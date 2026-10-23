import { api } from "./api";
import toast from "react-hot-toast";

/**
 * Build absolute image URL from backend uploads or local public path
 */
export const getImageUrl = (path) => {
  if (!path) return "/img/placeholder.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const staticBase = import.meta.env.VITE_STATIC_URL || "https://api.kingcreativestudio.my.id/70-studio";
  if (path.startsWith("/uploads-70-studio/")) {
    return `${staticBase}${path}`;
  }
  if (path.startsWith("uploads-70-studio/")) {
    return `${staticBase}/${path}`;
  }
  // Local static asset
  return path;
};

/**
 * Generic GET request helper supporting query parameters (pagination, search, filters)
 */
export async function fetchList(endpoint, params = {}) {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Generic POST request helper supporting FormData or JSON
 */
export async function createItem(endpoint, data, isMultipart = false) {
  try {
    const config = isMultipart
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    const response = await api.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Gagal menambahkan data";
    toast.error(msg);
    throw error;
  }
}

/**
 * Generic PUT request helper supporting FormData or JSON
 */
export async function updateItem(endpoint, data, isMultipart = false) {
  try {
    const config = isMultipart
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    const response = await api.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Gagal memperbarui data";
    toast.error(msg);
    throw error;
  }
}

/**
 * Generic DELETE request helper
 */
export async function deleteItem(endpoint) {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Gagal menghapus data";
    toast.error(msg);
    throw error;
  }
}
