import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, formatApiError } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/admin", { replace: true }); }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail) || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-primary bg-grain">
      <div className="hidden lg:flex flex-col justify-between p-12 w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1698967406711-ede239b6c07e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <Link to="/" className="relative flex items-center gap-3 text-white z-10">
          <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-gold/40"><Moon className="h-5 w-5 text-gold -rotate-12" /></div>
          <span className="font-serif font-bold text-lg">Pulo Melati</span>
        </Link>
        <div className="relative z-10 text-white max-w-md">
          <h2 className="font-serif text-4xl font-bold leading-tight">Portal Panitia PSB & Admin</h2>
          <p className="mt-4 text-white/70">Kelola pendaftar santri baru, berita, galeri, program, dan konten pesantren dalam satu dasbor.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-3.5 w-3.5" /> Beranda</Link>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Masuk Dasbor</h1>
          <p className="text-sm text-muted-foreground mt-1">Silakan masuk dengan akun admin.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="text-sm">Email</Label>
              <Input data-testid="admin-login-username-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pulomelati.sch.id" className="mt-1.5" autoComplete="username" />
            </div>
            <div>
              <Label className="text-sm">Kata Sandi</Label>
              <Input data-testid="admin-login-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" autoComplete="current-password" />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
            <Button data-testid="admin-login-submit-button" type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-11">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
            </Button>
            <Link to="/forgot-password" className="block text-center text-xs text-muted-foreground hover:text-primary">Lupa kata sandi?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
