import React from "react";

interface Props {
  notification: string;
  onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: Props) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in">
      <div className="bg-dark/95 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] backdrop-blur-md rounded-lg p-4 flex items-start gap-3 max-w-sm">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <h4 className="text-orange-400 text-sm font-bold mb-1">Perhatian</h4>
          <p className="text-gray-300 text-[0.65rem] leading-relaxed">
            {notification}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
