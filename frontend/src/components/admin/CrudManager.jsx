import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export function CrudManager({ title, endpoint, listUrl, fields, columns, addTestId, imageField }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(listUrl);
      setItems(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [listUrl]);

  const openAdd = () => {
    const init = {};
    fields.forEach((f) => (init[f.name] = f.type === "number" ? 0 : ""));
    setForm(init); setEditing(null); setDialogOpen(true);
  };

  const openEdit = async (item) => {
    let full = item;
    if (endpoint === "news" && item.slug) {
      try { full = (await api.get(`/news/${item.slug}`)).data; } catch { /* ignore */ }
    }
    setForm({ ...full }); setEditing(full); setDialogOpen(true);
  };

  const save = async () => {
    for (const f of fields) if (f.required && !String(form[f.name] ?? "").trim()) return toast.error(`Kolom "${f.label}" wajib diisi`);
    setSaving(true);
    try {
      const payload = { ...form };
      fields.forEach((f) => { if (f.type === "number") payload[f.name] = Number(payload[f.name]) || 0; });
      if (editing) await api.put(`/admin/${endpoint}/${editing.id}`, payload);
      else await api.post(`/admin/${endpoint}`, payload);
      toast.success(editing ? "Berhasil diperbarui" : "Berhasil ditambahkan");
      setDialogOpen(false); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setSaving(false); }
  };

  const remove = async (id) => {
    try { await api.delete(`/admin/${endpoint}/${id}`); toast.success("Item dihapus"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">{title}</h2>
          <p className="text-sm text-muted-foreground">{items.length} item</p>
        </div>
        <Button data-testid={addTestId} onClick={openAdd} className="bg-primary text-primary-foreground rounded-full"><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white border border-border p-4 flex flex-col">
              {imageField && item[imageField] && (
                <img src={item[imageField]} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
              )}
              <div className="flex-1 space-y-1">
                {columns.map((c) => (
                  <div key={c.key} className={c.primary ? "font-semibold text-slate-900 text-sm" : "text-xs text-muted-foreground line-clamp-2"}>
                    {c.prefix}{item[c.key]}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-lg text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus item ini?</AlertDialogTitle>
                      <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => remove(item.id)}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-muted-foreground text-sm col-span-full py-8 text-center">Belum ada data. Klik Tambah untuk membuat.</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-serif">{editing ? "Edit" : "Tambah"} {title}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {fields.map((f) => (
              <div key={f.name}>
                <Label className="text-sm">{f.label}{f.required && " *"}</Label>
                {f.type === "textarea" ? (
                  <Textarea value={form[f.name] || ""} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} className="mt-1.5" rows={f.rows || 3} placeholder={f.placeholder} />
                ) : f.type === "select" ? (
                  <Select value={form[f.name] || ""} onValueChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent>{f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <Input type={f.type} value={form[f.name] ?? ""} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} className="mt-1.5" placeholder={f.placeholder} />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={save} disabled={saving} className="bg-primary text-primary-foreground">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
