import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CrudManager } from "@/components/admin/CrudManager";
import { PsbTable } from "@/components/admin/PsbTable";
import { Moon, LogOut, Users, Newspaper, Image, GraduationCap, UserSquare2, MessageSquareQuote, BarChart3, Loader2, ExternalLink } from "lucide-react";

function StatsEditor() {
  const [stats, setStats] = useState([]);
  const [saving, setSaving] = useState("");
  useEffect(() => { api.get("/content/stats").then((r) => setStats(r.data)).catch(() => {}); }, []);
  const save = async (s) => {
    setSaving(s.key);
    try { await api.put(`/admin/stats/${s.key}`, { value: Number(s.value) || 0, label: s.label }); toast.success("Statistik diperbarui"); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setSaving(""); }
  };
  return (
    <div>
      <h2 className="font-serif font-bold text-2xl text-slate-900 mb-5">Statistik Beranda</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s, i) => (
          <div key={s.key} className="rounded-2xl bg-white border border-border p-5">
            <Label className="text-xs text-muted-foreground">Label</Label>
            <Input value={s.label} onChange={(e) => setStats((a) => a.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="mt-1 mb-3" />
            <Label className="text-xs text-muted-foreground">Nilai (angka)</Label>
            <Input type="number" value={s.value} onChange={(e) => setStats((a) => a.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="mt-1" />
            <Button size="sm" className="mt-3 bg-primary text-primary-foreground rounded-lg" onClick={() => save(stats[i])} disabled={saving === s.key}>
              {saving === s.key ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { v: "psb", label: "Pendaftar PSB", icon: Users, testid: "admin-tab-psb" },
  { v: "berita", label: "Berita", icon: Newspaper, testid: "admin-tab-berita" },
  { v: "galeri", label: "Galeri", icon: Image, testid: "admin-tab-galeri" },
  { v: "program", label: "Program", icon: GraduationCap, testid: "admin-tab-program" },
  { v: "pengajar", label: "Pengajar", icon: UserSquare2, testid: "admin-tab-pengajar" },
  { v: "testimoni", label: "Testimoni", icon: MessageSquareQuote, testid: "admin-tab-testimoni" },
  { v: "stats", label: "Statistik", icon: BarChart3, testid: "admin-tab-stats" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("psb");
  const [counts, setCounts] = useState({ psb: 0, news: 0, gallery: 0 });

  useEffect(() => {
    document.title = "Dasbor Admin — Pulo Melati";
    Promise.all([api.get("/admin/registrations"), api.get("/news"), api.get("/content/gallery")])
      .then(([r, n, g]) => setCounts({ psb: r.data.length, news: n.data.length, gallery: g.data.length }))
      .catch(() => {});
  }, []);

  const doLogout = async () => { await logout(); navigate("/admin/login", { replace: true }); };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center ring-2 ring-gold/40"><Moon className="h-5 w-5 text-gold -rotate-12" /></div>
            <div className="leading-tight">
              <div className="font-serif font-bold text-primary text-sm">Dasbor Pulo Melati</div>
              <div className="text-[11px] text-muted-foreground">{user?.name || user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.open("/", "_blank")} className="hidden sm:inline-flex text-muted-foreground"><ExternalLink className="h-4 w-4 mr-1" /> Lihat Situs</Button>
            <Button data-testid="admin-logout-button" variant="outline" size="sm" onClick={doLogout} className="rounded-full"><LogOut className="h-4 w-4 mr-1" /> Keluar</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Pendaftar PSB", value: counts.psb, icon: Users },
            { label: "Artikel Berita", value: counts.news, icon: Newspaper },
            { label: "Foto Galeri", value: counts.gallery, icon: Image },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-white border border-border p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><m.icon className="h-5 w-5 text-primary" /></div>
              <div>
                <div className="font-serif font-bold text-2xl text-slate-900">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex flex-wrap h-auto bg-white border border-border rounded-2xl p-1.5 gap-1">
            {TABS.map((t) => (
              <TabsTrigger key={t.v} value={t.v} data-testid={t.testid} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl px-4 py-2 text-sm">
                <t.icon className="h-4 w-4 mr-1.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="psb"><PsbTable /></TabsContent>
            <TabsContent value="berita">
              <CrudManager title="Berita & Artikel" endpoint="news" listUrl="/news" addTestId="admin-add-berita-button" imageField="image"
                fields={[
                  { name: "title", label: "Judul", type: "text", required: true },
                  { name: "category", label: "Kategori", type: "select", options: ["Kegiatan", "Prestasi", "Ta'lim", "Info PSB"], required: true },
                  { name: "date", label: "Tanggal (YYYY-MM-DD)", type: "text", placeholder: "2026-06-01" },
                  { name: "image", label: "URL Gambar", type: "text", required: true },
                  { name: "excerpt", label: "Ringkasan", type: "textarea", rows: 2, required: true },
                  { name: "content", label: "Isi Artikel", type: "textarea", rows: 8, required: true },
                ]}
                columns={[{ key: "title", primary: true }, { key: "category" }, { key: "excerpt" }]} />
            </TabsContent>
            <TabsContent value="galeri">
              <CrudManager title="Galeri Foto" endpoint="gallery" listUrl="/content/gallery" addTestId="admin-add-galeri-button" imageField="image"
                fields={[
                  { name: "title", label: "Judul Foto", type: "text", required: true },
                  { name: "category", label: "Kategori", type: "select", options: ["Kegiatan", "Santri", "Fasilitas", "Acara"], required: true },
                  { name: "image", label: "URL Gambar", type: "text", required: true },
                ]}
                columns={[{ key: "title", primary: true }, { key: "category" }]} />
            </TabsContent>
            <TabsContent value="program">
              <CrudManager title="Program Pendidikan" endpoint="programs" listUrl="/content/programs" addTestId="admin-add-program-button"
                fields={[
                  { name: "name", label: "Nama Program", type: "text", required: true },
                  { name: "badge", label: "Badge (mis. Akreditasi A)", type: "text" },
                  { name: "desc", label: "Deskripsi", type: "textarea", rows: 3, required: true },
                  { name: "order", label: "Urutan", type: "number" },
                ]}
                columns={[{ key: "name", primary: true }, { key: "badge" }, { key: "desc" }]} />
            </TabsContent>
            <TabsContent value="pengajar">
              <CrudManager title="Pengasuh & Ustadz" endpoint="teachers" listUrl="/content/teachers" addTestId="admin-add-pengajar-button" imageField="image"
                fields={[
                  { name: "name", label: "Nama", type: "text", required: true },
                  { name: "role", label: "Jabatan", type: "text", required: true },
                  { name: "specialty", label: "Spesialisasi Keilmuan", type: "text" },
                  { name: "image", label: "URL Foto", type: "text", required: true },
                  { name: "order", label: "Urutan", type: "number" },
                ]}
                columns={[{ key: "name", primary: true }, { key: "role" }, { key: "specialty" }]} />
            </TabsContent>
            <TabsContent value="testimoni">
              <CrudManager title="Testimoni" endpoint="testimonials" listUrl="/content/testimonials" addTestId="admin-add-testimoni-button"
                fields={[
                  { name: "name", label: "Nama", type: "text", required: true },
                  { name: "role", label: "Peran (mis. Wali Santri)", type: "text", required: true },
                  { name: "text", label: "Isi Testimoni", type: "textarea", rows: 4, required: true },
                  { name: "order", label: "Urutan", type: "number" },
                ]}
                columns={[{ key: "name", primary: true }, { key: "role" }, { key: "text" }]} />
            </TabsContent>
            <TabsContent value="stats"><StatsEditor /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
