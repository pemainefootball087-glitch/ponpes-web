import { useEffect, useRef, useState } from "react";
import { Clock, Users, GraduationCap, Award } from "lucide-react";

const ICONS = { Clock, Users, GraduationCap, Award };

function useCountUp(target, run) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf;
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
}

function StatItem({ item }) {
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.4 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const val = useCountUp(item.value, seen);
  const Icon = ICONS[item.icon] || Award;
  return (
    <div ref={ref} data-testid={`stat-counter-${item.key}`} className="text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gold/15 flex items-center justify-center">
        <Icon className="h-6 w-6 text-gold" />
      </div>
      <div className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
        {val.toLocaleString("id-ID")}
        <span className="text-gold text-xl sm:text-2xl ml-0.5">{item.suffix}</span>
      </div>
      <div className="mt-1 text-xs sm:text-sm text-white/60">{item.label}</div>
    </div>
  );
}

export function Stats({ stats = [] }) {
  return (
    <section className="relative bg-primary bg-grain py-14 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <StatItem key={s.key} item={s} />
        ))}
      </div>
    </section>
  );
}
