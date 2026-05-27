import { useEffect, useState, useCallback } from "react";
import TicketingApp from "./TicketingApp";
import { InteractableObject } from "../../domain/entities/InteractableObject";
import { EventBus } from "../../infrastructure/events/EventBus";
import {
  initCCTVRenderer,
  captureAllCCTVFrames,
  loadCachedCCTVFrames,
} from "../../domain/CCTVRenderer";

interface Props {
  objects: InteractableObject[];
  onClose: () => void;
  onGoToLocation: (idx: number) => void;
  onFixTicket: (idx: number) => void;
}

/* ── CCTV Feed Definitions ── */
const CCTV_FEEDS = [
  { id: "resepsionis", label: "Resepsionis", floor: "Lt.1" },
  { id: "igd", label: "IGD", floor: "Lt.1" },
  { id: "farmasi", label: "Farmasi", floor: "Lt.1" },
  { id: "icu", label: "ICU", floor: "Lt.1" },
  { id: "rawat_inap_1", label: "R.Inap 1", floor: "Lt.1" },
  { id: "rawat_inap_2", label: "R.Inap 2", floor: "Lt.1" },
  { id: "rawat_inap_3", label: "R.Inap 3", floor: "Lt.1" },
  { id: "poliklinik", label: "Poliklinik", floor: "Lt.1" },
  { id: "ruang_cctv", label: "R.CCTV", floor: "Lt.1" },
  { id: "ruang_operasi", label: "R.Operasi", floor: "Lt.2" },
  { id: "radiologi", label: "Radiologi", floor: "Lt.2" },
  { id: "hemodialisa", label: "Hemodialisa", floor: "Lt.2" },
  { id: "vip", label: "VIP", floor: "Lt.2" },
  { id: "server_room", label: "Server Room", floor: "Lt.3" },
];

