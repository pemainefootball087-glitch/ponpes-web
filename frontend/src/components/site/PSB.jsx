import { useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Upload, Loader2, CircleDot, CalendarClock, MessageCircle, FileText, X } from "lucide-react";

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

function StatusBadge({ status }) {
  const map = {
    "Dibuka Sekarang": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Akan Datang": "bg-amber-100 text-amber-700 border-amber-200",
    "Selesai": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span data-testid="psb-gelombang-badge" className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${map[status] || map.Selesai}`}>
      {status}
    </span>
  );
}

const DOC_FIELDS = [
  { key: "pas_foto", label: "Pas Foto 3x4" },
  { key: "ijazah", label: "Ijazah / SKL" },
  { key: "kk", label: "Kartu Keluarga (KK)" },
];

export function PSB({ settings }) {
  const open = settings?.registration_open;
  const [form, setForm] = useState({
    nama_lengkap: "", nik: "", jenis_kelamin: "", tempat_tanggal_lahir: "",
    program_tujuan: "", asal_sekolah: "", nama_wali: "", nomor_whatsapp: "",
    alamat_domisili: "", hafalan_sekarang: "", catatan_kesehatan: "", website: "",
  });
  const [docs, setDocs] = useState({});
  const [uploading, setUploading] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [calc, setCalc] = useState(settings?.calculator_options?.[0]?.program || "");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const calcBase = settings?.calculator_options?.find((o) => o.program === calc)?.base || 0;

  const onFile = async (key, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Ukuran file maksimal 5MB");
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setDocs((d) => ({ ...d, [key]: { ...data, label: DOC_FIELDS.find((f) => f.key === key)?.label } }));
      toast.success(`${DOC_FIELDS.find((f) => f.key === key)?.label} terunggah`);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setUploading("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const required = ["nama_lengkap", "nik", "jenis_kelamin", "tempat_tanggal_lahir", "program_tujuan", "asal_sekolah", "nama_wali", "nomor_whatsapp", "alamat_domisili", "hafalan_sekarang"];
    for (const r of required) if (!form[r]) return toast.error("Mohon lengkapi semua kolom bertanda wajib.");
    if (form.nik.replace(/\D/g, "").length !== 16) return toast.error("NIK harus 16 digit angka.");
    setSubmitting(true);
    try {
      const payload = { ...form, documents: Object.values(docs).map((d) => ({ id: d.id, path: d.path, filename: d.filename, label: d.label })) };
      const { data } = await api.post("/psb/register", payload);
      setSuccess(data);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  const waConfirm = () => {
    const wa = success?.whatsapp_number || settings?.whatsapp_number || "6281234567890";
    const msg = encodeURIComponent(
      `Assalamu'alaikum Panitia PSB Pondok Pesantren Pulo Melati.\nSaya telah mendaftar santri baru:\n\nNo. Pendaftaran: ${success?.reg_no}\nNama: ${success?.nama_lengkap}\n\nMohon konfirmasi tahap selanjutnya. Jazakumullah khairan.`
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <section id="psb" className="py-20 sm:py-28 bg-secondary/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-white border border-primary/10 px-3 py-1 rounded-full inline-block">
            Penerimaan Santri Baru
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            PSB Online 2026/2027
          </h2>
          <p className="mt-4 text-muted-foreground">Jadwal gelombang, persyaratan, estimasi biaya, dan formulir pendaftaran daring.</p>
        </div>

        {/* Gelombang */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {settings?.schedules?.map((s, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${s.status === "Dibuka Sekarang" ? "bg-primary text-white border-primary shadow-lg" : "bg-white border-border"}`}>
              <div className="flex items-center justify-between">
                <CalendarClock className={`h-5 w-5 ${s.status === "Dibuka Sekarang" ? "text-gold" : "text-primary"}`} />
                <StatusBadge status={s.status} />
              </div>
              <h3 className={`mt-3 font-serif font-bold text-lg ${s.status === "Dibuka Sekarang" ? "text-white" : "text-slate-900"}`}>{s.gelombang}</h3>
              <div className={`text-sm mt-1 ${s.status === "Dibuka Sekarang" ? "text-white/80" : "text-muted-foreground"}`}>{s.periode}</div>
              <div className={`text-xs mt-3 pt-3 border-t ${s.status === "Dibuka Sekarang" ? "border-white/15 text-gold" : "border-border text-primary font-medium"}`}>Kuota: {s.kuota}</div>
            </div>
          ))}
        </div>

        {/* Tahapan */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings?.tahapan?.map((t) => (
            <div key={t.step} className="rounded-2xl bg-white border border-border p-6 relative overflow-hidden">
              <div className="font-serif font-bold text-4xl text-gold/25 absolute top-3 right-4">{t.step}</div>
              <CircleDot className="h-5 w-5 text-primary" />
              <h4 className="mt-3 font-semibold text-slate-900">{t.title}</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Biaya + Calculator */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/50">
              <h3 className="font-serif font-bold text-xl text-slate-900">Rincian Biaya Pendidikan</h3>
            </div>
            <div className="divide-y divide-border">
              {settings?.biaya_table?.map((b, i) => (
                <div key={i} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{b.komponen}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{b.keterangan}</div>
                  </div>
                  <div className="font-serif font-bold text-primary whitespace-nowrap">{b.biaya}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-primary bg-grain p-6 text-white">
            <h3 className="font-serif font-bold text-lg text-gold">Simulasi Biaya Awal Masuk</h3>
            <p className="text-xs text-white/60 mt-1">Estimasi total pembayaran pertama.</p>
            <div className="mt-5">
              <Label className="text-white/70 text-xs">Pilih Program</Label>
              <Select value={calc} onValueChange={setCalc}>
                <SelectTrigger data-testid="psb-calculator-select" className="mt-1.5 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Pilih program" />
                </SelectTrigger>
                <SelectContent>
                  {settings?.calculator_options?.map((o) => (
                    <SelectItem key={o.program} value={o.program}>{o.program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 pt-5 border-t border-white/15">
              <div className="text-xs text-white/60">Estimasi Total</div>
              <div className="font-serif font-bold text-3xl text-white mt-1">{rupiah(calcBase)}</div>
              <div className="text-[11px] text-gold mt-2">*Infaq pembangunan dapat diangsur hingga 3x.</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-10 rounded-[2rem] bg-white border border-border p-6 sm:p-10 max-w-4xl mx-auto">
          <h3 className="font-serif font-bold text-2xl text-slate-900 text-center">Formulir Pendaftaran Santri Baru</h3>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {open ? "Lengkapi data berikut. Kolom bertanda * wajib diisi." : "Pendaftaran gelombang aktif sedang ditutup."}
          </p>

          {!open ? (
            <div className="mt-8 text-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 p-6 text-sm">
              Mohon maaf, saat ini tidak ada gelombang PSB yang dibuka. Silakan pantau pengumuman atau hubungi panitia via WhatsApp.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 grid sm:grid-cols-2 gap-5">
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden />

              <Field label="Nama Lengkap Calon Santri *"><Input data-testid="psb-form-nama-lengkap" value={form.nama_lengkap} onChange={(e) => set("nama_lengkap", e.target.value)} placeholder="Muhammad Fayyadh Al-Farisi" /></Field>
              <Field label="NIK Calon Santri *"><Input data-testid="psb-form-nik" value={form.nik} onChange={(e) => set("nik", e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="16 digit NIK sesuai KK" /></Field>

              <Field label="Jenis Kelamin *">
                <Select value={form.jenis_kelamin} onValueChange={(v) => set("jenis_kelamin", v)}>
                  <SelectTrigger data-testid="psb-form-jenis-kelamin"><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki (Santriawan)">Laki-laki (Santriawan)</SelectItem>
                    <SelectItem value="Perempuan (Santriwati)">Perempuan (Santriwati)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tempat & Tanggal Lahir *"><Input value={form.tempat_tanggal_lahir} onChange={(e) => set("tempat_tanggal_lahir", e.target.value)} placeholder="Jakarta, 14 Mei 2012" /></Field>

              <Field label="Jenjang Program yang Dituju *">
                <Select value={form.program_tujuan} onValueChange={(v) => set("program_tujuan", v)}>
                  <SelectTrigger data-testid="psb-form-program"><SelectValue placeholder="Pilih program" /></SelectTrigger>
                  <SelectContent>
                    {["MTs Pulo Melati", "MA Sains & Humaniora", "Takhassus Tahfidz 30 Juz", "KMI (Kulliyatul Muallimin)"].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Asal Sekolah / Madrasah *"><Input value={form.asal_sekolah} onChange={(e) => set("asal_sekolah", e.target.value)} placeholder="SDN Pulo Gebang 01 / MI Nurul Huda" /></Field>

              <Field label="Nama Ayah / Ibu / Wali *"><Input data-testid="psb-form-wali" value={form.nama_wali} onChange={(e) => set("nama_wali", e.target.value)} placeholder="Nama orang tua/wali santri" /></Field>
              <Field label="Nomor WhatsApp Wali (Aktif) *"><Input data-testid="psb-form-whatsapp" value={form.nomor_whatsapp} onChange={(e) => set("nomor_whatsapp", e.target.value)} placeholder="081234567890" /></Field>

              <Field label="Capaian Hafalan Al-Qur'an Terakhir *" full={false}>
                <Select value={form.hafalan_sekarang} onValueChange={(v) => set("hafalan_sekarang", v)}>
                  <SelectTrigger data-testid="psb-form-hafalan"><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    {["Belum ada (Baru Iqro/Juz Amma)", "1 - 2 Juz", "3 - 5 Juz", "Lebih dari 5 Juz"].map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Riwayat Alergi / Catatan Khusus (Opsional)"><Input value={form.catatan_kesehatan} onChange={(e) => set("catatan_kesehatan", e.target.value)} placeholder="Asma, alergi makanan, dll." /></Field>

              <div className="sm:col-span-2">
                <Label className="text-sm font-medium text-slate-700">Alamat Lengkap Domisili *</Label>
                <Textarea data-testid="psb-form-alamat" value={form.alamat_domisili} onChange={(e) => set("alamat_domisili", e.target.value)} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi" className="mt-1.5" rows={3} />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm font-medium text-slate-700">Unggah Berkas (Opsional — JPG/PNG/PDF, maks 5MB)</Label>
                <div className="mt-2 grid sm:grid-cols-3 gap-3">
                  {DOC_FIELDS.map((d) => (
                    <div key={d.key}>
                      <input id={`file-${d.key}`} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => onFile(d.key, e.target.files?.[0])} />
                      {docs[d.key] ? (
                        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-xs">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate flex-1 text-slate-700">{d.label}</span>
                          <button type="button" onClick={() => setDocs((x) => { const n = { ...x }; delete n[d.key]; return n; })}><X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button>
                        </div>
                      ) : (
                        <label htmlFor={`file-${d.key}`} className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground cursor-pointer hover:border-primary/40 hover:bg-secondary/50 transition-colors">
                          {uploading === d.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          <span className="truncate">{d.label}</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 mt-2">
                <Button data-testid="psb-submit-registration-button" type="submit" disabled={submitting} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-13 text-base ring-1 ring-gold/30">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kirim Pendaftaran Santri Baru"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Dialog open={!!success} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent data-testid="psb-success-dialog" className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <DialogTitle className="font-serif text-2xl text-center">Pendaftaran Berhasil!</DialogTitle>
            <DialogDescription className="text-center">
              Jazakumullah khairan, {success?.nama_lengkap}. Data Anda telah kami terima.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl bg-secondary border border-border py-4">
            <div className="text-xs text-muted-foreground">Nomor Pendaftaran Anda</div>
            <div className="font-serif font-bold text-2xl text-primary tracking-wide">{success?.reg_no}</div>
          </div>
          {success?.is_duplicate && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Catatan: nama/WhatsApp mirip dengan pendaftaran sebelumnya. Panitia akan memverifikasi.
            </p>
          )}
          <p className="text-sm text-muted-foreground">Silakan konfirmasi ke panitia melalui WhatsApp untuk mempercepat verifikasi berkas.</p>
          <Button data-testid="psb-success-whatsapp-button" onClick={waConfirm} className="bg-[#25D366] hover:bg-[#1eb257] text-white rounded-full h-12">
            <MessageCircle className="mr-2 h-5 w-5" /> Kirim Notifikasi via WhatsApp
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
