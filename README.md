# 🖥️ IT Support: The Vibe Coder

> Game 2D top-down retro bertema IT Support — dibuat untuk kompetisi **#JuaraVibeCoding**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud%20Run-4285F4?style=flat&logo=google-cloud&logoColor=white)

---

## 🎮 Tentang Game

**IT Support: The Vibe Coder** adalah game web sederhana bergaya retro pixel-art (2D top-down) di mana pemain berperan sebagai seorang IT Support di sebuah kantor. Tugas pemain adalah menemukan dan memperbaiki berbagai masalah IT seperti komputer mati, router rusak, dan serangan virus.

### ✨ Fitur Utama

- 🕹️ **3 Level** dengan sistem unlock bertahap
- 🗺️ **Peta 2D Top-Down** dengan tile-based rendering di HTML5 Canvas
- 🧩 **Sistem Kuis** — troubleshooting IT interaktif di setiap objek
- ⏱️ **Timer Challenge** — Level 3 memiliki batas waktu 90 detik
- 🔊 **Retro Sound Effects** menggunakan Web Audio API
- 🎨 **CRT Aesthetic** — scanlines, glow effect, pixel font
- 📱 **Emoji-based Assets** — tanpa file gambar eksternal

---

## 📋 Daftar Level

| Level | Nama | Deskripsi |
|-------|------|-----------|
| 1 | 💻 The Power Issue | Cari komputer yang mati dan selesaikan kuis tentang troubleshooting dasar |
| 2 | 📡 The Router Down | Navigasi ruang server yang kompleks untuk menemukan router rusak |
| 3 | 🦠 The Virus Outbreak | Karantina 3 komputer terinfeksi virus sebelum waktu habis! |

---

## 🎯 Cara Bermain

| Kontrol | Aksi |
|---------|------|
| `Arrow Keys` / `WASD` | Bergerak (Atas, Bawah, Kiri, Kanan) |
| `Spasi` | Interaksi dengan objek |

1. Klik **Start Game** di halaman utama
2. Pilih level yang tersedia (level terkunci akan terbuka setelah menyelesaikan level sebelumnya)
3. Gerakkan karakter menuju objek yang berkedip
4. Tekan **Spasi** saat berada di dekat objek untuk memulai kuis
5. Jawab kuis dengan benar untuk menyelesaikan task

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — Rendering game 2D
- **Vanilla CSS3** — Styling retro CRT dengan efek scanline & glow
- **Vanilla JavaScript** — Game engine, collision detection, state management
- **Google Fonts** — Press Start 2P (pixel font)
- **Nginx Alpine** — Static file server (production)
- **Docker** — Containerization untuk deployment

---

## 🚀 Menjalankan Secara Lokal

### Menggunakan Python HTTP Server

```bash
python3 -m http.server 8080
```

Buka browser di `http://localhost:8080`

### Menggunakan Docker

```bash
docker build -t it-support-game .
docker run -p 8080:8080 it-support-game
```

---

## ☁️ Deploy ke Google Cloud Run

```bash
gcloud run deploy it-support-game \
  --source . \
  --port 8080 \
  --allow-unauthenticated
```

---

## 📁 Struktur Proyek

```
├── index.html      # Struktur HTML & semua screen/modal
├── style.css       # Retro CRT aesthetic & animasi
├── levels.js       # Data peta, objek interaktif, dan kuis
├── game.js         # Game engine (rendering, collision, input, audio)
├── nginx.conf      # Konfigurasi Nginx (port 8080)
├── Dockerfile      # Container image untuk Cloud Run
└── README.md       # Dokumentasi proyek
```

---

## 📜 Lisensi

Proyek ini dibuat untuk submission kompetisi **#JuaraVibeCoding**.

---

<p align="center">
  Dibuat dengan ❤️ dan ☕ untuk <strong>#JuaraVibeCoding</strong>
</p>
