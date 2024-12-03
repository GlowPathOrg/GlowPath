import axios from "axios";
import { getToken } from "../utilities/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3002",
  headers: {"Authorization": "Bearer " + getToken()}
});

export default api;