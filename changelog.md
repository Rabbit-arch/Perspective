# Catatan Perubahan & Analisis Proyek P008 (PERSPECTIVE)

## [Web Font] - 2026-10-06

### Ringkasan
Menambahkan Google Fonts (`Noto Sans Mono`) ke seluruh halaman agar tampilan font konsisten di semua perangkat — menyamakan tampilan lokal (Arch Linux) dengan tampilan published (GitHub Pages/Vercel/Netlify).

### File yang Diubah
- `perspective.html`: Tambah `<link>` preconnect + Google Fonts, update `font-family` ke `"Noto Sans Mono","Courier New",Courier,monospace`
- `about.html`: Idem
- `archive.html`: Idem

### Alasan
Font lokal menggunakan `Noto Sans Mono` (default monospace Arch Linux), sedangkan perangkat lain (Android, Windows, iOS) jatuh ke font sistem masing-masing karena hanya `"Courier New"` yang digunakan sebelumnya. Dengan Google Fonts, semua perangkat mengunduh font yang sama.

---

## [Analisis Awal Proyek] - 2026-10-05


### Deskripsi Ringkas
`P008` adalah aplikasi web SPA (Single Page Application) monolitik berbasis halaman tunggal HTML (`perspective.html`) dengan estetika retro dithering, monokrom, dan aksen warna merah (`#c0262d`). Aplikasi ini mengeksplorasi tema "sudut pandang", jarak, dan persepsi pengamat melalui interaksi visual interaktif dan komponen-komponen eksperimental.

### Struktur Proyek Saat Ini
- `perspective.html`: File HTML tunggal berisi markup, style CSS internal, dan logika JavaScript Vanilla (Router, Visual Canvas SVG Eye, Interaksi Lensa, Sudut Pandang, Cermin, Jarak, Bayangan, Pengamat, Kesaksian, Contact, dan Utilitas Fullwidth).
- `about.test.js`: Suite pengujian TDD berbasis `node:test` dan `jsdom` untuk komponen navigasi, halaman About Me, utilitas `Fullwidth`, struktur stanzas, dan aksesibilitas pembaca layar (`.sr`).
- `contact.test.js`: Suite pengujian TDD berbasis `node:test` dan `jsdom` untuk modul `Contact`, pembuatan URL `mailto:`, penanganan event klik pada link Contact (navigasi & footer), serta fallback tampilan `#/contact`.

### Fitur Utama & Modul Utama
1. **Sistem Navigasi & Router Hash (`#/`)**: Mengatur tampilan section berdasarkan hash URL (`#/about`, `#/project`, `#/contact`, `#/sudut-pandang`, `#/lensa`, `#/cermin`, `#/archive`, `#/pengamat`, `#/kesaksian`, `#/jarak`, `#/bayangan`).
2. **Utilitas Fullwidth (`window.Fullwidth`)**: Mengonversi teks ASCII ke karakter selebar CJK (`U+3000` untuk spasi dan `+0xFEE0` offset untuk ASCII) serta menyediakan fallback pembaca layar (`.sr`).
3. **Modul Contact (`window.Contact`)**: Mengelola pembentukan URL `mailto:` dengan subjek dan isi terenkode serta penanganan event klik navigasi.
4. **Elemen Interaktif Sudut Pandang & Mata SVG**: Mode "terlihat" (`body.on`) yang menampilkan mata besar SVG (`#eye`), denyut cahaya merah (`#gz`), mata-mata kecil di tepi (`#gzeyes`), dan efek glitch/dithering.
5. **Modul Eksperimen**:
   - *Sudut Pandang*: Slider perspektif 3D pada potret.
   - *Lensa*: Efek sorot lampu radial (`-webkit-mask-image`) di atas dua lapisan teks yang berbeda.
   - *Cermin*: Efek cermin teks yang merespons input pengguna.
   - *Pengamat*: Detektor informasi lokal (resolusi layar, zona waktu, bahasa, durasi kunjungan).
   - *Kesaksian*: Buku tamu lokal berbasis `localStorage`.
   - *Bayangan*: Animasi bayangan CSS drop-shadow yang merespons pergerakan kursor/pointer dan bertindak independen (rebel).

