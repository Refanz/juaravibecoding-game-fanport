import { useEffect, useState } from "react";
import { EventBus } from "../../infrastructure/events/EventBus";

import { GameState } from "../../domain/GameState";
import ReportTicketList from "./ReportTicketList";

interface ReportData {
  id: string;
  date: string;
  totalResolved: number;
  totalUnresolved: number;
  details: {
    id: string;
    title: string;
    label: string;
    floor: number;
    impact: string;
    urgency: string;
    solved: boolean;
    resolveTimeHours: number | null;
  }[];
}

interface Props {
  gs: GameState;
}

export default function DailyReportModal({ gs }: Props) {
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const onShow = (data: ReportData) => {
      setReport(data);
      gs.isPaused = true;
      EventBus.emit("game_paused", true);
    };
    EventBus.on("show_daily_report", onShow);
    return () => { EventBus.off("show_daily_report", onShow); };
  }, [gs]);

  const handleContinue = () => {
    setReport(null);
    EventBus.emit("start_day_transition");
  };

  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border-t-8 border-blue-600">
        <div className="bg-slate-100 p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Laporan Harian IT Support</h2>
              <p className="text-slate-500 font-bold mt-1">Tanggal: {report.date}</p>
            </div>
            <div className="bg-slate-200 px-3 py-1 rounded text-xs font-bold text-slate-600">
              ID: {report.id}
            </div>
          </div>
        </div>
        
        <div className="flex bg-slate-50 p-4 border-b border-slate-200 gap-4">
          <div className="flex-1 bg-white p-4 border border-slate-200 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{report.totalResolved + report.totalUnresolved}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Insiden</div>
          </div>
          <div className="flex-1 bg-white p-4 border border-slate-200 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{report.totalResolved}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Selesai</div>
          </div>
          <div className="flex-1 bg-white p-4 border border-slate-200 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{report.totalUnresolved}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Belum Selesai</div>
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-4 flex-1 min-h-0">
          <ReportTicketList details={report.details} />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
          >
            Lanjutkan ke Hari Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
