import { API_URL } from "./config";

export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ApiConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: unknown;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.defaultHeaders || {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { token, body, headers, ...customOptions } = options;

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...(headers as Record<string, string>),
    };

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...customOptions,
      headers: requestHeaders,
    };

    if (body) {
      const isJson =
        requestHeaders["Content-Type"]?.includes("application/json");
      config.body = isJson ? JSON.stringify(body) : (body as BodyInit);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(response.status, response.statusText, errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error(`Network request failed: ${(error as Error).message}`);
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, body, method: "POST" });
  }

  public put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, body, method: "PUT" });
  }

  public patch<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, body, method: "PATCH" });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

const apiUrl = API_URL;

export const api = new ApiClient({
  baseUrl: apiUrl,
});