### Catatan Pengujian (TDD Protocol)
- Lingkungan eksekusi membutuhkan pustaka Node.js yang cocok dengan GLIBC sistem Arch CachyOS (menggunakan binary node v24.11.1 pada `/home/fireicereyy/.cache/ms-playwright-go/1.57.0/node`).

## [Update] - 2026-10-05
- **TDD Protocol**: Memisahkan halaman About Me menjadi file standalone `about.html`.
- **about.test.js**: Diperbarui untuk menguji `about.html` langsung alih-alih `perspective.html#/about`. Struktur tes diubah, mengekspektasikan format navigasi baru (tanpa tautan Home, serta menautkan Project ke `https://github.com/Rabbit-arch` eksternal), dan mengecek active tag pada navigasi halaman saat ini. Semua 9 uji lulus.
- **about.html**: Dibuat sebagai file HTML standalone dengan struktur dan desain konsisten dengan proyek utama, tanpa menyertakan skrip tambahan selain utilitas Fullwidth.

## [Pemisahan Halaman Archive] - 2026-10-05

### Deskripsi Perubahan
Sesuai dengan TDD Protocol, halaman Archive telah dipisahkan menjadi file standalone independen `archive.html`. Bersamaan dengan ini, dibuat juga suite pengujian `archive.test.js`.

### Detail Implementasi
1. **archive.test.js**:
   - Memastikan navigasi yang benar (About Me, Project, Archive, Contact) tanpa adanya tautan ke Home.
   - Memastikan title tab memuat 'Archive'.
   - Memastikan `aria-current="page"` berada pada elemen navigasi Archive.
   - Mengecek keberadaan minimal 4 elemen `<details>` dan `<summary>`.
   - Mengecek keberadaan elemen catatan `.old` yang ditujukan untuk catatan tersembunyi.
   - Memastikan tidak ada penyematan (embed) elemen interaktif/media yang tidak diinginkan (iframe, audio, video, object).

2. **archive.html**:
   - Struktur dan desain menyesuaikan dengan tampilan retro monokrom (CSS internal `about.html`).
   - Tidak menggunakan JavaScript (sepenuhnya statis HTML & CSS).
	- Menyertakan daftar elemen `<details>` untuk arsip catatan dengan efek blur dan grayscale pada `.old`.

## [Refaktorisasi Final Halaman Utama & TDD Selesai] - 2026-10-05

### Detail Implementasi
1. **contact.test.js**:
   - Diperbarui untuk menggunakan path lokal (tidak lagi mencari `../perspective.html` karena file dipindah).
   - Selector diupdate agar ekspektasi navigasi baru (tanpa Home, link yang valid) bisa lulus pengujian event klik pada link internal lainnya.

2. **perspective.html (Homepage)**:
   - Navigasi "Home" dihapus dari struktur navigasi `<nav>`.
   - Mengubah link About Me menunjuk ke `about.html`, Project menunjuk ke `https://github.com/Rabbit-arch` (eksternal, `target="_blank"`), Archive menunjuk ke `archive.html`, sedangkan Contact tetap sebagai fallback internal (`#/contact`).
   - Menghapus semua `<section>` eks-fitur yang sudah usang atau dipisah (about, archive, project, sudut-pandang, lensa, cermin, jarak, bayangan, pengamat, kesaksian).
   - Membersihkan blok CSS kustom yang merujuk pada fitur-fitur yang sudah terhapus di atas.
   - Membersihkan file JavaScript dari modul inisiasi IIFE yang lama, mengurangi kompleksitas router hash menjadi hanya mengatur fallback Contact dan tautan `#posts` anchor. 
3. **Status Pengujian**:
   - Keseluruhan 24 tes dari 3 buah berkas (`about.test.js`, `contact.test.js`, `archive.test.js`) telah berhasil lulus (100% Passed) menggunakan JSDOM pada Node.js.

## [Pembersihan Elemen Mode Terlihat & Penyesuaian Judul H1] - 2026-10-05

