import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

export function Berita({ news = [] }) {
  return (
    <section id="berita" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-secondary border border-primary/10 px-3 py-1 rounded-full inline-block">
              Berita & Artikel
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Kabar Terkini Pesantren
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {news.map((n) => (
            <Link
              key={n.id}
              to={`/berita/${n.slug}`}
              data-testid={`berita-card-${n.slug}`}
              className="group rounded-3xl bg-white border border-border overflow-hidden hover:shadow-xl hover:border-primary/25 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={n.image} alt={n.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gold font-semibold bg-gold/10 px-2.5 py-0.5 rounded-full">{n.category}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> {fmtDate(n.date)}</span>
                </div>
                <h3 className="mt-3 font-serif font-bold text-lg text-slate-900 leading-snug group-hover:text-primary transition-colors">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{n.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Baca Selengkapnya <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        {news.length === 0 && <p className="text-center text-muted-foreground mt-10">Belum ada berita.</p>}
      </div>
    </section>
  );
}
