import { useState } from "react";
import { Link } from "react-router-dom";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail) || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary bg-grain p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4"><MailCheck className="h-7 w-7 text-emerald-600" /></div>
            <h1 className="font-serif font-bold text-2xl text-slate-900">Periksa Email Anda</h1>
            <p className="text-sm text-muted-foreground mt-2">Jika email terdaftar, tautan reset kata sandi telah dikirim. Tautan berlaku 1 jam.</p>
            <Link to="/admin/login" className="inline-block mt-6 text-sm text-primary font-semibold">← Kembali ke Masuk</Link>
          </div>
        ) : (
          <>
            <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-3.5 w-3.5" /> Kembali</Link>
            <h1 className="font-serif font-bold text-2xl text-slate-900">Lupa Kata Sandi</h1>
            <p className="text-sm text-muted-foreground mt-1">Masukkan email admin untuk menerima tautan reset.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label className="text-sm">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pulomelati.sch.id" className="mt-1.5" required />
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-11">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kirim Tautan Reset"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
