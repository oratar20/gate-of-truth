'use client';
import { useState, useEffect } from 'react';
import { resolveState } from '@/lib/kavanot/engine';
import { selectYichud } from '@/lib/kavanot/yichudim';
import YichudReveal from './YichudReveal';

// מיקום גיבוי אם המשתמש לא מאשר איתור (אפשר להחליף לברירת מחדל שלך)
const FALLBACK = { lat: 31.7683, lng: 35.2137, cityName: 'ירושלים' };

export default function NowExperience() {
  const [state, setState] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let timer;
    const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const compute = (loc) => {
      try { setState(resolveState(new Date(), loc)); }
      catch (e) { setErr(e.message || 'engine error'); }
    };
    const start = (loc) => {
      compute(loc);
      // חישוב מחדש כל דקה — כדי שחלון התפילה יישאר עדכני
      timer = setInterval(() => compute(loc), 60000);
    };
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => start({ lat: p.coords.latitude, lng: p.coords.longitude, tzid }),
        () => start({ ...FALLBACK, tzid }),
        { timeout: 8000 }
      );
    } else {
      start({ ...FALLBACK, tzid });
    }
    return () => clearInterval(timer);
  }, []);

  if (err) return <Shell text="שגיאה בחישוב הרגע" />;
  if (!state) return <Shell text="מחשב את הרגע…" pulse />;

  return <YichudReveal state={state} yichud={selectYichud(state)} />;
}

function Shell({ text, pulse }) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#000', color: 'rgba(233,230,221,0.6)',
      fontFamily: "'Assistant', sans-serif", letterSpacing: 2, fontSize: 15,
    }}>
      <span style={{ animation: pulse ? 'kvPulse 2s ease-in-out infinite' : 'none' }}>{text}</span>
      <style>{`@keyframes kvPulse{0%,100%{opacity:.35}50%{opacity:.9}}`}</style>
    </div>
  );
}
