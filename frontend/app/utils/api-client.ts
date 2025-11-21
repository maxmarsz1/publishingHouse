import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

// Log every outgoing request
apiClient.interceptors.request.use((config) => {
  console.log("API Client: Outgoing request:");
  console.log("Request URL:", config.url || "No URL");
  console.log("Request Method:", config.method || "No method");
  console.log("Request Headers:", config.headers || "No headers");
  console.log("Request Data:", config.data || "No data");
  return config;
});

// Log every response (successful or failed)
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Client: Response received:");
    console.log("Response URL:", response.config.url || "No URL");
    console.log("Response Status:", response.status || "No status");
    console.log("Response Data:", response.data || "No data");
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log detailed error information
    console.error("API Client: Request failed with error:");
    console.error("Cause:", error.message);
    console.error("Status Code:", error.response?.status || "No status code");
    console.error("Request URL:", originalRequest?.url || "No URL");
    console.error("Request Method:", originalRequest?.method || "No method");
    console.error("Request Headers:", originalRequest?.headers || "No headers");
    console.error("Request Data:", originalRequest?.data || "No data");
    console.error("Response Data:", error.response?.data || "No response data");

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await refreshAccessToken(); // call your Next.js refresh route

          pendingRequests.forEach((cb) => cb());
          pendingRequests = [];
          isRefreshing = false;

          return apiClient(originalRequest); // retry original request
        } catch (err) {
          isRefreshing = false;
          pendingRequests = [];
          console.error("API Client: Token refresh failed:", err);
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        pendingRequests.push(() => {
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken(): Promise<void> {
  try {
    await axios.post(`${process.env.API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
  } catch (err) {
    console.error("Client: Refresh request failed:", err);
    throw err;
  }
}

export default apiClient;