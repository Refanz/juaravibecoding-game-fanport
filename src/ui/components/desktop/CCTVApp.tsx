import { useEffect, useState, useCallback } from "react";
import { EventBus } from "../../../infrastructure/events/EventBus";
import {
  initCCTVRenderer,
  captureAllCCTVFrames,
  loadCachedCCTVFrames,
} from "../../../domain/CCTVRenderer";

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

export default function CCTVApp() {
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
      <div className="hidden md:flex flex-col w-[150px] shrink-0 bg-[#0a1828] border-r border-[#1b4f72] overflow-y-auto">
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
          <div className="flex-1 p-1.5 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-1 overflow-y-auto content-start min-h-0 pb-12">
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
