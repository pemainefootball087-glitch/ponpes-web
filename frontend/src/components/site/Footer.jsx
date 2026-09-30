import { Moon, MapPin, Phone, Mail } from "lucide-react";

export function Footer({ settings }) {
  const wa = settings?.whatsapp_number || "6281234567890";
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-gold/40">
              <Moon className="h-5 w-5 text-gold -rotate-12" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg">Pondok Pesantren Pulo Melati</div>
              <div className="text-xs text-white/60 font-arabic text-base">معهد فولو ميلاتي الإسلامي</div>
            </div>
          </div>
          <p className="text-sm text-white/70 max-w-md leading-relaxed">
            Membina generasi Qur'ani yang berakhlak mulia, memadukan tradisi keilmuan turats salafiyah dengan keunggulan sains modern sejak 1994.
          </p>
        </div>
        <div>
          <h4 className="text-gold font-semibold mb-4 font-sans text-sm uppercase tracking-widest">Navigasi</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {["Profil & Visi", "Lembaga & Program", "Fasilitas", "Galeri", "Berita", "PSB Online"].map((x) => (
              <li key={x} className="hover:text-gold transition-colors cursor-default">{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gold font-semibold mb-4 font-sans text-sm uppercase tracking-widest">Kontak</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /> Jl. Melati Raya No. 1, Pulo Gebang, Jakarta Timur</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" /> +62 812-3456-7890</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" /> psb@pulomelati.sch.id</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50 px-4">
        © {new Date().getFullYear()} Pondok Pesantren Pulo Melati. Seluruh konten & identitas bersifat contoh untuk keperluan demonstrasi.
      </div>
    </footer>
  );
}
