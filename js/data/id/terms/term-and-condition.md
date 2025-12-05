# Syarat dan Ketentuan Layanan Bot Telegram

**Versi:** v1.1  
**Efektif sejak:** 01-01-2025  
**Yurisdiksi:** Hukum Indonesia - Jakarta

---

## 1. Tentang Layanan

Layanan bot Telegram ini menyediakan berbagai fitur untuk membantu pengguna, grup, dan channel dalam mengelola dan meningkatkan pengalaman mereka di platform Telegram.

### Fitur Utama
- Moderasi Otomatis (filter spam, kata terlarang, konten tidak pantas)
- Tracking Database username dan informasi publik pengguna
- Analitik dan statistik untuk grup/channel
- Dukungan Multi-Bahasa
- Layanan Promosi Berbayar
- **Anonymous Chat** - Fitur chat anonim yang menghubungkan pengguna secara acak

### Sistem Multi-Bot

Layanan ini menggunakan sistem multi-bot yang terdiri dari:
- **Master Bot** - Bot utama untuk registrasi dan manajemen akun
- **Bot Spesifik** - Bot dengan fitur khusus (seperti anonymous chat)

**Penting:** Untuk menggunakan bot spesifik (seperti anonymous chat bot), Anda HARUS terlebih dahulu membuat akun di Master Bot. Bot spesifik akan memverifikasi registrasi Anda melalui Master Bot sebelum memberikan akses.

### Developer dan Resource
Platform ini dikembangkan dan dikelola oleh satu orang developer dengan resource terbatas. Mohon pengertian untuk waktu respon (3-7 hari kerja, hingga 1 bulan untuk kasus kompleks) dan keterbatasan teknis yang mungkin terjadi.

---

## 2. Persetujuan dan Pendaftaran

Dengan menggunakan layanan ini, Anda:
- Berusia minimal **14 tahun**
- Menyetujui semua ketentuan dalam dokumen ini
- Menyetujui yurisdiksi hukum Indonesia
- Memahami keterbatasan layanan dan resource yang ada
- Memahami bahwa akun Master Bot diperlukan untuk menggunakan bot spesifik

---

## 3. Pengumpulan dan Penggunaan Data

### 3.1 Data yang Dikumpulkan

**Data Wajib:**
- User ID, username, dan nama lengkap
- Usia dan jenis kelamin
- Preferensi bahasa

**Data Opsional:**
- Informasi grup/channel jika Anda menambahkan bot
- Data pendukung seperti foto (untuk layanan tertentu)

**Tracking:**
- Waktu interaksi terakhir
- Preferensi dan pengaturan pengguna
- Riwayat penggunaan fitur
- Log koneksi anonymous chat (User ID, waktu sesi, metadata koneksi)

### 3.2 Database Tracking Publik

Bot merekam username dan full name semua pengguna. Data ini dapat diakses pengguna lain secara gratis (sesuai kuota) untuk:
- User ID
- Username
- Full name (nama lengkap)

**Opsi Privasi:** Anda dapat mengaktifkan **"Don't track my account"** untuk tidak dimasukkan dalam database tracking publik. Data tetap tersimpan untuk operasional bot tapi tidak dipublikasikan.

### 3.3 Pesan dan Media

**Penyimpanan Normal:**
Hanya metadata dasar dari media yang disimpan. Konten pesan/media lengkap **TIDAK** disimpan dalam kondisi normal.

**Penyimpanan Khusus:**
Pesan/media lengkap hanya disimpan jika:
- Terdeteksi pelanggaran aturan
- Terdapat laporan dari pengguna lain
- Diperlukan untuk investigasi keamanan

Metadata media disimpan dalam format pickle (Python serialization) dan dienkripsi untuk keamanan.

### 3.4 Keamanan dan Penyimpanan Data

**Enkripsi:**
- Metadata media Telegram dienkripsi
- Data lainnya tidak dienkripsi karena keterbatasan teknis
- **Lokasi Server:** Singapura
- **Yurisdiksi:** Hukum Indonesia

**Durasi Penyimpanan:**
- **Data Reguler:** 6 bulan sejak interaksi terakhir (dengan notifikasi sebelum penghapusan otomatis)
- **Data Pelanggaran:** 2 tahun (tetap tersimpan meskipun akun dihapus, atau permanen untuk kasus serius)
- **Log Anonymous Chat:** 6 bulan sejak sesi terakhir
- **Konten Pesan Anonymous Chat:** TIDAK disimpan (kecuali ada laporan)

