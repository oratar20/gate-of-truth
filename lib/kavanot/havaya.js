// ─────────────────────────────────────────────────────────────
//  שם הוי"ה — השם המפורש, מילואיו, וצירופיו.
//  תוכן מאומת בלבד:
//    · 4 המילויים — מאומתים בגימטריה (72/63/45/52) ע"י verify-content.mjs
//    · 12 הצירופים — נגזרים דטרמיניסטית (4!/2! = 12 תמורות נבדלות)
//  שיוך חודש→צירוף: רק ניסן=יהוה ננעל (מוסכם). השאר ממתין למקור מאומת.
// ─────────────────────────────────────────────────────────────

export const SHEM = ['י', 'ה', 'ו', 'ה'];

// ערכי גימטריה לאותיות המילוי
const GIMATRIA = { א: 1, ד: 4, ה: 5, ו: 6, י: 10 };

export function gematria(s) {
  return [...s].reduce((sum, ch) => sum + (GIMATRIA[ch] || 0), 0);
}

// ── ארבעת המילויים (Milui) ──
// כל מילוי = איות מלא של י-ה-ו-ה. הערך הוא סימן ההיכר של המילוי.
export const MILUIM = [
  {
    id: 'ab', name: 'ע"ב', value: 72,
    spelling: ['יוד', 'הי', 'ויו', 'הי'],
    sefira: 'חכמה',
    note: 'מילוי ביו"דין — הגבוה שבמילויים, כנגד חכמה.',
  },
  {
    id: 'sag', name: 'ס"ג', value: 63,
    spelling: ['יוד', 'הי', 'ואו', 'הי'],
    sefira: 'בינה',
    note: 'מילוי כנגד בינה.',
  },
  {
    id: 'mah', name: 'מ"ה', value: 45,
    spelling: ['יוד', 'הא', 'ואו', 'הא'],
    sefira: 'תפארת / ז"א',
    note: 'מילוי באלפי"ן — שם האדם, כנגד תפארת.',
  },
  {
    id: 'ben', name: 'ב"ן', value: 52,
    spelling: ['יוד', 'הה', 'וו', 'הה'],
    sefira: 'מלכות',
    note: 'מילוי כנגד מלכות, השכינה.',
  },
];

// ── 12 הצירופים (תמורות נבדלות של י-ה-ו-ה) ──
// נגזר דטרמיניסטית. שתי ה' → 4!/2! = 12 צירופים נבדלים.
export function deriveTzerufim() {
  const seen = new Set();
  const out = [];
  const idx = [0, 1, 2, 3];
  const perm = (arr) => {
    if (arr.length === idx.length) {
      const w = arr.map((i) => SHEM[i]).join('');
      if (!seen.has(w)) { seen.add(w); out.push(w); }
      return;
    }
    for (const i of idx) if (!arr.includes(i)) perm([...arr, i]);
  };
  perm([]);
  return out; // 12 צירופים נבדלים
}

export const TZERUFIM = deriveTzerufim();

// שיוך חודש → צירוף. ניסן=יהוה מוסכם ונעול.
// השאר: null = ממתין למקור מאומת (אין להמציא סדר).
export const MONTH_TZERUF = {
  ניסן: 'יהוה',
  אייר: null,
  סיון: null,
  תמוז: null,
  אב: null,
  אלול: null,
  תשרי: null,
  חשון: null,
  כסלו: null,
  טבת: null,
  שבט: null,
  אדר: null,
};

export const HAVAYA_SOURCE = 'שם בן ד׳ · מילוייו וצירופיו';
