import { CheckCircle2, Target, Eye } from "lucide-react";

const PROFIL_IMG =
  "https://images.unsplash.com/photo-1629273229664-11fabc0becc0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000";

export function Profil({ settings }) {
  if (!settings) return null;
  return (
    <section id="profil" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-5 -left-5 h-24 w-24 rounded-3xl bg-gold/15 -z-0" />
            <img
              src={PROFIL_IMG}
              alt="Santri mengaji"
              className="relative rounded-[2rem] shadow-2xl object-cover w-full h-[380px] sm:h-[460px] ring-1 ring-black/5"
            />
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-border">
              <div className="font-serif font-bold text-3xl text-primary">30+</div>
              <div className="text-xs text-muted-foreground">Tahun Mendidik Umat</div>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-secondary border border-primary/10 px-3 py-1 rounded-full inline-block">
              Profil Pesantren
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Tafaqquh Fiddin, Mandiri & Berwawasan Masa Depan
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{settings.profil_text}</p>

            <div className="mt-8 grid gap-5">
              <div className="rounded-2xl bg-secondary/60 border border-primary/10 p-5">
                <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                  <Eye className="h-5 w-5 text-gold" /> Visi
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{settings.visi}</p>
              </div>
              <div className="rounded-2xl bg-white border border-border p-5">
                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                  <Target className="h-5 w-5 text-gold" /> Misi
                </div>
                <ul className="space-y-2.5">
                  {settings.misi_points?.map((m, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
