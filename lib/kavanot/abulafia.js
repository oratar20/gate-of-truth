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

export function letterInfo(rawCh) {
  const ch = base(rawCh);
  const v = LETTER_VOWEL[ch] || 'kamatz';
  const vow = VOWELS[v];
  return { ch, marked: ch + vow.mark, vowel: v, ...vow };
}

// שם → רצף אותיותיו עם ניקוד ותנועה.
export function nameLetters(num0) {
  const name = NAMES_72_DISPLAY[num0];
  return [...name].map((ch, i) => ({ ...letterInfo(ch), letterIdx: i }));
}

// בונה רצף-הדרכה שטוח מתוך מספרי שמות (0-based).
export function buildSequence(nums) {
  const seq = [];
  for (const n of nums) {
    const letters = nameLetters(n);
    letters.forEach((L, i) => seq.push({ ...L, nameNum: n + 1, nameStr: NAMES_72_DISPLAY[n], first: i === 0 }));
  }
  return seq;
}

export const ALL_72 = NAMES_72_DISPLAY.map((s, i) => ({ num: i + 1, letters: nameLetters(i) }));

// ── הכנה (מן ההקדמה) ──
export const PREPARATION = [
  'טַהֵר את מחשבתך מהבלי הזמן, ונקה עצמך מגאווה וכעס.',
  'שֵׁב במקום שקט; פָּנֶיךָ אל המזרח, כמי שמתפלל לפני השם.',
  'כַּוֵּן ליבך לשם שמים ולחכמת האמת בלבד — לא להתגאות.',
  'הַזְכֵּר בניגון ישר, נעים ומתמשך; אל תטעה אף באות או בנקודה אחת.',
];

// ── קצב הנשימה (מן המקור) ──
export const BREATH = {
  note: 'נשימה אחת מתמשכת לכל אות — מושכים את ההגייה בניגון לאורך כל הנשיפה; תנועת הראש והנשיפה מסתיימות יחד. בין אות לאות — מנוחה כשיעור שלוש נשימות.',
  inhaleMs: 4000, chantMs: 9000, restMs: 7000,
};

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
