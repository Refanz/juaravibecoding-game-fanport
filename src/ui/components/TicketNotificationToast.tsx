import { useEffect } from "react";

interface Props {
  title: string;
  message: string;
  onClose: () => void;
}

export default function TicketNotificationToast({ title, message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed top-12 lg:top-4 right-2 lg:right-4 z-[9999] animate-fade-in origin-top-right scale-[0.85] lg:scale-100">
      <div className="bg-blue-900/95 border-l-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-md rounded-lg lg:rounded-r-lg p-2 lg:p-3 flex items-center gap-2 lg:gap-3 w-[85vw] max-w-[300px] lg:w-max lg:min-w-[350px] lg:max-w-[500px]">
        <span className="text-lg lg:text-2xl shrink-0">📋</span>
        <div className="flex-1">
          <h4 className="text-blue-300 text-[10px] lg:text-xs font-bold mb-0.5 uppercase tracking-wider">{title}</h4>
          <p className="text-gray-200 text-[9px] lg:text-[0.65rem] leading-snug">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-white transition-colors shrink-0 px-2 py-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
