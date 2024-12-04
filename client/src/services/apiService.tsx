import axios from "axios";
import { getToken } from "../utilities/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://glowpath-a7681fe09c29.herokuapp.com",
  headers: {"Authorization": "Bearer " + getToken()}
});

export default api;