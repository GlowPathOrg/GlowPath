import axios from "axios";
import { getToken } from "../utilities/token";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
  headers: {"Authorizaton": "Bearer " + getToken()}
});

export default api;