import { Quote } from "lucide-react";

export function Testimoni({ items = [] }) {
  return (
    <section className="py-20 sm:py-28 bg-primary bg-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold bg-white/5 border border-gold/20 px-3 py-1 rounded-full inline-block">
            Testimoni
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Kisah Wali Santri & Alumni
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-7 hover:bg-white/10 transition-colors">
              <Quote className="h-9 w-9 text-gold/60" />
              <p className="mt-4 text-white/85 text-sm leading-relaxed italic">"{t.text}"</p>
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-xs text-gold">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
