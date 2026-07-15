import { create } from "zustand";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface UIState {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],

  addToast: (type, message) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
