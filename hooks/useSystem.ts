import apiClient, { registerUnauthorizedHandler } from "@/lib/api";
import { getAxiosErrorMessage } from "@/lib/http";
import { getApiSuccessMessage } from "@/lib/toastMessages";
import {
  createSystemSchema,
  type CreateSystemInput,
  type System,
  updateSystemSchema,
  type UpdateSystemInput,
} from "@/schemas/system";
import { toast } from "@/hooks/useToast";
import { ZodError } from "zod";
import { create } from "zustand";

interface SystemsResponse {
  message: string;
  systems: System[];
}

interface SystemResponse {
  message: string;
  system: System;
}

interface SystemState {
  systems: System[];
  selectedSystem: System | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  error: string | null;
  detailError: string | null;
  submitError: string | null;

  getSystemsByProjectId: (projectId: string) => Promise<boolean>;
  getSystemById: (id: string) => Promise<boolean>;
  createSystem: (data: CreateSystemInput) => Promise<boolean>;
  updateSystem: (id: string, data: UpdateSystemInput) => Promise<boolean>;
  deleteSystem: (id: string) => Promise<boolean>;
  clearSystems: () => void;
  clearSelectedSystem: () => void;
  clearSubmitError: () => void;
}

function getValidationError(err: unknown, fallback: string): string {
  if (err instanceof ZodError) {
    return err.issues[0]?.message ?? fallback;
  }
  return getAxiosErrorMessage(err, fallback);
}

export const useSystem = create<SystemState>((set) => ({
  systems: [],
  selectedSystem: null,
  isLoading: false,
  isDetailLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: null,
  detailError: null,
  submitError: null,

  getSystemsByProjectId: async (projectId) => {
    set({ isLoading: true, error: null, systems: [] });
    try {
      const response = await apiClient.get<SystemsResponse>("/systems", {
        params: { project_id: projectId },
      });
      set({ systems: response.data.systems, isLoading: false });
      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to fetch systems");
      toast.error(message);
      set({ error: message, isLoading: false });
      return false;
    }
  },

  getSystemById: async (id) => {
    set({ isDetailLoading: true, detailError: null, selectedSystem: null });
    try {
      const response = await apiClient.get<SystemResponse>(`/systems/${id}`);
      set({ selectedSystem: response.data.system, isDetailLoading: false });
      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to fetch system");
      toast.error(message);
      set({ detailError: message, isDetailLoading: false });
      return false;
    }
  },

  createSystem: async (data) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const validated = createSystemSchema.parse(data);
      const response = await apiClient.post<SystemResponse>(
        "/systems",
        validated,
      );
      const system = response.data.system;
      set((state) => ({
        systems: [system, ...state.systems],
        isSubmitting: false,
      }));
      toast.success(
        getApiSuccessMessage(response.data, "System created successfully"),
      );
      return true;
    } catch (err) {
      const message = getValidationError(err, "Failed to create system");
      toast.error(message);
      set({ submitError: message, isSubmitting: false });
      return false;
    }
  },

  updateSystem: async (id, data) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const validated = updateSystemSchema.parse(data);
      const response = await apiClient.put<SystemResponse>(
        `/systems/${id}`,
        validated,
      );
      const system = response.data.system;
      set((state) => ({
        systems: state.systems.map((s) => (s.id === id ? system : s)),
        selectedSystem:
          state.selectedSystem?.id === id ? system : state.selectedSystem,
        isSubmitting: false,
      }));
      toast.success(
        getApiSuccessMessage(response.data, "System updated successfully"),
      );
      return true;
    } catch (err) {
      const message = getValidationError(err, "Failed to update system");
      toast.error(message);
      set({ submitError: message, isSubmitting: false });
      return false;
    }
  },

  deleteSystem: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      const response = await apiClient.delete(`/systems/${id}`);
      set((state) => ({
        systems: state.systems.filter((s) => s.id !== id),
        selectedSystem:
          state.selectedSystem?.id === id ? null : state.selectedSystem,
        isDeleting: false,
      }));
      toast.success(
        getApiSuccessMessage(response.data, "System deleted successfully"),
      );
      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to delete system");
      toast.error(message);
      set({ error: message, isDeleting: false });
      return false;
    }
  },

  clearSystems: () => {
    set({ systems: [], isLoading: false, error: null });
  },

  clearSelectedSystem: () => {
    set({ selectedSystem: null, detailError: null, isDetailLoading: false });
  },

  clearSubmitError: () => set({ submitError: null }),
}));

registerUnauthorizedHandler(() => {
  useSystem.setState({
    systems: [],
    selectedSystem: null,
    isLoading: false,
    isDetailLoading: false,
    isSubmitting: false,
    isDeleting: false,
    error: null,
    detailError: null,
    submitError: null,
  });
});
