import { useState, useMemo } from 'react';
import { InteractableObject } from '../../domain/entities/InteractableObject';
import { HOSPITAL_QUIZZES } from '../../infrastructure/data/quizzes';

interface Props {
  objects: InteractableObject[];
  onGoToLocation: (idx: number) => void;
  onFixTicket: (idx: number) => void;
}

export default function TicketingApp({ objects, onGoToLocation, onFixTicket }: Props) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Hardware' | 'Software' | 'Jaringan'>('all');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const getCategory = (icon: string) => {
    if (['📡', '🌟'].includes(icon)) return 'Jaringan';
    if (['💊', '💉', '🛏️'].includes(icon)) return 'Software';
    return 'Hardware';
  };

  const filteredTickets = useMemo(() => {
    return objects.map((obj, idx) => ({ ...obj, idx })).filter(obj => {
      const quiz = HOSPITAL_QUIZZES[obj.idx % HOSPITAL_QUIZZES.length];
      const cat = getCategory(quiz.icon);
      
      if (statusFilter === 'open' && obj.solved) return false;
      if (statusFilter === 'completed' && !obj.solved) return false;
      
      if (categoryFilter !== 'all' && cat !== categoryFilter) return false;
      
      return true;
    });
  }, [objects, statusFilter, categoryFilter]);

  const activeObj = selectedTicket !== null ? objects[selectedTicket] : null;
  const activeQuiz = selectedTicket !== null ? HOSPITAL_QUIZZES[selectedTicket % HOSPITAL_QUIZZES.length] : null;

  return (
    <div className="flex w-full h-full bg-[#f0f0f0] rounded-sm overflow-hidden border-2 border-slate-400">
      {/* Left List */}
      <div className="w-1/2 md:w-1/3 border-r-2 border-slate-400 flex flex-col bg-white">
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
                <div className="text-xl w-8 h-8 flex items-center justify-center bg-slate-200 rounded">{quiz.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.65rem] font-bold truncate text-slate-800">{quiz.title}</div>
                  <div className={`text-[0.55rem] font-bold ${t.solved ? 'text-green-600' : 'text-orange-500'}`}>
                    {t.solved ? 'Completed' : 'Open'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail */}
      <div className="flex-1 bg-[#fafafa] p-4 flex flex-col">
        {selectedTicket !== null && activeObj && activeQuiz ? (
          <>
            <div className="flex items-center gap-4 border-b-2 border-slate-200 pb-4 mb-4">
              <div className="text-4xl bg-slate-200 p-3 rounded-lg shadow-inner">{activeQuiz.icon}</div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{activeQuiz.title}</h2>
                <span className={`inline-block px-2 py-0.5 text-[0.6rem] rounded font-bold mt-1 ${activeObj.solved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {activeObj.solved ? '✅ COMPLETED' : '⚠️ WAITING FOR SUPPORT'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="mb-4">
                <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Masalah</div>
                <p className="text-[0.8rem] text-slate-700 leading-relaxed bg-white p-3 border border-slate-200 rounded shadow-sm">{activeQuiz.question}</p>
              </div>

              <div className="mb-4">
                <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Lokasi</div>
                <div className="flex items-center gap-2 text-[0.8rem] text-slate-700 font-bold bg-white p-2 border border-slate-200 rounded w-fit">
                  <span>🏥</span> {activeObj.label} (Lantai {activeObj.floor})
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
                onClick={() => onGoToLocation(selectedTicket)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-[0.7rem] transition-colors flex items-center justify-center gap-2 shadow"
              >
                <span>📍</span> Tuju Lokasi
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
    </div>
  );
}
