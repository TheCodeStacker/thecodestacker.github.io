# Refleksi Membangun Web Code Stacker: Perjalanan Arsitektur SPA yang Modular

Ketika pertama kali memutuskan untuk membuat aplikasi web yang lebih dari sekadar halaman statis, saya menghadapi masalah klasik: bagaimana cara mengatur kode agar tidak berantakan? Web Code Stacker, proyek dokumentasi sederhana yang saya kembangkan, menjadi pembelajaran berharga tentang bagaimana struktur yang tepat dapat membuat perbedaan besar, bahkan untuk proyek pribadi.

Yang menarik dari pengalaman ini adalah menyadari bahwa kompleksitas tidak selalu berarti "Advanced Level". Saya bukan developer senior dengan pengalaman bertahun-tahun, namun tantangan untuk membuat aplikasi yang mudah dirawat tetap sama. Ketika aplikasi mulai tumbuh dari satu file HTML menjadi puluhan file dengan berbagai tugas, keputusan yang diambil di awal benar-benar menentukan seberapa menyenangkan atau menyulitkan proses pengembangan ke depannya.

## Filosofi Modularitas yang Pragmatis

Pembelajaran paling fundamental yang saya dapat adalah pentingnya pemisahan tugas. Dalam Web Code Stacker, saya memisahkan aplikasi menjadi beberapa lapisan yang jelas: komponen, utilitas, dan konfigurasi. Kedengarannya teknis dan mungkin "over-engineering" untuk proyek kecil, namun percayalah, ini menyelamatkan saya dari mimpi buruk refactoring di kemudian hari.

Konsep arsitektur berbasis komponen yang saya terapkan sebenarnya cukup sederhana. Daripada menulis semua logika UI dalam satu file besar, saya membaginya menjadi bagian-bagian independen seperti sidebar, header, dan modal. Setiap komponen memiliki tanggung jawab sendiri atas rendering dan perilakunya. Yang lebih penting lagi, setiap komponen dapat digunakan kembali atau dimodifikasi tanpa harus mengutak-atik bagian lain dari aplikasi.

Dalam praktiknya, pendekatan ini memberikan kejelasan yang luar biasa. Ketika ada bug di sidebar, saya tahu persis harus membuka file mana. Saat ingin mengubah tampilan modal bahasa, saya tidak perlu khawatir secara tidak sengaja merusak fitur lain. Pemisahan perhatian ini bukan hanya teori akademis, ini benar-benar membuat proses pengembangan jauh lebih mudah dikelola.

## State Management yang Rasional

Salah satu tantangan terbesar dalam membuat single-page application (SPA) adalah mengelola state. Dalam Web Code Stacker, saya menerapkan pola state management yang sederhana namun efektif dengan menggunakan observer pattern. Ada satu objek state pusat yang menyimpan data penting seperti bahasa yang dipilih pengguna, dan berbagai komponen dapat "subscribe" untuk mendapatkan notifikasi ketika state berubah.

Yang menarik dari pendekatan ini adalah fleksibilitasnya. Ketika pengguna mengganti bahasa dari "English" ke "Bahasa Indonesia", saya tidak perlu memperbarui setiap komponen satu per satu secara manual, sungguh itu sangat merepotkan. State manager memberi tahu semua subscriber, dan mereka merespons sesuai kebutuhan masing-masing. Ini membuat aplikasi terasa lebih "reaktif" tanpa harus menggunakan framework berat seperti React atau Vue.

Tentu saja, ini bukan solusi yang cocok untuk aplikasi yang sangat kompleks dengan state tree yang dalam. Untuk Web Code Stacker yang relatif sederhana, pola ini memberikan keseimbangan yang sempurna antara kesederhanaan dan fungsionalitas. Saya tidak perlu belajar Redux atau MobX, tetapi tetap mendapatkan keuntungan dari state management terpusat.

Yang perlu diperhatikan adalah potensi "memory leaks" dari "observer pattern". Setiap kali komponen subscribe ke perubahan state, penting untuk membersihkan subscription tersebut ketika komponen sudah tidak digunakan lagi. Pada beberapa iterasi awal, saya mengalami bug di mana event listener menumpuk karena tidak dihapus dengan benar, membuat performa aplikasi menurun seiring penggunaan.

## Router yang Ringan namun Kuat

