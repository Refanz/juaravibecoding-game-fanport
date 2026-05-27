// ==========================================
// ui/components/CCTVMonitorModal.tsx
// Modal CCTV — Phaser snapshots + zoom/rotate
// ==========================================

import { useEffect, useRef, useState, useCallback } from 'react';
import { EventBus } from '../../infrastructure/events/EventBus';

interface Props { onClose: () => void; }

interface CCTVFeed { id: string; label: string; floor: string; activity: string; }

const CCTV_FEEDS: CCTVFeed[] = [
  { id: 'resepsionis',  label: 'Resepsionis',    floor: 'Lt. 1', activity: '🖥️' },
  { id: 'igd',          label: 'IGD',            floor: 'Lt. 1', activity: '🚑' },
  { id: 'farmasi',      label: 'Farmasi',        floor: 'Lt. 1', activity: '💊' },
  { id: 'icu',          label: 'ICU',            floor: 'Lt. 1', activity: '❤️' },
  { id: 'rawat_inap_1', label: 'Rawat Inap 1',   floor: 'Lt. 1', activity: '🛏️' },
  { id: 'rawat_inap_2', label: 'Rawat Inap 2',   floor: 'Lt. 1', activity: '🛏️' },
  { id: 'rawat_inap_3', label: 'Rawat Inap 3',   floor: 'Lt. 1', activity: '🛏️' },
  { id: 'poliklinik',   label: 'Poliklinik',     floor: 'Lt. 1', activity: '🩺' },
  { id: 'ruang_cctv',   label: 'Ruang CCTV',     floor: 'Lt. 1', activity: '📹' },
  { id: 'ruang_operasi',label: 'R. Operasi',     floor: 'Lt. 2', activity: '🔪' },
  { id: 'radiologi',    label: 'Radiologi',      floor: 'Lt. 2', activity: '☢️' },
  { id: 'hemodialisa',  label: 'Hemodialisa',    floor: 'Lt. 2', activity: '💉' },
  { id: 'vip',          label: 'Ruang VIP',      floor: 'Lt. 2', activity: '🌟' },
];

