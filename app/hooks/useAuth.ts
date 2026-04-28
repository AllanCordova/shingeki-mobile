import { create } from "zustand";
import { api } from "@/lib/api";
import { handle } from "@/lib/errorHandler";
import { AuthStorage } from "@/lib/auth";
import { parseApiError, ValidationErrors } from "@/lib/apiErrorParser";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;

  login: (credentials: Record<string, any>) => Promise<boolean>;
  register: (data: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  validationErrors: {},

  clearError: () => set({ error: null, validationErrors: {} }),

  login: async (credentials) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    const [err, response] = await handle(
      api.post<AuthResponse>("/api/login", credentials),
    );

    if (err) {
      const parsedError = parseApiError(err);

      set({
        isLoading: false,
        error: parsedError.message,
        validationErrors: parsedError.validationErrors,
      });
      return false;
    }

    await AuthStorage.setToken(response.token);

    set({
      user: response.user,
      isLoading: false,
      error: null,
      validationErrors: {},
    });
    return true;
  },

  register: async (data) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    const [err, response] = await handle(
      api.post<AuthResponse>("/api/register", data),
    );

    if (err) {
      const parsedError = parseApiError(err);

      set({
        isLoading: false,
        error: parsedError.message,
        validationErrors: parsedError.validationErrors,
      });
      return false;
    }

    await AuthStorage.setToken(response.token);
    set({
      user: response.user,
      isLoading: false,
      error: null,
      validationErrors: {},
    });
    return true;
  },

  fetchMe: async () => {
    const token = await AuthStorage.getToken();
    if (!token) return;

    set({ isLoading: true, error: null, validationErrors: {} });

    const [err, user] = await handle(api.get<User>("/api/me", { token }));

    if (err) {
      await AuthStorage.removeToken();
      set({ user: null, isLoading: false, validationErrors: {} });
      return;
    }

    set({ user, isLoading: false, validationErrors: {} });
  },

  logout: async () => {
    const token = await AuthStorage.getToken();
    set({ isLoading: true });

    if (token) {
      await handle(api.post("/api/logout", {}, { token }));
    }

    await AuthStorage.removeToken();
    set({ user: null, isLoading: false, error: null, validationErrors: {} });
  },
}));
