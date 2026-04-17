"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const borderColors = {
    success: "border-emerald-500/20",
    error: "border-rose-500/20",
    info: "border-blue-500/20",
  };

  const bgColors = {
    success: "bg-emerald-500/5",
    error: "bg-rose-500/5",
    info: "bg-blue-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-4 ring-1 ring-black/5 dark:ring-white/5 ${bgColors[type]} ${borderColors[type]}`}
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      
      <div className="flex-1">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
      >
        <X className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
      </button>
    </motion.div>
  );
}
