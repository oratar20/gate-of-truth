// ─────────────────────────────────────────────────────────────
//  הזכרת ע"ב שמות — שיטת ר' אברהם אבולעפיה, "ספר חיי העולם הבא".
//  נאמן למקור: כל אות ניקוד קבוע → תנועת ראש (כיוון) → נשימה אחת.
//  חמשת הניקודים ממליכים את השם בשש קצוות העולם.
// ─────────────────────────────────────────────────────────────
import { NAMES_72_DISPLAY } from './names72.js';

// ניקוד לכל אות (חלוקת אבולעפיה): 21 אותיות שבע"ב השמות.
const LETTER_VOWEL = {
  'י': 'holam', 'ק': 'holam',
  'א': 'kamatz', 'ד': 'kamatz', 'ו': 'kamatz', 'ז': 'kamatz', 'כ': 'kamatz',
  'ל': 'kamatz', 'ס': 'kamatz', 'ע': 'kamatz', 'צ': 'kamatz', 'ת': 'kamatz',
  'ב': 'tzere', 'ה': 'tzere', 'ח': 'tzere', 'ט': 'tzere', 'מ': 'tzere', 'פ': 'tzere', 'ר': 'tzere',
  'ש': 'chirik',
  'נ': 'shuruk',
  'ג': 'chirik', // אבולעפיה: ג' כניקוד ש', אף שאינה בע"ב השמות
};
const FINALS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const base = (ch) => FINALS[ch] || ch;
// כתיב מסורתי: אות אחרונה בכל שם בצורתה הסופית (עלם, מום, נלך…).
const TO_FINAL = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };
const traditional = (name) => { const a = [...name]; const i = a.length - 1; a[i] = TO_FINAL[a[i]] || a[i]; return a.join(''); };
const NAMES = NAMES_72_DISPLAY.map(traditional);

// חמשת הניקודים → כיוון תנועת-הראש (שש הקצוות), עם ציטוט מהמקור.
export const VOWELS = {
  holam:  { he: 'חוֹלָם',  mark: 'ֹ', dir: 'up',        arrow: '↑',
    move: 'הָרֵם את הראש כלפי מעלה, כנגד השמים; עצום עיניך ופתח פיך.',
    src: '"תניע ראשך לצד מעלה כנגד השמים, וסגור עיניך ופתח פיך ויאירו דבריך"' },
  kamatz: { he: 'קָמָץ',   mark: 'ָ', dir: 'leftright', arrow: '→',
    move: 'הנע הראש מהשמאל אל הימין, ואז החזר לפני מזרח והשתחווה מעט.',
    src: '"נגן באות והנע ראשך מהשמאל אל הימין... ואחר כך שוב והשב ראשך אל פני המזרח"' },
  tzere:  { he: 'צֵרֵי',   mark: 'ֵ', dir: 'rightleft', arrow: '←',
    move: 'הנע הראש מהימין אל השמאל (היפך הקמץ).',
    src: '"התחל בהזכרת האות ובתנועתה ונענע ראשך מהימין אל השמאל, היפך מן הקמץ"' },
  chirik: { he: 'חִירִיק', mark: 'ִ', dir: 'down',      arrow: '↓',
    move: 'השתחווה עם הראש מטה, כמשתחווה לפני השם (היפך החולם).',
    src: '"ונענע לראשך למטה כצורת המשתחווה לפני השם... הפך מתנועת חולם"' },
  shuruk: { he: 'שׁוּרוּק', mark: 'ֻ', dir: 'forward',   arrow: '•',
    move: 'ישר קדימה, ממך והלאה; אל תעלה ואל תוריד את הראש.',
    src: '"והמליכהו מהתחלת עצמך ביושר... ואל תעלה ראשך ואל תורידהו, כי אם הכל בדרך ישרה"' },
};

// משפטי-הדרכה קוליים (TTS) לתנועת-הראש של כל ניקוד.
export const VOWEL_SAY = {
  holam:  'הָרֵם את הראש מעלה',
  kamatz: 'הָנַע את הראש משמאל לימין',
  tzere:  'הָנַע את הראש מימין לשמאל',
  chirik: 'הַרְכֵּן את הראש מטה',
  shuruk: 'החזק את הראש ישר קדימה',
};

