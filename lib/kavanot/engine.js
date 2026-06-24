// ─────────────────────────────────────────────────────────────
//  KAVANOT · State Resolver
//  מחשב את "המצב הרוחני הנוכחי" בדיוק — תאריך, זמן הלכתי, יום,
//  חודש, עומר, חצות. מחזיר STATE בלבד.
//  אינו ממציא תוכן: צירופים/ייחודים נשלפים מטבלת מקורות נפרדת.
// ─────────────────────────────────────────────────────────────
import { HDate, Zmanim, Location, months, HebrewCalendar } from '@hebcal/core';

const SEFIROT = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];
// ימי השבוע ↔ ז' הספירות (ראשון=חסד ... שבת=מלכות)
const DAY_SEFIRA = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];

// ── שעות זמניות (Planetary Hours) ──
// סדר כשדי של ז' כוכבי הלכת (מהאיטי למהיר):
const CHALDEAN = ['שבתאי', 'צדק', 'מאדים', 'חמה', 'נוגה', 'כוכב', 'לבנה'];
// שליט השעה הראשונה אחר הזריחה, לפי יום השבוע (א=חמה ... שבת=שבתאי):
const DAY_RULER = ['חמה', 'לבנה', 'מאדים', 'כוכב', 'צדק', 'נוגה', 'שבתאי'];
// כוכב ↔ ספירה ↔ שם (התאמת המקובלים; ז' כוכבים לז' ספירות תחתונות):
const PLANET_META = {
  שבתאי: { en: 'Saturn',  sefira: 'מלכות', name: 'אֲדֹנָי',          letters: ['א', 'ד', 'נ', 'י'] },
  צדק:   { en: 'Jupiter', sefira: 'חסד',   name: 'אֵל',             letters: ['א', 'ל'] },
  מאדים: { en: 'Mars',    sefira: 'גבורה', name: 'אֱלֹהִים',         letters: ['א', 'ל', 'ה', 'י', 'ם'] },
  חמה:   { en: 'Sun',     sefira: 'תפארת', name: 'יְהוָה',           letters: ['י', 'ה', 'ו', 'ה'] },
  נוגה:  { en: 'Venus',   sefira: 'נצח',   name: 'יְהוָה צְבָאוֹת',   letters: ['י', 'ה', 'ו', 'ה'] },
  כוכב:  { en: 'Mercury', sefira: 'הוד',   name: 'אֱלֹהִים צְבָאוֹת', letters: ['א', 'ל', 'ה', 'י', 'ם'] },
  לבנה:  { en: 'Moon',    sefira: 'יסוד',  name: 'שַׁדַּי',           letters: ['ש', 'ד', 'י'] },
};

// התאריך האזרחי (Y/M/D) במיקום — חסין ל-timezone של המכונה/דפדפן.
function localYMD(date, tzid) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: tzid, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const g = (t) => +p.find((x) => x.type === t).value;
  return { y: g('year'), m: g('month'), d: g('day') };
}
// Date בצהרי התאריך הנתון (רכיביו המקומיים = התאריך המבוקש) — כך ש-hebcal
// יקרא את היום הנכון בלי תלות ב-tz של הריצה. החזרה: { zmanim, weekday }.
function ymdNoon(ymd, n = 0) {
  return new Date(ymd.y, ymd.m - 1, ymd.d + n, 12, 0, 0);
}

// מחשב את השעה הזמנית השלטת ברגע — מהזריחה/שקיעה האמיתיות במיקום.
function computeShaaZmanit(now, loc, tzid) {
  try {
    const t = now.getTime();
    const today = localYMD(now, tzid);
    const zFor = (n) => new Zmanim(loc, ymdNoon(today, n), false);
    const sunrise = zFor(0).neitzHaChama().getTime();
    const sunset = zFor(0).shkiah().getTime();

    let portion, segStart, segLen, idx, planetaryNoon;
    if (t < sunrise) {
      // לילה שהחל בשקיעת אתמול — היום הפלנטרי הוא אתמול
      const ySunset = zFor(-1).shkiah().getTime();
      portion = 'night';
      segLen = (sunrise - ySunset) / 12;
      idx = Math.floor((t - ySunset) / segLen);
      segStart = ySunset; planetaryNoon = ymdNoon(today, -1);
    } else if (t < sunset) {
      portion = 'day';
      segLen = (sunset - sunrise) / 12;
      idx = Math.floor((t - sunrise) / segLen);
      segStart = sunrise; planetaryNoon = ymdNoon(today, 0);
    } else {
      // לילה שהחל בשקיעת הערב — היום הפלנטרי הוא היום
      const tSunrise = zFor(1).neitzHaChama().getTime();
      portion = 'night';
      segLen = (tSunrise - sunset) / 12;
      idx = Math.floor((t - sunset) / segLen);
      segStart = sunset; planetaryNoon = ymdNoon(today, 0);
    }
    idx = Math.max(0, Math.min(11, idx));               // 0..11
    const globalIdx = portion === 'day' ? idx : 12 + idx; // 0..23 מהזריחה
    const wd = planetaryNoon.getDay();                   // 0=ראשון (תאריך-אזרחי)
    const startPos = CHALDEAN.indexOf(DAY_RULER[wd]);
    const planet = CHALDEAN[(startPos + globalIdx) % 7];
    return {
      portion,                       // 'day' | 'night'
      index: idx + 1,                // השעה ה-1..12
      planet,
      ...PLANET_META[planet],        // en, sefira, name, letters
      start: new Date(segStart + idx * segLen),       // תחילת השעה הנוכחית
      end: new Date(segStart + (idx + 1) * segLen),   // סופה
    };
  } catch {
    return null; // קווי-רוחב קיצוניים / שגיאת זמנים
  }
}

