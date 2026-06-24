'use client';
// ─────────────────────────────────────────────────────────────
//  SefirotTree — עץ עשר הספירות.
//  ממחיש את ירידת האור (צמצום) דרך הקו אל המלכות וחזרתו אל הכתר
//  (מסגרת הרמח"ל, קל"ח פתחי חכמה). לחיצה על ספירה: הסבר, שם, וספירות-שבה.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';
import { SEFIROT, PATHS, KAV_PATH, SEFIROT_SOURCE } from '@/lib/kavanot/sefirot';

const byId = Object.fromEntries(SEFIROT.map((s) => [s.id, s]));
const stripNikud = (s) => [...s].filter((c) => { const x = c.codePointAt(0); return !(x >= 0x0591 && x <= 0x05c7); }).join('');

// נתיב הקו במרכז: ירידה כתר→מלכות ועלייה חזרה — לאנימציית האור.
const kav = KAV_PATH.map((id) => byId[id]);
const down = kav.map((s) => `${s.x},${s.y}`);
const up = [...down].reverse().slice(1);
const MOTION = 'M' + [...down, ...up].join(' L');

export default function SefirotTree() {
  const [sel, setSel] = useState(null);
  return (
    <Cosmos stars={40}>
      <a href="/" style={backLink}>→ השער</a>
      <div style={wrap}>
        <div style={{ textAlign: 'center', paddingTop: 18 }}>
          <GlowText size="clamp(30px, 8vw, 46px)" weight={500} style={{ letterSpacing: 2 }}>
            עֵץ הַסְּפִירוֹת
          </GlowText>
          <p style={{ maxWidth: 420, margin: '14px auto 0', fontFamily: THEME.serif, fontSize: 15.5, lineHeight: 1.85, fontWeight: 300, color: 'rgba(233,230,221,0.75)' }}>
            האור הנאצל מאֵין-סוף מצטמצם ויורד בקו דרך הספירות עד המלכות, וחוזר ועולה אל הכתר.
            לחץ על ספירה לראות את עניינה, השם שכנגדה, והספירות שבתוכה.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 24px' }}>
          <svg viewBox="0 0 300 490" style={{ width: '100%', maxWidth: 360, height: 'auto' }}>
            {/* אֵין-סוף + צמצום */}
            <circle cx="150" cy="14" r="9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6">
              <animate attributeName="r" values="11;5;11" dur="6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.25;0.7" dur="6s" repeatCount="indefinite" />
            </circle>

            {/* קווי-חיבור */}
            {PATHS.map(([a, b], i) => (
              <line key={i} x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y}
                stroke="rgba(233,230,221,0.14)" strokeWidth="0.8" />
            ))}

            {/* אור יורד ועולה בקו */}
            <circle r="5" fill="#fff" opacity="0.95" style={{ filter: 'drop-shadow(0 0 6px #fff)' }}>
              <animateMotion path={MOTION} dur="9s" repeatCount="indefinite" />
              <animate attributeName="r" values="5;2.6;5" dur="9s" repeatCount="indefinite" />
            </circle>

            {/* ספירות */}
            {SEFIROT.map((s) => {
              const active = sel?.id === s.id;
              return (
                <g key={s.id} onClick={() => setSel(s)} style={{ cursor: 'pointer' }}>
                  <circle cx={s.x} cy={s.y} r="26"
                    fill={active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)'}
                    stroke={active ? 'rgba(255,255,255,0.85)' : 'rgba(233,230,221,0.35)'}
                    strokeWidth={active ? 1.4 : 0.9}
                    style={{ transition: 'all .25s ease', filter: active ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none' }}>
                    <animate attributeName="stroke-opacity" values="0.4;0.85;0.4" dur="4s" begin={`${s.y / 120}s`} repeatCount="indefinite" />
                  </circle>
                  <text x={s.x} y={s.y + 4.5} textAnchor="middle"
                    style={{ fontFamily: THEME.serif, fontSize: 12.5, fill: THEME.light, fontWeight: 500,
                      filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.45))' }}>
                    {s.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ fontSize: 11, letterSpacing: 1, color: THEME.faint, textAlign: 'center', paddingBottom: 28 }}>
          {SEFIROT_SOURCE}
        </div>
      </div>

      {sel && <Detail sel={sel} onClose={() => setSel(null)} />}
    </Cosmos>
  );
}

function Detail({ sel, onClose }) {
  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={sheet}>
        <button onClick={onClose} aria-label="סגור" style={closeBtn}>×</button>
        <div style={{ textAlign: 'center' }}>
          <GlowText size="clamp(34px, 9vw, 52px)" weight={500}>{sel.name}</GlowText>
          <div style={{ marginTop: 14, fontFamily: THEME.serif, fontSize: 17, color: 'rgba(233,230,221,0.85)' }}>
            {sel.meaning}
          </div>
          <div style={{ width: 40, height: 1, margin: '20px auto', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)' }} />
          <div style={{ fontSize: 12.5, letterSpacing: 2, color: THEME.dim, marginBottom: 6 }}>השם שכנגדה</div>
          <GlowText size="clamp(26px, 7vw, 36px)" weight={500}>{sel.divineName}</GlowText>
        </div>

        <div style={{ marginTop: 26 }}>
          <div style={{ fontSize: 12.5, letterSpacing: 2, color: THEME.dim, textAlign: 'center', marginBottom: 12 }}>
            הספירות שבתוך {stripNikud(sel.name)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px,1fr))', gap: 8 }}>
            {SEFIROT.map((inner) => (
              <div key={inner.id} style={innerChip}>
                {stripNikud(inner.name)} שב{stripNikud(sel.name)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const wrap = { minHeight: '100dvh', maxWidth: 640, margin: '0 auto', padding: '0 16px' };
const backLink = { position: 'fixed', top: '1.3rem', right: '1.3rem', zIndex: 50, color: THEME.dim, fontFamily: THEME.sans, fontSize: '0.9rem', letterSpacing: '0.08em', textDecoration: 'none', opacity: 0.75 };
const overlay = { position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const sheet = { position: 'relative', width: '100%', maxWidth: 460, maxHeight: '88dvh', overflowY: 'auto', background: 'radial-gradient(ellipse at 50% 0%, #14121c, #06040a)', border: '1px solid rgba(233,230,221,0.18)', borderRadius: 18, padding: '34px 24px 28px', animation: 'kvFadeUp .4s ease both' };
const closeBtn = { position: 'absolute', top: 12, left: 12, width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,230,221,0.18)', color: 'rgba(233,230,221,0.7)', fontSize: 20, cursor: 'pointer' };
const innerChip = { textAlign: 'center', fontFamily: THEME.serif, fontSize: 13.5, color: 'rgba(233,230,221,0.82)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(233,230,221,0.12)', borderRadius: 9, padding: '9px 6px' };
