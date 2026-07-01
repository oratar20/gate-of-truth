// ─────────────────────────────────────────────────────────────
//  בחירת התבוננות לרגע — סורק את ה-STATE ומציע מוקד התבוננות:
//  ייחוד · שם מע"ב · צירוף שם הוי"ה.
//
//  עיקרון יושרה: היכן שיש שיוך מאומת (ייחוד יומי כללי; צירוף הוי"ה
//  לחודש ניסן) — נשען עליו ומציין מקור. היכן שאין — הבחירה מתוארת
//  בשקיפות כ"רוטציה" ולא כשיוך מסורתי קבוע. לעולם לא ממציאים מקור.
// ─────────────────────────────────────────────────────────────
import { YICHUD_YAHADONHI } from './yichudim.js';
import { NAMES_72_DISPLAY, NAMES_72_SOURCE } from './names72.js';
import { MONTH_TZERUF, HAVAYA_SOURCE } from './havaya.js';
import { SHEMOT_KODESH, SHEMOT_KODESH_SOURCE } from './names_kodesh.js';
import { ANA_BEKOACH, SHEM_MEM_BET_DISPLAY, ANA_BEKOACH_SOURCE } from './ana_bekoach.js';
import { MEANINGS_72, MEANINGS_72_SOURCE } from './names72_meanings.js';

// שמות חודשי hebcal (אנגלית) → מפתח עברי ב-MONTH_TZERUF
const MONTH_HE = {
  Nisan: 'ניסן', Iyyar: 'אייר', Sivan: 'סיון', Tamuz: 'תמוז', Av: 'אב',
  Elul: 'אלול', Tishrei: 'תשרי', Cheshvan: 'חשון', Kislev: 'כסלו',
  Tevet: 'טבת', "Sh'vat": 'שבט', Adar: 'אדר', 'Adar I': 'אדר', 'Adar II': 'אדר',
};

const PRAYER_WINDOWS = ['שחרית', 'מנחה', 'ערבית'];
const TEFILLA_ORDER = ['עלות→הנץ', 'שחרית', 'אחר חצות', 'מנחה', 'בין השמשות', 'ערבית'];
const SEFIROT = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];
const POOLS = ['yichud', 'name', 'havaya', 'kodesh'];

// יום-בשנה יציב (0..364)
function dayOfYear(state) {
  const d = state?.gregorian instanceof Date ? state.gregorian : new Date(state?.gregorian || 0);
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}
function tefillaIndex(state) {
  const i = TEFILLA_ORDER.indexOf(state?.tefilla);
  return i < 0 ? 0 : i;
}
function sefiraIndex(state) {
  const i = SEFIROT.indexOf(state?.weekday?.sefira);
  return i < 0 ? 0 : i;
}
// חתימת-רגע: משתנה לפי יום *וגם* לפי חלון התפילה — כך שסריקה בזמנים
// שונים של אותו יום תיתן תוצאות שונות.
function momentSignature(state) {
  return dayOfYear(state) * 6 + tefillaIndex(state);
}
// אינדקס שם מע"ב רגיש-לרגע (0..71) — רוטציה שקופה לפי יום+תפילה+ספירה.
function nameIndexFor(state) {
  const raw = dayOfYear(state) + tefillaIndex(state) * 11 + sefiraIndex(state) * 7;
  return ((raw % 72) + 72) % 72;
}
// אינדקס שם-קודש רגיש-לרגע (0..6).
function kodeshIndexFor(state) {
  const raw = dayOfYear(state) + tefillaIndex(state) * 3 + sefiraIndex(state);
  return ((raw % SHEMOT_KODESH.length) + SHEMOT_KODESH.length) % SHEMOT_KODESH.length;
}

// ── מוקד: ייחוד ──
function focusYichud(state) {
  const y = YICHUD_YAHADONHI;
  const inPrayer = PRAYER_WINDOWS.includes(state?.tefilla);
  return {
    kind: 'yichud',
    label: 'ייחוד',
    title: y.title,
    subtitle: y.subtitle,
    letters: y.woven,
    woven: y.woven,
    split: y.split,
    explanation: y.explanation,
    contemplation: y.contemplation,
    basis: inPrayer
      ? `כעת זמן ${state.tefilla} — ייחוד הכוונה הכללי, מתאים בפרט לתפילה.`
      : 'הייחוד היומי הכללי של קוב"ה ושכינתיה — מתאים לכל עת.',
    source: y.source,
  };
}