**Backup dan Recovery:**
- Database di-backup secara berkala
- Prioritas pada data kritis
- Estimasi recovery maksimal 7 hari
- Tidak ada jaminan 100% karena keterbatasan resource

### 3.5 Penghapusan Data

**Proses Verifikasi Wajib:**
Untuk keamanan dan mencegah penyalahgunaan, penghapusan akun harus melalui verifikasi dengan developer.

**Cara Menghapus:**
1. Hubungi melalui kontak yang tersedia
2. Berikan User ID dan alasan penghapusan
3. Proses maksimal 7 hari kerja

**Catatan:** 
- Data pelanggaran tetap tersimpan sesuai ketentuan
- Penghapusan akun di Master Bot akan menghapus akses ke semua bot spesifik
- Data log anonymous chat akan dihapus sesuai ketentuan penyimpanan

---

## 4. Kebijakan Grup dan Channel

### 4.1 Untuk Owner dan Admin

- Memiliki kontrol penuh atas pengaturan bot
- Bertanggung jawab atas penggunaan bot
- Dapat mengatur fitur moderasi dan analitik
- Mendapat akses ke data statistik grup/channel mereka

**Data yang Dapat Diakses:**
- Statistik aktivitas grup/channel mereka
- Analisis dan analitik penggunaan bot
- Laporan moderasi dan pelanggaran
- Pengaturan dan konfigurasi bot

**Data yang TIDAK Dapat Diakses:**
- Data pribadi anggota di luar konteks grup/channel
- Aktivitas anggota di grup/channel lain
- Pesan pribadi dengan bot
- **Konten atau identitas dalam anonymous chat**

### 4.2 Untuk Anggota/Subscriber

- Interaksi dengan bot tercatat
- Tunduk pada aturan bot yang ditetapkan owner/admin
- Dianggap menyetujui penggunaan bot dengan tetap berada di grup/channel

### 4.3 Moderasi

Bot dapat melakukan moderasi otomatis dan manual berdasarkan pengaturan owner/admin. Semua tindakan moderasi dicatat untuk audit dan banding. Developer tidak bertanggung jawab atas keputusan moderasi yang diambil admin.

### 4.4 Promosi Berbayar

**Persetujuan Otomatis:**
Dengan menambahkan bot ke grup/channel atau tetap berada/berlangganan di grup/channel yang menggunakan bot ini, Anda **secara otomatis menyetujui**:
- Menerima promosi berbayar dari layanan ini
- Bot dapat mengirim pesan promosi
- Frekuensi promosi sesuai kebijakan yang ditetapkan

**Kontrol:**
- Owner dapat mengatur frekuensi promosi tertentu
- Tidak dapat menonaktifkan promosi sepenuhnya
- Jika tidak setuju, dapat mengeluarkan bot atau keluar dari grup/channel

---

## 5. Kebijakan Anonymous Chat

### 5.1 Tentang Fitur

Anonymous chat adalah fitur yang memungkinkan pengguna untuk berkomunikasi tanpa mengungkapkan identitas mereka kepada lawan bicara. Fitur ini dirancang untuk memberikan ruang komunikasi yang aman dan privat.

### 5.2 Persyaratan Akses

Untuk menggunakan anonymous chat bot, Anda **WAJIB**:
1. Membuat akun di Master Bot terlebih dahulu
2. Menyelesaikan proses verifikasi akun
3. Menyetujui Terms and Conditions secara penuh
4. Membuat extension akun pada anonymous chat bot

Tanpa registrasi di Master Bot, Anda **TIDAK DAPAT** mengakses fitur anonymous chat.

### 5.3 Cara Kerja dan Anonimitas

**Mekanisme:**
- Bot menghubungkan dua pengguna secara acak
- Identitas asli (User ID, username, nama lengkap) **TIDAK** ditampilkan kepada lawan bicara
- Setiap pengguna diberi identifikator anonim sementara selama sesi chat
- Koneksi dapat diakhiri kapan saja oleh salah satu pihak

**Yang Dilindungi:**
- Identitas Anda tidak terlihat oleh lawan bicara
- Username dan nama asli Anda tersembunyi
- Lawan bicara tidak dapat melacak Anda melalui sistem bot

