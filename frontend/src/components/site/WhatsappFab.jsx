import { MessageCircle } from "lucide-react";

export function WhatsappFab({ number = "6281234567890" }) {
  const text = encodeURIComponent(
    "Assalamu'alaikum Panitia PSB Pondok Pesantren Pulo Melati, saya ingin bertanya tentang pendaftaran santri baru..."
  );
  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="hero-whatsapp-consult-button"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb257] text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-black/20 animate-floaty transition-colors group"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
      <span className="hidden sm:inline font-semibold text-sm">Konsultasi PSB</span>
    </a>
  );
}
