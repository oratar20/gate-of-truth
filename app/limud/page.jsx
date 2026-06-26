'use client';
// ─────────────────────────────────────────────────────────────
//  לימוד השבוע — זוהר לפי פרשת השבוע.
//  פרשה מ-hebcal/Sefaria, פסוק+זוהר מ-Sefaria, ביאור מ-Claude (מסומן).
//  מתחדש מדי שבוע. תוכן מקור מאומת; הביאור בלבד הוא פרשנות.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';
import ParashaEmblem from '@/components/kavanot/ParashaEmblem';

const BOOKS = { Genesis: 'בראשית', Exodus: 'שמות', Leviticus: 'ויקרא', Numbers: 'במדבר', Deuteronomy: 'דברים' };
const heRef = (ref) => {
  if (!ref) return '';
  const m = ref.match(/^([A-Za-z ]+?)\s+([\d:.\-]+)/);
  if (m && BOOKS[m[1].trim()]) return `${BOOKS[m[1].trim()]} ${m[2]}`;
  return ref;
};
const sefariaUrl = (ref) => `https://www.sefaria.org/${encodeURIComponent((ref || '').replace(/\s+/g, '_'))}`;

export default function Limud() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch('/api/limud')
      .then((r) => r.json())
      .then((d) => (d.error ? setErr(d.error) : setData(d)))
      .catch((e) => setErr(e.message || 'error'));
  }, []);

  if (err) return <Shell text="לא ניתן לטעון את הלימוד כעת" />;
  if (!data) return <Shell text="פּוֹתֵחַ אֶת שַׁעֲרֵי הַפָּרָשָׁה…" pulse />;

  const stages = [];
  if (data.verse) stages.push({ n: 'א', kicker: 'הַפָּסוּק', cite: heRef(data.verse.ref), url: sefariaUrl(data.verse.ref), he: data.verse.he });
  if (data.zohar) stages.push({ n: 'ב', kicker: 'הַזֹּהַר הַקָּדוֹשׁ', cite: `זהר · ${data.parashaHe}`, url: sefariaUrl(data.zohar.ref), he: data.zohar.he });
  if (data.elucidation) stages.push({ n: 'ג', kicker: 'הַבֵּאוּר', cite: 'ביאור · מעוגן במקור', body: data.elucidation });
  if (data.kavana) stages.push({ n: 'ד', kicker: 'כַּוָּנָה לַשָּׁבוּעַ', he: data.kavana });
  stages.forEach((s, i) => { s.idx = i; s.last = i === stages.length - 1; });

  return (
    <Cosmos stars={44}>
      <a href="/" style={backLink}>→ השער</a>
      <div style={wrap}>
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          <div style={{ fontSize: 12.5, letterSpacing: 5, color: THEME.faint, fontWeight: 300 }}>לִימּוּד הַשָּׁבוּעַ</div>
          <ParashaEmblem parashaHe={data.parashaHe} parashaEn={data.parashaEn} firstEn={data.firstEn} />
          <div style={{ marginTop: 6 }}>
            <GlowText size="clamp(36px, 9.5vw, 58px)" weight={500} style={{ letterSpacing: 2 }}>{data.parashaHe}</GlowText>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, letterSpacing: 2, color: THEME.dim, fontWeight: 300 }}>
            ✦ פרשת השבוע · בְּאוֹר הַזֹּהַר הַקָּדוֹשׁ ✦
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 38, paddingBottom: 30 }}>
          <div style={spine} />
          {stages.map((s) => <Stage key={s.n} s={s} />)}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 44 }}>
          <a href="/ask" style={cta}>הַעֲמֵק בְּשִׂיחָה ←</a>
          <div style={{ marginTop: 16, fontSize: 11.5, letterSpacing: 1, color: THEME.faint }}>
            המקורות נטענים מ-Sefaria · הביאור הוא דברי הסבר · מתחדש מדי שבוע
          </div>
        </div>
      </div>
    </Cosmos>
  );
}

function Stage({ s }) {
  return (
    <div style={{ position: 'relative', paddingRight: 56, paddingBottom: s.last ? 0 : 28 }}>
      <div style={node}>{s.n}</div>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: s.he ? 12 : 8 }}>
          <span style={{ fontFamily: THEME.serif, fontSize: 16, color: THEME.light, fontWeight: 500, letterSpacing: 1 }}>{s.kicker}</span>
          {s.cite && (s.url
            ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, letterSpacing: 1, color: 'rgba(233,230,221,0.5)', whiteSpace: 'nowrap', textDecoration: 'none' }}>{s.cite} ↗</a>
            : <span style={{ fontSize: 11, letterSpacing: 1, color: THEME.faint, whiteSpace: 'nowrap' }}>{s.cite}</span>)}
        </div>
        {s.he && (
          <div style={{ fontFamily: THEME.serif, fontSize: 'clamp(17px, 4.4vw, 22px)', lineHeight: 1.85, color: '#fbfaf5', fontWeight: 400, textShadow: '0 0 18px rgba(255,255,255,0.26)' }}>
            {s.he}
          </div>
        )}
        {s.body && (
          <div style={{ fontFamily: THEME.sans, fontSize: 15.5, lineHeight: 1.95, fontWeight: 300, color: 'rgba(233,230,221,0.8)' }}>
            {s.body}
          </div>
        )}
      </div>
    </div>
  );
}

function Shell({ text, pulse }) {
  return (
    <Cosmos stars={36}>
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <span style={{ fontFamily: THEME.serif, color: THEME.dim, letterSpacing: 2, fontSize: 17, animation: pulse ? 'kvPulse 2s ease-in-out infinite' : 'none' }}>{text}</span>
      </div>
    </Cosmos>
  );
}

const wrap = { minHeight: '100dvh', maxWidth: 600, margin: '0 auto', padding: '0 18px', direction: 'rtl' };
const backLink = { position: 'fixed', top: '1.3rem', right: '1.3rem', zIndex: 50, color: THEME.dim, fontFamily: THEME.sans, fontSize: '0.9rem', letterSpacing: '0.08em', textDecoration: 'none', opacity: 0.75 };
const spine = { position: 'absolute', top: 18, bottom: 18, right: 18, width: 1, background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.4), rgba(255,255,255,0.05))' };
const node = { position: 'absolute', top: 0, right: 0, width: 37, height: 37, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: THEME.serif, fontSize: 17, color: THEME.light, background: 'radial-gradient(circle, rgba(20,18,28,1), rgba(6,4,10,1))', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 0 18px rgba(255,255,255,0.18)', zIndex: 2 };
const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(233,230,221,0.14)', borderRadius: 14, padding: '18px 20px', backdropFilter: 'blur(4px)' };
const cta = { display: 'inline-block', padding: '13px 36px', fontFamily: THEME.serif, fontSize: 17, color: THEME.light, textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, boxShadow: '0 0 26px rgba(255,255,255,0.12)' };
