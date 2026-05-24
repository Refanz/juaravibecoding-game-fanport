import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function NetworkTopologyModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative bg-dark/95 border-2 border-hospital-sky rounded-xl p-6 w-[95%] max-w-6xl h-[85vh] flex flex-col shadow-[0_0_40px_rgba(214,228,240,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hospital-sky/30 pb-4 mb-4">
          <div>
            <h2 className="text-hospital-sky font-bold text-2xl flex items-center gap-3">
              <span className="text-3xl">🌐</span> Network Topology Map
            </h2>
            <p className="text-medical-light text-sm mt-1">
              Live Infrastructure Monitoring - RS JVC RS-Type
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-red-900/50 hover:bg-red-900 border border-red-500 text-white text-lg font-bold rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Canvas / Dashboard */}
        <div className="flex-1 relative bg-black/50 rounded-lg border border-white/10 overflow-auto w-full h-full custom-scrollbar">
          <div className="relative min-w-[1000px] min-h-[600px] w-full h-full">
            {/* Animated SVG Connections Background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2980B9" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#4FC3F7" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.3" />
                </linearGradient>
                <style>
                  {`
                    .anim-dash {
                      stroke-dasharray: 12, 12;
                      animation: dash 3s linear infinite;
                    }
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -100;
                      }
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                      height: 8px;
                      width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(0, 0, 0, 0.3);
                      border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(79, 195, 247, 0.5);
                      border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(79, 195, 247, 0.8);
                    }
                  `}
                </style>
              </defs>

              {/* ISP to Firewall */}
              <path
                d="M 180,100 C 230,100 230,300 270,300"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="3"
                className="anim-dash"
              />
              <path
                d="M 180,300 L 270,300"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="3"
                className="anim-dash"
              />
              <path
                d="M 180,500 C 230,500 230,300 270,300"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="3"
                className="anim-dash"
              />

              {/* Firewall to Core */}
              <path
                d="M 370,300 L 470,300"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="4"
                className="anim-dash"
              />

              {/* Core to Distributions & Server */}
              <path
                d="M 570,300 C 620,300 620,150 670,150"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="3"
                className="anim-dash"
              />
              <path
                d="M 570,300 L 670,300"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="3"
                className="anim-dash"
              />
              <path
                d="M 570,300 C 620,300 620,450 670,450"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="3"
                className="anim-dash"
              />

              {/* Distribution to End Devices */}
              <path
                d="M 770,150 L 830,150"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="2"
                className="anim-dash"
              />
              <path
                d="M 770,450 L 830,450"
                fill="none"
                stroke="url(#glowLine)"
                strokeWidth="2"
                className="anim-dash"
              />
            </svg>

            {/* Nodes (Absolute Positioning based on % width and height) */}
            {/* Column 1: Modems */}
            <NodeCard
              left="5%"
              top="16.6%"
              icon="📡"
              title="Modem SenangNet"
              subtitle="ISP 1 - Primary"
              status="active"
              color="border-yellow-500"
            />
            <NodeCard
              left="5%"
              top="50%"
              icon="📡"
              title="Modem CepatNet"
              subtitle="ISP 2 - Secondary"
              status="active"
              color="border-red-500"
            />
            <NodeCard
              left="5%"
              top="83.3%"
              icon="📡"
              title="Modem Gatotkaca"
              subtitle="ISP 3 - Backup"
              status="warning"
              color="border-purple-500"
            />

            {/* Column 2: Firewall */}
            <NodeCard
              left="27%"
              top="50%"
              icon="🛡️"
              title="Fortigate Firewall"
              subtitle="Security Gateway (Lt.3)"
              status="active"
              color="border-orange-500"
            />

            {/* Column 3: Switch Core */}
            <NodeCard
              left="47%"
              top="50%"
              icon="🎛️"
              title="Switch Core"
              subtitle="Server Room (Lt.3)"
              status="active"
              color="border-blue-500"
            />

            {/* Column 4: Distribution / Servers */}
            <NodeCard
              left="67%"
              top="25%"
              icon="🏢"
              title="Switch Distribusi Lt.2"
              subtitle="IT Hub Lantai 2"
              status="active"
              color="border-hospital-sky"
            />

            <NodeCard
              left="67%"
              top="50%"
              icon="🖥️"
              title="Perangkat Server"
              subtitle="Server Room Lt.3"
              status="active"
              color="border-white/30"
              devices={[
                "6x Rak Server",
                "1x UPS Utama",
                "1x AC Server",
                "Access Door Panel",
                "PC Monitoring",
              ]}
            />

            <NodeCard
              left="67%"
              top="75%"
              icon="🏢"
              title="Switch Distribusi Lt.1"
              subtitle="IT Hub Lantai 1"
              status="active"
              color="border-medical-green"
            />

            {/* Column 5: End Devices */}
            <NodeCard
              left="83%"
              top="25%"
              icon="🏥"
              title="Klien Lantai 2"
              subtitle="End Devices Lt.2"
              status="active"
              color="border-white/30"
              devices={[
                "PC R.Operasi",
                "Alat Radiologi",
                "PC Hemodialisa",
                "Alat VIP",
                "CCTV (4x)",
                "Access Points (4x)",
              ]}
            />

            <NodeCard
              left="83%"
              top="75%"
              icon="🏥"
              title="Klien Lantai 1"
              subtitle="End Devices Lt.1"
              status="active"
              color="border-white/30"
              devices={[
                "PC Resepsionis",
                "PC Farmasi & IGD",
                "Alat ICU",
                "PC Poliklinik (3x)",
                "CCTV (7x)",
                "Access Points (17x)",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NodeProps {
  left: string;
  top: string;
  icon: string;
  title: string;
  subtitle: string;
  status: "active" | "warning" | "error";
  color: string;
  devices?: string[];
}

function NodeCard({
  left,
  top,
  icon,
  title,
  subtitle,
  status,
  color,
  devices,
}: NodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`absolute z-10 w-[13%] min-w-[140px] bg-dark/95 p-3 rounded-lg border ${color} shadow-lg backdrop-blur-md transition-transform cursor-pointer hover:scale-105`}
      style={{ left, top, transform: "translate(0, -50%)" }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      {/* Pulse effect */}
      {status === "active" && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
      {status === "warning" && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="text-2xl bg-black/60 p-2 rounded shadow-inner flex-shrink-0">
          {icon}
        </div>
        <div className="overflow-hidden w-full">
          <h3 className="text-white font-bold text-xs leading-tight truncate">
            {title}
          </h3>
          <p className="text-medical-light text-[10px] truncate">{subtitle}</p>
        </div>
      </div>

      {/* Hover / Tap Tooltip */}
      {showTooltip && (
        <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-max max-w-[220px] bg-black/95 text-white p-3 rounded-lg border border-white/20 shadow-2xl z-50 pointer-events-none">
          <div className="font-bold text-sm text-hospital-sky mb-1">
            {title}
          </div>
          <div className="text-medical-light text-xs">{subtitle}</div>
          {devices && (
            <div className="mt-2 pt-2 border-t border-white/20 flex flex-col gap-1.5">
              {devices.map((d) => (
                <DeviceItem key={d} name={d} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DeviceItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-hospital-sky leading-none whitespace-normal">
      <span className="min-w-[6px] h-1.5 rounded-full bg-hospital-sky shadow-[0_0_5px_#4FC3F7]"></span>
      <span className="break-words">{name}</span>
    </div>
  );
}
