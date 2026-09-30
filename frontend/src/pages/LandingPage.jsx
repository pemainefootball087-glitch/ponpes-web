import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Profil } from "@/components/site/Profil";
import { Programs } from "@/components/site/Programs";
import { Fasilitas } from "@/components/site/Fasilitas";
import { Gallery } from "@/components/site/Gallery";
import { Berita } from "@/components/site/Berita";
import { PSB } from "@/components/site/PSB";
import { Testimoni } from "@/components/site/Testimoni";
import { Pengajar } from "@/components/site/Pengajar";
import { Kontak } from "@/components/site/Kontak";
import { Footer } from "@/components/site/Footer";
import { WhatsappFab } from "@/components/site/WhatsappFab";

export default function LandingPage() {
  const [data, setData] = useState({ stats: [], programs: [], gallery: [], teachers: [], testimonials: [], news: [], settings: null });

  useEffect(() => {
    document.title = "Pondok Pesantren Pulo Melati — PSB Online 2026/2027";
    let live = true;
    Promise.all([
      api.get("/content/stats"),
      api.get("/content/programs"),
      api.get("/content/gallery"),
      api.get("/content/teachers"),
      api.get("/content/testimonials"),
      api.get("/news"),
      api.get("/psb/settings"),
    ])
      .then(([stats, programs, gallery, teachers, testimonials, news, settings]) => {
        if (!live) return;
        setData({
          stats: stats.data, programs: programs.data, gallery: gallery.data,
          teachers: teachers.data, testimonials: testimonials.data, news: news.data, settings: settings.data,
        });
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <Hero settings={data.settings} />
        <Stats stats={data.stats} />
        <Profil settings={data.settings} />
        <Programs programs={data.programs} />
        <Fasilitas settings={data.settings} />
        <Gallery items={data.gallery} />
        <Berita news={data.news} />
        <PSB settings={data.settings} />
        <Pengajar teachers={data.teachers} />
        <Testimoni items={data.testimonials} />
        <Kontak settings={data.settings} />
      </main>
      <Footer settings={data.settings} />
      <WhatsappFab number={data.settings?.whatsapp_number} />
    </div>
  );
}
