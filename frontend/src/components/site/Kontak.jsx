import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Kontak({ settings }) {
  const wa = settings?.whatsapp_number || "6281234567890";
  const text = encodeURIComponent("Assalamu'alaikum Panitia PSB Pondok Pesantren Pulo Melati, saya ingin bertanya...");
  return (
    <section id="kontak" className="py-20 sm:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-[2.5rem] bg-white border border-border overflow-hidden grid lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-primary bg-secondary border border-primary/10 px-3 py-1 rounded-full inline-block">
              Hubungi Kami
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Silaturahmi & Konsultasi PSB
            </h2>
            <p className="mt-4 text-muted-foreground">
              Panitia siap membantu menjawab pertanyaan seputar pendaftaran, biaya, dan kehidupan pesantren.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-3"><MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" /><span className="text-sm text-slate-700">Jl. Melati Raya No. 1, Pulo Gebang, Cakung, Jakarta Timur 13950</span></div>
              <div className="flex gap-3"><Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" /><span className="text-sm text-slate-700">+62 812-3456-7890 (Panitia PSB)</span></div>
              <div className="flex gap-3"><Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" /><span className="text-sm text-slate-700">psb@pulomelati.sch.id</span></div>
            </div>
            <a href={`https://wa.me/${wa}?text=${text}`} target="_blank" rel="noopener noreferrer">
              <Button data-testid="kontak-whatsapp-button" className="mt-8 bg-[#25D366] hover:bg-[#1eb257] text-white rounded-full px-6 h-12">
                <MessageCircle className="mr-2 h-5 w-5" /> Chat WhatsApp Panitia
              </Button>
            </a>
          </div>
          <div className="min-h-[320px] bg-primary bg-grain relative">
            <img
              src="https://images.unsplash.com/photo-1521241191669-b9fba071b073?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000"
              alt="Masjid pesantren"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-primary/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