/* ── Embedded CCTV App (Windows-style inside laptop) ── */
function CCTVApp() {
  const [frames, setFrames] = useState<Record<string, string>>({});
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState("");

  const doCapture = useCallback(() => {
    const result = captureAllCCTVFrames();
    setFrames(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    const onTime = ({ time }: { time: string }) => setClock(time);
    EventBus.on("time_updated", onTime);

    // Load cached
    const cached = loadCachedCCTVFrames();
    if (Object.keys(cached).length > 0) {
      setFrames(cached);
      setLoading(false);
    }

    let interval: ReturnType<typeof setInterval> | null = null;
    initCCTVRenderer().then(() => {
      doCapture();
      interval = setInterval(doCapture, 2000);
    });

    return () => {
      EventBus.off("time_updated", onTime);
      if (interval) clearInterval(interval);
    };
  }, [doCapture]);

  const selectedData = CCTV_FEEDS.find((f) => f.id === selectedFeed);

  return (
    <div className="flex flex-col md:flex-row h-full font-mono text-[11px] min-h-0">
      {/* Sidebar — Camera list */}
      <div
        className="hidden md:flex flex-col w-[150px] shrink-0 bg-[#0a1828] border-r border-[#1b4f72] overflow-y-auto"
      >
        <div
          style={{
            padding: "6px 8px",
            background: "#0d2137",
            borderBottom: "1px solid #1b4f72",
            color: "#4fc3f7",
            fontWeight: 700,
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          📹 Kamera ({CCTV_FEEDS.length})
        </div>
        {CCTV_FEEDS.map((feed) => (
          <button
            key={feed.id}
            onClick={() => setSelectedFeed(selectedFeed === feed.id ? null : feed.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 8px",
              border: "none",
              borderBottom: "1px solid #0d2137",
              background: selectedFeed === feed.id ? "#1b4f72" : "transparent",
              color: selectedFeed === feed.id ? "#4fc3f7" : "#7fb5c8",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 10,
              width: "100%",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: frames[feed.id] ? "#2ecc71" : "#e74c3c",
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {feed.label}
            </span>
            <span style={{ color: "#4a6a7a", fontSize: 8 }}>{feed.floor}</span>
          </button>
        ))}
      </div>

      {/* Main area — Grid or single view */}
      <div className="flex-1 bg-[#050e1a] flex flex-col overflow-hidden min-h-0 min-w-0">
        {/* Top info bar */}
        <div
          style={{
            padding: "4px 10px",
            background: "#0a1828",
            borderBottom: "1px solid #1b4f72",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#e74c3c",
                display: "inline-block",
                animation: "cctvBlink 1s infinite",
              }}
            />
            <span style={{ color: "#e74c3c", fontSize: 9, fontWeight: 700 }}>
              REC
            </span>
            <span style={{ color: "#4a6a7a", fontSize: 9 }}>
              {loading ? "⏳ Memuat..." : `✅ ${Object.keys(frames).length} aktif`}
            </span>
          </div>
          <span style={{ color: "#4fc3f7", fontSize: 9 }}>{clock}</span>
        </div>

        {/* Content */}
        {selectedFeed && selectedData ? (
          /* Single camera view */
          <div className="flex-1 flex flex-col p-2 gap-2 min-h-0">
            <div
              style={{
                flex: 1,
                background: "#0d1b2a",
                borderRadius: 4,
                border: "2px solid #4fc3f7",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {frames[selectedFeed] ? (
                <>
                  <img
                    src={frames[selectedFeed]}
                    alt={selectedData.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      imageRendering: "pixelated",
                      filter: "sepia(0.1) brightness(0.9) contrast(1.1)",
                    }}
                  />
                  {/* Scanlines */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "repeating-linear-gradient(to bottom,transparent 0px,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 3px)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              ) : (
                <div style={{ color: "#4a6a7a", fontSize: 10 }}>⏳ Menunggu sinyal...</div>
              )}
              {/* Camera label overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  left: 8,
                  color: "#4fc3f7",
                  fontSize: 9,
                  fontWeight: 700,
                  textShadow: "0 0 4px #000",
                }}
              >
                📹 {selectedData.label} [{selectedData.floor}]
              </div>
            </div>
            <button
              onClick={() => setSelectedFeed(null)}
              style={{
                alignSelf: "center",
                background: "#1b4f72",
                border: "1px solid #4fc3f7",
                color: "#4fc3f7",
                padding: "3px 12px",
                borderRadius: 3,
                cursor: "pointer",
                fontSize: 9,
              }}
            >
              ← Kembali ke Grid
            </button>
          </div>
        ) : (
          /* Grid view */
          <div
            className="flex-1 p-1.5 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-1 overflow-y-auto content-start min-h-0 pb-12"
          >
            {CCTV_FEEDS.map((feed) => (
              <div
                key={feed.id}
                onClick={() => setSelectedFeed(feed.id)}
                style={{
                  background: "#0d1b2a",
                  border: "1px solid #1b4f72",
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#4fc3f7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#1b4f72")
                }
              >
                <div
                  style={{
                    width: "100%",
                    height: 65,
                    background: "#0a1828",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {frames[feed.id] ? (
                    <>
                      <img
                        src={frames[feed.id]}
                        alt={feed.label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          imageRendering: "pixelated",
                          filter: "sepia(0.1) brightness(0.85) contrast(1.1)",
                        }}
                      />
                      {/* Scanlines */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)",
                          pointerEvents: "none",
                        }}
                      />
                    </>
                  ) : (
                    <div style={{ color: "#2e4a5a", fontSize: 8 }}>⏳</div>
                  )}
                  {/* REC dot */}
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: 4,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#e74c3c",
                      animation: "cctvBlink 1s infinite",
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "2px 4px",
                    background: "rgba(0,0,0,0.7)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#4fc3f7", fontSize: 7, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {feed.label}
                  </span>
                  <span style={{ color: "#4a6a7a", fontSize: 6 }}>{feed.floor}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes cctvBlink{0%,100%{opacity:1}50%{opacity:.15}}`}</style>
    </div>
  );
}

/* ── Main Desktop UI Modal ── */
export default function DesktopUIModal({
  objects,
  onClose,
  onGoToLocation,
  onFixTicket,
}: Props) {
  const [time, setTime] = useState("");
  const [activeApp, setActiveApp] = useState<"ticketing" | "cctv" | null>("ticketing");

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
    <div className="fixed inset-0 bg-black/50 z-[200] flex flex-col items-center justify-start sm:justify-center p-2 sm:p-8 animate-fade-in pointer-events-auto overflow-y-auto">
      <div className="w-full min-h-[500px] h-[95vh] sm:h-full max-w-[1000px] max-h-[700px] bg-[#008080] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative font-sans my-auto shrink-0">
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

          <button
            className="flex flex-col items-center gap-1 group w-20 cursor-pointer focus:outline-none"
            onDoubleClick={() => setActiveApp("cctv")}
            onClick={() => setActiveApp("cctv")}
          >
            <div
              className={`text-4xl p-2 rounded ${activeApp === "cctv" ? "bg-white/20 border border-white/40" : "group-hover:bg-white/10 border border-transparent"}`}
            >
              📹
            </div>
            <span className="text-white text-[0.6rem] text-center drop-shadow-md">
              CCTV
              <br />
              Monitor
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

        {activeApp === "cctv" && (
          <div className="absolute inset-4 sm:inset-10 top-4 bottom-14 rounded-md shadow-2xl flex flex-col overflow-hidden z-20 border border-slate-300">
            {/* Window Title Bar */}
            <div
              className="flex justify-between items-center px-2 py-1 select-none"
              style={{ background: "#0a1828", borderBottom: "1px solid #1b4f72" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem]">📹</span>
                <span className="font-bold text-[0.7rem]" style={{ color: "#4fc3f7" }}>
                  CCTV Control Room - Live Monitor
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
            <div className="flex-1 overflow-hidden" style={{ background: "#050e1a" }}>
              <CCTVApp />
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
            <span>
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
