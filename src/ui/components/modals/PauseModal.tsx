import { useState } from 'react';
import SettingsModal from './SettingsModal';
import SaveConfirmModal from './SaveConfirmModal';
import { EventBus } from '../../../infrastructure/events/EventBus';

interface Props {
  onResume: () => void;
  onReturnToWelcome: () => void;
  solvedCount: number;
  totalObjects: number;
}

export default function PauseModal({ onResume, onReturnToWelcome, solvedCount, totalObjects }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasJustSaved, setHasJustSaved] = useState(false);

  const handleManualSave = () => {
    EventBus.emit("request_manual_save");
    setHasJustSaved(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[300] animate-fade-in p-2 sm:p-4">
        <div className="bg-dark border-2 border-hospital-blue rounded-lg p-4 sm:p-6 max-w-sm w-full text-center relative shadow-[0_0_15px_#1565c0] max-h-[95vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-hospital-sky text-2xl mb-2 font-[var(--font-pixel)]">PAUSED</h2>
          
          <div className="my-6 p-4 bg-surface rounded border border-hospital-blue/30 text-left">
            <p className="text-text-dim text-[0.6rem] mb-3 font-[var(--font-pixel)]">Progress Task:</p>
            <div className="flex items-center gap-3">
              <span className="text-medical-green text-2xl animate-pulse-icon">📊</span>
              <span className="text-white text-lg font-[var(--font-pixel)]">
                {solvedCount} / {totalObjects} <span className="text-[0.6rem] text-medical-light">Selesai</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onResume}
              className="bg-medical-green hover:bg-medical-light text-white border-2 border-medical-light py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
            >
              ▶ RESUME
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-hospital-blue hover:bg-hospital-sky hover:text-dark text-white border-2 border-hospital-sky py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
            >
              ⚙️ PENGATURAN
            </button>
            <button
              onClick={handleManualSave}
              className="bg-surface hover:bg-surface-light text-white border-2 border-hospital-blue py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
            >
              💾 SAVE PROGRESS
            </button>
            <button
              onClick={() => {
                if (hasJustSaved) {
                  onReturnToWelcome();
                } else {
                  setShowSaveConfirm(true);
                }
              }}
              className="bg-red-alert/80 hover:bg-red-alert text-white border-2 border-red-500 py-3 px-4 rounded font-[var(--font-pixel)] text-[0.6rem] cursor-pointer transition-all duration-200 hover:scale-105"
            >
              ⏹ KEMBALI KE MENU
            </button>
          </div>
        </div>
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showSaveConfirm && (
        <SaveConfirmModal
          onSaveAndQuit={() => {
            EventBus.emit("request_manual_save");
            onReturnToWelcome();
          }}
          onQuitWithoutSave={onReturnToWelcome}
          onCancel={() => setShowSaveConfirm(false)}
        />
      )}
    </>
  );
}
