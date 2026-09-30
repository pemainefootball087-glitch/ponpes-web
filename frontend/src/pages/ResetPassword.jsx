import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Kata sandi minimal 6 karakter.");
    if (password !== confirm) return setError("Konfirmasi kata sandi tidak cocok.");
    setLoading(true); setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Kata sandi berhasil diperbarui. Silakan masuk.");
      navigate("/admin/login", { replace: true });
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail) || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary bg-grain p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="font-serif font-bold text-2xl text-slate-900">Reset Kata Sandi</h1>
        {!token ? (
          <p className="text-sm text-destructive mt-2">Token reset tidak ditemukan. Mohon gunakan tautan dari email Anda.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="text-sm">Kata Sandi Baru</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" placeholder="••••••••" />
            </div>
            <div>
              <Label className="text-sm">Konfirmasi Kata Sandi</Label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5" placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-11">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Perbarui Kata Sandi"}
            </Button>
          </form>
        )}
        <Link to="/admin/login" className="block text-center text-xs text-muted-foreground hover:text-primary mt-4">← Kembali ke Masuk</Link>
      </div>
    </div>
  );
}
