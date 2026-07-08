'use client';
// ─────────────────────────────────────────────────────────────
//  HazkaraGuide — מדריך מונפש להזכרת ע"ב שמות (אבולעפיה).
//  רמות נבחרות; לכל אות: הניקוד, אור-מונחה בכיוון תנועת-הראש,
//  וטבעת-נשימה מסונכרנת (שאיפה → הגייה+תנועה → מנוחה).
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';
import { LEVELS, VOWELS, buildSequence, ALL_72, PREPARATION, BREATH, PACES, timing, SOURCE } from '@/lib/kavanot/abulafia';

const PHASES = [
  { key: 'inhale', label: 'שְׁאִיפָה', hint: 'שאף לאט דרך האף' },
  { key: 'chant',  label: 'הַגָּה וְהָנַע', hint: 'הגה את האות בנשיפה אחת, והנע את הראש' },
  { key: 'rest',   label: 'מְנוּחָה', hint: 'נוח כשלוש נשימות' },
];

export default function HazkaraGuide() {
  const [levelId, setLevelId] = useState('prep');
  const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];

  return (
    <Cosmos stars={40}>
      <a href="/" style={backLink}>→ השער</a>
      <div style={wrap}>
        <div style={{ textAlign: 'center', paddingTop: 18 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: THEME.faint, fontWeight: 300 }}>הַזְכָּרַת ע"ב שֵׁמוֹת</div>
          <div style={{ marginTop: 8 }}><GlowText size="clamp(24px, 6vw, 34px)" weight={500} style={{ letterSpacing: 1 }}>שיטת אבולעפיה</GlowText></div>
        </div>

        <div style={tabs}>
          {LEVELS.map((l, i) => (
            <button key={l.id} onClick={() => setLevelId(l.id)} style={{
              ...tab,
              borderColor: l.id === levelId ? 'rgba(255,255,255,0.6)' : 'rgba(233,230,221,0.16)',
              color: l.id === levelId ? THEME.light : THEME.dim,
              background: l.id === levelId ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}>
              <span style={{ opacity: 0.5, fontSize: 11, marginInlineEnd: 6 }}>{i + 1}</span>{l.title}
            </button>
          ))}
        </div>

        {level.kind === 'prep' && <Prep onStart={() => setLevelId('letter')} />}
        {level.kind === 'run' && <Player key={level.id} seq={seqFor(level)} />}
        {level.kind === 'table' && <Table />}

        <div style={{ textAlign: 'center', padding: '26px 0 40px', fontSize: 11, letterSpacing: 1, color: THEME.faint }}>{SOURCE}</div>
      </div>
    </Cosmos>
  );
}

function seqFor(level) {
  const s = buildSequence(level.nums);
  return level.only != null ? s.slice(0, 1) : s;
}

// ── הכנה ──
function Prep({ onStart }) {
  return (
    <div style={{ ...card, textAlign: 'center', marginTop: 24 }}>
      <div style={{ fontFamily: THEME.serif, fontSize: 17, color: THEME.light, marginBottom: 16 }}>קֹדֶם כֹּל — הַכָנָה</div>
      {PREPARATION.map((p, i) => (
        <p key={i} style={{ fontFamily: THEME.serif, fontSize: 15.5, lineHeight: 1.9, fontWeight: 300, color: 'rgba(233,230,221,0.8)', margin: '0 0 10px' }}>{p}</p>
      ))}
      <button onClick={onStart} style={{ ...primaryBtn, marginTop: 22 }}>התחל בתרגול ←</button>
    </div>
  );
}

