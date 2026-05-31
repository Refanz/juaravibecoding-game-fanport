import React from "react";
import { WarehouseManager } from "../../../infrastructure/storage/WarehouseManager";
import { HOSPITAL_QUIZZES } from "../../../infrastructure/data/quizzes";

interface Props {
  quizKey: number;
  requiredItem: string;
  onSuccess: () => void;
  onCancel: () => void;
  onOpenProcurement: () => void;
}

export default function HardwareTicketModal({
  quizKey,
  requiredItem,
  onSuccess,
  onCancel,
  onOpenProcurement,
}: Props) {
  const quiz = HOSPITAL_QUIZZES[quizKey % HOSPITAL_QUIZZES.length];
  
  const hasStock = WarehouseManager.hasItem(requiredItem, 1);
  const stockItem = WarehouseManager.getStock().find(i => i.id === requiredItem);
  const itemName = stockItem ? stockItem.name : requiredItem;

  const handleFix = () => {
    if (hasStock) {
      const success = WarehouseManager.deductItem(requiredItem, 1);
      if (success) {
        onSuccess();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 pointer-events-auto">
      <div className="bg-hospital-dark border border-hospital-sky rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-hospital-dark to-hospital-alert border-b border-hospital-alert/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-md">{quiz.icon}</span>
            <div>
              <h2 className="text-white font-bold text-xl tracking-wide">Pergantian Hardware</h2>
              <p className="text-hospital-sky text-sm truncate">{quiz.title}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-medical-light text-sm">{quiz.question}</p>
          
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex items-center justify-between mt-2">
            <div>
              <p className="text-hospital-sky text-xs uppercase tracking-wider mb-1">Dibutuhkan</p>
              <p className="text-white font-bold">{itemName}</p>
            </div>
            <div className="text-right">
              <p className="text-hospital-sky text-xs uppercase tracking-wider mb-1">Stok Gudang</p>
              <p className={`font-bold ${hasStock ? 'text-green-400' : 'text-red-400'}`}>
                {stockItem ? stockItem.qty : 0} {stockItem?.unit || 'buah'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-white font-medium hover:bg-white/10 transition-all text-sm"
          >
            Batal
          </button>
          
          {hasStock ? (
            <button
              onClick={handleFix}
              className="px-6 py-2.5 rounded-xl text-hospital-dark font-bold bg-green-400 hover:bg-green-300 transition-all text-sm shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              Ambil & Ganti
            </button>
          ) : (
            <button
              onClick={onOpenProcurement}
              className="px-6 py-2.5 rounded-xl text-hospital-dark font-bold bg-hospital-sky hover:bg-hospital-blue transition-all text-sm shadow-[0_0_15px_rgba(79,195,247,0.3)] flex items-center gap-2"
            >
              🛒 Buka Vibe Procurement
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
