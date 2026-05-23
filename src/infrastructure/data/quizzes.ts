// ==========================================
// infrastructure/data/quizzes.ts
// 12 kuis troubleshooting IT rumah sakit
// ==========================================

export interface Quiz {
  icon: string;
  title: string;
  question: string;
  options: string[];
  correct: number;
  successMsg: string;
  failMsg: string;
}

export const HOSPITAL_QUIZZES: Quiz[] = [
  {
    icon: '🖥️', title: 'PC Mati Total!',
    question: 'Komputer di resepsionis tidak menyala sama sekali. Layar gelap, tidak ada lampu indikator. Apa langkah pertama?',
    options: ['A. Cek kabel power & pastikan terhubung ke listrik','B. Langsung beli komputer baru','C. Restart Windows','D. Update driver grafis'],
    correct: 0, successMsg: 'Benar! Cek kabel power adalah langkah pertama paling dasar! ✅', failMsg: 'Kurang tepat! Langkah pertama: cek kabel power. 🔌',
  },
  {
    icon: '📡', title: 'Jaringan Putus!',
    question: 'Sistem antrian pasien di IGD offline. Router menunjukkan lampu merah berkedip. Apa yang harus dilakukan?',
    options: ['A. Format ulang server','B. Restart router (cabut power, tunggu 30 detik, colok lagi)','C. Langsung hubungi ISP','D. Ganti semua kabel LAN'],
    correct: 1, successMsg: 'Benar! Restart router adalah troubleshooting paling dasar! 📡✅', failMsg: 'Kurang tepat! Restart router dulu sebelum langkah lain. 🔄',
  },
  {
    icon: '💊', title: 'Sistem Farmasi Error!',
    question: 'Aplikasi stok obat menampilkan error "Database Connection Failed". Apa yang harus dicek?',
    options: ['A. Install ulang Windows','B. Ganti keyboard','C. Cek koneksi jaringan & status server database','D. Hapus semua data obat'],
    correct: 2, successMsg: 'Benar! Cek koneksi dan server database dulu! 💊✅', failMsg: 'Salah! Cek koneksi jaringan ke server database terlebih dahulu.',
  },
  {
    icon: '🏥', title: 'Monitor ICU Blank!',
    question: 'Monitor vital sign pasien ICU tiba-tiba blank. Alarm tidak berbunyi. Langkah darurat?',
    options: ['A. Cek kabel power & koneksi monitor ke alat medis','B. Tunggu sampai menyala sendiri','C. Ganti monitor dengan TV','D. Matikan semua alat'],
    correct: 0, successMsg: 'Benar! Cek koneksi fisik adalah prioritas di ICU! 🏥✅', failMsg: 'Salah! Di ICU, cek koneksi fisik segera - nyawa pasien bergantung padanya!',
  },
  {
    icon: '🛏️', title: 'Sistem Rawat Inap Down!',
    question: 'Nurse station tidak bisa mengakses data pasien rawat inap. Browser menampilkan "ERR_CONNECTION_TIMED_OUT". Solusinya?',
    options: ['A. Ganti browser','B. Cek koneksi jaringan lokal & ping server','C. Hapus cache browser saja','D. Reinstall OS'],
    correct: 1, successMsg: 'Benar! Cek koneksi jaringan dan ping server dulu! ✅', failMsg: 'Kurang tepat! Timeout biasanya masalah koneksi jaringan.',
  },
  {
    icon: '👶', title: 'PC Poli Anak Lambat!',
    question: 'Komputer di Poli Anak sangat lambat, task manager menunjukkan CPU usage 100%. Apa yang harus dilakukan?',
    options: ['A. Tambah RAM saja','B. Cek proses yang menggunakan CPU tinggi & hentikan yang tidak perlu','C. Biarkan saja','D. Matikan antivirus'],
    correct: 1, successMsg: 'Benar! Identifikasi proses bermasalah lewat task manager! ✅', failMsg: 'Salah! Cek task manager untuk identifikasi proses penyebab masalah.',
  },
  {
    icon: '🤰', title: 'Printer Poli Kandungan Error!',
    question: 'Printer di Poli Kandungan tidak mau mencetak resep. Status menunjukkan "Offline". Apa yang harus dilakukan?',
    options: ['A. Ganti kertas saja','B. Restart printer & cek koneksi USB/jaringan','C. Cetak dari komputer lain','D. Tulis resep manual saja'],
    correct: 1, successMsg: 'Benar! Restart printer dan cek koneksi fisik! 🖨️✅', failMsg: 'Kurang tepat! Restart printer dan cek koneksi dulu.',
  },
  {
    icon: '💉', title: 'Sistem Poli Error!',
    question: 'Aplikasi rekam medis menampilkan error "Session Expired". Dokter tidak bisa input data pasien. Solusinya?',
    options: ['A. Matikan komputer','B. Login ulang ke aplikasi','C. Format hard disk','D. Hubungi vendor langsung'],
    correct: 1, successMsg: 'Benar! Session expired cukup login ulang! ✅', failMsg: 'Salah! Session expired biasanya cukup login ulang.',
  },
  {
    icon: '🔪', title: 'Server Ruang Operasi Down!',
    question: 'Server penyimpan rekaman CCTV ruang operasi mati. Lampu indikator merah. Apa yang harus dicek?',
    options: ['A. Cek power supply & pastikan UPS berfungsi','B. Pindahkan ke cloud saja','C. Biarkan, CCTV tidak penting','D. Hubungi polisi'],
    correct: 0, successMsg: 'Benar! Cek power supply dan UPS adalah langkah pertama! ✅', failMsg: 'Salah! Cek power supply dan UPS terlebih dahulu.',
  },
  {
    icon: '☢️', title: 'Workstation Radiologi Freeze!',
    question: 'Workstation untuk membaca hasil CT-Scan freeze dan tidak merespon. Apa yang harus dilakukan?',
    options: ['A. Cabut kabel power langsung','B. Tunggu beberapa menit, jika tetap freeze lakukan force restart','C. Ketuk-ketuk monitor','D. Biarkan sampai besok'],
    correct: 1, successMsg: 'Benar! Tunggu dulu, jika tetap freeze baru force restart! ✅', failMsg: 'Salah! Jangan langsung cabut power, tunggu dulu lalu force restart.',
  },
  {
    icon: '🫘', title: 'Mesin Hemodialisa Error!',
    question: 'Komputer kontrol mesin hemodialisa menampilkan "Driver Not Found". Alat tidak bisa dikalibrasi. Solusinya?',
    options: ['A. Install ulang OS','B. Reinstall driver perangkat dari CD/website vendor','C. Ganti mesin baru','D. Abaikan saja'],
    correct: 1, successMsg: 'Benar! Reinstall driver dari sumber resmi vendor! ✅', failMsg: 'Salah! Install ulang driver dari sumber resmi vendor.',
  },
  {
    icon: '🌟', title: 'WiFi VIP Room Down!',
    question: 'Pasien VIP komplain WiFi tidak bisa konek. Device lain juga tidak bisa connect ke access point ruangan. Apa yang dicek?',
    options: ['A. Suruh pasien pakai data seluler','B. Restart access point & cek konfigurasi SSID','C. Ganti password WiFi RS','D. Matikan semua access point'],
    correct: 1, successMsg: 'Benar! Restart access point dan cek konfigurasi! 📶✅', failMsg: 'Salah! Restart AP dan cek konfigurasi SSID terlebih dahulu.',
  },
];
