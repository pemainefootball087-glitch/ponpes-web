import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

export function Hero({ settings }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const pill = settings?.schedules?.find((s) => s.status === "Dibuka Sekarang");
  return (
    <section id="beranda" className="relative min-h-[100svh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Masjid Pondok Pesantren" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b201a] via-[#0b201a]/90 to-[#0b201a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b201a] via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 px-4 py-1.5 text-gold text-xs sm:text-sm font-medium mb-6 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" />
            {pill ? `${pill.gelombang} • ${pill.kuota}` : "Gelombang 2 PSB Dibuka • Kuota Terbatas"}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.08] tracking-tight text-balance animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Mendidik Karakter Qur'ani, Mengakar Tradisi, Membuka Cakrawala Dunia
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Penerimaan Santri Baru Tahun Ajaran 2026/2027 telah dibuka. Bergabunglah bersama 1.250+ santri dalam perpaduan kurikulum Tahfidz, Kitab Kuning, Sains, dan Bahasa Internasional di lingkungan asri Pulo Melati.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button
              data-testid="hero-register-cta-button"
              onClick={() => go("psb")}
              size="lg"
              className="bg-gold hover:bg-gold/90 text-white rounded-full px-7 h-13 text-base shadow-lg shadow-gold/25 group"
            >
              Daftar Santri Baru (PSB Online)
              <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              data-testid="hero-explore-cta-button"
              onClick={() => go("profil")}
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-13 text-base bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm"
            >
              <BookOpen className="mr-1 h-5 w-5" /> Pelajari Profil & Kurikulum
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
