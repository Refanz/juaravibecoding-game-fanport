import { ReactNode } from "react";

interface Props {
  title: string;
  icon: string;
  theme?: "light" | "dark"; // ticketing is light, cctv is dark
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
  isDesktop?: boolean;
}

export default function DesktopWindow({ 
  title, 
  icon, 
  theme = "light", 
  onClose, 
  children, 
  contentClassName,
  isDesktop = true
}: Props) {
  const isDark = theme === "dark";
  
  return (
    <div className={`absolute ${isDesktop ? 'inset-10 top-8 bottom-16' : 'inset-1 top-2 bottom-12'} rounded-md shadow-2xl flex flex-col overflow-hidden z-20 border border-slate-300 ${isDark ? '' : 'bg-white'}`}>
      {/* Window Title Bar */}
      <div
        className={`flex justify-between items-center px-2 py-1 select-none ${isDark ? '' : 'bg-[#000080] text-white'}`}
        style={isDark ? { background: "#0a1828", borderBottom: "1px solid #1b4f72" } : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="text-[0.7rem]">{icon}</span>
          <span className="font-bold text-[0.7rem]" style={isDark ? { color: "#4fc3f7" } : undefined}>
            {title}
          </span>
        </div>
        <button
          className="bg-[#c0c0c0] hover:bg-red-500 hover:text-white text-black border-2 border-white border-b-gray-600 border-r-gray-600 px-3 py-0 rounded-sm font-bold text-xs"
          onClick={onClose}
        >
          X
        </button>
      </div>
      
      {/* Window Content */}
      <div 
        className={`flex-1 overflow-hidden ${contentClassName || ""}`} 
        style={isDark ? { background: "#050e1a" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
