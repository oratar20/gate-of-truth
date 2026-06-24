'use client';
// ─────────────────────────────────────────────────────────────
//  RevealExperience — "קבל ייחוד לרגע"
//  סורק את הרגע → ממליץ מוקד התבוננות (ייחוד / שם מע"ב / צירוף הוי"ה)
//  → מציג הסבר ובסיס הבחירה → ממשיך להתבוננות באותיות.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';
import { resolveState } from '@/lib/kavanot/engine';
import { pickForMoment } from '@/lib/kavanot/select';
import { fallbackLocation } from '@/lib/kavanot/geo';

const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function RevealExperience() {
  const [state, setState] = useState(null);
  const [err, setErr] = useState(null);
  const [screen, setScreen] = useState('scan'); // scan | reveal | contemplate
  const [pick, setPick] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const compute = (loc) => {
      // אם המיקום נושא tz משלו (נפילת ברירת-מחדל) — נשתמש בו; אחרת tz הדפדפן
      // (משתמש אמיתי עם geolocation נמצא באזור-הזמן של עצמו).
      try { setState(resolveState(new Date(), { ...loc, tzid: loc.tzid || browserTz })); }
      catch (e) { setErr(e.message || 'engine error'); }
    };
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => compute({ lat: p.coords.latitude, lng: p.coords.longitude, cityName: 'מיקומך' }),
        () => compute(fallbackLocation()),   // נדחה/נכשל → מיקום לפי אזור-הזמן
        { timeout: 8000 }
      );
    } else compute(fallbackLocation());
  }, []);

  const doScan = () => {
    if (!state) return;
    const p = pickForMoment(state);
    setPick(p);
    setCurrent(p.primary);
    setScreen('reveal');
  };

  return (
    <Cosmos stars={46}>
      <a href="/" style={backLink}>→ השער</a>
      <div style={wrap}>
        {err ? (
          <Note>שגיאה בחישוב הרגע</Note>
        ) : !state ? (
          <Note pulse>סורק את הרגע…</Note>
        ) : screen === 'scan' ? (
          <ScanScreen state={state} onScan={doScan} />
        ) : screen === 'reveal' ? (
          <RevealScreen pick={pick} current={current} setCurrent={setCurrent}
            onContemplate={() => setScreen('contemplate')} onRescan={doScan} />
        ) : (
          <ContemplateScreen focus={current} onBack={() => setScreen('reveal')} />
        )}
      </div>
    </Cosmos>
  );
}

function ScanScreen({ state, onScan }) {
  const dayName = DAY_NAMES[state.weekday.index];
  const city = state.location?.cityName;
  let localTime = '';
  try {
    localTime = new Intl.DateTimeFormat('he', { timeZone: state.location?.tzid, hour: '2-digit', minute: '2-digit' }).format(new Date(state.gregorian));
  } catch { localTime = ''; }
  return (
    <div style={center}>
      <div style={{ fontSize: 13, letterSpacing: 4, color: THEME.dim, fontWeight: 300, marginBottom: 8 }}>
        {state.hebrew.date}
      </div>
      <div style={{ fontSize: 12.5, letterSpacing: 3, color: THEME.faint, fontWeight: 300, marginBottom: 6 }}>
        יום {dayName} · {state.weekday.sefira} · {state.tefilla}
        {state.omer ? ` · עומר ${state.omer.day}` : ''}
      </div>
      <div style={{ fontSize: 12, letterSpacing: 2, color: THEME.faint, fontWeight: 300, marginBottom: 30 }}>
        ✦ {[city, localTime].filter(Boolean).join(' · ')} ✦
      </div>
      <GlowText size="clamp(30px, 8vw, 46px)" weight={500} style={{ letterSpacing: 2 }}>
        קַבֵּל יִחוּד לָרֶגַע
      </GlowText>
      <p style={{ maxWidth: 360, marginTop: 22, fontFamily: THEME.serif, fontSize: 16.5, lineHeight: 1.9, fontWeight: 300, color: 'rgba(233,230,221,0.78)' }}>
        סריקת הרגע — לפי המיקום, השעה, ויום השבוע — תגלה את <b style={{ fontWeight: 500, color: THEME.light }}>השם השולט עכשיו</b> בשעה הזמנית, ותציע גם ייחוד, שם מע״ב, שם הוי״ה ושם הקודש.
      </p>
      <button onClick={onScan} style={primaryBtn}>סרוק את הרגע ✦</button>
    </div>
  );
}

