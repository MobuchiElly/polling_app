// /components/ui/toast.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number; // in ms
};

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = "default",
  duration = 3000,
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`fixed top-5 right-5 max-w-sm w-full p-4 rounded-lg shadow-lg flex flex-col space-y-1 border ${
        variant === "destructive"
          ? "bg-red-50 border-red-200 text-red-900"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-start">
        <strong>{title}</strong>
        <button
          className="ml-2 text-gray-500 hover:text-gray-700"
          onClick={() => setVisible(false)}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {description && <p className="text-sm">{description}</p>}
    </div>,
    document.body
  );
};
