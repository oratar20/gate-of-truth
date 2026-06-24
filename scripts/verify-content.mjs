// ─────────────────────────────────────────────────────────────
//  בדיקת תוכן מאומת — נכשלת בקול אם משהו לא תואם.
//  הרצה:  node scripts/verify-content.mjs
// ─────────────────────────────────────────────────────────────
import { MILUIM, gematria, TZERUFIM, SHEM } from '../lib/kavanot/havaya.js';
import { NAMES_72, NAMES_72_DISPLAY } from '../lib/kavanot/names72.js';
import { SHEM_MEM_BET, SHEM_MEM_BET_DISPLAY, ANA_BEKOACH } from '../lib/kavanot/ana_bekoach.js';

let fails = 0;
const check = (cond, msg) => {
  if (cond) { console.log('  ✓', msg); }
  else { console.log('  ✗', msg); fails++; }
};

console.log('— שם הוי"ה: מילויים (גימטריה) —');
for (const m of MILUIM) {
  const g = gematria(m.spelling.join(''));
  check(g === m.value, `${m.name} = ${m.spelling.join(' ')} → ${g} (צריך ${m.value})`);
}

console.log('— שם הוי"ה: צירופים —');
check(TZERUFIM.length === 12, `12 צירופים נבדלים (קיבלנו ${TZERUFIM.length})`);
const sorted = (a) => [...a].sort().join('');
const base = sorted(SHEM);
check(TZERUFIM.every((t) => sorted(t) === base), 'כל צירוף הוא תמורה של י-ה-ו-ה');
check(new Set(TZERUFIM).size === TZERUFIM.length, 'אין כפילויות בצירופים');
check(TZERUFIM.includes('יהוה'), 'הצירוף הבסיסי יהוה כלול');

console.log('— ע"ב שמות —');
check(NAMES_72.length === 72, `72 שמות (קיבלנו ${NAMES_72.length})`);
check(NAMES_72[0] === 'והו' && NAMES_72[1] === 'ילי', 'שם #1=והו, #2=ילי');
check(NAMES_72.every((n) => [...n].length === 3), 'כל שם בן 3 אותיות');
check(NAMES_72_DISPLAY.length === 72, 'גרסת תצוגה: 72 שמות');

console.log('— שם מ"ב (אנא בכח) —');
const derived = ['אבגיתצ', 'קרעשטנ', 'נגדיכש', 'בטרצתג', 'חקבטנע', 'יגלפזק', 'שקוצית'];
const famous  = ['אבגיתץ', 'קרעשטן', 'נגדיכש', 'בטרצתג', 'חקבטנע', 'יגלפזק', 'שקוצית'];
check(ANA_BEKOACH.length === 7, '7 שורות');
check(ANA_BEKOACH.every((l) => l.words.length === 6), 'שש תיבות בכל שורה');
check(SHEM_MEM_BET.join('').length === 42, `42 אותיות (קיבלנו ${SHEM_MEM_BET.join('').length})`);
check(SHEM_MEM_BET.every((g, i) => g === derived[i]), `גזירה (רגיל): ${SHEM_MEM_BET.join(' ')}`);
check(SHEM_MEM_BET_DISPLAY.every((g, i) => g === famous[i]), `תצוגה (סופיות): ${SHEM_MEM_BET_DISPLAY.join(' ')}`);

console.log(fails === 0 ? '\n✅ כל הבדיקות עברו' : `\n❌ ${fails} בדיקות נכשלו`);
process.exit(fails === 0 ? 0 : 1);
