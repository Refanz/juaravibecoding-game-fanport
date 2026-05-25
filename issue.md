# Issue: Migrate Tilemap from 2D Array to Phaser Tilemap

## Background
Saat ini, representasi map untuk lantai rumah sakit (Floor 1, Floor 2, dan Floor 3) menggunakan struktur data *2D array* secara manual di dalam kode (seperti di `floor1.ts`, `floor2.ts`, dll). Pendekatan ini sangat tidak efisien untuk map yang berskala besar, memakan memori, serta menyulitkan proses *level design* atau pengeditan map karena tidak adanya representasi visual secara langsung saat *development*.

## Tujuan
Melakukan migrasi sistem *rendering* dan penyimpanan data map dari *2D array* manual menjadi sistem Tilemap *native* bawaan dari Phaser (`Phaser.Tilemaps.Tilemap`), serta memanfaatkan *tileset* yang sudah ada pada *project* ini. Dengan menggunakan fitur Tilemap dari Phaser, map akan lebih mudah dikelola, dirender dengan performa yang lebih efisien, dan mendukung penggunaan *external editor* (seperti aplikasi **Tiled**).

## Daftar Map yang Akan Dimigrasi
1. Floor 1
2. Floor 2
3. Floor 3

## Rencana Perubahan (Action Plan)

1. **Konversi Format Data Map**
   - Hapus *2D array* map pada *file* `floor1.ts`, `floor2.ts`, dan `floor3.ts` (beserta konfigurasi manual terkait posisi X dan Y).
   - Buat format file Tilemap standar (misal: JSON hasil *export* dari Tiled Editor) atau representasi CSV/Tilemap array yang dapat dimuat langsung oleh parser Tilemap Phaser. Disarankan menggunakan format JSON agar mendungkung multi-layer (Tile Layer untuk lantai/dinding, dan Object Layer untuk objek interaktif).

2. **Update Preloader / AssetManager**
   - Tambahkan fungsi untuk memuat data *tilemap* JSON di tahap `preload()`.
   - Contoh: `this.load.tilemapTiledJSON('hospital-map', 'path/to/map.json')`
   - Pastikan *tileset* image yang saat ini digunakan di-load dengan benar untuk direkatkan (*bind*) dengan Tilemap JSON tersebut.

3. **Refactor GameScene / Map Rendering Engine**
   - Ganti *logic looping* `map.forEach` yang saat ini meng-*instantiate* Sprite satu per satu dengan instansiasi `Phaser.Tilemaps.Tilemap`.
   - Gunakan fungsi `const map = this.make.tilemap({ key: 'hospital-map' })`.
   - Hubungkan tileset dengan `map.addTilesetImage('tileset-name', 'tileset-key')`.
   - Render *layer* menggunakan `map.createLayer()`.

4. **Penyesuaian Sistem Collision (Tabrakan) & Objek Interaktif**
   - Transisikan dari cek tabrakan manual berdasarkan *grid array* ke sistem *collision* bawaan Tilemap Phaser.
   - Set collision menggunakan `map.setCollisionByProperty({ collides: true })` atau `map.setCollisionByExclusion`.
   - Pisahkan data objek interaktif (seperti PC Rusak, Lift, CCTV, AP, dll) ke dalam **Object Layer** pada Tilemap. Phaser dapat mem-*parsing* layer ini untuk me-*spawn* class *Interactable* atau *NPC* dengan koordinat yang akurat.

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Representasi 2D array manual untuk map telah dihapus dari basis kode.
- [ ] Map Floor 1, Floor 2, dan Floor 3 berhasil di-*render* ulang menggunakan `Phaser.Tilemaps`.
- [ ] Sistem *collision* karakter (Player dan NPC) berfungsi baik dengan *layer tilemap* dinding/penghalang.
- [ ] Posisi objek interaktif dapat diload secara otomatis dari data Tilemap/Object Layer.
- [ ] Performa *rendering* membaik dan lebih efisien karena dikelola langsung oleh *WebGL Pipeline* Phaser melalui Tilemap Layer.
- [ ] Mudah untuk ditambahkan map baru atau memperbarui map saat ini tanpa pusing melihat kode *array* berukuran raksasa.
