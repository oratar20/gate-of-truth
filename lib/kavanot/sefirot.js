// ─────────────────────────────────────────────────────────────
//  עשר הספירות — שמות, מיקום בעץ, משמעות מסורתית, והשם שכנגדן.
//  מבנה ותוכן מסורתיים. התאמת ע"ס↔שמות לפי המקובלים (פרדס רמונים וכו').
//  מסגרת ירידת האור (צמצום, קו, חזרה לכתר) — הרמח"ל, קל"ח פתחי חכמה.
// ─────────────────────────────────────────────────────────────

// viewBox 300×480. עמוד ימין (חכמה/חסד/נצח) = x גבוה; שמאל = x נמוך.
export const SEFIROT = [
  { id: 'keter',    name: 'כֶּתֶר',   x: 150, y: 44,  divineName: 'אֶהְיֶה',          meaning: 'רצון עליון · שורש הכל' },
  { id: 'chochma',  name: 'חָכְמָה',  x: 232, y: 104, divineName: 'יָהּ',             meaning: 'ראשית הגילוי · נקודת ההשכלה' },
  { id: 'bina',     name: 'בִּינָה',  x: 68,  y: 104, divineName: 'יְהוָה (אֱלֹהִים)', meaning: 'הבנה והתפשטות · אם הבנים' },
  { id: 'chesed',   name: 'חֶסֶד',   x: 232, y: 206, divineName: 'אֵל',             meaning: 'אהבה והשפעה · ימין' },
  { id: 'gevura',   name: 'גְּבוּרָה', x: 68,  y: 206, divineName: 'אֱלֹהִים',         meaning: 'דין וצמצום · שמאל' },
  { id: 'tiferet',  name: 'תִּפְאֶרֶת', x: 150, y: 256, divineName: 'יְהוָה',           meaning: 'רחמים · קו האמצע המכריע' },
  { id: 'netzach',  name: 'נֶצַח',    x: 232, y: 330, divineName: 'יְהוָה צְבָאוֹת',   meaning: 'נצחיות · הנהגה' },
  { id: 'hod',      name: 'הוֹד',    x: 68,  y: 330, divineName: 'אֱלֹהִים צְבָאוֹת', meaning: 'הוד והודיה' },
  { id: 'yesod',    name: 'יְסוֹד',   x: 150, y: 392, divineName: 'אֵל חַי · שַׁדַּי',  meaning: 'צדיק · מחבר ומעביר השפע' },
  { id: 'malchut',  name: 'מַלְכוּת', x: 150, y: 452, divineName: 'אֲדֹנָי',          meaning: 'שכינה · קבלה וגילוי' },
];

// קווי-חיבור עיקריים בעץ (מזהי ספירות).
export const PATHS = [
  ['keter', 'chochma'], ['keter', 'bina'], ['chochma', 'bina'],
  ['chochma', 'chesed'], ['bina', 'gevura'], ['chochma', 'tiferet'], ['bina', 'tiferet'],
  ['chesed', 'gevura'], ['chesed', 'tiferet'], ['gevura', 'tiferet'],
  ['chesed', 'netzach'], ['gevura', 'hod'], ['tiferet', 'netzach'], ['tiferet', 'hod'],
  ['tiferet', 'yesod'], ['netzach', 'hod'], ['netzach', 'yesod'], ['hod', 'yesod'],
  ['yesod', 'malchut'], ['keter', 'tiferet'], ['netzach', 'malchut'], ['hod', 'malchut'],
];

// נתיב ירידת/עליית הקו במרכז: כתר → ת"ת → יסוד → מלכות (וחזרה).
export const KAV_PATH = ['keter', 'tiferet', 'yesod', 'malchut'];

export const SEFIROT_NAMES = SEFIROT.map((s) => s.name);

export const SEFIROT_SOURCE = 'עשר ספירות · מסורת המקובלים · מסגרת הצמצום: הרמח"ל, קל"ח פתחי חכמה';
