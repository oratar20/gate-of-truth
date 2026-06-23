// ─────────────────────────────────────────────────────────────
//  Generator · ע"ב שמות (72 Names)
//  מקור: שמות יד:יט-כא. שלושה פסוקים, 72 אותיות כל אחד.
//  גזירה (בוסטרופדון): שם i = פסוק19[i] · פסוק20[73-i] · פסוק21[i]
//  פלט: lib/kavanot/names72.js  —  תוכן מאומת בלבד, נגזר דטרמיניסטית.
//
//  הרצה:  node scripts/gen-names72.mjs
// ─────────────────────────────────────────────────────────────
import { writeFileSync } from 'node:fs';

const REFS = ['Exodus 14:19', 'Exodus 14:20', 'Exodus 14:21'];

// השאר אותיות עבריות בלבד (כולל סופיות). הסר ניקוד, טעמים, מקף, פיסוק, רווחים.
function lettersOnly(s) {
  return [...s].filter((ch) => {
    const c = ch.codePointAt(0);
    return c >= 0x05d0 && c <= 0x05ea; // א..ת כולל ך ם ן ף ץ
  });
}

async function fetchVerse(ref) {
  const u = `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=hebrew`;
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Sefaria ${ref}: HTTP ${r.status}`);
  const j = await r.json();
  let he = j?.versions?.[0]?.text;
  if (Array.isArray(he)) he = he.join(' ');
  if (!he) throw new Error(`Sefaria ${ref}: no Hebrew text`);
  return he;
}

const rows = [];
for (const ref of REFS) {
  const raw = await fetchVerse(ref);
  const letters = lettersOnly(raw);
  console.log(`${ref}: ${letters.length} letters`);
  if (letters.length !== 72) {
    throw new Error(`ABORT — ${ref} has ${letters.length} letters, expected 72`);
  }
  rows.push(letters);
}

const [v19, v20, v21] = rows;
const names = [];
for (let i = 0; i < 72; i++) {
  // פסוק 19 קדימה · פסוק 20 אחורה · פסוק 21 קדימה.
  // האותיות נשמרות בדיוק כצורתן במקור (כולל סופיות) — גזירה נאמנה-למקור.
  names.push(v19[i] + v20[71 - i] + v21[i]);
}

// בדיקות-שיכולות-להיכשל — רק מול שמות שכולם מסכימים וחסרי-סופיות:
const expect = { 0: 'והו', 1: 'ילי' };
for (const [idx, want] of Object.entries(expect)) {
  if (names[idx] !== want) {
    throw new Error(`ABORT — name #${+idx + 1} is "${names[idx]}", expected "${want}"`);
  }
}
// תקינות מבנית: 72 שמות, כל אחד בדיוק 3 אותיות עבריות.
if (names.length !== 72) throw new Error(`ABORT — got ${names.length} names`);
const bad = names.findIndex((n) => !/^[א-ת]{3}$/.test(n));
if (bad !== -1) throw new Error(`ABORT — name #${bad + 1} malformed: "${names[bad]}"`);
console.log(`✓ 72 names derived & verified. #1=${names[0]} #2=${names[1]} ... #72=${names[71]}`);

// גרסת תצוגה: אותיות סופיות מנורמלות לרגילות (כמקובל בחלק מהטבלאות המודפסות).
const FINALS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const display = names.map((n) => [...n].map((c) => FINALS[c] || c).join(''));

const arr = (a) => JSON.stringify(a, null, 0).replace(/","/g, '", "');
const out = `// ─────────────────────────────────────────────────────────────
//  ע"ב שמות — 72 השמות בני שלוש אותיות.
//  מקור: שמות יד:יט-כא (3 פסוקים × 72 אותיות, גזירת בוסטרופדון).
//  נגזר דטרמיניסטית ומאומת ע"י scripts/gen-names72.mjs — אין לערוך ביד.
//
//  NAMES_72         — נאמן למקור, משמר אותיות סופיות כצורתן בפסוק.
//  NAMES_72_DISPLAY — סופיות מנורמלות לרגילות (נפוץ בטבלאות מודפסות).
// ─────────────────────────────────────────────────────────────

export const NAMES_72 = ${arr(names)};

export const NAMES_72_DISPLAY = ${arr(display)};

export const NAMES_72_SOURCE = 'שמות יד:יט-כא · גזירת ע"ב שמות';
`;

writeFileSync(new URL('../lib/kavanot/names72.js', import.meta.url), out, 'utf8');
console.log('→ wrote lib/kavanot/names72.js');
