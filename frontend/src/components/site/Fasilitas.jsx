import { Building2, CheckCircle2, Sun } from "lucide-react";

export function Fasilitas({ settings }) {
  if (!settings) return null;
  return (
    <section id="fasilitas" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-secondary border border-primary/10 px-3 py-1 rounded-full inline-block">
            Fasilitas Pesantren
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Lingkungan Asri & Sarana Lengkap
          </h2>
          <p className="mt-4 text-muted-foreground">Menunjang tumbuh kembang santri secara ruhiyah, jasadiyah, dan fikriyah.</p>
          <div className="mt-8 grid gap-3">
            {settings.facilities?.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-border p-4 hover:border-primary/25 hover:shadow-sm transition-all">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-slate-800">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="kegiatan" className="rounded-3xl bg-primary bg-grain p-7 sm:p-9 text-white h-fit">
          <div className="flex items-center gap-2 text-gold font-semibold mb-6">
            <Sun className="h-5 w-5" /> Ritme Harian Santri
          </div>
          <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/20">
            {settings.daily_activities?.map((a, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-gold ring-4 ring-primary" />
                <div className="text-gold text-xs font-semibold tracking-wide">{a.time}</div>
                <div className="text-sm text-white/85 mt-0.5">{a.activity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
