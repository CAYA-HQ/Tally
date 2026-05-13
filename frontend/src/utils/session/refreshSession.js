// Import necessary dependencies
import { getAccessToken, setAccessToken } from "./token";
import api from "./api";

// Add a request interceptor to include the access token in the Authorization header of every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Variables to manage token refresh state and queue of pending requests
let isRefreshing = false;
let queue = [];

// Function to process the queue of pending requests after token refresh
const processQueue = (error, token) => {
  queue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  queue = [];
};


// Add a response interceptor to handle 401 errors and refresh the token if necessary
api.interceptors.response.use((res) => res, async (err) => {

    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

                                                                                                                                                                                                                                                                    
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        setAccessToken(newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);