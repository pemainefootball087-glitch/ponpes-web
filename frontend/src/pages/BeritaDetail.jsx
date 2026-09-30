import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsappFab } from "@/components/site/WhatsappFab";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";

function fmtDate(d) {
  try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return d; }
}

export default function BeritaDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/news/${slug}`)
      .then((r) => { setArticle(r.data); document.title = `${r.data.title} — Pulo Melati`; })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="font-serif text-3xl text-primary">Artikel Tidak Ditemukan</h1>
        <Link to="/" className="text-gold font-semibold">← Kembali ke Beranda</Link>
      </div>
    );

  if (!article)
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <button onClick={() => navigate("/#berita")} data-testid="berita-back-button" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all mb-6">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
        </button>
        <div className="flex items-center gap-3 text-xs mb-4">
          <span className="text-gold font-semibold bg-gold/10 px-2.5 py-0.5 rounded-full">{article.category}</span>
          <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> {fmtDate(article.date)}</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight text-balance">{article.title}</h1>
        <img src={article.image} alt={article.title} className="w-full aspect-[16/9] object-cover rounded-3xl mt-8 shadow-lg" />
        <div className="mt-8 prose prose-slate max-w-none">
          {article.content?.split("\n").filter(Boolean).map((p, i) => (
            <p key={i} className="text-slate-700 leading-relaxed mb-4 text-[15px]">{p}</p>
          ))}
        </div>
      </article>
      <Footer />
      <WhatsappFab />
    </div>
  );
}
