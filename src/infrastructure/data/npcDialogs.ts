export interface NPCDialog {
  greeting: string;
  messages: string[];
  farewell: string;
}

export const NPC_DIALOGS: Record<string, NPCDialog> = {
  // FLOOR 1
  "Perawat_nurse": {
    greeting: "Halo! Ada yang bisa dibantu?",
    messages: [
      "Pastikan selalu menjaga kebersihan tangan, ya.",
      "Antrian obat sedang cukup panjang hari ini.",
      "Kami selalu siap sedia membantu pasien."
    ],
    farewell: "Semoga lekas sembuh!"
  },
  "Dokter IGD_doctor": {
    greeting: "Kondisi darurat? Kami siap!",
    messages: [
      "IGD harus selalu siap sedia 24 jam.",
      "Waktu adalah nyawa di ruangan ini.",
      "Tolong jangan halangi jalur ambulans."
    ],
    farewell: "Mari kita berikan penanganan terbaik."
  },
  "Apoteker_nurse": {
    greeting: "Selamat datang di Farmasi.",
    messages: [
      "Resep obat harap diserahkan di loket depan.",
      "Beberapa jenis obat harus dengan resep dokter.",
      "Jangan lupa cek tanggal kedaluwarsa obat."
    ],
    farewell: "Terima kasih."
  },
  "Dokter ICU_doctor": {
    greeting: "Harap tenang, ini area kritis.",
    messages: [
      "Pasien ICU membutuhkan pemantauan konstan.",
      "Hanya keluarga inti yang diizinkan menjenguk.",
      "Kebersihan sangat penting di ruangan ini."
    ],
    farewell: "Terima kasih atas pengertiannya."
  },
  "Dokter Bedah_doctor": {
    greeting: "Halo. Persiapan operasi sudah selesai?",
    messages: [
      "Operasi membutuhkan ketelitian dan fokus tinggi.",
      "Peralatan sterilisasi berfungsi dengan baik.",
      "Setiap detik sangat berharga di ruang operasi."
    ],
    farewell: "Doakan yang terbaik."
  },
  "Dokter Gigi_nurse": {
    greeting: "Halo! Jangan lupa sikat gigi.",
    messages: [
      "Kesehatan mulut sangat memengaruhi kesehatan tubuh.",
      "Hindari makanan yang terlalu manis.",
      "Peralatan kami selalu disterilisasi."
    ],
    farewell: "Semoga harimu menyenangkan."
  },
  "Pasien Masuk_nurseBed": {
    greeting: "Aduh, sakit...",
    messages: [
      "Saya sedang diantar ke kamar perawatan.",
      "Semoga saya cepat sembuh.",
      "Terima kasih perawat sudah membantu."
    ],
    farewell: "Sampai jumpa."
  },
  "Perawat_walkingNurse": {
    greeting: "Permisi, saya sedang sibuk.",
    messages: [
      "Banyak pasien yang harus saya periksa.",
      "Waktu berjalan begitu cepat.",
      "Ada dokumen yang harus segera diserahkan."
    ],
    farewell: "Maaf, saya harus pergi."
  },
  // FLOOR 2
  "Radiolog_nurse": {
    greeting: "Selamat datang di ruang Radiologi.",
    messages: [
      "Harap lepaskan benda logam sebelum masuk.",
      "Kami menggunakan peralatan mutakhir.",
      "Hasil rontgen akan segera keluar."
    ],
    farewell: "Silakan tunggu di ruang tunggu."
  },
  "Dokter_doctor": {
    greeting: "Selamat pagi.",
    messages: [
      "Kesehatan pasien adalah prioritas utama.",
      "Kami melakukan observasi ketat setiap hari.",
      "Pastikan selalu makan makanan bergizi."
    ],
    farewell: "Semoga harimu baik."
  },
  "Perawat VIP_nurse": {
    greeting: "Selamat datang di area VIP.",
    messages: [
      "Kami memberikan pelayanan eksklusif di sini.",
      "Kenyamanan pasien adalah kunci utama.",
      "Fasilitas kami sangat lengkap."
    ],
    farewell: "Silakan beritahu jika butuh bantuan."
  },
  "Transfer VIP_nurseBed": {
    greeting: "Wah, nyaman sekali di sini.",
    messages: [
      "Pelayanan VIP memang berbeda.",
      "Saya merasa lebih tenang.",
      "Semoga cepat pulih."
    ],
    farewell: "Sampai jumpa."
  },
  // FLOOR 3
  "Security_security": {
    greeting: "Selamat pagi. Ada yang bisa dibantu?",
    messages: [
      "Keamanan rumah sakit adalah tanggung jawab kami.",
      "Harap lapor jika melihat hal yang mencurigakan.",
      "Kami memantau dari ruang CCTV."
    ],
    farewell: "Tetap waspada."
  },
  
  // DEFAULT FALLBACK per Role
  "default_doctor": {
    greeting: "Halo, saya dokter bertugas.",
    messages: [
      "Jaga selalu kesehatan Anda.",
      "Minum air putih yang cukup.",
      "Jangan ragu untuk berkonsultasi."
    ],
    farewell: "Salam sehat."
  },
  "default_nurse": {
    greeting: "Halo, saya perawat di sini.",
    messages: [
      "Kami siap membantu 24 jam.",
      "Jangan lupa istirahat yang cukup.",
      "Apabila butuh bantuan, tekan bel."
    ],
    farewell: "Semoga lekas sembuh."
  },
  "default_security": {
    greeting: "Halo. Harap tertib di area rumah sakit.",
    messages: [
      "Jaga barang bawaan Anda.",
      "Parkir kendaraan di tempat yang disediakan.",
      "Laporkan jika ada kehilangan."
    ],
    farewell: "Terima kasih."
  },
  "default_guest": {
    greeting: "Halo.",
    messages: [
      "Saya sedang menjenguk kerabat.",
      "Rumah sakit ini cukup besar ya.",
      "Semoga semuanya baik-baik saja."
    ],
    farewell: "Sampai jumpa."
  },
  "default_generic": {
    greeting: "Halo.",
    messages: [
      "Semoga harimu menyenangkan.",
      "Rumah sakit ini selalu sibuk."
    ],
    farewell: "Sampai jumpa."
  }
};
