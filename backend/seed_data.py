"""Initial content seeding for the public site. Idempotent per collection."""
from datetime import datetime, timezone
import uuid


def _id():
    return str(uuid.uuid4())


STATS = [
    {"key": "tahun_berdiri", "label": "Tahun Berdiri & Mengabdi", "value": 1994, "suffix": "M", "icon": "Clock"},
    {"key": "santri", "label": "Santri Mukim Aktif", "value": 1280, "suffix": "+", "icon": "Users"},
    {"key": "alumni", "label": "Alumni Tersebar Global", "value": 4500, "suffix": "+", "icon": "GraduationCap"},
    {"key": "asatidz", "label": "Asatidz & Pengajar Ahli", "value": 78, "suffix": "Guru", "icon": "Award"},
]

PROGRAMS = [
    {"id": _id(), "order": 1, "name": "MTs Pulo Melati (Madrasah Tsanawiyah)", "badge": "Akreditasi A",
     "desc": "Pendidikan menengah formal 3 tahun mengintegrasikan kurikulum Kemenag dengan kepesantrenan intensif."},
    {"id": _id(), "order": 2, "name": "MA Sains & Humaniora Pulo Melati", "badge": "Unggulan",
     "desc": "Persiapan matang menuju perguruan tinggi ternama (PTKIN, PTN, Al-Azhar Kairo, Turki) dengan peminatan IPA & Keagamaan."},
    {"id": _id(), "order": 3, "name": "Madrasah Tahfidzul Qur'an (MTQ)", "badge": "Khusus 30 Juz",
     "desc": "Program karantina hafalan intensif dengan target mutqin 30 juz berijazah sanad dan tartil qira'ah."},
    {"id": _id(), "order": 4, "name": "Kulliyatul Mu'allimin Al-Islamiyah (KMI)", "badge": "Tradisi & Modern",
     "desc": "Kaderisasi calon guru, da'i, dan cendekiawan muslim dengan penguasaan metodologi pengajaran dan retorika dakwah."},
]

