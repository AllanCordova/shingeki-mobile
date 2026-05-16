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
import { getApiSuccessMessage } from "@/lib/toastMessages";
import { toast } from "@/hooks/useToast";
import {
  AuthResponse,
  loginSchema,
  registerSchema,
  SuccessResponse,
  User,
  type LoginInput,
  type RegisterInput,
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

      toast.success(
        getApiSuccessMessage(response.data, "Account created successfully"),
      );
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof ZodError
          ? (err.issues[0]?.message ?? "Registration failed")
          : getAxiosErrorMessage(err, "Registration failed");

      toast.error(errorMessage);
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
      toast.success(getApiSuccessMessage(response.data, "Signed in successfully"));
    } catch (err) {
      const errorMessage =
        err instanceof ZodError
          ? (err.issues[0]?.message ?? "Login failed")
          : getAxiosErrorMessage(err, "Login failed");

      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  logout: async () => {
    const hadToken = !!get().token;
    let succeeded = true;

    try {
      set({ isLoading: true, error: null });

      if (hadToken) {
        await apiClient.post<SuccessResponse>("/logout");
      }
    } catch (err) {
      succeeded = false;
      const message = getAxiosErrorMessage(err, "Logout failed");
      toast.error(message);
      set({ error: message });
    } finally {
      removePersistedToken();
      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }

    if (hadToken && succeeded) {
      toast.success("Signed out successfully");
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
      const message = getAxiosErrorMessage(err, "Failed to fetch user");
      toast.error(message);
      set({ error: message, isLoading: false });
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
  toast.error("Session expired. Please sign in again.");
});