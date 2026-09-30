import { useEffect, useState, useCallback } from "react";
import api, { API, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, MessageCircle, FileText, Eye, Loader2, AlertTriangle } from "lucide-react";

const STATUSES = ["Pending", "Terverifikasi", "Ujian Masuk", "Diterima", "Ditolak"];
const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700",
  Terverifikasi: "bg-blue-100 text-blue-700",
  "Ujian Masuk": "bg-violet-100 text-violet-700",
  Diterima: "bg-emerald-100 text-emerald-700",
  Ditolak: "bg-red-100 text-red-700",
};

export function PsbTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Semua");
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (status !== "Semua") params.status = status;
      const { data } = await api.get("/admin/registrations", { params });
      setRows(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [q, status]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/registrations/${id}/status`, { status: newStatus });
      setRows((r) => r.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
      toast.success("Status diperbarui");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const chatWa = (row) => {
    const msg = encodeURIComponent(`Assalamu'alaikum ${row.nama_wali}, kami Panitia PSB Pondok Pesantren Pulo Melati terkait pendaftaran ananda ${row.nama_lengkap} (${row.reg_no}).`);
    window.open(`https://wa.me/${row.nomor_whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">Pendaftar PSB</h2>
          <p className="text-sm text-muted-foreground">{rows.length} pendaftar</p>
        </div>
        <Button onClick={() => window.open(`${API}/admin/registrations/export`, "_blank")} variant="outline" className="rounded-full">
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input data-testid="admin-psb-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / WhatsApp / no. pendaftaran" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger data-testid="admin-psb-status-filter" className="sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Status</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">No. Pendaftaran</th>
                <th className="px-4 py-3 font-semibold">Calon Santri</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Program</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} data-testid={`psb-row-${r.reg_no}`} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-mono font-semibold text-primary text-xs flex items-center gap-1">
                      {r.reg_no}
                      {r.is_duplicate && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" title="Kemungkinan duplikat" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{r.nama_lengkap}</div>
                    <div className="text-xs text-muted-foreground">{r.nomor_whatsapp}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600">{r.program_tujuan}</td>
                  <td className="px-4 py-3">
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                      <SelectTrigger data-testid="admin-psb-status-select" className={`h-8 w-36 text-xs border-0 font-semibold ${STATUS_STYLE[r.status] || ""}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button size="icon" variant="ghost" className="h-8 w-8" title="Detail" onClick={() => setDetail(r)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25D366]" title="WhatsApp" onClick={() => chatWa(r)}><MessageCircle className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Belum ada pendaftar.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">{detail?.nama_lengkap} — {detail?.reg_no}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-2 text-sm">
              <Row k="NIK" v={detail.nik} />
              <Row k="Jenis Kelamin" v={detail.jenis_kelamin} />
              <Row k="TTL" v={detail.tempat_tanggal_lahir} />
              <Row k="Program" v={detail.program_tujuan} />
              <Row k="Asal Sekolah" v={detail.asal_sekolah} />
              <Row k="Wali" v={detail.nama_wali} />
              <Row k="WhatsApp" v={detail.nomor_whatsapp} />
              <Row k="Alamat" v={detail.alamat_domisili} />
              <Row k="Hafalan" v={detail.hafalan_sekarang} />
              <Row k="Catatan" v={detail.catatan_kesehatan || "-"} />
              <div className="pt-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Berkas Terunggah</div>
                {detail.documents?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {detail.documents.map((d, i) => (
                      <button key={i} onClick={() => window.open(`${API}/files/${d.path}`, "_blank")} className="inline-flex items-center gap-1.5 text-xs bg-secondary border border-border rounded-lg px-3 py-2 hover:border-primary/40">
                        <FileText className="h-3.5 w-3.5 text-primary" /> {d.label || d.filename}
                      </button>
                    ))}
                  </div>
                ) : <p className="text-xs text-muted-foreground">Tidak ada berkas.</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex gap-3 border-b border-border/60 py-1.5">
      <span className="w-28 shrink-0 text-muted-foreground text-xs">{k}</span>
      <span className="text-slate-800">{v}</span>
    </div>
  );
}
