import axios from "axios";

const BASEURL = process.env.BASEURL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let getAccessToken: () => string | null = () => null;

export function registerAuthTokenGetter(fn: () => string | null): void {
  getAccessToken = fn;
}

let onUnauthorized: () => void = () => {};

export function registerUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
