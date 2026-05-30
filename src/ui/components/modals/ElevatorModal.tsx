import React from 'react';

interface Props {
  currentFloor: number;
  onSelectFloor: (floor: 1 | 2 | 3) => void;
  onClose: () => void;
}

export default function ElevatorModal({ currentFloor, onSelectFloor, onClose }: Props) {
  const floors = [
    { num: 3, label: 'Lantai 3 - Server Room', color: 'border-purple-500' },
    { num: 2, label: 'Lantai 2 - VIP & Operasi', color: 'border-hospital-blue' },
    { num: 1, label: 'Lantai 1 - IGD & Poli', color: 'border-medical-green' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
      <div className="bg-dark/95 border-2 border-hospital-sky rounded-lg p-4 sm:p-6 w-full max-w-sm flex flex-col items-center gap-3 sm:gap-4 shadow-[0_0_20px_rgba(214,228,240,0.2)] max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="text-3xl">🛗</div>
        <h2 className="text-hospital-sky font-bold text-lg mb-2">Panel Lift</h2>
        
        <div className="flex flex-col gap-3 w-full">
          {floors.map((f) => (
            <button
              key={f.num}
              onClick={() => {
                if (f.num !== currentFloor) {
                  onSelectFloor(f.num as 1 | 2 | 3);
                } else {
                  onClose();
                }
              }}
              className={`flex items-center justify-between p-3 border ${f.color} ${f.num === currentFloor ? 'bg-white/10 opacity-50 cursor-not-allowed' : 'bg-dark/50 hover:bg-white/10 hover:scale-105'} transition-all rounded`}
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-bold bg-black/50 px-2 py-1 rounded">Lt.{f.num}</span>
                <span className="text-[0.65rem] text-medical-light whitespace-nowrap">{f.label}</span>
              </div>
              {f.num === currentFloor && <span className="text-[0.55rem] text-medical-green ml-2">Saat ini</span>}
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-red-900/50 hover:bg-red-900 border border-red-500 text-white rounded text-xs transition-colors w-full cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
