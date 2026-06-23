'use client';
import { useState, useEffect } from 'react';

const LIGHT = '#fbfaf5';
const GLOW = 'rgba(255,255,255,0.75)';
const PARCHMENT = '#e9e6dd';
const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function YichudReveal({ state, yichud }) {
  const [screen, setScreen] = useState('explain'); // explain | contemplate
  const [mode, setMode] = useState('woven');         // woven | split
  const [revealed, setRevealed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const id = 'kavanot-fonts';
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700&family=Assistant:wght@300;400;600&display=swap';
      document.head.appendChild(link);
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const fn = (e) => setReduce(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);

  useEffect(() => {
    if (screen === 'contemplate') {
      setRevealed(false);
      const t = setTimeout(() => setRevealed(true), 60);
      return () => clearTimeout(t);
    }
  }, [screen, mode]);

  const serif = "'Frank Ruhl Libre', serif";
  const sans = "'Assistant', sans-serif";
  const dayName = DAY_NAMES[state.weekday.index];

  return (
    <div dir="rtl" style={{
      position: 'relative', width: '100%', minHeight: '100dvh', height: '100dvh',
      overflow: 'hidden', fontFamily: sans, color: PARCHMENT, userSelect: 'none',
      background: 'radial-gradient(ellipse at 50% 42%, #0e0e0e 0%, #050505 55%, #000 100%)',
    }}>
      <Style reduce={reduce} />
      <Stars />
      {screen === 'explain' ? (
        <ExplainScreen serif={serif} yichud={yichud} state={state} dayName={dayName}
          onContinue={() => setScreen('contemplate')} />
      ) : (
        <ContemplateScreen serif={serif} yichud={yichud} mode={mode} setMode={setMode}
          revealed={revealed} zoom={zoom} setZoom={setZoom} reduce={reduce}
          onExit={() => { setScreen('explain'); setMode('woven'); setZoom(1); }} />
      )}
    </div>
  );
}

function ExplainScreen({ serif, yichud, state, dayName, onContinue }) {
  return (
    <div style={{
      position: 'relative', zIndex: 2, height: '100%', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 26px', animation: 'fadeUp 1s ease both',
    }}>
      <div style={{ fontSize: 13, letterSpacing: 4, color: 'rgba(233,230,221,0.55)', fontWeight: 300, marginBottom: 8 }}>
        {state.hebrew.date}
      </div>
      <div style={{ fontSize: 12.5, letterSpacing: 3, color: 'rgba(233,230,221,0.42)', fontWeight: 300, marginBottom: 26 }}>
        יום {dayName} · {state.weekday.sefira} · {state.tefilla}
        {state.omer ? ` · עומר ${state.omer.day}` : ''}
      </div>

      <div style={{
        fontFamily: serif, fontSize: 'clamp(50px, 13vw, 80px)', fontWeight: 500,
        letterSpacing: 3, lineHeight: 1, color: LIGHT,
        textShadow: '0 0 26px rgba(255,255,255,0.35), 0 0 60px rgba(255,255,255,0.15)',
      }}>{yichud.title}</div>

      <div style={{ fontFamily: serif, fontSize: 19, color: 'rgba(233,230,221,0.85)', marginTop: 16, fontWeight: 400 }}>
        {yichud.subtitle}
      </div>

      <div style={{ width: 44, height: 1, margin: '26px 0',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }} />

      <p style={{ maxWidth: 360, fontSize: 16.5, lineHeight: 1.95, fontWeight: 300, color: 'rgba(233,230,221,0.82)', margin: 0 }}>
        {yichud.explanation}
      </p>

      <button onClick={onContinue} style={{
        marginTop: 40, padding: '15px 42px', fontFamily: serif, fontSize: 18, color: LIGHT,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: 999, cursor: 'pointer', boxShadow: '0 0 30px rgba(255,255,255,0.12)',
        textShadow: '0 0 16px rgba(255,255,255,0.4)', fontWeight: 400, letterSpacing: 1, backdropFilter: 'blur(4px)',
      }}>המשך להתבוננות</button>

      <div style={{ marginTop: 22, fontSize: 11.5, letterSpacing: 2, color: 'rgba(233,230,221,0.38)', fontWeight: 300 }}>
        {yichud.source}
      </div>
    </div>
  );
}

function ContemplateScreen({ serif, yichud, mode, setMode, revealed, zoom, setZoom, reduce, onExit }) {
  const base = mode === 'woven' ? 'clamp(46px, 13vw, 96px)' : 'clamp(54px, 16vw, 120px)';
  return (
    <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button onClick={onExit} aria-label="חזרה" style={{
        position: 'absolute', top: 18, left: 18, width: 40, height: 40, borderRadius: 999,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,230,221,0.18)',
        color: 'rgba(233,230,221,0.7)', fontSize: 20, cursor: 'pointer', zIndex: 5,
      }}>×</button>

      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 360, height: 360, borderRadius: '50%', filter: 'blur(10px)', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 45%, transparent 70%)',
        animation: reduce ? 'none' : 'auraPulse 9s ease-in-out infinite',
      }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px', transform: `scale(${zoom})`, transition: 'transform 0.35s ease',
      }}>
        {mode === 'woven' ? (
          <div dir="rtl" style={{
            display: 'flex', gap: 'clamp(2px, 1.5vw, 12px)', fontFamily: serif,
            fontSize: base, fontWeight: 500, lineHeight: 1,
            animation: reduce ? 'none' : 'breathe 7.5s ease-in-out infinite',
          }}>
            {yichud.woven.map((ch, i) => (
              <Letter key={i} ch={ch} i={i} revealed={revealed} delay={i * 0.18} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
            {yichud.split.map((row, ri) => (
              <div key={ri} style={{ textAlign: 'center' }}>
                <div dir="rtl" style={{
                  display: 'flex', gap: 'clamp(4px, 2vw, 16px)', fontFamily: serif, fontSize: base,
                  fontWeight: 500, lineHeight: 1, justifyContent: 'center',
                  animation: reduce ? 'none' : 'breathe 7.5s ease-in-out infinite',
                }}>
                  {row.letters.map((ch, i) => (
                    <Letter key={i} ch={ch} i={i} revealed={revealed} delay={ri * 0.5 + i * 0.15} />
                  ))}
                </div>
                <div style={{ marginTop: 14, fontSize: 12.5, letterSpacing: 2, color: 'rgba(233,230,221,0.5)', fontWeight: 300 }}>
                  {row.label}
                </div>
                {ri === 0 && <div style={{ width: 60, height: 1, margin: '20px auto 0', background: 'rgba(233,230,221,0.2)' }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        textAlign: 'center', padding: '0 30px 14px', fontSize: 14.5, lineHeight: 1.8,
        fontWeight: 300, color: 'rgba(233,230,221,0.6)', maxWidth: 380, margin: '0 auto', minHeight: 52,
      }}>
        {mode === 'woven' ? yichud.contemplation.woven : yichud.contemplation.split}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 16px 26px' }}>
        <Ctrl onClick={() => setMode(mode === 'woven' ? 'split' : 'woven')} wide serif={serif}>
          {mode === 'woven' ? 'פירוק' : 'שזירה'}
        </Ctrl>
        <Ctrl onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}>－</Ctrl>
        <Ctrl onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}>＋</Ctrl>
      </div>
    </div>
  );
}

function Letter({ ch, revealed, delay }) {
  return (
    <span style={{
      color: LIGHT,
      textShadow: `0 0 14px ${GLOW}, 0 0 34px ${GLOW}, 0 0 70px rgba(255,255,255,0.3)`,
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(14px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{ch}</span>
  );
}

function Ctrl({ children, onClick, wide, serif }) {
  return (
    <button onClick={onClick} style={{
      minWidth: wide ? 96 : 52, height: 52, borderRadius: 999,
      background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(233,230,221,0.2)',
      color: PARCHMENT, fontSize: wide ? 17 : 22, fontFamily: wide ? serif : 'inherit',
      cursor: 'pointer', backdropFilter: 'blur(6px)', fontWeight: 400,
    }}>{children}</button>
  );
}

function Stars() {
  const [stars] = useState(() => Array.from({ length: 30 }, () => ({
    top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 1.7 + 0.5,
    dur: Math.random() * 4 + 4, delay: Math.random() * 5,
  })));
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size,
          borderRadius: '50%', background: 'rgba(255,255,255,0.65)',
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Style({ reduce }) {
  return (
    <style>{`
      @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
      @keyframes breathe { 0%,100%{filter:brightness(1);transform:scale(1)} 50%{filter:brightness(1.22);transform:scale(1.035)} }
      @keyframes auraPulse { 0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.12)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      * { -webkit-tap-highlight-color: transparent; }
      button:focus-visible { outline: 2px solid rgba(255,255,255,0.6); outline-offset: 3px; }
      ${reduce ? `*{animation:none !important; transition:opacity .3s ease !important;}` : ''}
    `}</style>
  );
}
