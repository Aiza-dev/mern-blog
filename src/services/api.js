import axios from "axios";

// Create custom axios instance
const api = axios.create({
  baseURL: "", // empty so it maps relatively to the Express Server
  timeout: 30000,
});

// Auto attach Authorization Token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mern-blog-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
