import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { id: "profil", label: "Profil & Visi", testid: "nav-link-profil" },
  { id: "program", label: "Lembaga & Program", testid: "nav-link-program" },
  { id: "fasilitas", label: "Fasilitas", testid: "nav-link-fasilitas" },
  { id: "galeri", label: "Galeri", testid: "nav-link-galeri" },
  { id: "berita", label: "Berita", testid: "nav-link-berita" },
  { id: "psb", label: "Biaya & Jadwal PSB", testid: "nav-link-psb" },
  { id: "kontak", label: "Kontak", testid: "nav-link-kontak" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl border-b border-primary/10 shadow-sm" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-[72px]">
        <Link to="/" data-testid="nav-brand-logo" className="flex items-center gap-3 shrink-0" onClick={() => window.scrollTo({ top: 0 })}>
          <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center ring-2 ring-gold/40 shrink-0">
            <Moon className="h-5 w-5 text-gold -rotate-12" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <div className="font-serif font-bold text-primary text-[15px] sm:text-base">Pondok Pesantren Pulo Melati</div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground tracking-wide">Membina Generasi Qur'ani Berakhlak Mulia</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={l.testid}
              onClick={() => go(l.id)}
              className="px-3 py-2 text-[13px] font-medium text-slate-700 hover:text-primary rounded-lg hover:bg-secondary transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            data-testid="nav-admin-login-link"
            onClick={() => navigate("/admin/login")}
            className="hidden sm:inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary px-2.5 py-2 rounded-lg transition-colors"
            title="Portal Admin"
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </button>
          <Button
            data-testid="nav-daftar-cta"
            onClick={() => go("psb")}
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 ring-1 ring-gold/30 hover:ring-gold/60 transition-all"
          >
            Daftar PSB 2026/2027
          </Button>
          <button className="lg:hidden p-2 text-primary" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle" aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-primary/10 px-4 py-3 space-y-1 animate-fade-up">
          {LINKS.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-secondary font-medium">
              {l.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button onClick={() => go("psb")} className="w-full bg-primary text-primary-foreground rounded-full">Daftar PSB 2026/2027</Button>
            <Button variant="outline" onClick={() => navigate("/admin/login")} className="w-full rounded-full">Portal Admin</Button>
          </div>
        </div>
      )}
    </header>
  );
}