Routing adalah jantung dari setiap single-page application. Dalam Web Code Stacker, saya membuat custom router yang memanfaatkan navigasi berbasis hash. Keputusan menggunakan hash routing (#) dibandingkan history API memang memiliki trade-off, namun untuk kasus saya, hosting di GitHub Pages tanpa konfigurasi server side, ini pilihan yang menurut saya paling pragmatis.

Yang saya sukai dari pendekatan ini adalah kontrolnya. Saya dapat mendefinisikan dengan presisi bagaimana parsing URL bekerja, bagaimana parameter query ditangani, dan bagaimana state navigasi dikelola. Router custom ini juga terintegrasi dengan sangat mulus dengan state manager, sehingga perubahan bahasa dapat tercermin dalam URL secara otomatis.

Satu aspek yang awalnya menantang adalah menangani siklus navigasi dengan benar. Ketika pengguna berpindah dari satu halaman ke halaman lain, ada urutan operasi yang harus terjadi: membersihkan halaman lama, mengambil konten baru, merender halaman baru, memperbarui state UI. Koordinasi ini perlu dilakukan dengan hati-hati untuk menghindari "race conditions" atau kebocoran memori.

Saya menerapkan pelindung navigasi yang cukup sederhana, sebuah flag `isNavigating` yang mencegah navigasi bersamaan. Ini sederhana, namun efektif mencegah bug yang muncul ketika pengguna mengklik cepat pada berbagai item/menu yang tersedia. Tanpa menjaga hal ini, aplikasi bisa terjebak dalam keadaan state yang tidak konsisten atau bahkan crash.

## Strategi Pemuatan Konten yang Efisien

Salah satu keputusan arsitektur yang berdampak adalah bagaimana konten dimuat dan di-cache. Daripada memuat semua dokumentasi di awal, Web Code Stacker lebih memilih menggunakan lazy loading, hanya mengambil file markdown ketika pengguna benar-benar membutuhkannya. Ini secara drastis mengurangi waktu muat di awal, terutama penting bagi pengguna dengan koneksi internet lambat.

Implementasi lapisan cache di atas lazy loading memberikan yang terbaik dari kedua dunia. Konten yang sudah diambil sekali akan disimpan di memori, sehingga navigasi berikutnya dapat dimuat secara instan dari memori. Namun saya harus menyadari tentang konsumsi memori, untuk aplikasi dengan ratusan atau ribuan dokumen, diperlukan strategi cache eviction yang lebih tepat dan rumit, mungkin akan saya perbarui lagi ke depannya.

Yang menarik adalah bagaimana dukungan multi bahasa yang terintegrasi dengan strategi loading ini. Setiap kombinasi dokumen bahasa di-cache secara terpisah, sehingga pergantian bahasa tidak memicu pengambilan ulang yang tidak perlu. Namun ini juga berarti penggunaan memori bisa dua kali atau tiga kali lipat jika pengguna secara aktif menggunakan beberapa bahasa.

## Penanganan Event yang Bersih

Satu aspek yang sering diremehkan adalah manajemen penanganan event yang tepat. Pada iterasi pertama Web Code Stacker, saya tidak terlalu khawatir dengan pembersihan event listener, dan hasilnya adalah kebocoran memori yang tidak terlihat namun pasti. Setiap kali komponen di-render ulang, event listener baru ditambahkan tanpa menghapus event listener yang lama.

Solusinya adalah implementasi event handler registry menggunakan WeakMap. Setiap elemen menyimpan referensi ke event handler-nya masing-masing, dan ada fungsi cleanup yang secara sistematis menghapus semua listener sebelum elemen dihancurkan atau diganti. Ini membosankan untuk membangun pengaturan awalnya, namun terbayar dalam stabilitas jangka panjang.

Yang saya pelajari adalah pentingnya menjadi teliti dalam manajemen sumber daya, meskipun di dalam JavaScript yang sudah memiliki "garbage collection". Browser modern memang canggih, namun mereka tidak dapat mendeteksi setiap pola kebocoran memori, apalagi ketika ada "circular references" atau "dangling event listeners".

## Render Konten Dinamis

Parsing dan penataan markdown adalah fitur inti dari Web Code Stacker. Saya menggunakan marked.js untuk mengonversi markdown ke HTML, namun tantangan sebenarnya adalah menata hasilnya secara konsisten. Markdown processors menghasilkan plain HTML, dan tugas saya adalah menerapkan class Tailwind CSS secara terprogram untuk setiap tipe elemen.

Pendekatan yang saya gunakan adalah post-processing output HTML dengan manipulasi DOM. Setelah markdown di-parse, saya menelusuri hasil HTML-nya dan menerapkan class berdasarkan tipe elemen dan konteks. Misalnya, paragraf pertama yang berisi metadata di-style berbeda dari paragraf body, list items mendapatkan bullet bernomor yang bergaya, code blocks mendapatkan tombol salin, dan seterusnya.

Ini lebih bertele-tele dibandingkan menggunakan CSS global, namun memberikan kontrol granular yang saya butuhkan. Setiap tipe elemen dapat di-style secara presisi, dan saya dapat menambahkan fitur interaktif seperti pembesaran gambar dan sebagainya.

Pertimbangan kinerja menjadi relevan ketika berurusan dengan dokumen yang besar. Manipulasi DOM yang terlalu luas dapat membuatnya lambat, apalagi di perangkat mobile. Untuk optimalisasi, saya menggabungkan operasi DOM dan menggunakan fragmen dokumen untuk meminimalkan reflow dan repaints.

## Struktur Folder yang Memudahkan

Struktur organisasi file adalah sesuatu yang sering diabaikan dalam pembelajaran dan praktik, namun sangat penting untuk pemeliharaan. Web Code Stacker menggunakan struktur yang bersih: direktori komponen untuk bagian UI, utils untuk fungsi bantu, config untuk pengaturan, dan data untuk konten.

Yang membuat perbedaan adalah konsistensi. Setiap file komponen akan mengekspor fungsi dengan penamaan yang sama, setiap modul utilitas memiliki tanggung jawab tunggal yang jelas, dan konfigurasi yang dipisah dari logika implementasi. Ketika kembali ke codebase setelah beberapa minggu tidak disentuh, struktur yang terorganisir ini secara signifikan mengurangi beban kognitif untuk mengetahui "apa itu? dan untuk apa?".

Satu pola yang membantu adalah mengelompokkan fungsionalitas terkait. Misalnya, semua kode terkait bahasa (konfigurasi, komponen modal, manajemen state) mudah ditemukan karena terhubung secara logis. Ini membuat pengembangan fitur dan perbaikan bug jauh lebih efisien.

## Pembelajaran tentang Peningkatan Progresif

Web Code Stacker awalnya dimulai sebagai aplikasi yang sangat dasar, dan secara bertahap menambahkan fitur seiring waktu. Pendekatan peningkatan progresif ini ternyata sangat berharga bagi saya. Daripada mencoba membangun semuanya dengan sempurna dari awal, saya fokus pada fungsionalitas inti terlebih dahulu, kemudian secara berulang menambahkan peningkatan.

Misalnya, animasi dan transisi ditambahkan belakangan setelah navigasi dasar sudah solid. Modal bahasa awalnya sangat sederhana, baru kemudian saya tambahkan polesan visual dan animasi yang halus. Pendekatan bertahap ini mencegah rasa kewalahan dan memungkinkan pengujian setiap penambahan fitur dengan tepat sebelum melanjutkan.

Yang juga penting adalah mengetahui kapan harus berhenti. Ada banyak fitur yang bisa ditambahkan, fungsi pencarian, mode gelap, sistem bookmark, dan sebagainya, namun untuk lingkup proyek ini, saya harus realistis tentang apa yang sebenarnya diperlukan versus apa yang sekadar baik untuk dimiliki.

## Trade-off dan Keterbatasan

Jujur saja, ada beberapa keputusan yang saya ambil yang tidak optimal untuk semua kasus. Pendekatan custom router berarti saya kehilangan fitur-fitur canggih dari library routing yang mapan. State management yang sederhana dapat menjadi bottleneck jika aplikasi berkembang signifikan. Hash-based routing tidak SEO-friendly dibandingkan pushState routing yang sebenarnya.

Sistem konten berbasis markdown juga memiliki keterbatasan. Tidak ada validasi runtime, kesalahan ketik dalam markdown tidak terdeteksi sampai di-render, dan tata letak kompleks sulit diakomodasi. Untuk situs dokumentasi sederhana ini dapat diterima, namun untuk aplikasi yang lebih canggih diperlukan pendekatan yang berbeda.

Strategi manajemen memori yang saya gunakan juga naif untuk aplikasi produksi dengan lalu lintas tinggi. Tidak ada kebijakan cache eviction, tidak ada strategi lazy loading untuk gambar, dan tidak ada pertimbangan untuk fungsionalitas offline. Mungkin nanti akan saya tambahkan perlahan.

## Refleksi dan Langkah Selanjutnya

Membangun Web Code Stacker mengajarkan saya bahwa arsitektur yang baik bukan tentang menggunakan framework terbaru atau mengikuti setiap best practice secara membabi buta. Ini tentang memahami trade-off, bersikap pragmatis dengan batasan sumber daya, dan membangun sesuatu yang dapat dirawat untuk jangka panjang.

Untuk developer lain yang mungkin memulai perjalanan serupa, saran saya adalah mulai dari yang sederhana namun berpikir modular dari awal. Tidak perlu langsung menggunakan framework kompleks, namun desain kode dengan pola pikir bahwa itu akan berkembang. Investasikan waktu dalam struktur yang tepat, bahkan jika awalnya terasa berlebihan untuk proyek kecil.

Yang paling berharga adalah pengalaman nyata dalam membuat keputusan arsitektur dan menghadapi konsekuensinya. Setiap bug yang saya perbaiki, setiap refactoring yang saya lakukan, dan setiap fitur yang saya tambahkan memperdalam pemahaman tentang apa yang berhasil dan apa yang tidak dalam praktik.

## Penutup

Perjalanan membangun Web Code Stacker bukan hanya tentang menghasilkan aplikasi yang berfungsi, tetapi lebih tentang proses pembelajaran yang berkelanjutan. Setiap baris kode yang ditulis, setiap masalah yang dipecahkan, dan setiap keputusan arsitektur yang diambil membentuk pemahaman yang lebih dalam tentang pengembangan web modern.

Yang saya sadari adalah bahwa tidak ada solusi sempurna yang cocok untuk semua kasus. Setiap proyek memiliki konteks, batasan, dan kebutuhan yang unik. Web Code Stacker mungkin tidak menggunakan framework populer atau mengikuti pola arsitektur enterprise yang kompleks, namun pendekatan yang dipilih sesuai dengan kebutuhan dan sumber daya yang tersedia.

Bagi saya pribadi, proyek ini membuktikan bahwa sebagai developer, kita tidak perlu menunggu sampai menjadi "expert" untuk membangun sesuatu yang bermakna. Yang diperlukan adalah keberanian untuk memulai, kesabaran untuk belajar dari kesalahan, dan kemauan untuk terus memperbaiki. Kode yang baik adalah kode yang terus berkembang seiring pemahaman kita yang semakin matang.

Ke depannya, masih banyak ruang untuk perbaikan dan penambahan fitur. Namun saya bangga dengan fondasi yang telah dibangun, fondasi yang modular, dapat dipelihara, dan yang terpenting, dapat dipahami oleh diri saya sendiri ketika kembali mengunjunginya di masa depan.

Untuk Anda yang sedang mempertimbangkan untuk memulai proyek serupa, ingatlah bahwa setiap aplikasi besar dimulai dari langkah pertama yang sederhana. Jangan takut untuk bereksperimen, jangan ragu untuk membuat kesalahan, dan yang paling penting, jangan berhenti belajar. Dokumentasi yang Anda tulis hari ini, bug yang Anda perbaiki besok, dan fitur yang Anda tambahkan minggu depan, semuanya adalah bagian dari perjalanan yang akan membuat Anda menjadi developer yang lebih baik.

Selamat coding, dan semoga refleksi ini bermanfaat untuk perjalanan pengembangan Anda!

---

### Terhubung dengan Saya

Jika Anda tertarik untuk mengikuti perjalanan pengembangan saya lebih lanjut, berbagi pengalaman, atau berdiskusi tentang bahasa program python, bot telegram, atau web development, saya mengundang Anda untuk bergabung di ekosistem Telegram saya:

#### Akun telegram saya
**[@CodeStacker](https://t.me/CodeStacker)**

#### Chanmel telegram yang saya kelola
**[@CodeStackerChannel](https://t.me/CodeStackerChannel)**
**[@CodeStackerTricky](https://t.me/CodeStackerTricky)**

#### Group telegram yang saya kelola
**[@CodeStackerGroup](https://t.me/CodeStackerGroup)**

#### Bot telegram yang saya kelola
**[@CodeStackerBot](https://t.me/CodeStackerBot)**

Mari kita belajar dan berkembang bersama dalam komunitas yang saling mendukung!