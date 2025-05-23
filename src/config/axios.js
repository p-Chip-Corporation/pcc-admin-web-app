// config/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 100000,
});

// Request logger
api.interceptors.request.use((config) => {
  console.log(
    `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${
      config.url
    }`
  );
  return config;
});

// Injectable logout + navigate handlers
let clearUserFn = null;
let navigateFn = null;

export const setAxiosAuthHandlers = ({ clearUser, navigate }) => {
  clearUserFn = clearUser;
  navigateFn = navigate;
};

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && clearUserFn && navigateFn) {
      clearUserFn();
      navigateFn("/auth");
    }

    return Promise.reject(error);
  }
);

export default api;
