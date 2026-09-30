export function Pengajar({ teachers = [] }) {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-secondary border border-primary/10 px-3 py-1 rounded-full inline-block">
            Dewan Pengasuh & Asatidz
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Bimbingan Para Guru Ahli
          </h2>
        </div>
        <div className="mt-12 grid gap-6 grid-cols-2 lg:grid-cols-4">
          {teachers.map((t) => (
            <div key={t.id} className="group text-center">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted mb-4">
                <img src={t.image} alt={t.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">{t.name}</h3>
              <div className="text-xs text-primary font-medium mt-1">{t.role}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t.specialty}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
