// ─────────────────────────────────────────────────────────────
//  מיקום ברירת-מחדל מאזור-הזמן של הדפדפן — כשאין geolocation.
//  עדיף לחשב לפי עיר תואמת ל-tz מאשר לקפוץ לירושלים תמיד.
//  הקואורדינטות מייצגות (מספיק מדויק לזריחה/שקיעה ולשעות זמניות).
// ─────────────────────────────────────────────────────────────

export const TZ_COORDS = {
  'America/New_York':    { lat: 40.71,  lng: -74.01,  cityName: 'ניו יורק' },
  'America/Detroit':     { lat: 42.33,  lng: -83.05,  cityName: 'דטרויט' },
  'America/Toronto':     { lat: 43.65,  lng: -79.38,  cityName: 'טורונטו' },
  'America/Chicago':     { lat: 41.88,  lng: -87.63,  cityName: 'שיקגו' },
  'America/Denver':      { lat: 39.74,  lng: -104.99, cityName: 'דנבר' },
  'America/Phoenix':     { lat: 33.45,  lng: -112.07, cityName: 'פיניקס' },
  'America/Los_Angeles': { lat: 34.05,  lng: -118.24, cityName: 'לוס אנג׳לס' },
  'America/Mexico_City': { lat: 19.43,  lng: -99.13,  cityName: 'מקסיקו סיטי' },
  'America/Sao_Paulo':   { lat: -23.55, lng: -46.63,  cityName: 'סאו פאולו' },
  'America/Argentina/Buenos_Aires': { lat: -34.60, lng: -58.38, cityName: 'בואנוס איירס' },
  'Europe/London':       { lat: 51.51,  lng: -0.13,   cityName: 'לונדון' },
  'Europe/Paris':        { lat: 48.85,  lng: 2.35,    cityName: 'פריז' },
  'Europe/Berlin':       { lat: 52.52,  lng: 13.40,   cityName: 'ברלין' },
  'Europe/Madrid':       { lat: 40.42,  lng: -3.70,   cityName: 'מדריד' },
  'Europe/Rome':         { lat: 41.90,  lng: 12.50,   cityName: 'רומא' },
  'Europe/Moscow':       { lat: 55.76,  lng: 37.62,   cityName: 'מוסקבה' },
  'Asia/Jerusalem':      { lat: 31.77,  lng: 35.21,   cityName: 'ירושלים' },
  'Asia/Tel_Aviv':       { lat: 32.08,  lng: 34.78,   cityName: 'תל אביב' },
  'Asia/Istanbul':       { lat: 41.01,  lng: 28.98,   cityName: 'איסטנבול' },
  'Asia/Dubai':          { lat: 25.20,  lng: 55.27,   cityName: 'דובאי' },
  'Asia/Kolkata':        { lat: 28.61,  lng: 77.21,   cityName: 'דלהי' },
  'Asia/Bangkok':        { lat: 13.76,  lng: 100.50,  cityName: 'בנגקוק' },
  'Asia/Shanghai':       { lat: 31.23,  lng: 121.47,  cityName: 'שנגחאי' },
  'Asia/Tokyo':          { lat: 35.68,  lng: 139.69,  cityName: 'טוקיו' },
  'Australia/Sydney':    { lat: -33.87, lng: 151.21,  cityName: 'סידני' },
  'Africa/Johannesburg': { lat: -26.20, lng: 28.04,   cityName: 'יוהנסבורג' },
};

const JERUSALEM = { lat: 31.77, lng: 35.21, cityName: 'ירושלים', tzid: 'Asia/Jerusalem' };

// מיקום ברירת-מחדל לפי אזור-הזמן של הדפדפן.
// 1) התאמה ישירה בטבלה. 2) גזירת אורך מההיסט (offset×15°), רוחב ברירת-מחדל.
// 3) ירושלים כמוצא אחרון.
export function fallbackLocation() {
  let tzid = 'Asia/Jerusalem';
  try { tzid = Intl.DateTimeFormat().resolvedOptions().timeZone || tzid; } catch {}

  const hit = TZ_COORDS[tzid];
  if (hit) return { ...hit, tzid };

  // גזירה גסה מההיסט הנוכחי (שעון הדפדפן = אזור-הזמן הזה)
  try {
    const offsetHours = -new Date().getTimezoneOffset() / 60; // מזרח חיובי
    const lng = Math.max(-180, Math.min(180, offsetHours * 15));
    const region = tzid.split('/').pop()?.replace(/_/g, ' ');
    return { lat: 31.77, lng, cityName: region || 'מיקום משוער', tzid };
  } catch {
    return JERUSALEM;
  }
}
