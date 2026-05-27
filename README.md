# 🖥️ IT Support: Hospital Vibe

> Sebuah game web simulasi 2D top-down bertema **IT Support Rumah Sakit** yang dinamis dan interaktif — dikembangkan secara khusus untuk kompetisi **#JuaraVibeCoding**.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Phaser](https://img.shields.io/badge/Phaser-990033?style=for-the-badge&logo=phaser&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

---

## 🎮 Tentang Game

**IT Support: Hospital Vibe** menempatkan Anda sebagai seorang IT Support Specialist di sebuah rumah sakit bertingkat yang sibuk. Di sini, Anda ditantang untuk mendiagnosis, menelusuri, dan memperbaiki berbagai masalah infrastruktur IT medis dan operasional. Dari komputer resepsionis yang mati total, kegagalan database sistem farmasi, server ruang operasi yang down, hingga gangguan jaringan WiFi di ruang VIP.

Gunakan **Laptop OS Virtual** Anda untuk memantau tiket masuk, mengamati feed CCTV secara real-time di seluruh sudut ruangan rumah sakit, dan melacak status kesehatan topologi jaringan di lingkungan rumah sakit.

---

## ✨ Fitur Utama & Keunggulan Sistem

### 1. Arsitektur Modern & Separation of Concerns (SoC)
Game ini dirancang dengan pendekatan arsitektur bersih (**Clean Architecture**) yang memisahkan tanggung jawab secara tegas:
- **React UI Overlay**: Menangani seluruh menu utama, antarmuka sistem operasi virtual laptop (Tiketing & CCTV), dialog NPC, HUD interaktif, pengaturan, peta taktis, diagram topologi, dan kuis pemecahan masalah.
- **Phaser.js Game Engine (v4)**: Bertanggung jawab atas rendering peta 2D berbasis grid, sistem fisika, collision detection, navigasi pergerakan pemain, dan interaksi spasial di dunia game.
- **Unified EventBus**: Komunikasi dua arah antara React dan Phaser.js dijembatani secara efisien menggunakan custom EventBus, memastikan sinkronisasi state game tetap konsisten tanpa mengorbankan performa.

### 2. Antarmuka Sistem Operasi Virtual Laptop (Desktop UI)
Nikmati simulasi OS retro ala Windows 95/Classic OS langsung di dalam game dengan menekan tombol Laptop:
- **IT Support Ticketing App**: Pantau tiket masalah yang aktif. Dilengkapi fitur filter status (*All, Open, Completed*) dan kategori (*Hardware, Software, Jaringan*). Gunakan opsi **Tuju Lokasi** untuk memunculkan pointer navigasi visual langsung di layar yang menuntun Anda ke ruang perangkat bermasalah.
- **Real-Time CCTV Surveillance**: Fitur pengawasan kamera live di 14 ruangan berbeda dari 3 lantai rumah sakit. Tampilan didukung oleh rendering sub-texture Phaser dinamis dengan filter CRT/scanline estetis dan indikator rekaman berkedip.

### 3. Peta Rumah Sakit 3 Lantai yang Realistis
Jelajahi denah rumah sakit yang dirancang menyerupai fasilitas medis sungguhan:
- **Lantai 1**: Lobby/Resepsionis, Unit Gawat Darurat (IGD), Farmasi, ICU, Ruang Rawat Inap (Kelas 1, 2, 3), 10 Poliklinik Spesialis/Umum, dan Ruang Kontrol CCTV.
- **Lantai 2**: Ruang Operasi (OK), Unit Hemodialisa, Departemen Radiologi, dan Ruang Rawat Inap VIP.
- **Lantai 3**: Server Room (Pusat infrastruktur jaringan utama).

### 4. Sistem Waktu Kustom (In-Game Time System)
Game ini memiliki sistem simulasi waktu terakselerasi mandiri (terlepas dari jam perangkat lokal Anda) di mana **1 jam di dalam game setara dengan 1 menit di dunia nyata**. 
- Jam operasional kerja dimulai pukul **08:00** hingga **20:00**.
- Sistem kalender otomatis yang menghitung pergantian hari, bulan, dan tahun.

