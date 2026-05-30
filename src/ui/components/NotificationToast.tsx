import React, { useEffect, useRef } from "react";

interface Props {
  title?: string;
  message?: string; // made optional to support old 'notification' prop
  notification?: string; // kept for backward compatibility
  icon?: string;
  colorTheme?: "orange" | "red" | "blue" | "green";
  duration?: number;
  onClose: () => void;
  topPosition?: string;
}

export default function NotificationToast({
  title = "Perhatian",
  message,
  notification,
  icon = "⚠️",
  colorTheme = "orange",
  duration = 2000,
  onClose,
  topPosition = "top-4 lg:top-4"
}: Props) {
  const displayMessage = message || notification;
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseRef.current();
    }, duration);
    return () => clearTimeout(timer);
  }, [displayMessage, duration]);

  const themes = {
    orange: {
      border: "border border-orange-500/50",
      shadow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]",
      titleText: "text-orange-400",
      bg: "bg-dark/95"
    },
    red: {
      border: "border border-red-500/50",
      shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
      titleText: "text-red-400",
      bg: "bg-dark/95"
    },
    blue: {
      border: "border-l-4 border-blue-500",
      shadow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      titleText: "text-blue-300",
      bg: "bg-blue-900/95"
    },
    green: {
      border: "border border-green-500/50",
      shadow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
      titleText: "text-green-400",
      bg: "bg-dark/95"
    }
  };

  const currentTheme = themes[colorTheme] || themes.orange;

  if (!displayMessage) return null;

  return (
    <div className={`fixed ${topPosition} right-4 z-[9999] animate-fade-in origin-top-right scale-[0.8] lg:scale-[1.1]`}>
      <div className={`${currentTheme.bg} ${currentTheme.border} ${currentTheme.shadow} backdrop-blur-md rounded-lg p-3 lg:p-4 flex items-start gap-3 w-[85vw] max-w-[300px] lg:w-max lg:min-w-[300px] lg:max-w-[400px]`}>
        <span className="text-lg lg:text-xl shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1">
          <h4 className={`${currentTheme.titleText} text-[10px] lg:text-sm font-bold mb-0.5 lg:mb-1 uppercase tracking-wider`}>
            {title}
          </h4>
          <p className="text-gray-300 text-[9px] lg:text-[0.65rem] leading-snug lg:leading-relaxed">
            {displayMessage}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors shrink-0 px-2 py-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
