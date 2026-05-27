import { useEffect, useState } from "react";
import TicketingApp from "./TicketingApp";
import { InteractableObject } from "../../domain/entities/InteractableObject";
import { EventBus } from "../../infrastructure/events/EventBus";

interface Props {
  objects: InteractableObject[];
  onClose: () => void;
  onGoToLocation: (idx: number) => void;
  onFixTicket: (idx: number) => void;
}

export default function DesktopUIModal({
  objects,
  onClose,
  onGoToLocation,
  onFixTicket,
}: Props) {
  const [time, setTime] = useState("");
  const [activeApp, setActiveApp] = useState<"ticketing" | null>("ticketing");

  useEffect(() => {
    const onTimeUpdated = ({ time }: { time: string }) => {
      setTime(time);
    };
    EventBus.on("time_updated", onTimeUpdated);
    return () => {
      EventBus.off("time_updated", onTimeUpdated);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-2 sm:p-8 animate-fade-in pointer-events-auto">
      <div className="w-full h-full max-w-[1000px] max-h-[700px] bg-[#008080] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative font-sans">
        {/* Desktop Icons */}
        <div className="flex-1 p-4 flex flex-col gap-4 items-start relative z-10">
          <button
            className="flex flex-col items-center gap-1 group w-20 cursor-pointer focus:outline-none"
            onDoubleClick={() => setActiveApp("ticketing")}
            onClick={() => setActiveApp("ticketing")}
          >
            <div
              className={`text-4xl p-2 rounded ${activeApp === "ticketing" ? "bg-white/20 border border-white/40" : "group-hover:bg-white/10 border border-transparent"}`}
            >
              📋
            </div>
            <span className="text-white text-[0.6rem] text-center drop-shadow-md">
              IT Support
              <br />
              Ticketing
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group w-20 cursor-not-allowed opacity-70">
            <div className="text-4xl p-2 rounded border border-transparent group-hover:bg-white/10">
              🌐
            </div>
            <span className="text-white text-[0.6rem] text-center drop-shadow-md">
              Browser
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group w-20 cursor-not-allowed opacity-70">
            <div className="text-4xl p-2 rounded border border-transparent group-hover:bg-white/10">
              ⚙️
            </div>
            <span className="text-white text-[0.6rem] text-center drop-shadow-md">
              Settings
            </span>
          </button>
        </div>

        {/* Windows / Apps */}
        {activeApp === "ticketing" && (
          <div className="absolute inset-4 sm:inset-10 top-4 bottom-14 bg-white rounded-md shadow-2xl flex flex-col overflow-hidden z-20 border border-slate-300">
            {/* Window Title Bar */}
            <div className="bg-[#000080] text-white flex justify-between items-center px-2 py-1 select-none">
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem]">📋</span>
                <span className="font-bold text-[0.7rem]">
                  Sistem Tiketing IT Support - v1.0
                </span>
              </div>
              <button
                className="bg-[#c0c0c0] hover:bg-red-500 hover:text-white text-black border-2 border-white border-b-gray-600 border-r-gray-600 px-3 py-0 rounded-sm font-bold text-xs"
                onClick={() => setActiveApp(null)}
              >
                X
              </button>
            </div>
            {/* Window Content */}
            <div className="flex-1 overflow-hidden p-1 bg-[#c0c0c0]">
              <TicketingApp
                objects={objects}
                onGoToLocation={onGoToLocation}
                onFixTicket={onFixTicket}
              />
            </div>
          </div>
        )}

        {/* Taskbar */}
        <div className="h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center justify-between px-2 z-30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] relative">
          <div className="flex items-center gap-2 h-full py-1">
            <button
              className="h-full bg-[#c0c0c0] border-2 border-white border-b-gray-600 border-r-gray-600 px-3 flex items-center gap-2 font-bold text-sm active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white text-black"
              onClick={onClose}
            >
              <span className="text-[#008080]">⊞</span> Tutup OS
            </button>

            {/* Active App Indicator */}
            {activeApp === "ticketing" && (
              <div className="h-full bg-[#dfdfdf] border-2 border-gray-600 border-b-white border-r-white px-3 flex items-center gap-2 text-xs font-bold text-slate-800">
                📋 IT Support
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 h-full py-1.5 px-3 bg-[#c0c0c0] border-2 border-gray-600 border-b-white border-r-white text-xs text-black font-bold">
            <span>🔋 100%</span>
            <span>
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