/* ---------- Fallback canvas ---------- */
function FallbackCanvas({ color, activity }: { color: string; activity: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let f = 0;
    const draw = () => {
      const W = c.width, H = c.height;
      ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
      const t = f * 0.025;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.3 * Math.sin(t + i)})`;
        ctx.beginPath();
        ctx.arc(((Math.sin(t*(0.4+i*0.1)+i)+1)/2)*(W-8)+4, ((Math.cos(t*(0.3+i*0.07)+i*2)+1)/2)*(H-8)+4, 3, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.fillStyle='rgba(0,0,0,0.15)';
      for (let y=0;y<H;y+=4) ctx.fillRect(0,y,W,1);
      f++; raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [color]);
  return (
    <div style={{ position:'relative', flex:1 }}>
      <canvas ref={ref} width={320} height={180} style={{ width:'100%',height:'100%',display:'block' }}/>
      <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6 }}>
        <div style={{ fontSize:22,opacity:0.5 }}>{activity}</div>
        <div style={{ color:'#4a8fa8',fontSize:7,fontFamily:'"Press Start 2P",monospace' }}>MEMUAT...</div>
      </div>
    </div>
  );
}

/* ---------- Control buttons ---------- */
const btnStyle: React.CSSProperties = {
  background:'rgba(0,20,40,0.85)', border:'1px solid #1b4f72', color:'#4fc3f7',
  borderRadius:4, padding:'3px 7px', cursor:'pointer', fontSize:10, lineHeight:1,
};

/* ---------- CCTV Panel ---------- */
function CCTVPanel({
  feed, snapshot, expanded, zoom, rotation, onClick,
  onZoomIn, onZoomOut, onRotate,
}: {
  feed: CCTVFeed; snapshot: string|null; expanded: boolean;
  zoom: number; rotation: number;
  onClick: () => void;
  onZoomIn: () => void; onZoomOut: () => void; onRotate: () => void;
}) {
  const [clock, setClock] = useState('');
  useEffect(() => {
    const onTimeUpdated = ({ time }: { time: string }) => setClock(time);
    EventBus.on('time_updated', onTimeUpdated);
    return () => { EventBus.off('time_updated', onTimeUpdated); };
  }, []);

  const bg = feed.floor==='Lt. 2'?'#0d2137':feed.floor==='Luar'?'#0a1828':'#0d1b2a';
  const transform = `scale(${zoom}) rotate(${rotation}deg)`;

  return (
    <div onClick={onClick} style={{
      position:'relative', background:bg,
      border: expanded?'2px solid #4fc3f7':'1px solid #1b4f72',
      borderRadius:6, overflow:'hidden', cursor:'pointer',
      boxShadow: expanded?'0 0 20px #4fc3f7aa':'0 0 6px #4fc3f722',
      transition:'box-shadow 0.2s', display:'flex', flexDirection:'column',
      minHeight: expanded?320:140,
    }}>
      {/* Feed */}
      <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
        {snapshot ? (
          <>
            <img src={snapshot} alt={feed.label} style={{
              width:'100%',height:'100%',objectFit:'cover',display:'block',
              filter:'sepia(0.15) brightness(0.85) contrast(1.1)',
              transform, transformOrigin:'center center', transition:'transform 0.3s',
            }}/>
            <div style={{ position:'absolute',inset:0,
              background:'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)',
              pointerEvents:'none' }}/>
            <div style={{ position:'absolute',inset:0,
              background:'radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.45) 100%)',
              pointerEvents:'none' }}/>
          </>
        ) : (
          <FallbackCanvas color={bg} activity={feed.activity}/>
        )}
      </div>

      {/* REC */}
      <div style={{ position:'absolute',top:8,left:8,display:'flex',alignItems:'center',gap:4 }}>
        <span style={{ width:7,height:7,borderRadius:'50%',background:'#e74c3c',
          boxShadow:'0 0 6px #e74c3c',display:'inline-block',animation:'cctvBlink 1s infinite' }}/>
        <span style={{ color:'#e74c3c',fontSize:8,fontFamily:'monospace',fontWeight:700 }}>REC</span>
      </div>

      {/* Activity */}
      <div style={{ position:'absolute',top:8,right:8,fontSize:expanded?20:13,opacity:0.85 }}>
        {feed.activity}
      </div>

      {/* Zoom/Rotate controls — visible in both modes */}
      <div style={{ position:'absolute',bottom:30,right:6,display:'flex',flexDirection:'column',gap:3,zIndex:10 }}
        onClick={e=>e.stopPropagation()}
      >
        <button style={btnStyle} onClick={onZoomIn} title="Zoom In">🔍+</button>
        <button style={btnStyle} onClick={onZoomOut} title="Zoom Out">🔍−</button>
        <button style={btnStyle} onClick={onRotate} title="Rotate 180°">🔄</button>
      </div>

      {/* Zoom / Rotation badge */}
      {(zoom !== 1 || rotation !== 0) && (
        <div style={{ position:'absolute',top:8,left:'50%',transform:'translateX(-50%)',
          background:'rgba(0,0,0,0.7)',color:'#4fc3f7',fontSize:7,fontFamily:'monospace',
          padding:'2px 6px',borderRadius:3 }}>
          {zoom !== 1 && `×${zoom.toFixed(1)}`}{rotation !== 0 && ` ↻${rotation}°`}
        </div>
      )}

      {/* Bottom bar */}
      <div style={{ background:'rgba(0,0,0,0.8)',padding:'4px 8px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ color:'#4fc3f7',fontSize:8,fontFamily:'"Press Start 2P",monospace' }}>{feed.label}</span>
        <span style={{ color:'#7fb5c8',fontSize:7,fontFamily:'monospace' }}>[{feed.floor}] {clock}</span>
      </div>
    </div>
  );
}

/* ---------- Modal ---------- */
export default function CCTVMonitorModal({ onClose }: Props) {
  const [frames, setFrames] = useState<Record<string,string>>({});
  const [expanded, setExpanded] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState<Record<string,number>>({});
  const [rotation, setRotation] = useState<Record<string,number>>({});
  const refreshRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const requestCapture = useCallback(() => {
    setLoading(true);
    EventBus.emit('request_cctv_capture');
  }, []);

  useEffect(() => {
    const onFrames = (data: {id:string;src:string}[]) => {
      setFrames(prev => { const n={...prev}; for(const f of data) n[f.id]=f.src; return n; });
      setLoading(false);
    };
    EventBus.on('cctv_frames', onFrames);
    requestCapture();
    refreshRef.current = setInterval(requestCapture, 10000);
    return () => { EventBus.off('cctv_frames', onFrames); if(refreshRef.current) clearInterval(refreshRef.current); };
  }, [requestCapture]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key==='Escape') { if(expanded) setExpanded(null); else onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded, onClose]);

  const handleZoomIn = (id: string) => setZoom(p => ({ ...p, [id]: Math.min((p[id]??1)+0.5, 3) }));
  const handleZoomOut = (id: string) => setZoom(p => ({ ...p, [id]: Math.max((p[id]??1)-0.5, 0.5) }));
  const handleRotate = (id: string) => setRotation(p => ({ ...p, [id]: ((p[id]??0)+180)%360 }));

  const expandedFeed = CCTV_FEEDS.find(f => f.id === expanded);

  return (
    <div style={{
      position:'fixed',inset:0,background:'rgba(0,5,15,0.95)',zIndex:500,
      display:'flex',flexDirection:'column',fontFamily:'"Press Start 2P",monospace',
      backdropFilter:'blur(4px)',
    }}>
      {/* Header */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'10px 20px',borderBottom:'1px solid #1b4f72',
        background:'rgba(0,10,30,0.9)',flexShrink:0,
      }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <span style={{ fontSize:20 }}>📹</span>
          <div>
            <div style={{ color:'#4fc3f7',fontSize:10 }}>CCTV CONTROL ROOM</div>
            <div style={{ color:'#5d8aa0',fontSize:7,marginTop:3 }}>
              {loading ? '⏳ Memuat live view...' : `✅ ${Object.keys(frames).length} kamera aktif`}
            </div>
          </div>
        </div>
        <div style={{ display:'flex',gap:8,alignItems:'center' }}>
          <button onClick={requestCapture} title="Refresh"
            style={{ background:'#0d2137',border:'1px solid #1b4f72',color:'#4fc3f7',borderRadius:4,padding:'5px 10px',cursor:'pointer',fontSize:8 }}>
            🔄 Refresh
          </button>
          {expanded && (
            <button onClick={()=>setExpanded(null)}
              style={{ background:'#1b4f72',border:'1px solid #4fc3f7',color:'#4fc3f7',borderRadius:4,padding:'5px 12px',cursor:'pointer',fontSize:8 }}>
              ← Semua
            </button>
          )}
          <button onClick={onClose} title="Tutup (ESC)"
            style={{ background:'transparent',border:'1px solid #c0392b',color:'#e74c3c',borderRadius:4,padding:'5px 12px',cursor:'pointer',fontSize:10 }}>
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && expandedFeed ? (
        <div style={{ flex:1,padding:20,display:'flex',flexDirection:'column',gap:12,overflow:'hidden' }}>
          <CCTVPanel feed={expandedFeed} snapshot={frames[expandedFeed.id]??null} expanded
            zoom={zoom[expandedFeed.id]??1} rotation={rotation[expandedFeed.id]??0}
            onClick={()=>setExpanded(null)}
            onZoomIn={()=>handleZoomIn(expandedFeed.id)}
            onZoomOut={()=>handleZoomOut(expandedFeed.id)}
            onRotate={()=>handleRotate(expandedFeed.id)}
          />
          <div style={{ color:'#4a8fa8',fontSize:7,textAlign:'center' }}>
            Klik panel atau [ESC] untuk kembali · Gunakan 🔍+/− untuk zoom · 🔄 untuk rotate 180°
          </div>
        </div>
      ) : (
        <div style={{
          flex:1,overflowY:'auto',padding:16,display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',
          gap:12,alignContent:'start',
        }}>
          {CCTV_FEEDS.map(feed => (
            <CCTVPanel key={feed.id} feed={feed} snapshot={frames[feed.id]??null} expanded={false}
              zoom={zoom[feed.id]??1} rotation={rotation[feed.id]??0}
              onClick={()=>setExpanded(feed.id)}
              onZoomIn={()=>handleZoomIn(feed.id)}
              onZoomOut={()=>handleZoomOut(feed.id)}
              onRotate={()=>handleRotate(feed.id)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding:'6px 20px',borderTop:'1px solid #1b4f72',background:'rgba(0,10,30,0.9)',
        display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,
      }}>
        <span style={{ color:'#2e6a8a',fontSize:7 }}>
          [ESC] tutup · 🔍+/− zoom · 🔄 rotate 180° · auto-refresh 10s
        </span>
        <span style={{ color:loading?'#f39c12':'#2ecc71',fontSize:7 }}>
          {loading?'⏳ CAPTURING...':'🟢 LIVE'}
        </span>
      </div>

      <style>{`@keyframes cctvBlink{0%,100%{opacity:1}50%{opacity:.1}}`}</style>
    </div>
  );
}