GALLERY = [
    {"id": _id(), "category": "Santri", "title": "Halaqah Mengaji Pagi", "image": "https://images.unsplash.com/photo-1629273229664-11fabc0becc0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Kegiatan", "title": "Tahfidz di Masjid", "image": "https://images.unsplash.com/photo-1712249239085-2161afc54d60?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Santri", "title": "Santri Cilik Bersemangat", "image": "https://images.unsplash.com/photo-1589995635011-078e0bb91d11?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Fasilitas", "title": "Al-Qur'an & Rehal", "image": "https://images.unsplash.com/photo-1624489389801-09bb319beae6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Fasilitas", "title": "Masjid Jami' Pesantren", "image": "https://images.unsplash.com/photo-1521241191669-b9fba071b073?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Acara", "title": "Aula Utama Pondok", "image": "https://images.unsplash.com/photo-1698967406711-ede239b6c07e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Fasilitas", "title": "Kubah & Ornamen", "image": "https://images.unsplash.com/photo-1558114965-eeb97aa84c3b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
    {"id": _id(), "category": "Kegiatan", "title": "Suasana Ibadah", "image": "https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
]

TEACHERS = [
    {"id": _id(), "order": 1, "name": "KH. Ahmad Baihaqi, Lc., M.A.", "role": "Pengasuh & Pimpinan Pondok",
     "specialty": "Fiqh, Ushul Fiqh & Tasawwuf", "image": "https://images.unsplash.com/photo-1627091908405-30bd51eec537?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"id": _id(), "order": 2, "name": "Ustadzah Hj. Nur Aisyah, S.Pd.I.", "role": "Kepala Bidang Tahfidz Putri",
     "specialty": "Tahfidz & Qira'ah Sab'ah", "image": "https://images.unsplash.com/photo-1634451784126-b9f7282edb1b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"id": _id(), "order": 3, "name": "Ustadz Fahmi Ridwan, M.Pd.", "role": "Koordinator Kurikulum Al-Qur'an",
     "specialty": "Tahsin, Tajwid & Sanad", "image": "https://images.unsplash.com/photo-1629131973019-56596eb9975a?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"id": _id(), "order": 4, "name": "Ustadz Zulkifli Hasan, Lc.", "role": "Pembina Bahasa Arab & Inggris",
     "specialty": "Muhadatsah & Balaghah", "image": "https://images.unsplash.com/photo-1680692138250-9dfcbd9c67be?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
]

TESTIMONIALS = [
    {"id": _id(), "order": 1, "name": "Bapak Hendra Wijaya", "role": "Wali Santri MTs",
     "text": "Perubahan akhlak dan kedisiplinan anak saya luar biasa sejak mondok di Pulo Melati. Hafalannya bertambah dan ia semakin mandiri."},
    {"id": _id(), "order": 2, "name": "Siti Rahmawati", "role": "Alumni Angkatan 2018",
     "text": "Bekal ilmu agama dan bahasa dari pondok sangat membantu saya melanjutkan studi ke Al-Azhar Kairo. Barakallah para asatidz."},
    {"id": _id(), "order": 3, "name": "Ibu Dewi Kartika", "role": "Wali Santri Tahfidz",
     "text": "Program tahfidznya terstruktur dengan pembimbing yang sabar. Anak saya kini sudah 15 juz dan tetap berprestasi di pelajaran umum."},
]

NEWS = [
    {"id": _id(), "slug": "wisuda-tahfidz-30-juz-2026", "title": "120 Santri Diwisuda Tahfidz 30 Juz Tahun Ini",
     "category": "Prestasi", "image": "https://images.unsplash.com/photo-1712249239085-2161afc54d60?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
     "excerpt": "Pondok Pesantren Pulo Melati menggelar wisuda akbar bagi 120 santri penghafal Al-Qur'an 30 juz bersanad.",
     "content": "Pondok Pesantren Pulo Melati kembali menorehkan prestasi membanggakan. Sebanyak 120 santri berhasil menuntaskan hafalan Al-Qur'an 30 juz secara mutqin dan bersanad muttashil.\n\nAcara wisuda berlangsung khidmat di Masjid Jami' pondok dengan dihadiri para wali santri, dewan asatidz, serta masyarakat sekitar. Para wisudawan menjalani ujian ketat sebelum dinyatakan lulus, meliputi tes hafalan acak, kelancaran, serta ketepatan tajwid.\n\nPengasuh pondok berpesan agar para hafizh dan hafizhah senantiasa menjaga hafalan dan mengamalkan kandungan Al-Qur'an dalam kehidupan sehari-hari.",
     "published": True, "date": "2026-03-12"},
    {"id": _id(), "slug": "psb-gelombang-2-dibuka-2026", "title": "PSB Gelombang 2 TA 2026/2027 Resmi Dibuka",
     "category": "Info PSB", "image": "https://images.unsplash.com/photo-1629273229664-11fabc0becc0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
     "excerpt": "Penerimaan Santri Baru gelombang 2 untuk jenjang MTs, MA, dan Takhassus Tahfidz telah dibuka dengan kuota terbatas.",
     "content": "Panitia Penerimaan Santri Baru (PSB) Pondok Pesantren Pulo Melati mengumumkan pembukaan pendaftaran gelombang 2 untuk Tahun Ajaran 2026/2027.\n\nPendaftaran dibuka mulai 1 Februari hingga 30 April 2026 untuk jenjang MTs, MA Sains & Humaniora, serta program Takhassus Tahfidz 30 Juz. Kuota asrama sangat terbatas, sehingga calon wali santri diimbau untuk segera mendaftar melalui formulir PSB online.\n\nProses pendaftaran kini lebih mudah, cukup mengisi formulir daring dan mengunggah berkas persyaratan. Panitia akan mengonfirmasi jadwal tes melalui WhatsApp.",
     "published": True, "date": "2026-02-01"},
    {"id": _id(), "slug": "lomba-pidato-tiga-bahasa", "title": "Santri Raih Juara Lomba Pidato Tiga Bahasa Tingkat Provinsi",
     "category": "Prestasi", "image": "https://images.unsplash.com/photo-1589995635011-078e0bb91d11?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
     "excerpt": "Dua santri Pulo Melati memborong juara pertama lomba pidato Bahasa Arab dan Bahasa Inggris tingkat provinsi.",
     "content": "Prestasi gemilang kembali diraih santri Pondok Pesantren Pulo Melati. Dalam ajang lomba pidato tiga bahasa tingkat provinsi, dua santri berhasil menyabet juara pertama untuk kategori Bahasa Arab dan Bahasa Inggris.\n\nKeberhasilan ini merupakan buah dari pembinaan bahasa yang intensif melalui program muhadatsah harian. Pondok menargetkan seluruh santri mampu berkomunikasi aktif dalam dua bahasa internasional.",
     "published": True, "date": "2026-01-20"},
]

FACILITIES = [
    "Masjid Jami' Berkapasitas 2.000 Jamaah",
    "Asrama Santri Putra & Putri Terpisah & Berpagar Asri",
    "Laboratorium Komputer & Bahasa Digital",
    "Perpustakaan Khazanah Turats & Buku Modern",
    "Poskestren (Pos Kesehatan Pesantren) Siaga 24 Jam",
    "Sarana Olahraga: Lapangan Futsal, Voli, Memanah & Silat",
]

DAILY_ACTIVITIES = [
    {"time": "03.30 - 04.30", "activity": "Qiyamul Lail, Muraja'ah Tahfidz & Sholat Subuh Berjamaah"},
    {"time": "05.00 - 06.30", "activity": "Kajian Kitab Kuning Pagi / Halaqah Sorogan"},
    {"time": "07.00 - 14.30", "activity": "Kegiatan Belajar Formal Madrasah (MTs/MA)"},
    {"time": "15.30 - 17.00", "activity": "Ekstrakurikuler, Muhadatsah Bahasa, & Olahraga"},
    {"time": "18.00 - 20.30", "activity": "Maghrib, Dzikir Ratib, Halaqah Qur'an, Isya & Sorogan Malam"},
    {"time": "21.00 - 22.00", "activity": "Belajar Mandiri / Ta'lim, Istirahat Santri"},
]

PSB_SETTINGS = {
    "key": "psb",
    "schedules": [
        {"gelombang": "Gelombang 1 (Jalur Prestasi & Beasiswa)", "periode": "1 Nov 2025 - 31 Jan 2026", "status": "Selesai", "kuota": "120 Santri"},
        {"gelombang": "Gelombang 2 (Reguler)", "periode": "1 Feb 2026 - 30 Apr 2026", "status": "Dibuka Sekarang", "kuota": "180 Santri (Sisa 42 Kursi)"},
        {"gelombang": "Gelombang 3 (Sisa Kuota)", "periode": "1 Mei 2026 - 20 Jun 2026", "status": "Akan Datang", "kuota": "Jika kuota masih tersedia"},
    ],
    "registration_open": True,
    "tahapan": [
        {"step": "01", "title": "Pendaftaran Online", "desc": "Isi formulir biodata calon santri & orang tua pada formulir PSB di bawah ini."},
        {"step": "02", "title": "Verifikasi Berkas", "desc": "Panitia memvalidasi data dan mengonfirmasi jadwal tes melalui WhatsApp panitia."},
        {"step": "03", "title": "Ujian Masuk & Wawancara", "desc": "Tes membaca Al-Qur'an, dasar bahasa & wawancara komitmen orang tua (online/offline)."},
        {"step": "04", "title": "Pengumuman & Daftar Ulang", "desc": "Pengumuman kelulusan serta penyelesaian administrasi seragam & asrama."},
    ],
    "biaya_table": [
        {"komponen": "Infaq Pembangunan Asrama & Sarpras", "biaya": "Rp 3.500.000", "keterangan": "Hanya saat awal masuk (dapat diangsur 3x)"},
        {"komponen": "Seragam Lengkap (5 Stel + Atribut)", "biaya": "Rp 950.000", "keterangan": "Baju koko, gamis/jilbab, pramuka, olahraga, batik"},
        {"komponen": "Paket Kitab Pelajaran & Buku Modul Setahun", "biaya": "Rp 750.000", "keterangan": "Kitab matan, kamus, dan buku kurikulum Kemenag"},
        {"komponen": "SPP Bulanan (Makan 3x, Asrama, Listrik, Pendidikan)", "biaya": "Rp 850.000 / bln", "keterangan": "Semua fasilitas asrama, laundry ringan, dan pembinaan"},
    ],
    "calculator_options": [
        {"program": "MTs Pulo Melati (Reguler)", "base": 6050000},
        {"program": "MA Sains & Agama (Reguler)", "base": 6350000},
        {"program": "Takhassus Tahfidz 30 Juz", "base": 5850000},
    ],
    "whatsapp_number": "6281234567890",
    "profil_text": "Pondok Pesantren Pulo Melati didirikan atas restu para sesepuh ulama Nusantara dengan komitmen melahirkan santri yang tafaqquh fiddin, mandiri, dan berwawasan masa depan. Memadukan kedalaman kajian Turats Salafiyah dengan keunggulan sains modern.",
    "visi": "Menjadi episentrum peradaban santri yang kokoh dalam tauhid, mutqin dalam Al-Qur'an, unggul dalam adab dan sains, serta memimpin perubahan ummat.",
    "misi_points": [
        "Menyelenggarakan halaqah Tahfidzul Qur'an 30 Juz bersanad muttashil.",
        "Mengkaji kitab-kitab turats mu'tabarah secara komprehensif (nahwu, sharaf, fiqh, tasawwuf).",
        "Menanamkan budaya bilingual (Arab & Inggris) sebagai bahasa komunikasi harian.",
        "Membekali santri dengan kecakapan teknologi, kepemimpinan, dan kewirausahaan mandiri.",
    ],
    "facilities": FACILITIES,
    "daily_activities": DAILY_ACTIVITIES,
}


async def seed_content(db):
    now = datetime.now(timezone.utc).isoformat()
    if await db.stats.count_documents({}) == 0:
        await db.stats.insert_many([{**s} for s in STATS])
    if await db.programs.count_documents({}) == 0:
        await db.programs.insert_many([{**p} for p in PROGRAMS])
    if await db.gallery.count_documents({}) == 0:
        await db.gallery.insert_many([{**g, "created_at": now} for g in GALLERY])
    if await db.teachers.count_documents({}) == 0:
        await db.teachers.insert_many([{**t} for t in TEACHERS])
    if await db.testimonials.count_documents({}) == 0:
        await db.testimonials.insert_many([{**t} for t in TESTIMONIALS])
    if await db.news.count_documents({}) == 0:
        await db.news.insert_many([{**n, "created_at": now} for n in NEWS])
    if await db.settings.count_documents({"key": "psb"}) == 0:
        await db.settings.insert_one({**PSB_SETTINGS})
