import { useState } from 'react';

export interface TicketDetail {
  id: string;
  title: string;
  label: string;
  floor: number;
  impact: string;
  urgency: string;
  solved: boolean;
  resolveTimeHours: number | null;
}

interface Props {
  details: TicketDetail[];
}

export default function ReportTicketList({ details }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const safeDetails = details || [];

  if (safeDetails.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 italic font-bold">
        Tidak ada insiden tercatat pada hari ini.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {safeDetails.map((d, idx) => {
        const isExpanded = expandedIndex === idx;
        return (
          <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all">
            <div 
              className="p-3 bg-slate-50 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="font-bold text-slate-800 text-sm truncate">
                  <span className="text-blue-600 mr-1">#{d.id}</span>
                  {d.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{d.label} (Lt. {d.floor})</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {d.solved ? (
                  <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">SELESAI</span>
                ) : (
                  <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px]">TERTUNDA</span>
                )}
                <span className={`text-slate-400 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="p-3 border-t border-slate-200 bg-white flex flex-col gap-2 text-xs animate-fade-in">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-bold">Lokasi</span>
                  <span className="text-slate-800 font-bold">{d.label} (Lantai {d.floor})</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-bold">Tingkat Dampak</span>
                  <span className={`font-bold ${d.impact === 'High' ? 'text-red-600' : d.impact === 'Medium' ? 'text-orange-500' : 'text-blue-600'}`}>{d.impact}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-bold">Urgensi</span>
                  <span className="text-slate-800 font-bold">{d.urgency}</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-slate-500 font-bold">Waktu Penyelesaian</span>
                  <span className="text-slate-800 font-bold">
                    {d.solved && d.resolveTimeHours !== null ? (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {Math.floor(d.resolveTimeHours)}j {Math.floor((d.resolveTimeHours * 60) % 60)}m
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Belum diselesaikan</span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
