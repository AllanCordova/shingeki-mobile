import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType) => string;
  dismiss: (id: string) => void;
};

const DEFAULT_DURATION_MS = 3500;

function createToastId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],

  show: (message, type = "info") => {
    const id = createToastId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      get().dismiss(id);
    }, DEFAULT_DURATION_MS);

    return id;
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export const toast = {
  success: (message: string) => useToast.getState().show(message, "success"),
  error: (message: string) => useToast.getState().show(message, "error"),
  info: (message: string) => useToast.getState().show(message, "info"),
};