// ── מוקד: שם מע"ב (שיטת 72shemot — זריחה + סלוט 20 דק') ──
function focusName(state) {
  const sz = state?.shem72;
  const idx = sz ? sz.index : nameIndexFor(state);   // מדויק אם זמין, אחרת רוטציה
  const name = NAMES_72_DISPLAY[idx];
  const meaning = MEANINGS_72[idx];
  const tz = state?.location?.tzid;
  const city = state?.location?.cityName;
  const fmt = (d) => { try { return new Intl.DateTimeFormat('he', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date(d)); } catch { return ''; } };
  const basis = sz
    ? `שיטת ע"ב שמות · זריחה ${fmt(sz.sunrise)}${city ? ` · ${city}` : ''} · השם שולט ${fmt(sz.slotStart)}–${fmt(sz.slotEnd)}.`
    : `שם מס׳ ${idx + 1} — רוטציה לפי הרגע (לא שיוך מסורתי קבוע).`;
  return {
    kind: 'name',
    label: 'שם מע"ב',
    title: name,
    subtitle: `שם ${idx + 1} מתוך ע"ב`,
    letters: [...name],
    explanation: meaning ||
      'אחד משבעים ושניים השמות הנגזרים משמות יד:יט-כא. ההתבוננות: ' +
      'צייר את שלוש האותיות כאור לבן, נשום לאט, וכוון בהן את הלב.',
    contemplation: { woven: 'ראה את שלוש האותיות כאור אחד. נשום, והנח את הדעת בהן.' },
    basis,
    source: sz ? `${MEANINGS_72_SOURCE} · שם ${idx + 1}` : `${NAMES_72_SOURCE} · שם ${idx + 1}`,
  };
}

// ── מוקד: שם הוי"ה / צירוף החודש ──
function focusHavaya(state) {
  const monthHe = MONTH_HE[state?.hebrew?.monthName];
  const perm = monthHe ? MONTH_TZERUF[monthHe] : null; // מאומת רק לניסן
  const letters = perm || 'יהוה';
  return {
    kind: 'havaya',
    label: perm ? `צירוף ${monthHe}` : 'שם הוי"ה',
    title: letters,
    subtitle: perm ? `צירוף הוי"ה לחודש ${monthHe}` : 'השם המפורש',
    letters: [...letters],
    explanation: perm
      ? `צירוף שם הוי"ה לחודש ${monthHe}. ההתבוננות: ראה את ארבע האותיות זוהרות, וכוון בהן.`
      : 'שם הוי"ה — השם המפורש. ההתבוננות: ראה את ארבע האותיות כאור, ויחד אותן בלב.',
    contemplation: {
      woven: 'ראה את ארבע האותיות כאור אחד. נשום, ויחד אותן בלב.',
    },
    basis: perm
      ? `צירוף מאומת לחודש ${monthHe}.`
      : 'שם הוי"ה הבסיסי — שיוך הצירוף לחודש זה ממתין למקור מאומת.',
    source: HAVAYA_SOURCE,
  };
}

// ── מוקד: שם מהשמות שאינם נמחקים ──
function focusKodesh(state) {
  const idx = kodeshIndexFor(state);
  const k = SHEMOT_KODESH[idx];
  return {
    kind: 'kodesh',
    label: 'שם הקודש',
    title: k.name,
    subtitle: k.gloss,
    letters: k.letters,
    explanation:
      'אחד משבעת השמות שאינם נמחקים (רמב"ם, יסודי התורה ו:ב). ' +
      'ההתבוננות: ראה את אותיות השם כאור, נשום, וכוון בהן את הלב.',
    contemplation: {
      woven: 'ראה את אותיות השם כאור אחד. נשום, והנח את הדעת בהן.',
    },
    basis: `שם ${idx + 1} מתוך שבעת השמות — נבחר לפי הרגע (יום · ${state?.tefilla || ''}). רוטציה שקופה.`,
    source: SHEMOT_KODESH_SOURCE,
  };
}

