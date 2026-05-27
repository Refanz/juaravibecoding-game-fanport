import { useEffect, useState } from 'react';
import { EventBus } from '../../infrastructure/events/EventBus';
import { 
  FLOOR1_AREA_BOUNDS, 
  FLOOR2_AREA_BOUNDS,
  ROOM_LABELS_F1,
  ROOM_LABELS_F2,
  FLOOR1_DECORATIONS,
  FLOOR2_DECORATIONS
} from '../../infrastructure/data/floorData';
import { ELEVATOR_POS } from '../../infrastructure/data/maps';

interface Props {
  onClose: () => void;
  initialFloor: 1 | 2 | 3;
}

export default function MapModal({ onClose, initialFloor }: Props) {
  const [viewFloor, setViewFloor] = useState<1 | 2 | 3>(initialFloor);
  const [playerPos, setPlayerPos] = useState<{x: number, y: number, floor: 1 | 2 | 3} | null>(null);

  useEffect(() => {
    const handlePlayerPos = (pos: {x: number, y: number, floor: 1 | 2 | 3}) => {
      setPlayerPos(pos);
    };

    EventBus.on('player_position', handlePlayerPos);
    return () => {
      EventBus.off('player_position', handlePlayerPos);
    };
  }, []);

  const areaBounds = viewFloor === 1 ? FLOOR1_AREA_BOUNDS : FLOOR2_AREA_BOUNDS;
  const roomLabels = viewFloor === 1 ? ROOM_LABELS_F1 : ROOM_LABELS_F2;
  const decorations = viewFloor === 1 ? FLOOR1_DECORATIONS : FLOOR2_DECORATIONS;
  
  const cctvs = decorations.filter(d => d.type === 'cctvCamera');
  const aps = decorations.filter(d => d.type === 'accessPoint');

  const MAP_W = 28;
  const MAP_H = 30;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark border border-hospital-blue rounded-lg w-full max-w-4xl h-[90vh] flex flex-col shadow-[0_0_20px_rgba(33,150,243,0.3)] animate-fade-in scale-[0.75] sm:scale-100 origin-top sm:origin-center">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-hospital-blue/30 bg-hospital-blue/10">
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 text-xs md:text-sm font-[var(--font-pixel)] rounded transition-colors ${viewFloor === 1 ? 'bg-hospital-blue text-white' : 'bg-dark border border-hospital-blue text-hospital-sky hover:bg-hospital-blue/30'}`}
              onClick={() => setViewFloor(1)}
            >
              LANTAI 1
            </button>
            <button 
              className={`px-4 py-2 text-xs md:text-sm font-[var(--font-pixel)] rounded transition-colors ${viewFloor === 2 ? 'bg-hospital-blue text-white' : 'bg-dark border border-hospital-blue text-hospital-sky hover:bg-hospital-blue/30'}`}
              onClick={() => setViewFloor(2)}
            >
              LANTAI 2
            </button>
          </div>
          <h2 className="text-hospital-sky font-[var(--font-pixel)] text-lg md:text-xl absolute left-1/2 -translate-x-1/2 hidden md:block text-shadow-glow">HOSPITAL MAP</h2>
          <button onClick={onClose} className="text-hospital-sky hover:text-white text-3xl leading-none">&times;</button>
        </div>

        {/* Map Area */}
        <div className="flex-1 p-2 md:p-4 overflow-auto bg-[#0a1526] relative flex items-center justify-center">
          <div className="w-full h-full max-h-[70vh] flex items-center justify-center">
            <svg 
              viewBox={`0 0 ${MAP_W} ${MAP_H}`} 
              className="max-w-full max-h-full drop-shadow-lg"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Background */}
              <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#06101c" rx="0.5" />
              
              {/* Area Bounds */}
              {areaBounds.map((area, i) => (
                <rect 
                  key={`area-${i}`}
                  x={area.startX} 
                  y={area.startY} 
                  width={area.endX - area.startX + 1} 
                  height={area.endY - area.startY + 1} 
                  fill="#1b3a57" 
                  stroke="#4fc3f7" 
                  strokeWidth="0.05"
                  rx="0.2"
                />
              ))}

              {/* Elevator */}
              <rect x={ELEVATOR_POS.x} y={ELEVATOR_POS.y} width="1.5" height="1.5" fill="#5e35b1" rx="0.2" />
              <text x={ELEVATOR_POS.x + 0.75} y={ELEVATOR_POS.y + 0.8} fill="#fff" fontSize="0.8" textAnchor="middle" alignmentBaseline="middle">🛗</text>

              {/* CCTV */}
              {cctvs.map((cctv, i) => (
                <text key={`cctv-${i}`} x={cctv.x + 0.5} y={cctv.y + 0.5} fontSize="0.7" textAnchor="middle" alignmentBaseline="middle">📹</text>
              ))}

              {/* Access Points */}
              {aps.map((ap, i) => (
                <text key={`ap-${i}`} x={ap.x + 0.5} y={ap.y + 0.5} fontSize="0.6" textAnchor="middle" alignmentBaseline="middle">📡</text>
              ))}

              {/* Room Labels */}
              {roomLabels.map((lbl, i) => (
                <text 
                  key={`lbl-${i}`}
                  x={lbl.x + 0.5} 
                  y={lbl.y + 0.5} 
                  fill="#90caf9" 
                  fontSize="0.4" 
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {lbl.text}
                </text>
              ))}

              {/* Player Position */}
              {playerPos && playerPos.floor === viewFloor && (
                <g transform={`translate(${playerPos.x / 48}, ${playerPos.y / 48})`}>
                  <circle r="0.8" fill="rgba(255, 82, 82, 0.4)">
                    <animate attributeName="r" values="0.4;1.2;0.4" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="0.4" fill="#ff5252" stroke="#fff" strokeWidth="0.1" />
                  <text y="-0.6" fontSize="0.3" fill="#fff" textAnchor="middle" fontWeight="bold">YOU</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-hospital-blue/30 bg-hospital-blue/5 flex gap-4 md:gap-8 flex-wrap justify-center text-hospital-sky font-[var(--font-pixel)] text-[0.6rem]">
          <div className="flex items-center gap-2"><span className="text-base">🛗</span> Lift</div>
          <div className="flex items-center gap-2"><span className="text-base">📹</span> CCTV</div>
          <div className="flex items-center gap-2"><span className="text-base">📡</span> Access Point</div>
          <div className="flex items-center gap-2">
            <div className="relative w-3 h-3 flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-red-500/50 animate-ping"></span>
              <span className="absolute w-2 h-2 rounded-full bg-red-500 border border-white"></span>
            </div> 
            Posisi Anda
          </div>
        </div>
      </div>
    </div>
  );
}
