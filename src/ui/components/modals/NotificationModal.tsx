import React from 'react';

interface NotificationItem {
  id: string;
  time: string;
  message: string;
}

interface Props {
  notifications: NotificationItem[];
  onClose: () => void;
  onClear: () => void;
}

export default function NotificationModal({ notifications, onClose, onClear }: Props) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1a1a24] border-2 border-hospital-blue/40 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(0,180,216,0.3)] flex flex-col max-h-[80vh] overflow-hidden">
        <div className="bg-hospital-blue/20 border-b border-hospital-blue/30 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔔</span> Pusat Notifikasi
          </h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-lg w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-white/50 italic font-bold">
              Tidak ada notifikasi baru.
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex gap-3">
                <div className="text-2xl opacity-80">⚠️</div>
                <div className="flex-1">
                  <div className="text-hospital-sky text-xs font-bold mb-1">{notif.time}</div>
                  <div className="text-white text-sm leading-relaxed">{notif.message}</div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-black/20">
            <button 
              onClick={onClear}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold rounded-lg border border-red-500/30 transition-colors text-sm"
            >
              Bersihkan Semua
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