**Yang TIDAK Dilindungi:**
- Informasi yang Anda bagikan secara sukarela dalam percakapan
- Identitas Anda dari pihak ketiga (Telegram, penegak hukum)
- Pola perilaku yang dapat mengidentifikasi Anda
- Metadata yang dianalisis untuk keperluan keamanan

**Peringatan:** Jangan membagikan informasi pribadi (nama, lokasi, nomor telepon, dll) dalam anonymous chat. Developer tidak bertanggung jawab jika Anda mengungkapkan identitas Anda sendiri.

### 5.4 Keamanan dan Moderasi

**Fitur Keamanan:**
- **Pemblokiran:** Anda dapat memblokir pengguna. Sistem mencegah koneksi ulang dan blokir bersifat satu arah.
- **Pengakhiran Chat:** Gunakan `/stop` atau `/next` untuk mengakhiri. Identitas Anda tetap anonim.
- **Deteksi Otomatis:** Sistem mendeteksi kata/frasa berpotensi melanggar dan memberi peringatan otomatis.

**Rate Limiting:**
Untuk mencegah penyalahgunaan:
- Maksimal 30 koneksi baru per jam per pengguna
- Cooldown 60 detik antara koneksi untuk mencegah spam
- Pembatasan otomatis jika terdeteksi pola penyalahgunaan

**Pelaporan Pelanggaran:**
1. Gunakan perintah `/report` dalam chat
2. Bot akan menyimpan percakapan sebagai bukti dan mengidentifikasi pelanggar
3. Anda tetap anonim dari pelanggar
4. Laporan akan ditinjau dalam 24-48 jam

**Laporan Palsu:** Melaporkan tanpa alasan yang sah akan mengakibatkan sanksi terhadap pelapor.

### 5.5 Pengungkapan Identitas

Developer **akan mengungkap** identitas pengguna anonim jika:
- Laporan pelanggaran serius (konten ilegal, ancaman kekerasan, pelecehan seksual, perdagangan ilegal)
- Perintah hukum yang sah (surat perintah pengadilan, permintaan penegak hukum)
- Keamanan platform (peretasan, sabotase sistem, eksploitasi celah keamanan)

Data akan diverifikasi, hanya data relevan yang diungkap, dan dokumentasi disimpan untuk audit.

### 5.6 Hak dan Kewajiban dalam Anonymous Chat

**Anda Berhak:**
- Mengakhiri chat kapan saja tanpa alasan
- Memblokir pengguna yang tidak diinginkan
- Melaporkan pelanggaran dengan perlindungan identitas
- Mengetahui data yang disimpan tentang aktivitas anonymous chat Anda
- Meminta penghapusan log koneksi (sesuai prosedur Pasal 3.5)
- Mengajukan banding jika merasa salah di-ban

**Anda TIDAK Berhak:**
- Mengetahui identitas pengguna anonim lainnya
- Meminta pengungkapan data pengguna lain tanpa alasan hukum
- Mengakses log percakapan setelah sesi berakhir (kecuali ada laporan)

**Anda Wajib:**
1. Menghormati pengguna lain
2. Tidak berbagi atau meminta informasi pribadi
3. Mematuhi hukum dan tidak mengirim konten ilegal
4. Tidak menyalahgunakan anonimitas untuk merugikan orang lain
5. Melaporkan pelanggaran untuk menjaga keamanan platform

---

## 6. Aturan Penggunaan dan Konsekuensi

### 6.1 Larangan Umum

**Dilarang:**
- Promosi tidak resmi dan spam
- Konten kekerasan, ilegal, atau tidak pantas
- Perundungan dan konten negatif
- Reverse engineering terhadap bot
- Scraping data tanpa izin
- Membuat bot tiruan
- Pelecehan atau harassment (termasuk dalam anonymous chat)
- Mengirim konten ilegal dalam bentuk apapun
- Mencoba mengidentifikasi pengguna anonim lainnya

### 6.2 Konsekuensi dan Sanksi

**Tingkatan Sanksi:**
1. Peringatan
2. Pembatasan fitur
3. Ban permanen dari semua bot dalam sistem ini
4. Laporan ke pihak berwenang (untuk pelanggaran serius)

**Proses Banding:**
Anda dapat mengajukan banding selama data audit masih tersedia melalui kontak yang tersedia dengan menyertakan:
- User ID
- Deskripsi kasus
- Bukti pendukung (jika ada)

---

## 7. Hak Kekayaan Intelektual

### 7.1 Kepemilikan Bot

