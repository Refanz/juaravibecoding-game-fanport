import { AudioManager } from "../../infrastructure/assets/AudioManager";

interface Props {
  onSaveAndQuit: () => void;
  onQuitWithoutSave: () => void;
  onCancel: () => void;
}

export default function SaveConfirmModal({ onSaveAndQuit, onQuitWithoutSave, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[400] animate-fade-in p-2 sm:p-4">
      <div className="bg-dark border-2 border-hospital-blue rounded-lg p-4 sm:p-6 max-w-sm w-full text-center relative shadow-[0_0_15px_#1565c0]">
        <h2 className="text-hospital-sky text-xl mb-4 font-[var(--font-pixel)] leading-relaxed">
          Simpan progress<br />sebelum keluar?
        </h2>
        
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => { AudioManager.click(); onSaveAndQuit(); }}
            className="bg-medical-green hover:bg-medical-light text-white border-2 border-medical-light py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
          >
            💾 SIMPAN & KELUAR
          </button>
          <button
            onClick={() => { AudioManager.click(); onQuitWithoutSave(); }}
            className="bg-red-alert/80 hover:bg-red-alert text-white border-2 border-red-500 py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
          >
            🚪 KELUAR TANPA SAVE
          </button>
          <button
            onClick={() => { AudioManager.click(); onCancel(); }}
            className="bg-surface hover:bg-surface-light text-white border-2 border-hospital-blue py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
          >
            ↩ BATAL
          </button>
        </div>
      </div>
    </div>
  );
}