### 5. Vector-to-Raster Asset System (Self-Contained)
Seluruh visual game — termasuk sprite karakter pemain, NPC medis, lift, komputer, printer, mesin MRI, hingga access point — dihasilkan menggunakan kode **inline SVG**.
- SVG ini dirasterisasi sekali menjadi Data URI (Base64 PNG) selama fase `preload` Phaser untuk mencegah memory leak.
- Membuat game ini **100% mandiri** tanpa ketergantungan pada hosting gambar eksternal, menjamin game tetap dapat dimuat dengan cepat dan andal secara offline.

### 6. PWA & Optimalisasi Mobile
- **Installable PWA**: Mendukung instalasi di perangkat seluler dan desktop sebagai aplikasi standalone layar penuh melalui konfigurasi manifest web terintegrasi.
- **Virtual Gamepad**: Joystick virtual D-pad dan tombol aksi sentuh yang halus untuk mempermudah pergerakan di layar mobile, dioptimalkan dengan penanganan event sentuh non-pasif untuk mencegah scroll lagging.
- **Responsive Layout & Orientation System**: Tampilan UI otomatis menyesuaikan ukuran layar, serta memiliki pengaturan rotasi orientasi (Landscape / Portrait) di menu Settings.

### 7. Percakapan Interaktif dengan NPC
Berinteraksilah dengan staf medis (Dokter, Perawat, Petugas Keamanan) dan pengunjung di rumah sakit. Dapatkan dialog dan saran unik yang disesuaikan dengan peran (role) masing-masing NPC untuk memandu pemecahan masalah Anda.

---

## 📋 Daftar Troubleshooting & Kuis IT Medis

Terdapat 12 jenis kuis pemecahan masalah IT yang sangat relevan dengan operasional teknologi informasi rumah sakit:

| No | Masalah IT | Lokasi Perangkat | Kategori | Deskripsi Singkat |
|:--:|:-----------|:-----------------|:---------|:------------------|
| 1 | 💻 PC Mati Total | Resepsionis (Lt. 1) | Hardware | Komputer pendaftaran mati tanpa lampu indikator daya. |
| 2 | 📡 Jaringan IGD Putus | IGD (Lt. 1) | Jaringan | Lampu router berkedip merah; sistem antrean pasien IGD offline. |
| 3 | 💊 Database Connection Failed | Farmasi (Lt. 1) | Software | Aplikasi stok obat gagal terhubung ke server database pusat. |
| 4 | 🏥 Monitor ICU Blank | ICU (Lt. 1) | Hardware | Layar monitor vital sign pasien tiba-tiba blank tanpa alarm suara. |
| 5 | 🛏️ Connection Timed Out | Ruang Rawat Inap (Lt. 1) | Software | Nurse station tidak bisa mengakses rekam medis pasien rawat inap. |
| 6 | 👶 CPU Usage 100% | Poli Anak (Lt. 1) | Software | Komputer dokter Poli Anak mengalami kelambatan ekstrem. |
| 7 | 🤰 Printer Offline | Poli Kandungan (Lt. 1)| Hardware | Printer gagal mencetak resep fisik untuk pasien kandungan. |
| 8 | 💉 Session Expired | Poli Umum (Lt. 1) | Software | Aplikasi rekam medis memutus sesi login dokter secara tiba-tiba. |
| 9 | 🔪 Server CCTV Down | R. Operasi (Lt. 2) | Hardware | Server penyimpanan rekaman video bedah mati total. |
| 10| ☢️ Workstation Freeze | Radiologi (Lt. 2) | Software | Layar penampil hasil foto CT-Scan macet dan tidak merespons. |
| 11| 🫘 Driver Not Found | Hemodialisa (Lt. 2) | Software | Komputer kontrol mesin cuci darah kehilangan driver kalibrasi. |
| 12| 🌟 WiFi VIP Down | Ruang VIP (Lt. 2) | Jaringan | Pasien VIP mengeluhkan hilangnya koneksi SSID di kamar mereka. |

---

## 🎯 Panduan Kontrol & Mekanik Permainan