// ── מוקד: השם השולט ברגע (שעה זמנית) ──
// המוקד הראשי והרציני: נקבע מהמיקום + השעה + יום השבוע (שעות זמניות),
// לא רוטציה. כוכב השעה ↔ ספירה ↔ שם.
function focusRuler(state) {
  const sz = state?.shaaZmanit;
  if (!sz) return null;
  const portionHe = sz.portion === 'day' ? 'היום' : 'הלילה';
  const city = state?.location?.cityName;
  const fmt = (d) => { try { return new Intl.DateTimeFormat('he', { timeZone: state?.location?.tzid, hour: '2-digit', minute: '2-digit' }).format(new Date(d)); } catch { return ''; } };
  return {
    kind: 'ruler',
    label: 'השם השולט עכשיו',
    title: sz.name,
    subtitle: `${sz.planet} · ספירת ${sz.sefira}`,
    letters: sz.letters,
    explanation:
      `ברגע זה שולטת השעה הזמנית ה-${sz.index} של ${portionHe}, ` +
      `בשליטת ${sz.planet} (${sz.en}) — כנגד ספירת ${sz.sefira}. השם השולט: ${sz.name}.`,
    contemplation: { woven: 'ראה את אותיות השם כאור אחד. נשום, ויחד בו את הלב.' },
    basis:
      `שעה זמנית${city ? ` · ${city}` : ''} · ${fmt(sz.start)}–${fmt(sz.end)} · ` +
      `מחושב מהזריחה/שקיעה במקום ויום השבוע.`,
    source: 'שעות זמניות (Planetary Hours) · התאמת כוכב↔ספירה↔שם לפי המקובלים',
  };
}

// ── מוקד: שם מ"ב (אנא בכח) — השורה כנגד ספירת השעה/היום ──
function focusAna(state) {
  const sef = state?.shaaZmanit?.sefira || state?.weekday?.sefira;
  let i = ANA_BEKOACH.findIndex((l) => l.sefira === sef);
  if (i < 0) i = 0;
  const line = ANA_BEKOACH[i];
  const group = SHEM_MEM_BET_DISPLAY[i];
  return {
    kind: 'ana',
    label: 'שם מ"ב',
    title: group,
    subtitle: `אנא בכח · שורת ${line.sefira}`,
    letters: [...group],
    explanation:
      `שורה מתוך שם המ"ב (אַנָּא בְּכֹחַ), כנגד ספירת ${line.sefira}: ` +
      `"${line.words.join(' ')}". ראשי-התיבות: ${group}.`,
    contemplation: { woven: 'ראה את שש האותיות כאור, נשום, וכוון בשורת התפילה.' },
    basis: `שם מ"ב — השורה כנגד ספירת ${sef} (ספירת השעה/היום).`,
    source: ANA_BEKOACH_SOURCE,
  };
}

// כל המוקדים לרגע (הראשי = השם השולט, אם זמין)
export function buildFoci(state) {
  return {
    ruler: focusRuler(state),
    yichud: focusYichud(state),
    name: focusName(state),
    havaya: focusHavaya(state),
    kodesh: focusKodesh(state),
    ana: focusAna(state),
  };
}

// בחירה ראשית לרגע + כל האפשרויות.
// הסריקה מתחלפת באמת בין שלושת המאגרים לפי חתימת-הרגע, ולא נתקעת
// על הייחוד. עוגנים מאומתים גוברים: ר"ח בחודש מאומת → צירוף הוי"ה.
export function pickForMoment(state) {
  const foci = buildFoci(state);
  const options = [foci.ruler, foci.yichud, foci.name, foci.havaya, foci.kodesh, foci.ana].filter(Boolean);

  // המוקד הראשי = השם השולג ברגע (שעה זמנית). אם החישוב לא זמין
  // (קו-רוחב קיצוני / שגיאת זמנים) — נופלים חזרה לרוטציה על המאגרים.
  let primary = foci.ruler;
  if (!primary) {
    const n = POOLS.length;
    const kind = POOLS[((momentSignature(state) % n) + n) % n];
    primary = foci[kind];
  }

  return { primary, options };
}
