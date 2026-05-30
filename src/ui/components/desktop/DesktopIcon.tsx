import { ReactNode } from "react";

interface Props {
  icon: string | ReactNode;
  label: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function DesktopIcon({ icon, label, isActive, isDisabled, onClick, onDoubleClick }: Props) {
  return (
    <button
      className={`flex flex-col items-center gap-1 group w-20 focus:outline-none ${isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      onClick={!isDisabled ? onClick : undefined}
      onDoubleClick={!isDisabled ? onDoubleClick : undefined}
    >
      <div
        className={`text-5xl p-2 rounded border ${
          isActive 
            ? "bg-white/20 border-white/40" 
            : "border-transparent group-hover:bg-white/10"
        }`}
      >
        {icon}
      </div>
      <span className="text-white text-[0.7rem] font-bold text-center drop-shadow-md">
        {label}
      </span>
    </button>
  );
}
