import apiClient, { registerUnauthorizedHandler } from "@/lib/api";
import { getAxiosErrorMessage } from "@/lib/http";
import { getApiSuccessMessage } from "@/lib/toastMessages";
import {
  signatureIssueResponseSchema,
  signatureValidateResponseSchema,
  type SignatureMeta,
} from "@/schemas/signature";
import {
  scanQueuedResponseSchema,
  scanResultsResponseSchema,
  type SystemResult,
} from "@/schemas/systemResult";
import {
  createSystemSchema,
  type CreateSystemInput,
  type System,
  updateSystemSchema,
  type UpdateSystemInput,
} from "@/schemas/system";
import { toast } from "@/hooks/useToast";
import axios from "axios";
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

  signatureToken: string | null;
  embedHint: string | null;
  signatureStatus: string | null;
  signatureMeta: SignatureMeta | null;
  lastScanInfo: { attacks_count: number; target_url: string } | null;
  scanResults: SystemResult[];
  isSignatureLoading: boolean;
  isValidating: boolean;
  isScanning: boolean;
  isResultsLoading: boolean;
  scanError: string | null;

  getSystemsByProjectId: (projectId: string) => Promise<boolean>;
  getSystemById: (id: string) => Promise<boolean>;
  createSystem: (data: CreateSystemInput) => Promise<boolean>;
  updateSystem: (id: string, data: UpdateSystemInput) => Promise<boolean>;
  deleteSystem: (id: string) => Promise<boolean>;
  issueSignatureToken: (systemId: string) => Promise<boolean>;
  validateSignature: (systemId: string) => Promise<boolean>;
  startScan: (systemId: string) => Promise<boolean>;
  getScanResults: (systemId: string) => Promise<boolean>;
  clearSystems: () => void;
  clearSelectedSystem: () => void;
  clearSubmitError: () => void;
  clearScanState: () => void;
}

function getValidationError(err: unknown, fallback: string): string {
  if (err instanceof ZodError) {
    return err.issues[0]?.message ?? fallback;
  }
  return getAxiosErrorMessage(err, fallback);
}

function parseValidateResponse(data: unknown): SignatureMeta | null {
  const parsed = signatureValidateResponseSchema.safeParse(data);
  return parsed.success ? parsed.data.signature : null;
}

const scanStateDefaults = {
  signatureToken: null,
  embedHint: null,
  signatureStatus: null,
  signatureMeta: null,
  lastScanInfo: null,
  scanResults: [] as SystemResult[],
  isSignatureLoading: false,
  isValidating: false,
  isScanning: false,
  isResultsLoading: false,
  scanError: null,
};

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
  ...scanStateDefaults,

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

  issueSignatureToken: async (systemId) => {
    set({ isSignatureLoading: true, scanError: null });
    try {
      const response = await apiClient.post(
        `/systems/${systemId}/signature`,
      );
      const parsed = signatureIssueResponseSchema.parse(response.data);
      set({
        signatureToken: parsed.token,
        embedHint: parsed.embed_hint,
        signatureStatus: parsed.status,
        isSignatureLoading: false,
      });
      toast.success(
        getApiSuccessMessage(
          parsed,
          "Token de verificação gerado com sucesso",
        ),
      );
      return true;
    } catch (err) {
      const message = getValidationError(
        err,
        "Falha ao gerar token de verificação",
      );
      toast.error(message);
      set({ scanError: message, isSignatureLoading: false });
      return false;
    }
  },

  validateSignature: async (systemId) => {
    set({ isValidating: true, scanError: null });
    try {
      const response = await apiClient.post(
        `/systems/${systemId}/signature/validate`,
      );
      const parsed = signatureValidateResponseSchema.parse(response.data);
      set({
        signatureMeta: parsed.signature,
        signatureStatus: parsed.signature.status,
        isValidating: false,
      });
      if (parsed.signature.status === "ALLOWED") {
        toast.success(
          getApiSuccessMessage(parsed, "Posse do sistema validada"),
        );
        return true;
      }
      toast.error(parsed.message || "Posse ainda não validada");
      return false;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const signature = parseValidateResponse(err.response.data);
        const message = getAxiosErrorMessage(
          err,
          "Token não encontrado no site alvo",
        );
        if (signature) {
          set({
            signatureMeta: signature,
            signatureStatus: signature.status,
            isValidating: false,
            scanError: message,
          });
        } else {
          set({ isValidating: false, scanError: message });
        }
        toast.error(message);
        return false;
      }
      const message = getValidationError(err, "Falha ao validar posse");
      toast.error(message);
      set({ scanError: message, isValidating: false });
      return false;
    }
  },

  startScan: async (systemId) => {
    set({ isScanning: true, scanError: null });
    try {
      const response = await apiClient.post(`/systems/${systemId}/scan`);
      const parsed = scanQueuedResponseSchema.parse(response.data);
      set({
        lastScanInfo: {
          attacks_count: parsed.attacks_count,
          target_url: parsed.target_url,
        },
        isScanning: false,
      });
      toast.success(
        getApiSuccessMessage(parsed, "Scan DAST enfileirado com sucesso"),
      );
      return true;
    } catch (err) {
      const message = getValidationError(err, "Falha ao iniciar scan");
      toast.error(message);
      set({ scanError: message, isScanning: false });
      return false;
    }
  },

  getScanResults: async (systemId) => {
    set({ isResultsLoading: true, scanError: null });
    try {
      const response = await apiClient.get(`/systems/${systemId}/results`);
      const parsed = scanResultsResponseSchema.parse(response.data);
      set({ scanResults: parsed.results, isResultsLoading: false });
      toast.success(
        getApiSuccessMessage(parsed, "Resultados atualizados"),
      );
      return true;
    } catch (err) {
      const message = getValidationError(err, "Falha ao carregar resultados");
      toast.error(message);
      set({ scanError: message, isResultsLoading: false });
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

  clearScanState: () => set(scanStateDefaults),
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
    ...scanStateDefaults,
  });
});