Semua hak kekayaan intelektual atas bot (kode sumber, desain, fitur, logo, dokumentasi) adalah milik developer dan dilindungi hukum.

### 7.2 Hak Pengguna atas Konten

Anda tetap memiliki hak penuh atas konten yang Anda kirimkan. Dengan menggunakan layanan, Anda memberikan lisensi terbatas, non-eksklusif untuk:
- Menyimpan dan memproses konten sesuai kebijakan
- Menampilkan konten dalam konteks layanan
- Membuat backup

Lisensi berakhir ketika Anda menghapus konten atau akun.

### 7.3 Lisensi Open Source

Bot ini dibangun menggunakan berbagai teknologi open source dan library yang masing-masing memiliki lisensi sendiri. Kami berkomitmen untuk mematuhi semua ketentuan lisensi yang berlaku.

#### Bahasa Pemrograman
- **Python** (Python Software Foundation License / PSF License 2.0) - Bahasa pemrograman utama

#### Database & Caching
- **PostgreSQL** (PostgreSQL License - BSD-style) - Relational database management system
- **Redis** (Dual License: RSALv2 / SSPLv1 / AGPLv3) - In-memory data store dan caching
  - *Catatan: Redis versi 7.2 dan sebelumnya menggunakan BSD-3, Redis 7.4-7.8 menggunakan RSALv2/SSPLv1, Redis 8+ menggunakan tri-license RSALv2/SSPLv1/AGPLv3*

#### Python Libraries (Backend)
- **Telethon** (MIT License) - Telegram API library untuk Python
- **asyncpg** (Apache License 2.0) - PostgreSQL async driver
- **redis-py** (MIT License) - Redis Python client
- **aiofiles** (Apache License 2.0) - Async file operations
- **uvloop** (MIT License / Apache License 2.0 - Dual Licensed) - Fast event loop untuk asyncio
- **orjson** (Apache License 2.0 / MIT License - Dual Licensed) - Fast JSON library
- **loguru** (MIT License) - Python logging library dengan fitur lengkap
- **PyYAML** (MIT License) - YAML parser dan emitter untuk Python
- **ujson** (BSD 3-Clause License) - Ultra fast JSON encoder dan decoder
- **aiorun** (Apache License 2.0) - Asyncio run helper untuk lifecycle management

#### Frontend/Web Libraries
- **TailwindCSS** (MIT License) - Utility-first CSS framework
- **Marked.js** (MIT License) - Markdown parser dan compiler
- **Lucide Icons** (ISC License) - Beautiful & consistent icon toolkit

#### Informasi Tambahan
Developer berkomitmen untuk:
- Mematuhi semua ketentuan lisensi open source yang berlaku
- Memberikan attribution yang sesuai untuk semua library yang digunakan
- Tidak melanggar ketentuan copyleft license seperti AGPL/SSPL
- Menjaga transparansi penggunaan komponen open source

Untuk informasi lisensi lengkap dan source code dari setiap komponen, silakan kunjungi repositori resmi masing-masing library.

**Catatan Penting tentang Redis:**
Proyek ini menggunakan Redis sebagai caching layer. Versi Redis yang digunakan dan lisensinya dapat berbeda tergantung deployment. Penggunaan kami mematuhi ketentuan lisensi yang berlaku dan tidak menyediakan Redis sebagai managed service kepada pihak ketiga.

---

## 8. Layanan Pihak Ketiga

### 8.1 Telegram

100% aktivitas Anda berada di sistem Telegram. Developer tidak memiliki kontrol atas kebijakan privasi Telegram.

### 8.2 Cloud Provider

Layanan ini menggunakan layanan cloud terpercaya. Peretasan atau akses tidak sah dari pihak internal cloud provider di luar kendali developer.

### 8.3 API Eksternal

- **Nominatim (OpenStreetMap)** untuk layanan lokasi
- Pengguna akan diinformasikan saat fitur API eksternal digunakan

---

## 9. Penafian dan Batasan Tanggung Jawab

Developer **TIDAK BERTANGGUNG JAWAB** atas:
- Kerugian yang timbul dari penggunaan layanan
- Gangguan teknis di luar kendali
- Peretasan atau akses tidak sah dari pihak ketiga
- Keputusan moderasi yang diambil admin grup/channel
- Perubahan atau penghentian layanan pihak ketiga
- Konten yang dikirim oleh pengguna lain (termasuk dalam anonymous chat)
- Interaksi negatif atau tidak menyenangkan dengan pengguna lain
- Kebocoran informasi pribadi yang Anda bagikan secara sukarela
- Gangguan emosional dari percakapan
- Anonimitas dari penegak hukum dengan surat perintah yang sah
- Gangguan teknis, koneksi terputus, atau downtime

