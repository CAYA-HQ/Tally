import axios from "axios";

const apiOrigin = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
const normalizedOrigin = apiOrigin.replace(/\/$/, "");
const baseURL = normalizedOrigin.endsWith("/api")
  ? normalizedOrigin
  : `${normalizedOrigin}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
