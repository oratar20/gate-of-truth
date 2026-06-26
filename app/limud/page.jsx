'use client';
// ─────────────────────────────────────────────────────────────
//  אב-טיפוס · לימוד השבוע (זוהר לפי פרשת השבוע)
//  תוכן לדוגמה בלבד — בגרסה החיה: פרשה מ-hebcal, זוהר/פסוק מ-Sefaria,
//  ביאור מ-Claude (מעוגן ומצוטט). כאן רק להמחשת המבנה והעיצוב.
// ─────────────────────────────────────────────────────────────
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';

const STAGES = [
  {
    n: 'א', kicker: 'הַפָּסוּק', cite: 'במדבר יט׳:ב׳',
    he: 'זֹאת חֻקַּת הַתּוֹרָה אֲשֶׁר צִוָּה יְיָ לֵאמֹר',
    body: 'הפרשה נפתחת בחוק שאין לו טעם גלוי — שער אל מה שלמעלה מן השכל.',
  },
  {
    n: 'ב', kicker: 'הַזֹּהַר הַקָּדוֹשׁ', cite: 'זהר, חוקת',
    he: 'רִבִּי יוֹסֵי פָּתַח: זֹאת חֻקַּת הַתּוֹרָה — חֻקָּה דְּגָזַר קֻדְשָׁא בְּרִיךְ הוּא, וְהִיא חֹק עִלָּאָה סְתִימָא דְּכֹלָּא.',
    body: 'הזוהר קורא ל"חוקה" שם של חכמה עליונה נסתרת — הנהגה שמעל הטעם, המאירה דווקא מתוך ההעלם.',
  },
  {
    n: 'ג', kicker: 'הַבֵּאוּר', cite: 'ביאור · מעוגן במקור',
    he: null,
    body: 'מה שאין לו טעם נגלה אינו חיסרון אלא עומק: יש קומה באמונה שמתחילה בדיוק במקום שבו השכל נעצר. ה"חוק" מזמין לקבל מאהבה, ולגלות אור גם במה שאינו מובן.',
  },
  {
    n: 'ד', kicker: 'כַּוָּנָה לַשָּׁבוּעַ', cite: null,
    he: 'לְקַבֵּל בְּאַהֲבָה',
    body: 'השבוע — מקום אחד שבו אני "לא מבין", ובוחר לבטוח. שם נפתח השער.',
  },
];

export default function LimudPrototype() {
  return (
    <Cosmos stars={44}>
      <a href="/" style={backLink}>→ השער</a>
      <div style={wrap}>
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          <div style={{ fontSize: 12.5, letterSpacing: 5, color: THEME.faint, fontWeight: 300 }}>לִימּוּד הַשָּׁבוּעַ</div>
          <div style={{ marginTop: 14 }}>
            <GlowText size="clamp(38px, 10vw, 60px)" weight={500} style={{ letterSpacing: 2 }}>חֻקַּת · בָּלָק</GlowText>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, letterSpacing: 2, color: THEME.dim, fontWeight: 300 }}>
            ✦ פרשת השבוע · בְּאוֹר הַזֹּהַר הַקָּדוֹשׁ ✦
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 40, paddingBottom: 30 }}>
          <div style={spine} />
          {STAGES.map((s, i) => <Stage key={i} s={s} last={i === STAGES.length - 1} />)}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <a href="/ask" style={cta}>הַעֲמֵק בְּשִׂיחָה ←</a>
          <div style={{ marginTop: 16, fontSize: 11.5, letterSpacing: 1, color: THEME.faint }}>
            המקורות נטענים מ-Sefaria · מתחדש מדי שבוע לפי הפרשה
          </div>
        </div>
      </div>
    </Cosmos>
  );
}

function Stage({ s, last }) {
  return (
    <div style={{ position: 'relative', paddingRight: 56, paddingBottom: last ? 0 : 30 }}>
      <div style={node}>{s.n}</div>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: s.he ? 14 : 8 }}>
          <span style={{ fontFamily: THEME.serif, fontSize: 16, color: THEME.light, fontWeight: 500, letterSpacing: 1 }}>{s.kicker}</span>
          {s.cite && <span style={{ fontSize: 11, letterSpacing: 1, color: THEME.faint, whiteSpace: 'nowrap' }}>{s.cite}</span>}
        </div>
        {s.he && (
          <div style={{ fontFamily: THEME.serif, fontSize: 'clamp(18px, 4.6vw, 23px)', lineHeight: 1.75, color: '#fbfaf5', fontWeight: 400,
            textShadow: '0 0 18px rgba(255,255,255,0.28)', marginBottom: s.body ? 14 : 0 }}>
            {s.he}
          </div>
        )}
        {s.body && (
          <div style={{ fontFamily: THEME.sans, fontSize: 15.5, lineHeight: 1.95, fontWeight: 300, color: 'rgba(233,230,221,0.78)' }}>
            {s.body}
          </div>
        )}
      </div>
    </div>
  );
}

const wrap = { minHeight: '100dvh', maxWidth: 600, margin: '0 auto', padding: '0 18px', direction: 'rtl' };
const backLink = { position: 'fixed', top: '1.3rem', right: '1.3rem', zIndex: 50, color: THEME.dim, fontFamily: THEME.sans, fontSize: '0.9rem', letterSpacing: '0.08em', textDecoration: 'none', opacity: 0.75 };
const spine = { position: 'absolute', top: 18, bottom: 18, right: 18, width: 1, background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.4), rgba(255,255,255,0.05))' };
const node = { position: 'absolute', top: 0, right: 0, width: 37, height: 37, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: THEME.serif, fontSize: 17, color: THEME.light, background: 'radial-gradient(circle, rgba(20,18,28,1), rgba(6,4,10,1))',
  border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 0 18px rgba(255,255,255,0.18)', zIndex: 2 };
const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(233,230,221,0.14)', borderRadius: 14, padding: '18px 20px', backdropFilter: 'blur(4px)' };
const cta = { display: 'inline-block', padding: '13px 36px', fontFamily: THEME.serif, fontSize: 17, color: THEME.light, textDecoration: 'none',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, boxShadow: '0 0 26px rgba(255,255,255,0.12)' };
