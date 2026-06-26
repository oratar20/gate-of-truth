'use client';
// ─────────────────────────────────────────────────────────────
//  ParashaEmblem — סמל זוהר לפרשה.
//  אמבלמים מעוצבים-ידנית לפי נושא (מתרחבים בהדרגה) + סיגיל גנרטיבי
//  ייחודי (נגזר משם הפרשה) כברירת-מחדל, כך שלכל שבוע יש ויזואל.
// ─────────────────────────────────────────────────────────────

const W = (a) => `rgba(255,255,255,${a})`;

// ── אמבלם: באר מרים (חוקת) ──
function Well() {
  return (
    <svg viewBox="0 0 200 150" width="178" height="134" aria-label="סמל באר מרים" style={{ overflow: 'visible' }}>
      {[-26, -13, 0, 13, 26].map((dx, i) => (
        <line key={i} x1={100 + dx * 0.3} y1="96" x2={100 + dx} y2="30" stroke={W(0.18 - Math.abs(dx) * 0.003)} strokeWidth="1">
          <animate attributeName="opacity" values="0.15;0.5;0.15" dur="5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </line>
      ))}
      <ellipse cx="100" cy="100" rx="9" ry="4.5" fill={W(0.95)} style={{ filter: 'drop-shadow(0 0 8px #fff)' }}>
        <animate attributeName="rx" values="9;11;9" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {[18, 30, 44, 60, 78].map((rx, i) => (
        <ellipse key={i} cx="100" cy="100" rx={rx} ry={rx * 0.42} fill="none" stroke={W(0.34 - i * 0.05)} strokeWidth="0.9">
          <animate attributeName="ry" values={`${rx * 0.42};${rx * 0.46};${rx * 0.42}`} dur="6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </svg>
  );
}

// ── סיגיל גנרטיבי — ייחודי לכל פרשה (דטרמיניסטי משם הפרשה) ──
function Sigil({ seedStr }) {
  let seed = 0;
  for (const ch of String(seedStr || 'פרשה')) seed = (seed * 31 + ch.codePointAt(0)) % 100000;
  const cx = 100, cy = 75;
  const rays = 7 + (seed % 6);              // 7..12
  const rings = 2 + (seed % 3);             // 2..4
  const rot = (seed % 360) * (Math.PI / 180);
  const R = 54;
  const tips = Array.from({ length: rays }, (_, k) => {
    const a = rot + (k / rays) * Math.PI * 2;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.92 };
  });
  return (
    <svg viewBox="0 0 200 150" width="178" height="134" aria-label="סמל הפרשה" style={{ overflow: 'visible' }}>
      {Array.from({ length: rings }, (_, i) => {
        const rr = 16 + i * 14;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={rr} ry={rr * 0.92} fill="none" stroke={W(0.3 - i * 0.05)} strokeWidth="0.8">
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur="6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </ellipse>
        );
      })}
      {tips.map((t, k) => (
        <g key={k}>
          <line x1={cx} y1={cy} x2={t.x} y2={t.y} stroke={W(0.16)} strokeWidth="0.7" />
          <circle cx={t.x} cy={t.y} r="2.1" fill={W(0.85)} style={{ filter: 'drop-shadow(0 0 4px #fff)' }}>
            <animate attributeName="r" values="2.1;3;2.1" dur="4s" begin={`${k * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="4.5" fill={W(0.95)} style={{ filter: 'drop-shadow(0 0 9px #fff)' }}>
        <animate attributeName="r" values="4.5;6;4.5" dur="4.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// מפת אמבלמים מעוצבים-ידנית (לפי שם אנגלי של הפרשה הראשונה).
const NAMED = { Chukat: { Comp: Well, label: 'בְּאֵר מִרְיָם' } };

export default function ParashaEmblem({ parashaEn, firstEn, parashaHe }) {
  const key = firstEn || (parashaEn || '').split('-')[0];
  const named = NAMED[key];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0 2px' }}>
      {named ? <named.Comp /> : <Sigil seedStr={parashaHe || parashaEn} />}
      {named && (
        <div style={{ marginTop: 4, fontSize: 11, letterSpacing: 1.5, color: 'rgba(233,230,221,0.38)', fontWeight: 300 }}>
          סֵמֶל · {named.label}
        </div>
      )}
    </div>
  );
}
