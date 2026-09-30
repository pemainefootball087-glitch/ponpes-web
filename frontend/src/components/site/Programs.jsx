import { GraduationCap, ArrowUpRight } from "lucide-react";

export function Programs({ programs = [] }) {
  return (
    <section id="program" className="py-20 sm:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-white border border-primary/10 px-3 py-1 rounded-full inline-block">
            Lembaga di Bawah Yayasan
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Program Pendidikan Terpadu
          </h2>
          <p className="mt-4 text-muted-foreground">
            Jenjang pendidikan formal dan kepesantrenan yang saling menguatkan, dari Tsanawiyah hingga kaderisasi ulama.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {programs.map((p, i) => (
            <div
              key={p.id}
              className="group relative rounded-3xl bg-white border border-border p-7 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-28 w-28 bg-gold/5 rounded-bl-[3rem] group-hover:bg-gold/10 transition-colors" />
              <div className="relative flex items-start justify-between">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">{p.badge}</span>
              </div>
              <h3 className="relative mt-5 font-serif font-bold text-xl text-slate-900">{p.name}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