function RevealScreen({ pick, current, setCurrent, onContemplate, onRescan }) {
  if (!pick || !current) return null;
  return (
    <div style={{ ...center, animation: 'kvFadeUp .7s ease both' }}>
      <div style={{ fontSize: 12.5, letterSpacing: 4, color: THEME.faint, fontWeight: 300, marginBottom: 14 }}>
        {current.label}
      </div>
      <GlowText size="clamp(40px, 11vw, 68px)" weight={500} style={{ letterSpacing: 3 }}>
        {current.title}
      </GlowText>
      {current.subtitle && (
        <div style={{ marginTop: 12, fontFamily: THEME.serif, fontSize: 17, color: 'rgba(233,230,221,0.82)' }}>
          {current.subtitle}
        </div>
      )}

      <div style={{ width: 44, height: 1, margin: '24px 0', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />

      <p style={{ maxWidth: 360, fontSize: 16, lineHeight: 1.9, fontWeight: 300, color: 'rgba(233,230,221,0.82)', margin: 0 }}>
        {current.explanation}
      </p>

      <div style={basisBox}>
        <span style={{ color: THEME.dim }}>מדוע עכשיו: </span>{current.basis}
      </div>

      {/* החלפה בין שלושת המוקדים */}
      <div style={{ display: 'flex', gap: 8, marginTop: 26, flexWrap: 'wrap', justifyContent: 'center' }}>
        {pick.options.map((o) => {
          const active = o.kind === current.kind;
          return (
            <button key={o.kind} onClick={() => setCurrent(o)} style={{
              ...chip,
              borderColor: active ? 'rgba(255,255,255,0.55)' : 'rgba(233,230,221,0.18)',
              color: active ? THEME.light : THEME.dim,
              background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}>{o.label}</button>
          );
        })}
      </div>

      <button onClick={onContemplate} style={{ ...primaryBtn, marginTop: 28 }}>המשך להתבוננות →</button>
      <button onClick={onRescan} style={ghostBtn}>סרוק שוב</button>
      <div style={{ marginTop: 18, fontSize: 11.5, letterSpacing: 1.5, color: THEME.faint, fontWeight: 300 }}>
        {current.source}
      </div>
    </div>
  );
}

function ContemplateScreen({ focus, onBack }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, [focus]);
  const guide = focus?.contemplation?.woven || 'ראה את האותיות כאור אחד. נשום לאט.';
  return (
    <div style={{ ...center, minHeight: '100dvh', justifyContent: 'center' }}>
      <button onClick={onBack} aria-label="חזרה" style={closeBtn}>×</button>
      <div dir="rtl" style={{
        display: 'flex', gap: 'clamp(4px, 2vw, 16px)', fontFamily: THEME.serif,
        fontSize: 'clamp(46px, 14vw, 110px)', fontWeight: 500, lineHeight: 1,
        animation: 'kvBreathe 7.5s ease-in-out infinite',
      }}>
        {(focus?.letters || []).map((ch, i) => (
          <span key={i} style={{
            color: THEME.light,
            textShadow: '0 0 14px rgba(255,255,255,0.7), 0 0 34px rgba(255,255,255,0.4), 0 0 70px rgba(255,255,255,0.25)',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity .7s ease ${i * 0.16}s, transform .7s ease ${i * 0.16}s`,
          }}>{ch}</span>
        ))}
      </div>
      <div style={{ marginTop: 34, padding: '0 30px', fontSize: 14.5, lineHeight: 1.8, fontWeight: 300, color: 'rgba(233,230,221,0.6)', maxWidth: 380, textAlign: 'center' }}>
        {guide}
      </div>
    </div>
  );
}

function Note({ children, pulse }) {
  return (
    <div style={{ ...center, minHeight: '70dvh', justifyContent: 'center' }}>
      <span style={{ color: THEME.dim, letterSpacing: 2, fontSize: 15, animation: pulse ? 'kvPulse 2s ease-in-out infinite' : 'none' }}>
        {children}
      </span>
    </div>
  );
}

// ── styles ──
const wrap = { minHeight: '100dvh', display: 'flex', flexDirection: 'column', maxWidth: 620, margin: '0 auto' };
const center = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 24px' };
const primaryBtn = {
  marginTop: 34, padding: '15px 40px', fontFamily: THEME.serif, fontSize: 18, color: THEME.light,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999,
  cursor: 'pointer', boxShadow: '0 0 30px rgba(255,255,255,0.12)', fontWeight: 400, letterSpacing: 1, backdropFilter: 'blur(4px)',
};
const ghostBtn = {
  marginTop: 12, padding: '8px 22px', fontFamily: THEME.sans, fontSize: 13, color: THEME.dim,
  background: 'transparent', border: '1px solid rgba(233,230,221,0.18)', borderRadius: 999, cursor: 'pointer', letterSpacing: 1,
};
const chip = {
  padding: '8px 18px', fontFamily: THEME.serif, fontSize: 15, borderRadius: 999,
  border: '1px solid', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all .2s ease',
};
const basisBox = {
  marginTop: 20, maxWidth: 360, fontSize: 13, lineHeight: 1.7, fontWeight: 300,
  color: 'rgba(233,230,221,0.7)', background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(233,230,221,0.12)', borderRadius: 10, padding: '12px 16px',
};
const backLink = {
  position: 'fixed', top: '1.3rem', right: '1.3rem', zIndex: 50, color: THEME.dim,
  fontFamily: THEME.sans, fontSize: '0.9rem', letterSpacing: '0.08em', textDecoration: 'none', opacity: 0.75,
};
const closeBtn = {
  position: 'absolute', top: 18, left: 18, width: 40, height: 40, borderRadius: 999,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,230,221,0.18)',
  color: 'rgba(233,230,221,0.7)', fontSize: 20, cursor: 'pointer', zIndex: 5,
};
