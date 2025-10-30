import { ROUTES } from "@/constants/RouteConstants";
import axios from "axios";

const axiosinstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosinstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalReq.headers["Authorization"] = `Bearer ${token}`;
          return axiosinstance(originalReq);
        });
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}${ROUTES.AUTH.BASE}${
            ROUTES.AUTH.REFRESH
          }`,
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        axiosinstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalReq.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return axiosinstance(originalReq);
      } catch (refreshError) {
        processQueue(refreshError, null);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw err;
  }
);

export default axiosinstance;