### Detail Implementasi
1. **perspective.html**:
   - Memperbarui aturan CSS `body.on .eq, body.on .sub, body.on .subt { display: none }` untuk memastikan segmen nama, garis pembatas titik, dan link `[so much pain]` disembunyikan seluruhnya saat mode "terlihat" aktif.
2. **about.html**:
   - Mengubah elemen judul `<h1>` utama menjadi `⌈ ＡＢＯＵＴ　ＭＥ ⌋` (sesuai gaya `perspective.html`).
   - Menambahkan subtitle `<div class="subt">Raihan H. Mubarak</div>`.
   - Menghapus header duplikat (`<h2 data-fw>About Me</h2><h3>-admin</h3><hr>`) di dalam `<article>`.
3. **archive.html**:
   - Mengubah elemen judul `<h1>` utama menjadi `⌈ ＡＲＣＨＩＶＥ ⌋` (sesuai gaya `perspective.html`).
   - Menambahkan subtitle `<div class="subt">Raihan H. Mubarak</div>`.
   - Menghapus header duplikat (`<h2>Archive</h2><h3>-admin</h3><hr>`) di dalam `<article>`.

## [Penyelarasan Style Header & Penghapusan Header Duplikat] - 2026-10-05

### Detail Implementasi
1. **Penyelarasan Style Header `h1`**:
   - Mengadopsi format teks retro monokrom `perspective.html` (`⌈` + Fullwidth uppercase + `⌋`) pada `about.html` (`⌈ ＡＢＯＵＴ　ＭＥ ⌋`) dan `archive.html` (`⌈ ＡＲＣＨＩＶＥ ⌋`).
   - Menambahkan `.subt` (`Raihan H. Mubarak`) pada header `about.html` dan `archive.html`.
2. **Penghapusan Duplikasi Header**:
   - Membuang tag `<h2>` dan `<h3>-admin</h3>` di dalam kontainer `<article>` pada `about.html` dan `archive.html` agar tidak terjadi pengulangan judul header.
3. **Pembaruan Suite Pengujian**:
   - Memperbarui `about.test.js` untuk memverifikasi `h1` utama `⌈ ＡＢＯＵＴ　ＭＥ ⌋` tanpa mengandalkan `h2` duplikat yang sudah dihapus.
   - Semua 24 tes dari 3 file suite lulus 100%.

## [Pembersihan Elemen Navigasi & Subtitle dari Halaman Standalone] - 2026-10-05

### Detail Implementasi
1. **Pembersihan Header Subhalaman (`about.html` & `archive.html`)**:
   - Menghapus segmen `<div class="subt">Raihan H. Mubarak</div>`.
   - Menghapus segmen pola dekoratif `<div class="eq">░▒▓█▓▒𓁿▒▓█▓▒░</div>`.
   - Menghapus bilah navigasi `<nav>` (`About Me︱Project︱Archive︱Contact`) sehingga navigasi utama hanya berada di halaman utama (`perspective.html`).
2. **Pembaruan Pengujian (TDD Protocol)**:
   - Memperbarui `about.test.js` dan `archive.test.js` untuk mengonfirmasi ketiadaan `<nav>`, `.subt`, dan `.eq` pada halaman sub/standalone.
   - Seluruh 22 tes pada suite pengujian berhasil lulus 100%.

## [Randomisasi Logika & Timing Animasi Tatap Mata] - 2026-10-05

### Detail Implementasi
1. **perspective.html**:
   - Menghapus waktu tunggu statis pada trigger tatap mata (`stare` mode) dan kedipan (`blinkLoop`).
   - Mengubah fungsi `cycle()` untuk mentrigger mode tatap (`E.mode = 'stare'`) dengan durasi tatap acak `2500ms - 7500ms` (`rnd(2500, 7500)`) dan interval jeda acak `5000ms - 14000ms` (`rnd(5000, 14000)`).
   - Menambahkan randomisasi frekuensi fase denyut tatapan (`starePhase = rnd(250, 500)`) pada efek `gazeFx`.
2. **Status Pengujian**:
   - Seluruh 22 pengujian pada test suite lulus 100%.




