import { useState, useMemo, useEffect } from 'react';
import { InteractableObject } from '../../../domain/entities/InteractableObject';
import { HOSPITAL_QUIZZES } from '../../../infrastructure/data/quizzes';
import { EventBus } from '../../../infrastructure/events/EventBus';
import ReportTicketList from './ReportTicketList';

interface Props {
  objects: InteractableObject[];
  onGoToLocation: (idx: number) => void;
  onFixTicket: (idx: number) => void;
  currentTimestamp: number;
}

export default function TicketingApp({ objects, onGoToLocation, onFixTicket, currentTimestamp }: Props) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Hardware' | 'Software' | 'Jaringan'>('all');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'tickets' | 'reports'>('tickets');
  const [reports, setReports] = useState<any[]>([]);
  const [tick, setTick] = useState(0);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'reports') {
      const existingStr = sessionStorage.getItem("hospital_reports");
      if (existingStr) {
        try {
          const parsed = JSON.parse(existingStr);
          const valid = parsed.filter((r: any) => r && r.date);
          setReports(valid);
        } catch(e) {}
      }
      setSelectedReport(null);
    }
  }, [activeTab]);

  useEffect(() => {
    const onTicketUpdate = () => setTick(t => t + 1);
    EventBus.on("ticket_spawned", onTicketUpdate);
    return () => {
      EventBus.off("ticket_spawned", onTicketUpdate);
    };
  }, []);

  const getCategory = (icon: string) => {
    if (['📡', '🌟'].includes(icon)) return 'Jaringan';
    if (['💊', '💉', '🛏️'].includes(icon)) return 'Software';
    return 'Hardware';
  };

  const filteredTickets = useMemo(() => {
    return objects.map((obj, idx) => ({ ...obj, idx })).filter(obj => {
      if (!obj.active) return false;
      const quiz = HOSPITAL_QUIZZES[obj.idx % HOSPITAL_QUIZZES.length];
      const cat = getCategory(quiz.icon);
      
      if (statusFilter === 'open' && obj.solved) return false;
      if (statusFilter === 'completed' && !obj.solved) return false;
      
      if (categoryFilter !== 'all' && cat !== categoryFilter) return false;
      
      return true;
    });
  }, [objects, statusFilter, categoryFilter, tick]);

  const activeObj = selectedTicket !== null ? objects[selectedTicket] : null;
  const activeQuiz = selectedTicket !== null ? HOSPITAL_QUIZZES[selectedTicket % HOSPITAL_QUIZZES.length] : null;

  return (
    <div className="flex flex-col w-full h-full bg-[#f0f0f0] rounded-sm overflow-hidden border-2 border-slate-400">
      <div className="flex border-b-2 border-slate-400 bg-slate-200 shrink-0">
        <button 
          onClick={() => setActiveTab('tickets')} 
          className={`flex-1 py-2 font-bold text-sm transition-colors ${activeTab === 'tickets' ? 'bg-white text-blue-600 shadow-[inset_0_-2px_0_#2563eb]' : 'text-slate-600 hover:bg-slate-300'}`}
        >
          Daftar Tiket
        </button>
        <button 
          onClick={() => setActiveTab('reports')} 
          className={`flex-1 py-2 font-bold text-sm transition-colors ${activeTab === 'reports' ? 'bg-white text-blue-600 shadow-[inset_0_-2px_0_#2563eb]' : 'text-slate-600 hover:bg-slate-300'}`}
        >
          Laporan Harian
        </button>
      </div>
      
      <div className="flex-1 flex min-h-0">
        {activeTab === 'tickets' ? (
          <>
            {/* Left List */}
            <div className={`w-full md:w-1/3 border-r-2 border-slate-400 flex flex-col bg-white min-h-0 ${selectedTicket !== null ? 'hidden md:flex' : 'flex'}`}>
        {/* Filter bar */}
        <div className="p-2 border-b border-slate-300 bg-[#e0e0e0] flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              className={`flex-1 px-2 py-1 text-[0.6rem] rounded font-bold shadow-sm ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300'}`}
              onClick={() => setStatusFilter('all')}
            >Semua</button>
            <button 
              className={`flex-1 px-2 py-1 text-[0.6rem] rounded font-bold shadow-sm ${statusFilter === 'open' ? 'bg-orange-500 text-white' : 'bg-white border border-slate-300'}`}
              onClick={() => setStatusFilter('open')}
            >Open</button>
            <button 
              className={`flex-1 px-2 py-1 text-[0.6rem] rounded font-bold shadow-sm ${statusFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-white border border-slate-300'}`}
              onClick={() => setStatusFilter('completed')}
            >Selesai</button>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {['all', 'Hardware', 'Software', 'Jaringan'].map(cat => (
              <button 
                key={cat}
                className={`px-2 py-0.5 text-[0.55rem] rounded-full whitespace-nowrap border ${categoryFilter === cat ? 'bg-slate-700 text-white border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
                onClick={() => setCategoryFilter(cat as any)}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>
        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          {filteredTickets.length === 0 && (
            <div className="text-[0.65rem] text-center text-slate-500 mt-4">Tidak ada tiket.</div>
          )}
          {filteredTickets.map(t => {
            const quiz = HOSPITAL_QUIZZES[t.idx % HOSPITAL_QUIZZES.length];
            return (
              <div 
                key={t.idx}
                onClick={() => setSelectedTicket(t.idx)}
                className={`flex items-center gap-3 p-2 border-2 rounded cursor-pointer transition-all ${selectedTicket === t.idx ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-100'}`}
              >
                <div className="text-xl w-8 h-8 flex items-center justify-center bg-slate-200 rounded shrink-0">{quiz.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.65rem] font-bold truncate text-slate-800">
                    <span className="text-blue-600 mr-1">#{t.id}</span>
                    {quiz.title}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className={`text-[0.55rem] font-bold ${t.solved ? 'text-green-600' : 'text-orange-500'}`}>
                      {t.solved ? 'Completed' : 'Open'}
                    </div>
                    <div className="text-[0.5rem] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {t.impact} Impact
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail */}
      <div className={`flex-1 bg-[#fafafa] p-2 md:p-4 flex-col min-h-0 overflow-y-auto custom-scrollbar ${selectedTicket === null ? 'hidden md:flex' : 'flex'}`}>
        {selectedTicket !== null && activeObj && activeQuiz ? (
          <>
            {/* Mobile Back Button */}
            <div className="md:hidden mb-4">
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-bold text-[0.6rem] border border-blue-200 flex items-center gap-2"
              >
                <span>⬅</span> Kembali ke Daftar Tiket
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4 border-b-2 border-slate-200 pb-3 md:pb-4 mb-3 md:mb-4">
              <div className="text-3xl md:text-4xl bg-slate-200 p-2 md:p-3 rounded-lg shadow-inner">{activeQuiz.icon}</div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-800">
                  <span className="text-blue-600 mr-2">#{activeObj.id}</span>
                  {activeQuiz.title}
                </h2>
                <div className="flex gap-2 flex-wrap items-center mt-1">
                  <span className={`inline-block px-2 py-0.5 text-[0.6rem] rounded font-bold ${activeObj.solved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {activeObj.solved ? '✅ COMPLETED' : '⚠️ WAITING FOR SUPPORT'}
                  </span>
                  <span className={`inline-block px-2 py-0.5 text-[0.6rem] rounded font-bold ${activeObj.impact === 'High' ? 'bg-red-100 text-red-700' : activeObj.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                    Impact: {activeObj.impact}
                  </span>
                  <span className={`inline-block px-2 py-0.5 text-[0.6rem] rounded font-bold bg-slate-200 text-slate-700`}>
                    Urgency: {activeObj.urgency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-visible">
              <div className="mb-4">
                <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Masalah</div>
                <p className="text-[0.8rem] text-slate-700 leading-relaxed bg-white p-3 border border-slate-200 rounded shadow-sm">{activeQuiz.question}</p>
              </div>

              <div className="mb-3 md:mb-4">
                <div className="text-[0.6rem] md:text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Informasi Tiket</div>
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2 text-[0.7rem] md:text-[0.8rem] text-slate-700 font-bold bg-white p-1.5 md:p-2 border border-slate-200 rounded w-fit">
                    <span>🏥</span> {activeObj.label} (Lantai {activeObj.floor})
                  </div>
                  
                  {activeObj.spawnTime && (
                    <div className="flex items-center gap-2 text-[0.8rem] font-bold bg-white p-2 border border-slate-200 rounded w-fit text-slate-700">
                      <span>🕒</span> Dibuat: {(() => {
                        const d = new Date(activeObj.spawnTime);
                        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                        const dayName = days[d.getDay()];
                        const dateNum = d.getDate();
                        const monthName = months[d.getMonth()];
                        const yearNum = d.getFullYear();
                        return `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
                      })()}
                    </div>
                  )}
                  
                  {!activeObj.solved && (
                    <div className="flex items-center gap-2 text-[0.8rem] font-bold bg-white p-2 border border-slate-200 rounded w-fit text-slate-700">
                      <span>⏱️</span> SLA:{' '}
                      {(() => {
                        const slaHours = activeObj.impact === 'High' ? 3 : activeObj.impact === 'Medium' ? 5 : 8;
                        return <span className="text-blue-600">{slaHours} Jam</span>;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t-2 border-slate-200 mt-auto">
              {!activeObj.solved && (
                <div className="text-[0.65rem] text-slate-500 bg-blue-50 border border-blue-200 p-2 rounded">
                  ℹ️ Anda harus mendatangi lokasi sumber masalah secara langsung untuk melakukan perbaikan.
                </div>
              )}
              <button
                onClick={() => !activeObj.solved && onGoToLocation(selectedTicket)}
                disabled={activeObj.solved}
                className={`w-full text-white py-2 rounded font-bold text-[0.7rem] transition-colors flex items-center justify-center gap-2 shadow ${
                  activeObj.solved 
                    ? "bg-slate-400 cursor-not-allowed opacity-80" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {activeObj.solved ? (
                  <>
                    <span>✅</span> Resolved
                  </>
                ) : (
                  <>
                    <span>📍</span> Tuju Lokasi
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
            <span className="text-4xl opacity-50">📋</span>
            Pilih tiket untuk melihat detail
          </div>
        )}
      </div>
    </>
  ) : (
    <div className="flex-1 bg-white overflow-y-auto p-2 md:p-4 flex flex-col gap-3 md:gap-4 custom-scrollbar">
      {selectedReport === null ? (
        <>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Riwayat Laporan Harian</h2>
          {reports.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-bold italic">
              Belum ada laporan harian. Mainkan game hingga pergantian hari (Pukul 20:00).
            </div>
          ) : (
            reports.map((r, i) => (
              <div 
                key={i} 
                className="border border-slate-300 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => setSelectedReport(r)}
              >
                <div className="bg-slate-100 p-4 flex justify-between items-center group hover:bg-blue-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-700 group-hover:text-blue-700">Tanggal: {r.date}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">#{r.id}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Selesai: {r.totalResolved}</span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Tertunda: {r.totalUnresolved}</span>
                    <span className="text-slate-400 ml-2">▶</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div className="mb-4 flex justify-between items-start border-b-2 border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md font-bold text-[0.65rem] border border-blue-200 flex items-center gap-2 transition-colors"
              >
                <span>⬅</span> Kembali
              </button>
              <h2 className="text-lg font-bold text-slate-800">Detail Laporan ({selectedReport.date})</h2>
            </div>
            <div className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-[10px] font-mono text-slate-500 font-bold">
              {selectedReport.id}
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{selectedReport.totalResolved}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Selesai</div>
            </div>
            <div className="flex-1 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{selectedReport.totalUnresolved}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Tertunda</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
            <ReportTicketList details={selectedReport.details} />
          </div>
        </div>
      )}
    </div>
        )}
      </div>
    </div>
  );
}
