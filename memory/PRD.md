# PRD — Pondok Pesantren Pulo Melati (Company Profile + PSB)

## Original Problem Statement
Web-based school profile + online student registration (Penerimaan Santri Baru) for Pondok Pesantren Pulo Melati, with a JWT-secured admin dashboard for managing content and applicants. Stack: React + FastAPI + MongoDB + Object Storage. Indonesian language, mobile-first. WhatsApp via wa.me deep-links. Biaya offline (info only).

## User Personas
- **Public (mobile-heavy):** calon santri & wali santri, alumni, community — browse profile/program/berita, register for PSB.
- **Admin (panitia PSB):** manage registrations (status workflow) and site content (berita, galeri, program, pengajar, testimoni, statistik).

## Architecture
- **Backend** `/app/backend`: `server.py` (public + admin API, /api prefix, upload/download, PSB register), `auth.py` (JWT cookie auth, brute-force, password reset, admin seed), `storage.py` (Emergent Object Storage), `seed_data.py` (initial content).
- **Frontend** `/app/frontend/src`: `pages/` (LandingPage, BeritaDetail, AdminLogin, AdminDashboard, Forgot/ResetPassword), `components/site/` (Navbar, Hero, Stats, Profil, Programs, Fasilitas, Gallery, Berita, PSB, Pengajar, Testimoni, Kontak, Footer, WhatsappFab), `components/admin/` (PsbTable, CrudManager), `context/AuthContext`, `lib/api`.
- **DB collections:** users, registrations, news, gallery, programs, teachers, testimonials, stats, settings, files, counters, login_attempts, password_reset_tokens/requests.

## Core Requirements (static)
- Public single landing page + `/berita/:slug` detail routes.
- Animated stat counters; filterable gallery (Semua/Kegiatan/Santri/Fasilitas/Acara).
- PSB: gelombang schedule, tahapan, biaya table, fee calculator, validated registration form with optional jpg/png/pdf uploads (5MB, magic-byte checked), success dialog + reg_no + WhatsApp handoff.
- Admin JWT auth; every admin route protected server-side; CRUD for all content; PSB view/filter/search/status/export/doc-view.
- Edge cases: honeypot + IP rate-limit on public form, duplicate flagging, UTF-8, registration open/closed by settings.

## Implemented (2026-06 — first MVP)
- ✅ Full public landing page with all sections + design system (forest green/gold, Cormorant Garamond + Plus Jakarta Sans).
- ✅ Berita list + detail pages.
- ✅ PSB registration (validation, honeypot, IP rate-limit, dup flag, atomic reg_no counter) + Object Storage uploads (strict validation).
- ✅ JWT admin auth (login/me/logout/refresh + forgot/reset password + brute force), admin seeded as frafa1349@gmail.com.
- ✅ Admin dashboard: PSB table (search/filter/status/export CSV/view docs/WhatsApp) + CRUD for berita/galeri/program/pengajar/testimoni + stats editor.
- ✅ Tested: 36/36 backend pytest pass, frontend flows pass (iteration_1.json).

## Backlog / Remaining
- **P1:** Persist PSB rate-limit to DB/Redis (currently in-process, per-worker).
- **P2:** Editable PSB settings (gelombang/biaya/tahapan) UI in admin (endpoint exists, no dedicated form yet).
- **P2:** Admin image upload for berita/galeri/pengajar (currently URL paste).
- **P2:** Printable Tanda Bukti Pendaftaran PDF.
- **P3:** Optional Twilio WhatsApp automation; online payment (Midtrans/Stripe); multi-role admin.

## Next Tasks
- Await user feedback; prioritize admin PSB-settings editor and image upload if requested.
