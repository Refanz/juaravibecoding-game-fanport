interface Props {
  time: string;
  activeApp: "ticketing" | "cctv" | null;
  onCloseOS: () => void;
}

export default function DesktopTaskbar({ time, activeApp, onCloseOS }: Props) {
  return (
    <div className="h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center justify-between px-2 z-30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] relative mt-auto">
      <div className="flex items-center gap-2 h-full py-1">
        <button
          className="h-full bg-[#c0c0c0] border-2 border-white border-b-gray-600 border-r-gray-600 px-3 flex items-center gap-2 font-bold text-sm active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white text-black"
          onClick={onCloseOS}
        >
          <span className="text-[#008080]">⊞</span> Tutup OS
        </button>

        {/* Active App Indicators */}
        {activeApp === "ticketing" && (
          <div className="h-full bg-[#dfdfdf] border-2 border-gray-600 border-b-white border-r-white px-3 flex items-center gap-2 text-xs font-bold text-slate-800">
            📋 IT Support
          </div>
        )}
        {activeApp === "cctv" && (
          <div className="h-full bg-[#dfdfdf] border-2 border-gray-600 border-b-white border-r-white px-3 flex items-center gap-2 text-xs font-bold text-slate-800">
            📹 CCTV Monitor
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 h-full py-1.5 px-3 bg-[#c0c0c0] border-2 border-gray-600 border-b-white border-r-white text-xs text-black font-bold">
        <span>🔋 100%</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
