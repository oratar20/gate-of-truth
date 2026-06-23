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