**Layanan dapat dihentikan, dimodifikasi, atau diubah kapan saja dengan atau tanpa pemberitahuan sebelumnya.**

---

## 10. Kebijakan Khusus

### 10.1 Perlindungan Anak

Layanan ini untuk pengguna berusia **14 tahun ke atas**. Jika menemukan akun di bawah umur, laporkan melalui kontak yang tersedia dengan bukti yang jelas.

**Kebijakan Tegas untuk Grup/Channel:**
Bot **TIDAK AKAN** memproses permintaan apapun yang berhubungan dengan akun anak di bawah umur di grup/channel. Ini termasuk:
- Menambahkan akun anak di bawah umur sebagai admin
- Memproses perintah dari akun anak di bawah umur
- Menyimpan atau melacak data akun anak di bawah umur
- Memberikan akses fitur apapun kepada akun anak di bawah umur

Jika terdeteksi akun di bawah umur mencoba menggunakan bot di grup/channel, bot akan menolak semua permintaan dan owner/admin akan diberi notifikasi.

**Khusus Anonymous Chat:** Pengawasan ekstra diterapkan untuk mencegah penyalahgunaan yang melibatkan anak di bawah umur. Setiap laporan terkait konten yang membahayakan anak akan ditangani dengan prioritas tertinggi dan dapat diungkap ke pihak berwenang.

### 10.2 Pelanggaran Keamanan Data

Jika terjadi data breach, pengguna yang terdampak akan:
- Diinformasikan tentang insiden
- Diberikan detail yang relevan
- Diberi tahu langkah-langkah yang diambil

### 10.3 Multi-Bahasa dan Yurisdiksi

Bot mendukung berbagai bahasa, namun semua ketentuan tunduk pada **Hukum Indonesia - Jakarta**. Compliance khusus untuk regulasi regional (GDPR, CCPA, dll) tidak dapat disediakan karena keterbatasan biaya dan pengetahuan.

---

## 11. Perubahan Kebijakan

- Kebijakan dapat berubah sewaktu-waktu untuk meningkatkan keamanan, menyesuaikan dengan regulasi baru, atau meningkatkan pengalaman pengguna
- Setiap perubahan signifikan akan diinformasikan melalui bot atau channel resmi
- Dengan tetap menggunakan layanan, Anda otomatis menyetujui kebijakan terbaru

Jika tidak setuju: data Anda tetap tersimpan sesuai ketentuan sebelumnya, dan Anda dapat menghubungi untuk menghapus akun.

---

## 12. Kontak

**Telegram:** @YourBotSupport *(ganti dengan username support Anda)*

**Waktu Respon:** 3-7 hari kerja (hingga 1 bulan untuk kasus kompleks)

### Informasi yang Perlu Disertakan:
- User ID (jika terkait akun)
- Deskripsi masalah yang jelas
- Screenshot (jika diperlukan)
- Tingkat urgensi (jika mendesak)
- **Untuk laporan anonymous chat:** sertakan waktu kejadian dan deskripsi pelanggaran

---

## 13. Kesimpulan dan Persetujuan

Dengan menyetujui ketentuan ini, Anda:
- Memahami dan menyetujui semua kebijakan dalam dokumen ini
- Berkomitmen menggunakan layanan dengan bertanggung jawab
- Setuju data Anda disimpan sesuai ketentuan yang berlaku
- Memahami keterbatasan layanan dan resource yang ada
- Menyetujui yurisdiksi hukum Indonesia
- Menyetujui penerimaan promosi berbayar (jika di grup/channel)
- Memahami username dan full name dapat diakses pengguna lain (kecuali aktifkan "Don't track my account")
- Memahami bahwa akun Master Bot diperlukan untuk menggunakan bot spesifik
- Menyetujui kebijakan anonymous chat dan batasan tanggung jawab yang ada

---

*Dokumen ini merupakan bagian dari kebijakan privasi yang mengikat secara hukum.*

**Terima kasih telah mempercayai dan menggunakan layanan ini. Mari bersama-sama membangun komunitas Telegram yang lebih aman dan bertanggung jawab!**