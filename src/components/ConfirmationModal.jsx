import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Delete Permanently", 
  cancelText = "Cancel",
  type = "danger" // "danger" or "warning"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans print:hidden" id="custom-confirmation-modal">
      <div 
        className="relative bg-white dark:bg-brown-850 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-peach-100 dark:border-brown-800 animate-slide-up transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Header */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-brown-400 hover:text-brown-700 dark:hover:text-white hover:bg-brown-100 dark:hover:bg-brown-800 rounded-lg transition shrink-0 cursor-pointer flex"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-start space-x-4">
          {/* Status Symbol badge */}
          <div className={`p-3 rounded-xl shrink-0 ${
            type === "danger" 
              ? "bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400" 
              : "bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400"
          }`}>
            {type === "danger" ? <Trash2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>

          <div className="space-y-2 text-left">
            <h3 className="text-lg font-bold font-display text-brown-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-brown-600 dark:text-brown-300 leading-relaxed font-sans">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons layout segment */}
        <div className="mt-6 flex justify-end space-x-2.5">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-brown-50 dark:bg-brown-800 hover:bg-brown-100 dark:hover:bg-brown-750 text-brown-705 dark:text-peach-100 font-semibold rounded-xl text-xs transition cursor-pointer flex border border-peach-55/10"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-4.5 py-2 font-bold rounded-xl text-xs text-white transition cursor-pointer flex items-center space-x-1 border ${
              type === "danger" 
                ? "bg-red-600 border-red-700 hover:bg-red-700" 
                : "bg-peach-500 border-peach-600 hover:bg-peach-600"
            }`}
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
