// ─────────────────────────────────────────────────────────────
//  גלגול הניקוד — שיטת ר' אברהם אבולעפיה, "אור השכל".
//  כל אות נהגית עם כל חמשת הניקודים (גלגול מלא), מוארכת, נשימה לכל
//  ניקוד, עם תנועת-ראש. שים לב: הכיוונים כאן הפוכים מ"חיי העולם הבא"
//  (צרי = שמאל→ימין, קמץ = ימין→שמאל).
// ─────────────────────────────────────────────────────────────

// חמשת הניקודים → כיוון תנועת-ראש (לפי אור השכל), עם ציטוט מקור.
export const VOWELS_OS = {
  holam:  { he: 'חוֹלָם',  mark: 'ֹ', dir: 'up',        arrow: '↑',
    move: 'העלה את הראש מעט-מעט מעלה, ובסיום השתחווה פעם אחת.',
    say: 'הָרֵם את הראש מעלה',
    src: '"תעלה ראשך עם הנשימה מעט מעט עד שתשלים וראשך למעלה, ואחר שתשלים תשתחוה עד הארץ"' },
  chirik: { he: 'חִירִיק', mark: 'ִ', dir: 'down',      arrow: '↓',
    move: 'משוך את הראש מטה — מושך את הכוח העליון להידבק בך.',
    say: 'הַרְכֵּן את הראש מטה',
    src: '"נגן בחרק הנמשך למטה ומושך כח העליון להדביקו בך"' },
  shuruk: { he: 'שׁוּרוּק', mark: 'ֻ', dir: 'forward',   arrow: '•',
    move: 'לא מעלה ולא מטה — משיכה אמצעית כנגד הפנים.',
    say: 'החזק את הראש ישר קדימה',
    src: '"ובשרק לא למעלה ולא למטה אלא משיכה אמצעית כנגד הפנים האמצעיים"' },
  tzere:  { he: 'צֵרֵי',   mark: 'ֵ', dir: 'leftright', arrow: '→',
    move: 'המשך את הראש מהשמאל אל הימין.',
    say: 'הָנַע את הראש משמאל לימין',
    src: '"ובצרי תמשיך ראשך מהשמאל אל הימין"' },
  kamatz: { he: 'קָמָץ',   mark: 'ָ', dir: 'rightleft', arrow: '←',
    move: 'המשך את הראש מהימין אל השמאל.',
    say: 'הָנַע את הראש מימין לשמאל',
    src: '"ובקמץ מהימין אל השמאל"' },
};

// סדר הגלגול: מעלה, מטה, אמצע, ואז שני האופקיים.
export const VOWEL_ORDER_OS = ['holam', 'chirik', 'shuruk', 'tzere', 'kamatz'];

const ALEFBET = [...'אבגדהוזחטיכלמנסעפצקרשת'];

export const LETTER_SETS = [
  { id: 'alef',    title: 'אָלֶ״ף',       letters: ['א'] },
  { id: 'havaya',  title: 'שֵׁם הֲוָיָ״ה', letters: [...'יהוה'] },
  { id: 'alefbet', title: 'כָּל הָאָלֶף־בֵּית', letters: ALEFBET },
];

// בונה רצף גלגול: לכל אות — חמישה ניקודים כסדרם.
export function buildGilgul(letters) {
  const seq = [];
  for (const ch of letters) {
    VOWEL_ORDER_OS.forEach((v, i) => {
      const vow = VOWELS_OS[v];
      seq.push({ ch, letter: ch, vowel: v, marked: ch + vow.mark, ...vow, first: i === 0, group: ch });
    });
  }
  return seq;
}

// כל אות עם חמשת ניקודיה (לטבלה).
export const GILGUL_TABLE = ALEFBET.map((ch) => ({
  letter: ch,
  cells: VOWEL_ORDER_OS.map((v) => ({ marked: ch + VOWELS_OS[v].mark, arrow: VOWELS_OS[v].arrow, vowel: v })),
}));

export const PREPARATION_OS = [
  'שֵׁב וּפָנֶיךָ אל המזרח, שמשם האור יוצא לעולם.',
  'התעטף בבגדים לבנים טהורים, וראשך מוכתר בתפילין.',
  'לך חמש קצוות להניע בהן את ראשך — כנגד חמשת הניקודים.',
  'הַגֵּה כל אות מוארכת, נשימה אחת לכל ניקוד; אם טעית בטור — שוב אל ראשו.',
];

export const BREATH_OS = {
  note: 'כל אות מוארכת עם כל חמשת הניקודים, נשימה אחת לכל ניקוד. בסוף כל טור — מנוחה עד חמש נשימות. אין שניות קבועות; בחר קצב שנוח לך.',
};

export const PACES_OS = [
  { id: 'slow',  label: 'אָרֹךְ',   exhale: 15000 },
  { id: 'med',   label: 'בֵּינוֹנִי', exhale: 11000 },
  { id: 'short', label: 'קָצָר',    exhale: 8000 },
];
export function timingOs(ex) {
  return { inhaleMs: Math.round(ex * 0.45), chantMs: ex, restMs: Math.round(ex * 1.1) };
}

export const SOURCE_OS = 'ר\' אברהם אבולעפיה · אור השכל';
