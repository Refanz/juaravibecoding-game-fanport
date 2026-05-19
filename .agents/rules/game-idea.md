---
trigger: always_on
---

# Instruksi Pembuatan Game: IT Support Vibe (Proyek #JuaraVibeCoding)

## Konteks Proyek
Kamu adalah seorang ahli pengembangan game web-based. Buatkan saya sebuah purwarupa (prototype) game web sederhana dengan tema "IT Support" menggunakan gaya visual 2D top-down retro (mirip game RPG/Pokémon jadul). Game ini merupakan bagian dari submission kompetisi #JuaraVibeCoding, sehingga kodenya harus siap untuk di-deploy ke **Google Cloud Run**.

## Tech Stack & Infrastruktur
- **Frontend**: HTML5, CSS3, dan JavaScript murni (disarankan menggunakan library **Kaboom.js** atau **Phaser.js** via CDN agar ringan dan cocok untuk vibe coding).
- **Deployment**: Buatkan file `Dockerfile` sederhana (menggunakan image `nginx:alpine` atau `node`) untuk melayani (serve) file statis HTML/JS/CSS ini agar siap di-deploy langsung ke Google Cloud Run.

## Spesifikasi & Flow Game
Game harus fungsional, responsif, dan memiliki 3 layar/state utama:

1. **Welcome Page**: 
   - Menampilkan judul game (contoh: "IT Support: The Vibe Coder").
   - Tombol "Start Game".
   - Teks instruksi singkat cara bermain. 
   - Desain UI harus bernuansa retro/pixel-art, rapi, dan ramah untuk orang awam.

2. **Level Selection**: 
   - Menampilkan minimal 3 level. 
   - Level 2 dan 3 awalnya terkunci (locked) dan baru bisa diakses setelah level sebelumnya diselesaikan.

3. **Main Game (Mekanik Top-Down 2D)**:
   - Karakter utama bisa bergerak (Atas, Bawah, Kiri, Kanan) menggunakan tombol panah atau WASD di dalam ruangan kantor/server.
   - Terdapat objek berkedip atau "NPC" (seperti komputer mati, router rusak) yang harus dihampiri.
   - **Interaksi**: Saat pemain berada di dekat objek dan menekan tombol aksi (misal: Spasi), muncul popup dialog/kuis troubleshooting IT sederhana.
   - Pemain menang jika berhasil menjawab/menyelesaikan task IT tersebut.

## Rincian Level (Sederhana)
- **Level 1 (The Power Issue)**: Pemain harus berjalan mencari 1 komputer yang mati dan menyalakannya (Kuis: "Layar blank, apa yang dicek pertama kali? A. Kabel Power, B. Beli baru").
- **Level 2 (The Router Down)**: Pemain mencari router di ruang server yang ruwet untuk merestart jaringan internet.
- **Level 3 (The Virus Outbreak)**: Pemain harus mengkarantina 3 komputer yang terinfeksi virus dengan batas waktu (timer).

## Manajemen Asset (Vibe Coding)
Karena ini "vibe coding", **jangan gunakan local asset gambar**. Gunakan bentuk geometri dengan warna-warni yang merepresentasikan objek, atau gunakan **Emoji** (misal: 💻 untuk PC, 👨‍💻 untuk player, 📡 untuk router) yang di-render di atas kanvas agar kode bisa langsung berjalan (run) tanpa pesan error "image not found".

## Output yang Dibutuhkan
Tolong hasilkan baris kode lengkap untuk file-file berikut:
1. `index.html` (Struktur dasar & impor library via CDN)
2. `style.css` (Gaya retro, font pixel jika memungkinkan via Google Fonts)
3. `game.js` (Logika game, state Welcome, Level Select, pergerakan, dan deteksi tabrakan/interaksi)
4. `Dockerfile` (Konfigurasi Nginx untuk melayani direktori statis pada port 8080 sesuai standar Cloud Run)

Pastikan kodenya fungsional, bersih, dan menghasilkan user experience yang menyenangkan!
