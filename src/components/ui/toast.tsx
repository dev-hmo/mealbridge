"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/stores/use-ui-store";

interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastItem;
  onRemove: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg min-w-[300px] transition-all duration-300 ${
        styles[toast.type]
      } ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}`}
    >
      <span className="text-lg">{icons[toast.type]}</span>
      <span className="flex-1 text-sm">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/70 hover:text-white"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
