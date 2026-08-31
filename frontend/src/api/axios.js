import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let waitingQueue = [];

const processQueue = (
  error,
  token = null
) => {
  waitingQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });

  waitingQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    if (
      originalRequest?.url?.includes(
        "/auth/login"
      ) ||
      originalRequest?.url?.includes(
        "/auth/refresh"
      )
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      localStorage.getItem(
        "refresh_token"
      );

    if (!refreshToken) {
      localStorage.removeItem(
        "access_token"
      );

      window.location.href = "/login";

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          waitingQueue.push({
            resolve,
            reject,
          });
        }
      ).then((newToken) => {
        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {
          refresh_token:
            refreshToken,
        }
      );

      const newAccessToken =
        response.data.access_token;

      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      api.defaults.headers.common.Authorization =
        `Bearer ${newAccessToken}`;

      processQueue(
        null,
        newAccessToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(
        refreshError,
        null
      );

      localStorage.removeItem(
        "access_token"
      );
      localStorage.removeItem(
        "refresh_token"
      );

      window.location.href = "/login";

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;