// ── מנגן מונפש ──
function Player({ seq }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState(-1); // -1 idle
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [paceId, setPaceId] = useState('med');
  const T = timing((PACES.find((p) => p.id === paceId) || PACES[1]).exhale);
  const dur = (p) => [T.inhaleMs, T.chantMs, T.restMs][p];
  const L = seq[idx];

  useEffect(() => {
    if (!playing || phase < 0) return;
    const t = setTimeout(() => {
      if (phase >= 2) {
        if (idx + 1 < seq.length) { setIdx(idx + 1); setPhase(0); }
        else { setPlaying(false); setPhase(-1); setDone(true); }
      } else setPhase(phase + 1);
    }, dur(phase));
    return () => clearTimeout(t);
  }, [playing, phase, idx, seq.length, paceId]);

  const start = () => { setIdx(0); setPhase(0); setPlaying(true); setDone(false); };
  const active = phase >= 0;

  return (
    <div style={{ marginTop: 20 }}>
      <PlayerStyle />

      {/* בורר קצב-נשימה */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: THEME.faint, marginInlineEnd: 4 }}>קֶצֶב הַנְּשִׁימָה</span>
        {PACES.map((p) => (
          <button key={p.id} onClick={() => setPaceId(p.id)} disabled={playing} style={{
            ...pacePill,
            borderColor: p.id === paceId ? 'rgba(255,255,255,0.5)' : 'rgba(233,230,221,0.16)',
            color: p.id === paceId ? THEME.light : THEME.dim, opacity: playing ? 0.5 : 1,
          }}>{p.label}</button>
        ))}
      </div>

      <Stage L={L} phase={phase} active={active} idx={idx} T={T} />

      <div style={{ textAlign: 'center', marginTop: 14, minHeight: 66 }}>
        {active ? (
          <>
            <div style={{ fontSize: 13, letterSpacing: 3, color: THEME.light, fontWeight: 400 }}>{PHASES[phase].label}</div>
            <div style={{ fontSize: 13, color: THEME.dim, marginTop: 6 }}>
              {phase === 1 ? <><b style={{ color: THEME.light, fontWeight: 500 }}>{VOWELS[L.vowel].he} {L.arrow}</b> · {L.move}</> : PHASES[phase].hint}
            </div>
          </>
        ) : done ? (
          <div style={{ fontFamily: THEME.serif, fontSize: 16, color: 'rgba(233,230,221,0.8)' }}>הושלם. שֵׁב רגע בשקט.</div>
        ) : (
          <div style={{ fontSize: 13, color: THEME.dim }}>הפנה פניך למזרח. כשתהיה מוכן — התחל.</div>
        )}
      </div>

      {!active && !done && (
        <div style={{ maxWidth: 400, margin: '10px auto 0', fontSize: 11.5, lineHeight: 1.7, color: THEME.faint, textAlign: 'center' }}>{BREATH.note}</div>
      )}

      {phase === 1 && <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: 0.5, color: THEME.faint, maxWidth: 380, margin: '4px auto 0', lineHeight: 1.6 }}>{VOWELS[L.vowel].src}</div>}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
        {!playing ? <button onClick={start} style={primaryBtn}>{done ? 'שוב' : 'התחל'}</button>
          : <button onClick={() => setPlaying(false)} style={ghostBtn}>השהה</button>}
        {!playing && phase >= 0 && <button onClick={() => setPlaying(true)} style={primaryBtn}>המשך</button>}
      </div>

      <SeqDots seq={seq} idx={idx} active={active} />
    </div>
  );
}

function Stage({ L, phase, active, idx, T }) {
  const breathScale = phase === 0 ? 1.25 : phase === 1 ? 0.72 : 0.95;
  const breathDur = active ? [T.inhaleMs, T.chantMs, T.restMs][phase] : 600;
  return (
    <div style={{ position: 'relative', width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* טבעת הנשימה */}
      <div style={{
        position: 'absolute', width: 220, height: 220, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.22)',
        transform: `scale(${breathScale})`, transition: `transform ${breathDur}ms ease-in-out`,
        boxShadow: phase === 1 ? '0 0 40px rgba(255,255,255,0.10) inset' : 'none',
      }} />
      {/* מדריך הכיוונים */}
      <DirGuides />
      {/* האור המונחה — זז בכיוון תנועת הראש בזמן ההגייה */}
      {phase === 1 && (
        <div key={`orb-${idx}`} style={{
          position: 'absolute', width: 16, height: 16, borderRadius: '50%',
          background: '#fff', filter: 'drop-shadow(0 0 10px #fff)',
          animation: `hz-${L.dir} ${T.chantMs}ms ease-in-out both`,
        }} />
      )}
      {/* האות המנוקדת */}
      <div style={{
        position: 'relative', fontFamily: THEME.serif, fontSize: 'clamp(80px, 22vw, 130px)', fontWeight: 500,
        color: '#fbfaf5', lineHeight: 1,
        textShadow: phase === 1 ? '0 0 26px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.4)' : '0 0 16px rgba(255,255,255,0.35)',
        transition: 'text-shadow .5s ease', opacity: active ? 1 : 0.85,
      }}>
        {L ? L.marked : 'א'}
      </div>
    </div>
  );
}

