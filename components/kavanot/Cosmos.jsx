'use client';
// ─────────────────────────────────────────────────────────────
//  Cosmos · שפת העיצוב המשותפת של "שער האמת"
//  רקע שחור-מיסטי + שדה כוכבים + אותיות לבנות זוהרות.
//  כל דף חדש עוטף את עצמו ב-<Cosmos> ומשתמש ב-GlowText / GlowLetters.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';

export const THEME = {
  light: '#fbfaf5',
  glow: 'rgba(255,255,255,0.75)',
  parchment: '#e9e6dd',
  dim: 'rgba(233,230,221,0.55)',
  faint: 'rgba(233,230,221,0.38)',
  bg: 'radial-gradient(ellipse at 50% 38%, #0e0e14 0%, #06040a 55%, #000 100%)',
  serif: "'Frank Ruhl Libre', serif",
  sans: "'Assistant', sans-serif",
};

// טוען פונטים פעם אחת + מזהה prefers-reduced-motion
export function useCosmosChrome() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const id = 'kavanot-fonts';
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Assistant:wght@300;400;600&display=swap';
      document.head.appendChild(link);
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const fn = (e) => setReduce(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);
  return { reduce };
}

export function Starfield({ count = 40, reduce = false }) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      // דטרמיניסטי-למראית-עין אך מפוזר — נמנע מ-Math.random ב-SSR
      top: ((i * 47) % 100) + (((i * 13) % 7) - 3) * 0.6,
      left: ((i * 71) % 100) + (((i * 17) % 5) - 2) * 0.7,
      size: 0.5 + ((i * 7) % 17) / 10,
      dur: 4 + ((i * 11) % 40) / 10,
      delay: ((i * 19) % 50) / 10,
    }))
  );
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${s.top}%`, left: `${s.left}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          animation: reduce ? 'none' : `kvTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// אות / טקסט לבן זוהר
export function GlowText({ children, size = 'inherit', weight = 500, serif = true, style = {} }) {
  return (
    <span style={{
      fontFamily: serif ? THEME.serif : THEME.sans,
      fontSize: size, fontWeight: weight, color: THEME.light, lineHeight: 1,
      textShadow: '0 0 14px rgba(255,255,255,0.6), 0 0 34px rgba(255,255,255,0.35), 0 0 70px rgba(255,255,255,0.18)',
      ...style,
    }}>{children}</span>
  );
}

// עוטף-עמוד: רקע שחור + כוכבים + keyframes משותפים
export function Cosmos({ children, stars = 40, dir = 'rtl' }) {
  const { reduce } = useCosmosChrome();
  return (
    <div dir={dir} style={{
      position: 'relative', minHeight: '100dvh', width: '100%', overflowX: 'hidden',
      background: THEME.bg, color: THEME.parchment, fontFamily: THEME.sans,
    }}>
      <CosmosStyle reduce={reduce} />
      <Starfield count={stars} reduce={reduce} />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}

export function CosmosStyle({ reduce = false }) {
  return (
    <style>{`
      @keyframes kvTwinkle { 0%,100%{opacity:0.1} 50%{opacity:0.75} }
      @keyframes kvBreathe { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.25)} }
      @keyframes kvFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      @keyframes kvAura { 0%,100%{opacity:0.5} 50%{opacity:1} }
      @keyframes kvPulse { 0%,100%{opacity:.35} 50%{opacity:.9} }
      * { -webkit-tap-highlight-color: transparent; }
      a { color: inherit; }
      button:focus-visible, a:focus-visible { outline: 2px solid rgba(255,255,255,0.6); outline-offset: 3px; }
      ${reduce ? `*{animation:none !important; transition:opacity .3s ease !important;}` : ''}
    `}</style>
  );
}
