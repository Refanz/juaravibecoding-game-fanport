---
trigger: always_on
---

# Instruksi Pembuatan Game: IT Support Hospital Vibe (Proyek #JuaraVibeCoding)

## Konteks Proyek
Kamu adalah seorang ahli pengembangan game web-based. Buatkan saya purwarupa (prototype) game web dengan tema "IT Support di Rumah Sakit 2 Lantai" menggunakan gaya visual 2D top-down retro. Game ini adalah submission untuk kompetisi #JuaraVibeCoding, dan kodenya harus siap di-deploy ke **Google Cloud Run** [1].

## Tech Stack, Infrastruktur & Arsitektur
- **Frontend**: **React** dipadukan dengan bundler **Vite** dan menggunakan bahasa **TypeScript**.
- **Paradigma (Wajib)**: 
  - Terapkan **Object-Oriented Programming (OOP)** untuk logika inti game (gunakan *class*, enkapsulasi, pewarisan, polimorfisme untuk entitas seperti `Player`, `NPC`, `InteractableObject`).
  - Implementasikan **Clean Architecture** dan **Separation of Concerns (SoC)**. Pisahkan dengan jelas antara lapisan Presentasi (React Components/Hooks), lapisan Domain (Logika OOP Game murni), dan lapisan Infrastruktur (Data/Asset).
- **Deployment**: Buatkan `Dockerfile` multi-stage (Node.js untuk *build* project Vite, lalu `nginx:alpine` untuk *serve* folder `dist` di port 8080) [1].

## Spesifikasi & Flow Game
Game memiliki 2 state utama:
1. **Welcome Page**: Judul "IT Support: Hospital Vibe", tombol "Start Game", dan UI bernuansa rumah sakit.
2. **Main Game (Peta 2 Lantai)**: 
   - Pemain bergerak menggunakan panah/WASD.
   - Bisa berpindah lantai dengan mendekati objek **Lift** (tekan Spasi).
   - **Interaksi Kasus**: Terdapat PC/Alat rusak berkedip merah. Jika didekati (tekan Spasi), muncul popup kuis troubleshooting IT.

## Layout & Tata Ruang
Buatkan tata letak grid/ruangan yang luas:
- **Lantai 1:** Front Office (spawn), IGD, Farmasi, ICU, Rawat Inap (Kelas 1, 2, 3), dan Rawat Jalan (10 meja Poli: Anak, Penyakit Dalam, ObGyn, Bedah, Mata, THT, Gigi, Saraf, Kulit & Kelamin, Jantung).
- **Lantai 2:** Rawat Inap VIP, Ruang Operasi, Hemodialisa, Radiologi.

## Manajemen Asset & Optimasi Performa
Jangan gunakan local asset gambar. **Generate seluruh aset menggunakan kode SVG (Scalable Vector Graphics)** dengan aturan:
1. **Rasterisasi di Awal**: Render kode SVG menjadi format Data URI (PNG/Base64) **hanya satu kali saat preload**. Jangan render ulang vektor di setiap frame.
2. **Bentuk Dasar & Flat Design**: Gunakan `<rect>`, `<circle>`, `<polygon>`. Dilarang menggunakan filter berat (drop shadow, blur) atau `<path>` kompleks. Gunakan warna solid retro.
3. **Daftar Aset**: Pemain (IT dengan laptop), Tenaga Medis, Meja PC, PC Rusak, Pintu Lift, Kasur, Obat, Simbol Radiasi.

## Output yang Dibutuhkan
Hasilkan struktur proyek Vite yang modular dan baris kode lengkap untuk:
1. Konfigurasi proyek (`package.json`, `vite.config.ts`, `tsconfig.json`).
2. `index.html` dan file entry `src/main.tsx`.
3. Direktori `src/` yang terstruktur (contoh: `src/domain/`, `src/ui/components/`, `src/infrastructure/`) yang memadukan UI komponen React dengan logika class OOP.
4. `Dockerfile` yang siap mem-build Vite app dan men-deploy hasilnya ke Cloud Run.