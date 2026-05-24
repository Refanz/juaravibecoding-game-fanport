import { getAllSpriteUris, SpriteKey } from '../../infrastructure/assets/AssetManager';

interface Props {
  onClose: () => void;
}

export default function InfoModal({ onClose }: Props) {
  const uris = getAllSpriteUris();

  const legends: { key: SpriteKey; label: string }[] = [
    { key: 'player', label: 'Pemain (IT Support)' },
    { key: 'doctor', label: 'Dokter' },
    { key: 'nurse', label: 'Perawat' },
    { key: 'walkingNurse', label: 'Perawat Keliling' },
    { key: 'guest', label: 'Tamu / Pengunjung' },
    { key: 'nurseWheelchair', label: 'Pasien & Perawat' },
    { key: 'nurseBed', label: 'Transfer Pasien' },
    { key: 'security', label: 'Satpam / Security' },
    { key: 'pcBroken', label: 'PC Rusak (Harus Diperbaiki)' },
    { key: 'medBroken', label: 'Alat Medis Rusak (Harus Diperbaiki)' },
    { key: 'elevator', label: 'Lift (Pindah Lantai)' },
    { key: 'accessPoint', label: 'Access Point (WiFi)' },
    { key: 'bed', label: 'Kasur Pasien' },
    { key: 'medicine', label: 'Obat / Farmasi' },
    { key: 'radiation', label: 'Radiologi / Radiasi' },
    { key: 'securityPost', label: 'Pos Satpam' },
    { key: 'gate', label: 'Gerbang' },
    { key: 'car', label: 'Mobil' },
    { key: 'motorcycle', label: 'Motor' },
    { key: 'cctvCamera', label: 'Kamera CCTV' },
    { key: 'cctvMonitor', label: 'Monitor CCTV' },
    { key: 'serverRack', label: 'Rak Server' },
    { key: 'ups', label: 'UPS (Baterai Cadangan)' },
    { key: 'firewall', label: 'Firewall / Router' },
    { key: 'switchCore', label: 'Switch Core' },
    { key: 'switchAccess', label: 'Switch Access' },
    { key: 'ac', label: 'AC (Pendingin Ruangan)' },
    { key: 'accessDoor', label: 'Pintu Akses (Biometrik)' },
    { key: 'modemSenang', label: 'ISP: ISP Senang' },
    { key: 'modemCepat', label: 'ISP: ISP Cepat' },
    { key: 'modemGatotkaca', label: 'ISP: Gatotkaca' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-300 animate-fade-in p-4">
      <div className="bg-dark border-2 border-hospital-blue rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-[0_0_15px_#1565c0]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-hospital-sky hover:text-white text-xl font-bold cursor-pointer bg-transparent border-none"
        >
          ✕
        </button>
        <h2 className="text-hospital-sky text-base sm:text-xl mb-4 text-center border-b border-hospital-blue/30 pb-2 font-[var(--font-pixel)]">Informasi Ikon</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {legends.map((item) => (
            <div key={item.key} className="flex items-center gap-3 bg-surface p-2 rounded border border-hospital-blue/20">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <img src={uris[item.key]} alt={item.label} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-medical-light text-[0.6rem] font-[var(--font-pixel)] leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
