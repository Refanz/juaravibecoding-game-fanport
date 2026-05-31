import { useEffect, useState } from "react";
import TicketingApp from "./TicketingApp";
import CCTVApp from "./CCTVApp";
import DesktopTaskbar from "./DesktopTaskbar";
import DesktopIcon from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import VibeProcurementApp from "./VibeProcurementApp";
import { InteractableObject } from "../../../domain/entities/InteractableObject";
import { EventBus } from "../../../infrastructure/events/EventBus";

interface Props {
  objects: InteractableObject[];
  initialApp?: "ticketing" | "cctv" | "procurement" | null;
  onClose: () => void;
  onGoToLocation: (idx: number) => void;
  onFixTicket: (idx: number) => void;
}

export default function DesktopUIModal({
  objects,
  initialApp,
  onClose,
  onGoToLocation,
  onFixTicket,
}: Props) {
  const [time, setTime] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [activeApp, setActiveApp] = useState<"ticketing" | "cctv" | "procurement" | null>(initialApp || null);
  const [layout, setLayout] = useState({
    width: 1000,
    height: 700,
    scale: 1,
    isDesktop: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      const isDesktop = W >= 1024 && H >= 600;

      if (!isDesktop) {
        // Mobile / Tablet landscape mode:
        // We want the UI to exactly fill the screen, but the content inside to be larger (zoomed in).
        // By relying purely on CSS percentages for width/height and scale, we bypass
        // any JS `window.innerWidth` race conditions or address bar height glitches.
        setLayout({
          width: 0, // Ignored in CSS calc mode
          height: 0, // Ignored in CSS calc mode
          scale: 0.8,
          isDesktop: false,
        });
      } else {
        // On desktop, we preserve the classic 1000x700 windowed look
        const scaleX = (W - 32) / 1000;
        const scaleY = (H - 32) / 700;
        setLayout({
          width: 1000,
          height: 700,
          scale: Math.min(scaleX, scaleY, 1),
          isDesktop: true,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onTimeUpdated = ({
      time,
      timestamp: ts,
    }: {
      time: string;
      timestamp?: number;
    }) => {
      setTime(time);
      if (ts) setTimestamp(ts);
    };
    EventBus.on("time_updated", onTimeUpdated);
    return () => {
      EventBus.off("time_updated", onTimeUpdated);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 z-[200] animate-fade-in pointer-events-auto overflow-hidden">
      <div
        className={`bg-[#008080] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden font-sans absolute ${
          layout.isDesktop ? "top-1/2 left-1/2" : "top-0 left-0"
        }`}
        style={
          layout.isDesktop
            ? {
                width: layout.width,
                height: layout.height,
                transform: `translate(-50%, -50%) scale(${layout.scale})`,
                transformOrigin: "center",
                borderRadius: 8,
              }
            : {
                width: `calc(100% / ${layout.scale})`,
                height: `calc(100% / ${layout.scale})`,
                transform: `scale(${layout.scale})`,
                transformOrigin: "top left",
                borderRadius: 0,
              }
        }
      >
        {/* Desktop Icons */}
        <div className="flex-1 min-h-0 p-2 md:p-4 flex flex-col flex-wrap gap-2 md:gap-5 items-start content-start relative z-10 overflow-hidden">
          <DesktopIcon
            icon="📋"
            label={
              <>
                IT Support
                <br />
                Ticketing
              </>
            }
            isActive={activeApp === "ticketing"}
            onClick={() => setActiveApp("ticketing")}
            onDoubleClick={() => setActiveApp("ticketing")}
          />
          <DesktopIcon
            icon="📹"
            label={
              <>
                CCTV
                <br />
                Monitor
              </>
            }
            isActive={activeApp === "cctv"}
            onClick={() => setActiveApp("cctv")}
            onDoubleClick={() => setActiveApp("cctv")}
          />
          <DesktopIcon icon="🌐" label="Browser" isDisabled={true} />
          <DesktopIcon 
            icon="🛒" 
            label={
              <>
                Vibe<br />
                Procurement
              </>
            } 
            isActive={activeApp === "procurement"}
            onClick={() => setActiveApp("procurement")}
            onDoubleClick={() => setActiveApp("procurement")}
          />
          <DesktopIcon icon="⚙️" label="Settings" isDisabled={true} />
        </div>

        {/* Windows / Apps */}
        {activeApp === "ticketing" && (
          <DesktopWindow
            title="Sistem Tiketing IT Support - v1.0"
            icon="📋"
            onClose={() => setActiveApp(null)}
            contentClassName="p-1 bg-[#c0c0c0]"
            isDesktop={layout.isDesktop}
          >
            <TicketingApp
              objects={objects}
              onGoToLocation={onGoToLocation}
              onFixTicket={onFixTicket}
              currentTimestamp={timestamp}
            />
          </DesktopWindow>
        )}

        {activeApp === "cctv" && (
          <DesktopWindow
            title="CCTV Control Room - Live Monitor"
            icon="📹"
            theme="dark"
            onClose={() => setActiveApp(null)}
            isDesktop={layout.isDesktop}
          >
            <CCTVApp />
          </DesktopWindow>
        )}

        {activeApp === "procurement" && (
          <DesktopWindow
            title="Vibe Procurement System"
            icon="🛒"
            theme="light"
            onClose={() => setActiveApp(null)}
            isDesktop={layout.isDesktop}
            contentClassName="bg-[#f0f0f0]"
          >
            <VibeProcurementApp currentTimestamp={timestamp} />
          </DesktopWindow>
        )}

        {/* Taskbar */}
        <DesktopTaskbar time={time} activeApp={activeApp} onCloseOS={onClose} />
      </div>
    </div>
  );
}