### Kontrol Karakter
- **Bergerak**: Gunakan tombol arah `Arrow Keys` (⬆️ ⬇️ ⬅️ ➡️) atau tombol `W`, `A`, `S`, `D`.
- **Interaksi**: Tekan tombol `SPASI` (atau tombol aksi sentuh di mobile) untuk:
  - Berinteraksi dengan komputer/perangkat IT berkedip merah untuk membuka **Kuis Troubleshooting**.
  - Mengajak bicara NPC di sekitar Anda untuk memicu **Dialog Dialog Modis**.
  - Berinteraksi di depan **Elevator (Lift)** untuk membuka **Menu Perpindahan Lantai**.

### Alur Gameplay Utama
1. **Mulai Tugas**: Dari Welcome Screen, klik **Start Game**.
2. **Periksa Tiket**: Buka Laptop virtual Anda (tombol 💻 di kanan atas HUD) untuk melihat daftar tiket masalah (*Ticketing App*).
3. **Navigasi ke Target**: Pilih salah satu tiket, lalu klik **Tuju Lokasi**. Sebuah panah penunjuk jalan virtual akan menuntun Anda ke lantai dan ruangan yang dituju.
4. **Gunakan Lift**: Dekati Lift di bagian tengah lorong dan tekan `SPASI` jika perangkat target berada di lantai yang berbeda.
5. **Pecahkan Masalah**: Berdirilah di dekat perangkat IT yang berkedip merah dan tekan `SPASI`. Jawablah pertanyaan kuis pilihan ganda troubleshooting dengan tepat.
6. **Selesaikan Level**: Perbaiki seluruh 12 perangkat rusak di seluruh lantai rumah sakit untuk memenangkan permainan!

---

## 🛠️ Detail Tech Stack & Dependensi

Proyek ini dibangun menggunakan pustaka modern berkinerja tinggi:
- **Core UI**: React v18.2 (Stateful UI rendering) & TypeScript v5.2 (Tipe statis yang aman).
- **Core Engine**: Phaser.js v4.1 (Web Audio API, Canvas rendering, dynamic texture capture, physics).
- **Bundler & Tooling**: Vite v5.0 (Prapemrosesan super cepat) & Vite PWA Plugin (Penyediaan service worker & manifest).
- **Styling**: Vanilla CSS3 + TailwindCSS v4.3 (Konfigurasi tema dinamis dan styling responsif modal desktop).
- **Container Server**: Nginx Alpine (Ringan, aman, menyajikan berkas static bundle di port 8080).

---

## 📁 Struktur Direktori Proyek

Game ini mengimplementasikan pemisahan berbasis domain yang rapi:
```
JVC_Refanzzzz/
├── src/
│   ├── main.tsx                     # Entry point aplikasi React
│   ├── index.css                    # Desain sistem global & kustom Tailwind v4
│   ├── domain/                      # Lapisan Logika Domain & OOP Entitas
│   │   ├── GameState.ts             # Manajemen State Utama (Screen, Quiz, Pause)
│   │   ├── FloorManager.ts          # Pelacakan status penyelesaian objek rusak per lantai
│   │   ├── CCTVRenderer.ts          # Capture frame Phaser ke React secara periodik
│   │   ├── entities/                # OOP Entity Classes
│   │   │   ├── Player.ts            # Logika gerakan, input, dan collision pemain
│   │   │   ├── NPC.ts               # Logika NPC dan deteksi proximity
│   │   │   └── InteractableObject.ts# Base class & subclass perangkat IT rusak (Polimorfisme)
│   │   └── phaser/                  # Integrasi Phaser.js
│   │       ├── PhaserGame.tsx       # Pembungkus React untuk Canvas Phaser
│   │       ├── GameScene.ts         # Inti Phaser: preloading asset, setup map, loop render, camera
│   │       └── TimeManager.ts       # Pengelola clock simulasi waktu terakselerasi
│   ├── infrastructure/              # Lapisan Data & Sistem Eksternal
│   │   ├── assets/                  # Audio manager kustom untuk sfx klik/sukses/gagal
│   │   ├── data/                    # Konfigurasi Peta & Pertanyaan
│   │   │   ├── floorData.ts         # Mapping data ruangan dan posisi entitas dari JSON
│   │   │   ├── quizzes.ts           # Kumpulan data 12 pertanyaan kuis IT rumah sakit
│   │   │   ├── npcDialogs.ts        # Data pohon dialog kustom per peran NPC
│   │   │   └── maps/                # File JSON hasil ekspor dari Tiled Map Editor
│   │   │       ├── floor1.json
│   │   │       ├── floor2.json
│   │   │       └── floor3.json
│   │   └── events/                  # EventBus komunikasi Phaser <-> React
│   │       └── EventBus.ts
│   └── ui/                          # Lapisan Antarmuka Pengguna (React Components)
│       ├── components/              # Komponen & Dialog UI Overlays
│       │   ├── App.tsx              # Router Utama Game (Welcome vs Playing)
│       │   ├── GameScreen.tsx       # Manajer Kontainer Layar Permainan
│       │   ├── DesktopUIModal.tsx   # Laptop Virtual OS (Tiketing & CCTV App)
│       │   ├── VirtualGamepad.tsx   # Panel kontrol sentuh mobile
│       │   ├── NPCDialogModal.tsx   # Penampil dialog teks NPC
│       │   ├── QuizModal.tsx        # Penampil pertanyaan troubleshooting
│       │   ├── MapModal.tsx         # Tampilan peta interaktif
│       │   ├── NetworkTopologyModal.tsx # Diagram topologi kesehatan jaringan rumah sakit
│       │   └── SettingsModal.tsx    # Panel opsi audio, bahasa, dan orientasi layar
│       └── hooks/                   # Custom React Hooks
│           ├── useGameTime.ts       # Hook sinkronisasi jam simulasi
│           └── useGameEvents.ts     # Hook penanganan EventBus game
├── index.html                       # HTML5 template (Meta tag PWA, Google Fonts)
├── Dockerfile                       # Multi-stage image build (Node Alpine & Nginx Alpine)
├── nginx.conf                       # Konfigurasi reverse-routing Nginx port 8080
├── cloudbuild.yaml                  # Konfigurasi Google Cloud Build CI/CD
└── package.json                     # Daftar paket dependensi proyek
```

