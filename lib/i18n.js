// ─────────────────────────────────────────────────────────────
//  i18n — עברית / English / Español.
//  מחרוזות ממשק (לא אותיות קודש — שמות/אותיות נשארים בעברית).
//  key → { he, en, es }. הרחבה: הוסף מפתחות כאן, השתמש ב-t(key, lang).
// ─────────────────────────────────────────────────────────────

export const LANGS = ['he', 'en', 'es'];
export const LANG_LABEL = { he: 'עברית', en: 'English', es: 'Español' };
export const RTL_LANGS = ['he'];
export const isRTL = (lang) => RTL_LANGS.includes(lang);

export const STRINGS = {
  // ── כללי ──
  'gate.title':    { he: 'שַׁעַר הָאֱמֶת', en: 'שַׁעַר הָאֱמֶת', es: 'שַׁעַר הָאֱמֶת' },
  'gate.subtitle': { he: 'GATE OF TRUTH', en: 'GATE OF TRUTH', es: 'PORTAL DE LA VERDAD' },
  'gate.back':     { he: '→ השער', en: 'Gate →', es: 'Portal →' },

  // ── דף השער ──
  'hub.intro': {
    he: 'מקום להניח בו את השאלות — ולעלות אל הרגע.\nמענה מעומק הקבלה, והתבוננות בשמות הקודש.',
    en: 'A place to lay down your questions — and rise to the moment.\nAnswers from the depths of Kabbalah, and contemplation of the holy Names.',
    es: 'Un lugar para dejar tus preguntas — y elevarte al momento.\nRespuestas desde lo profundo de la Cabalá, y contemplación de los Nombres sagrados.',
  },
  'hub.disclaimer': {
    he: 'כלי לחיזוק ולעיון. אינו מחליף רב חי או ייעוץ מקצועי.',
    en: 'A tool for reflection and study. Not a substitute for a living teacher or professional guidance.',
    es: 'Una herramienta de reflexión y estudio. No sustituye a un maestro vivo ni a la orientación profesional.',
  },

  // ── שערי הניווט ──
  'gate.reveal.label':  { he: 'הִתְבּוֹנְנוּת', en: 'Contemplation', es: 'Contemplación' },
  'gate.reveal.sub':    { he: 'השם השולט עכשיו · סריקת הרגע לפי מקום ושעה', en: 'The name ruling now · scanned by place & time', es: 'El nombre que rige ahora · según lugar y hora' },
  'gate.ask.label':     { he: 'שְׁאַל', en: 'Ask', es: 'Pregunta' },
  'gate.ask.sub':       { he: 'מענה מעומק הקבלה · מבוסס מקורות', en: 'Answers from the depth of Kabbalah · sourced', es: 'Respuestas desde la Cabalá · con fuentes' },
  'gate.limud.label':   { he: 'לִימּוּד הַשָּׁבוּעַ', en: 'Weekly Study', es: 'Estudio Semanal' },
  'gate.limud.sub':     { he: 'זוהר לפי פרשת השבוע', en: 'Zohar on the weekly portion', es: 'Zóhar sobre la porción semanal' },
  'gate.sefirot.label': { he: 'עֵץ הַסְּפִירוֹת', en: 'Tree of the Sefirot', es: 'Árbol de las Sefirot' },
  'gate.sefirot.sub':   { he: 'עשר הספירות · ירידת האור', en: 'The ten Sefirot · descent of light', es: 'Las diez Sefirot · descenso de la luz' },
  'gate.names.label':   { he: 'ע״ב שֵׁמוֹת', en: 'The 72 Names', es: 'Los 72 Nombres' },
  'gate.names.sub':     { he: 'שבעים ושניים השמות', en: 'The seventy-two Names', es: 'Los setenta y dos Nombres' },
  'gate.havaya.label':  { he: 'שֵׁם הֲוָיָ״ה', en: 'The Name (Havaya)', es: 'El Nombre (Havaiá)' },
  'gate.havaya.sub':    { he: 'השם וצירופיו', en: 'The Name and its permutations', es: 'El Nombre y sus permutaciones' },
  'gate.hazkara.label': { he: 'הַזְכָּרָה', en: 'Hazkara Practice', es: 'Práctica de Hazkará' },
  'gate.hazkara.sub':   { he: 'הזכרת ע"ב שמות · אבולעפיה', en: 'Reciting the 72 Names · Abulafia', es: 'Recitar los 72 Nombres · Abulafia' },
};

export function t(key, lang = 'he', params) {
  const entry = STRINGS[key];
  let s = (entry && (entry[lang] ?? entry.he)) ?? key;
  if (params) for (const k of Object.keys(params)) s = s.split(`{${k}}`).join(params[k]);
  return s;
}

const KEY = 'gate-lang';
export function getStoredLang() {
  try { const l = localStorage.getItem(KEY); return LANGS.includes(l) ? l : 'he'; } catch { return 'he'; }
}
export function storeLang(l) { try { localStorage.setItem(KEY, l); } catch {} }
