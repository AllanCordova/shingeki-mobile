import {
  apiClient,
  registerAuthTokenGetter,
  registerUnauthorizedHandler,
} from "@/lib/api";
import {
  getPersistedToken,
  removePersistedToken,
  setPersistedToken,
} from "@/lib/authTokenStorage";
import { getAxiosErrorMessage } from "@/lib/http";
import {
  loginSchema,
  registerSchema,
  updateSchema,
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
  type SuccessResponse,
  type UpdateInput,
  type User,
} from "@/schemas/auth";
import { ZodError } from "zod";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  sessionHydrated: boolean;

  register: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  updateMe: (data: UpdateInput) => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
  hydrateSession: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  sessionHydrated: false,

  hydrateSession: async () => {
    const stored = getPersistedToken();
    if (!stored) {
      set({ user: null, token: null, sessionHydrated: true });
      return;
    }
    set({ token: stored });
    try {
      const response = await apiClient.get<User>("/me");
      set({ user: response.data, sessionHydrated: true, error: null });
    } catch {
      removePersistedToken();
      set({
        user: null,
        token: null,
        sessionHydrated: true,
        error: null,
      });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const validatedData = registerSchema.parse(data);

      const response = await apiClient.post<AuthResponse>(
        "/register",
        validatedData,
      );

      const token = response.data.token;
      setPersistedToken(token);
      set({
        user: response.data.user,
        token,
        isLoading: false,
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof ZodError
          ? (err.issues[0]?.message ?? "Registration failed")
          : getAxiosErrorMessage(err, "Registration failed");

      set({ error: errorMessage, isLoading: false });

      return false;
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const validatedData = loginSchema.parse(data);

      const response = await apiClient.post<AuthResponse>(
        "/login",
        validatedData,
      );

      const token = response.data.token;
      setPersistedToken(token);
      set({
        user: response.data.user,
        token,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ZodError
          ? (err.issues[0]?.message ?? "Login failed")
          : getAxiosErrorMessage(err, "Login failed");

      set({ error: errorMessage, isLoading: false });
    }
  },

  logout: async () => {
    const hadToken = !!get().token;
    try {
      set({ isLoading: true, error: null });

      if (hadToken) {
        await apiClient.post<SuccessResponse>("/logout");
      }
    } catch (err) {
      set({
        error: getAxiosErrorMessage(err, "Logout failed"),
      });
    } finally {
      removePersistedToken();
      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },

  getMe: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<User>("/me");

      set({
        user: response.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: getAxiosErrorMessage(err, "Failed to fetch user"),
        isLoading: false,
      });
    }
  },

  updateMe: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const validatedData = updateSchema.parse(data);

      const response = await apiClient.put<User>("/me", validatedData);

      set({
        user: response.data,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ZodError
          ? (err.issues[0]?.message || "Validation error")
          : getAxiosErrorMessage(err, "Update failed");

      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  setToken: (token) => {
    setPersistedToken(token);
    set({ token });
  },
}));

registerAuthTokenGetter(() => useAuth.getState().token);

registerUnauthorizedHandler(() => {
  removePersistedToken();
  useAuth.setState({
    user: null,
    token: null,
    isLoading: false,
  });
});
