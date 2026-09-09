import axios from "axios";
import { BASE_URL } from "./constants";

// All API calls go through this instance so the auth cookie
// (set by the backend as an HTTP-only cookie) is sent automatically.
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