function DirGuides() {
  const items = [
    { t: 'מעלה', s: { top: 8, left: '50%', transform: 'translateX(-50%)' } },
    { t: 'מטה', s: { bottom: 8, left: '50%', transform: 'translateX(-50%)' } },
    { t: 'ימין', s: { right: 4, top: '50%', transform: 'translateY(-50%)' } },
    { t: 'שמאל', s: { left: 4, top: '50%', transform: 'translateY(-50%)' } },
  ];
  return <>{items.map((it) => (
    <div key={it.t} style={{ position: 'absolute', ...it.s, fontSize: 10, letterSpacing: 1, color: 'rgba(233,230,221,0.28)' }}>{it.t}</div>
  ))}</>;
}

function SeqDots({ seq, idx, active }) {
  if (seq.length <= 1) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 22, maxWidth: 340, marginInline: 'auto' }}>
      {seq.map((L, i) => (
        <span key={i} title={`שם ${L.nameNum}`} style={{
          fontFamily: THEME.serif, fontSize: 15,
          color: i === idx && active ? '#fbfaf5' : i < idx ? 'rgba(233,230,221,0.5)' : 'rgba(233,230,221,0.28)',
          textShadow: i === idx && active ? '0 0 12px rgba(255,255,255,0.6)' : 'none',
          borderInlineStart: L.first && i !== 0 ? '1px solid rgba(233,230,221,0.2)' : 'none',
          paddingInlineStart: L.first && i !== 0 ? 6 : 0,
        }}>{L.marked}</span>
      ))}
    </div>
  );
}

// ── טבלת כל ע"ב ──
function Table() {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: THEME.dim, marginBottom: 14 }}>
        כל שם — שלוש אותיות עם ניקודן וכיוון תנועת-הראש
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 8 }}>
        {ALL_72.map((n) => (
          <div key={n.num} style={{ ...card, padding: '10px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: THEME.faint, marginBottom: 4 }}>{n.num}</div>
            <div dir="rtl" style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {n.letters.map((L, i) => (
                <span key={i} style={{ fontFamily: THEME.serif, fontSize: 22, color: '#fbfaf5', textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>{L.marked}</span>
              ))}
            </div>
            <div dir="rtl" style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 3, fontSize: 12, color: 'rgba(233,230,221,0.55)' }}>
              {n.letters.map((L, i) => <span key={i} style={{ width: 22, textAlign: 'center' }}>{L.arrow}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerStyle() {
  return (
    <style>{`
      @keyframes hz-up { 0%{transform:translateY(34px);opacity:.25} 20%{opacity:1} 100%{transform:translateY(-96px);opacity:.35} }
      @keyframes hz-down { 0%{transform:translateY(-34px);opacity:.25} 20%{opacity:1} 100%{transform:translateY(96px);opacity:.35} }
      @keyframes hz-leftright { 0%{transform:translateX(-96px);opacity:.25} 20%{opacity:1} 100%{transform:translateX(96px);opacity:.9} }
      @keyframes hz-rightleft { 0%{transform:translateX(96px);opacity:.25} 20%{opacity:1} 100%{transform:translateX(-96px);opacity:.9} }
      @keyframes hz-forward { 0%{transform:scale(.4);opacity:.25} 50%{transform:scale(1.7);opacity:1} 100%{transform:scale(.5);opacity:.3} }
    `}</style>
  );
}

const wrap = { minHeight: '100dvh', maxWidth: 620, margin: '0 auto', padding: '0 16px', direction: 'rtl' };
const backLink = { position: 'fixed', top: '1.3rem', right: '1.3rem', zIndex: 50, color: THEME.dim, fontFamily: THEME.sans, fontSize: '0.9rem', letterSpacing: '0.08em', textDecoration: 'none', opacity: 0.75 };
const tabs = { display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 22 };
const tab = { padding: '7px 14px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontFamily: THEME.serif, fontSize: 14, transition: 'all .2s ease', backdropFilter: 'blur(4px)' };
const pacePill = { padding: '4px 12px', borderRadius: 999, border: '1px solid', background: 'transparent', cursor: 'pointer', fontFamily: THEME.serif, fontSize: 13, transition: 'all .2s ease' };
const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(233,230,221,0.14)', borderRadius: 14, padding: '18px 20px', backdropFilter: 'blur(4px)' };
const primaryBtn = { padding: '12px 32px', fontFamily: THEME.serif, fontSize: 16, color: THEME.light, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, cursor: 'pointer', boxShadow: '0 0 24px rgba(255,255,255,0.12)' };
const ghostBtn = { padding: '12px 26px', fontFamily: THEME.sans, fontSize: 14, color: THEME.dim, background: 'transparent', border: '1px solid rgba(233,230,221,0.2)', borderRadius: 999, cursor: 'pointer' };
