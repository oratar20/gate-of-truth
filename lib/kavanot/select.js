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

// ── מוקד: שם מע"ב ──
function focusName(state) {
  const idx = nameIndexFor(state);
  const name = NAMES_72_DISPLAY[idx];
  return {
    kind: 'name',
    label: 'שם מע"ב',
    title: name,
    subtitle: `שם ${idx + 1} מתוך ע"ב`,
    letters: [...name],
    explanation:
      'אחד משבעים ושניים השמות הנגזרים משמות יד:יט-כא. ההתבוננות: ' +
      'צייר את שלוש האותיות כאור לבן, נשום לאט, וכוון בהן את הלב.',
    contemplation: {
      woven: 'ראה את שלוש האותיות כאור אחד. נשום, והנח את הדעת בהן.',
    },
    basis: `שם מס׳ ${idx + 1} — נבחר לפי הרגע (יום · ${state?.tefilla || ''} · ${state?.weekday?.sefira || ''}). רוטציה שקופה, לא שיוך מסורתי קבוע.`,
    source: `${NAMES_72_SOURCE} · שם ${idx + 1}`,
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

// כל ארבעת המוקדים לרגע
export function buildFoci(state) {
  return {
    yichud: focusYichud(state),
    name: focusName(state),
    havaya: focusHavaya(state),
    kodesh: focusKodesh(state),
  };
}

// בחירה ראשית לרגע + כל האפשרויות.
// הסריקה מתחלפת באמת בין שלושת המאגרים לפי חתימת-הרגע, ולא נתקעת
// על הייחוד. עוגנים מאומתים גוברים: ר"ח בחודש מאומת → צירוף הוי"ה.
export function pickForMoment(state) {
  const foci = buildFoci(state);
  const monthHe = MONTH_HE[state?.hebrew?.monthName];
  const monthVerified = monthHe && MONTH_TZERUF[monthHe];

  // רוטציה אמיתית על-פני כל המאגרים לפי חתימת-הרגע
  const n = POOLS.length;
  let primaryKind = POOLS[((momentSignature(state) % n) + n) % n];

  // עוגנים מאומתים גוברים על הרוטציה
  if (state?.isRoshChodesh && monthVerified) primaryKind = 'havaya';

  return {
    primary: foci[primaryKind],
    options: [foci.yichud, foci.name, foci.havaya, foci.kodesh],
  };
}