export function resolveState(now, { lat, lng, tzid = 'America/New_York', cityName = '' }) {
  const loc = new Location(lat, lng, false, tzid, cityName);
  const hd = new HDate(now);
  const z = new Zmanim(loc, now, false);

  // ── זמנים הלכתיים ──
  const Z = {
    alot:        z.alotHaShachar(),
    netz:        z.neitzHaChama(),
    chatzot:     z.chatzot(),
    minchaGedola:z.minchaGedola(),
    shkia:       z.shkiah(),
    tzeit:       z.tzeit(),
    chatzotNight:z.chatzotNight(),
  };

  // ── חלון התפילה הנוכחי + יום/לילה הלכתי ──
  const t = now.getTime();
  let tefilla, dayNight;
  if (t >= Z.alot.getTime() && t < Z.netz.getTime())            { tefilla = 'עלות→הנץ'; dayNight = 'יום'; }
  else if (t >= Z.netz.getTime() && t < Z.chatzot.getTime())    { tefilla = 'שחרית';    dayNight = 'יום'; }
  else if (t >= Z.chatzot.getTime() && t < Z.minchaGedola.getTime()){ tefilla = 'אחר חצות'; dayNight = 'יום'; }
  else if (t >= Z.minchaGedola.getTime() && t < Z.shkia.getTime()){ tefilla = 'מנחה';     dayNight = 'יום'; }
  else if (t >= Z.shkia.getTime() && t < Z.tzeit.getTime())     { tefilla = 'בין השמשות'; dayNight = 'ספק'; }
  else                                                           { tefilla = 'ערבית';    dayNight = 'לילה'; }

  const beforeChatzotNight =
    (t >= Z.tzeit.getTime() && t < Z.chatzotNight.getTime()) ||
    (t < Z.alot.getTime() && t < Z.chatzotNight.getTime());

  // ── יום בשבוע ↔ ספירה ──
  const dow = hd.getDay();                 // 0=ראשון ... 6=שבת
  const sefiraOfDay = DAY_SEFIRA[dow];
  const isShabbat = dow === 6;

  // ── ספירת העומר (אם פעיל) ──
  const hy = hd.getFullYear();
  const omerStart = new HDate(16, months.NISAN, hy).abs(); // ליל ב' של פסח = יום 1
  const omerDay = hd.abs() - omerStart + 1;
  let omer = null;
  if (omerDay >= 1 && omerDay <= 49) {
    const week = Math.ceil(omerDay / 7);
    const inWeek = ((omerDay - 1) % 7) + 1;
    omer = {
      day: omerDay,
      combo: `${SEFIROT[inWeek - 1]} שב${SEFIROT[week - 1]}`,
      week, inWeek,
    };
  }

  // ── חודש, ראש חודש, חגים ──
  const monthName = hd.getMonthName();
  const isRoshChodesh = hd.getDate() === 1 || hd.getDate() === 30;
  const holidays = HebrewCalendar.getHolidaysOnDate(hd, false) || [];

  return {
    gregorian: now,
    hebrew: { date: hd.render('he'), day: hd.getDate(), monthName, year: hy },
    weekday: { index: dow, sefira: sefiraOfDay, isShabbat },
    zmanim: Z,
    tefilla,
    dayNight,
    beforeChatzotNight,
    omer,                                    // null אם אין עומר
    isRoshChodesh,
    holidays: holidays.map(e => e.render('he')),
    // ── מיקום + שעה זמנית שלטת ──
    location: { lat, lng, tzid, cityName },
    shaaZmanit: computeShaaZmanit(now, loc, tzid),
    // ── תוכן קבלי: נשלף מטבלת מקורות, לא מחושב כאן ──
    monthPermutation: null,                  // צירוף הוי"ה לחודש — לפי מקור, יוזן בנפרד
  };
}

// ── תקציר קריא לאדם ──
export function summarize(s) {
  const lines = [
    `${s.hebrew.date}`,
    `יום ${['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'][s.weekday.index]} · ${s.weekday.sefira}`,
    `${s.tefilla} · ${s.dayNight}${s.beforeChatzotNight ? ' · לפני חצות' : ''}`,
  ];
  if (s.omer) lines.push(`עומר יום ${s.omer.day}: ${s.omer.combo}`);
  if (s.isRoshChodesh) lines.push('ראש חודש');
  if (s.holidays.length) lines.push(s.holidays.join(', '));
  return lines.join('\n');
}