export function letterInfo(rawCh) {
  const v = LETTER_VOWEL[base(rawCh)] || 'kamatz';   // הניקוד לפי צורת-האם
  const vow = VOWELS[v];
  return { ch: rawCh, marked: rawCh + vow.mark, vowel: v, ...vow };  // תצוגה בצורת-המקור
}

// שם → רצף אותיותיו עם ניקוד ותנועה (כתיב מסורתי, סופיות בסוף).
export function nameLetters(num0) {
  return [...NAMES[num0]].map((ch, i) => ({ ...letterInfo(ch), letterIdx: i }));
}

// בונה רצף-הדרכה שטוח מתוך מספרי שמות (0-based).
export function buildSequence(nums) {
  const seq = [];
  for (const n of nums) {
    nameLetters(n).forEach((L, i) => seq.push({ ...L, nameNum: n + 1, nameStr: NAMES[n], first: i === 0 }));
  }
  return seq;
}

export const ALL_72 = NAMES.map((s, i) => ({ num: i + 1, letters: nameLetters(i) }));

// ── הכנה (מן ההקדמה) ──
export const PREPARATION = [
  'טַהֵר את מחשבתך מהבלי הזמן, ונקה עצמך מגאווה וכעס.',
  'שֵׁב במקום שקט; פָּנֶיךָ אל המזרח, כמי שמתפלל לפני השם.',
  'כַּוֵּן ליבך לשם שמים ולחכמת האמת בלבד — לא להתגאות.',
  'הַזְכֵּר בניגון ישר, נעים ומתמשך; אל תטעה אף באות או בנקודה אחת.',
];

// ── קצב הנשימה ──
// אבולעפיה אינו נותן שניות: מושכים כל אות בנשימה אחת "כפי אשר תוכל" —
// כאורך נשיפה נוחה; תנועת-הראש והנשיפה מסתיימות יחד; בין אות לאות מנוחה
// כשלוש נשימות. לכן הקצב מתכוונן, ואינו מספר קבוע "מהמקור".
export const BREATH = {
  note: 'לפי אבולעפיה: מושכים כל אות בנשימה אחת "כפי אשר תוכל" — כאורך נשיפה נוחה; תנועת-הראש והנשיפה מסתיימות יחד. בין אות לאות — מנוחה כשלוש נשימות. אין שניות קבועות; בחר קצב שנוח לך.',
  src: '"וכפי אשר תהיה התנועה... עד שתפסיק הנשימה יחד עם תנועות ראשך... אל תוריד ראשך עד שתשלים הכל"',
};

export const PACES = [
  { id: 'slow',  label: 'אָרֹךְ',   exhale: 15000 },
  { id: 'med',   label: 'בֵּינוֹנִי', exhale: 11000 },
  { id: 'short', label: 'קָצָר',    exhale: 8000 },
];

// חלוקת נשיפה לשלבים: שאיפה ~חצי מהנשיפה, הגייה=הנשיפה, מנוחה~שלוש נשימות.
export function timing(exhaleMs) {
  return { inhaleMs: Math.round(exhaleMs * 0.45), chantMs: exhaleMs, restMs: Math.round(exhaleMs * 1.1) };
}

// ── רמות (נבחרות אחת אחרי השנייה) ──
export const LEVELS = [
  { id: 'prep',  title: 'הַכָנָה',            kind: 'prep' },
  { id: 'letter', title: 'אוֹת אַחַת',        kind: 'run', nums: [0], only: 0 },   // האות ו' מן והו
  { id: 'vaho',  title: 'הַשֵּׁם הָרִאשׁוֹן · והו', kind: 'run', nums: [0] },
  { id: 'six',   title: 'שֵׁשׁ שֵׁמוֹת',        kind: 'run', nums: [0, 1, 2, 3, 4, 5] },
  { id: 'verse', title: 'פָּסוּק רִאשׁוֹן · כ"ד שֵׁמוֹת', kind: 'run', nums: Array.from({ length: 24 }, (_, i) => i) },
  { id: 'all',   title: 'כָּל ע"ב · הַטַּבְלָה', kind: 'table' },
];

export const SOURCE = 'ר\' אברהם אבולעפיה · ספר חיי העולם הבא';
