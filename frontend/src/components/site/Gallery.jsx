import { useState } from "react";

const FILTERS = [
  { label: "Semua", testid: "gallery-filter-all" },
  { label: "Kegiatan", testid: "gallery-filter-kegiatan" },
  { label: "Santri", testid: "gallery-filter-santri" },
  { label: "Fasilitas", testid: "gallery-filter-fasilitas" },
  { label: "Acara", testid: "gallery-filter-acara" },
];

export function Gallery({ items = [] }) {
  const [active, setActive] = useState("Semua");
  const shown = active === "Semua" ? items : items.filter((i) => i.category === active);
  return (
    <section id="galeri" className="py-20 sm:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-white border border-primary/10 px-3 py-1 rounded-full inline-block">
            Galeri Kegiatan
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Momen di Pulo Melati
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              data-testid={f.testid}
              onClick={() => setActive(f.label)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === f.label
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white text-slate-600 border border-border hover:border-primary/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shown.map((g) => (
            <div key={g.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={g.image}
                alt={g.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <div className="text-[10px] text-gold font-semibold uppercase tracking-wide">{g.category}</div>
                  <div className="text-white text-sm font-medium">{g.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {shown.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">Belum ada foto pada kategori ini.</p>
        )}
      </div>
    </section>
  );
}