---

## 🚀 Menjalankan Secara Lokal

Pastikan Anda telah memasang **Node.js (v18+)** di sistem Anda.

### 1. Kloning dan Pasang Dependensi
```bash
# Masuk ke direktori workspace game
cd JVC_Refanzzzz

# Pasang semua paket dependensi yang dibutuhkan
npm install
```

### 2. Jalankan Server Dev (Vite)
```bash
npm run dev
```
Buka peramban (browser) Anda di alamat yang tertera di terminal, biasanya `http://localhost:5173`.

### 3. Build & Pratinjau Produksi
```bash
# Kompilasi TypeScript dan bundel aset static untuk produksi
npm run build

# Uji hasil kompilasi produksi secara lokal
npm run preview
```

### 4. Menjalankan Menggunakan Docker
Jika Anda ingin menguji di lingkungan container yang identik dengan cloud server:
```bash
# Build Docker image
docker build -t hospital-it-support .

# Jalankan container di port 8080
docker run -p 8080:8080 hospital-it-support
```
Buka browser Anda dan akses `http://localhost:8080`.

---

## ☁️ Deployment ke Google Cloud Run

Aplikasi ini siap dideploy ke Google Cloud Run (port default `8080` sudah dikonfigurasi pada `nginx.conf` dan `Dockerfile`).

### Menggunakan Google Cloud Build (CI/CD otomatis)
Konfigurasi `cloudbuild.yaml` yang disertakan akan otomatis membangun image Docker, menyimpannya di Google Container Registry (GCR), dan melakukan deployment ke Cloud Run region `asia-southeast2` (Jakarta):

```bash
# Lakukan submit build dengan gcloud CLI
gcloud builds submit --config cloudbuild.yaml
```

### Deployment Manual via gcloud CLI
Anda juga dapat mendeploy secara langsung dari terminal lokal Anda:
```bash
gcloud run deploy hospital-it-support \
  --source . \
  --port 8080 \
  --region asia-southeast2 \
  --allow-unauthenticated
```

---

## 📜 Lisensi & Hak Cipta

Proyek ini dikembangkan secara orisinal oleh pengembang untuk memenuhi kriteria kepatuhan dan orisinalitas dalam kompetisi **#JuaraVibeCoding**.

<p align="center">
  Dibuat dengan penuh dedikasi 💻, musik yang asyik 🎧, dan kopi hangat ☕ untuk <strong>#JuaraVibeCoding</strong>
</p>
