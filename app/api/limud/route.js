// ─────────────────────────────────────────────────────────────
//  /api/limud — לימוד השבוע: פרשה (Sefaria) → פסוק + זוהר (Sefaria)
//  → ביאור + כוונה (Claude, מעוגן ומסומן). מטמון שבועי לפי הפרשה.
// ─────────────────────────────────────────────────────────────
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-5-20250929';

const cache = new Map(); // parashaEn → data

function clean(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
function excerpt(s, max = 540) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const i = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('׃'), cut.lastIndexOf(':'));
  return (i > 220 ? cut.slice(0, i + 1) : cut) + ' …';
}
async function sefariaText(ref) {
  try {
    const r = await fetch(`https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}`);
    if (!r.ok) return null;
    const j = await r.json();
    let he = j?.versions?.find((v) => v.language === 'he')?.text ?? j?.versions?.[0]?.text;
    if (Array.isArray(he)) he = he.flat().join(' ');
    he = clean(he);
    return he ? { he, ref: j?.ref || ref } : null;
  } catch { return null; }
}

export async function GET() {
  try {
    const cal = await fetch('https://www.sefaria.org/api/calendars?diaspora=1').then((r) => r.json());
    const par = cal.calendar_items.find((c) => c.title?.en === 'Parashat Hashavua');
    if (!par) return Response.json({ error: 'no parasha' }, { status: 502 });

    const parashaHe = par.displayValue.he;                    // חקת-בלק
    const parashaEn = par.displayValue.en.replace(/^Parashat /, ''); // Chukat-Balak
    const torahRef = par.ref;                                 // Numbers 19:1-25:9
    const firstEn = parashaEn.split('-')[0];                  // Chukat

    if (cache.has(parashaEn)) {
      return Response.json(cache.get(parashaEn), { headers: { 'Cache-Control': 'public, s-maxage=86400' } });
    }

    const startRef = torahRef.split('-')[0];                  // Numbers 19:1
    const [verse, zoharRaw] = await Promise.all([
      sefariaText(startRef),
      sefariaText(`Zohar, ${firstEn}.1`),
    ]);
    const zohar = zoharRaw ? { he: excerpt(zoharRaw.he), ref: zoharRaw.ref } : null;

    let elucidation = '', kavana = '';
    if (process.env.ANTHROPIC_API_KEY && zohar) {
      try {
        const msg = await client.messages.create({
          model: MODEL,
          max_tokens: 600,
          system:
            'אתה כותב "ביאור" קצר ובהיר בעברית לקטע מהזוהר הקדוש, עבור לומד מתחיל. ' +
            'הישאר נאמן אך ורק לטקסט שניתן לך — אל תמציא ציטוטים, מקורות, או רעיונות שאינם בקטע. ' +
            'הביאור הוא דברי הסבר שלך, לא דברי הזוהר עצמו. כתוב בחום ובבהירות, וחבר לעבודת הלב. ' +
            'החזר JSON בלבד, ללא טקסט נוסף: {"beur": "2-4 משפטים", "kavana": "משפט מעשי אחד לשבוע"}.',
          messages: [{ role: 'user', content: `פרשת ${parashaHe}.\nקטע מהזוהר:\n${zohar.he}` }],
        });
        const t = msg.content?.[0]?.text || '';
        const j = JSON.parse(t.match(/\{[\s\S]*\}/)[0]);
        elucidation = clean(j.beur);
        kavana = clean(j.kavana);
      } catch { /* ביאור יישאר ריק — העמוד עדיין מציג פסוק+זוהר */ }
    }

    const data = { parashaHe, parashaEn, firstEn, verse, zohar, elucidation, kavana };
    cache.set(parashaEn, data);
    return Response.json(data, { headers: { 'Cache-Control': 'public, s-maxage=86400' } });
  } catch (e) {
    return Response.json({ error: e.message || 'limud error' }, { status: 500 });
  }
}
