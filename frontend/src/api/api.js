import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("JWT Token exists:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Do NOT manually set Content-Type.
    // Axios/browser will automatically handle:
    // - JSON requests
    // - FormData / image uploads
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;