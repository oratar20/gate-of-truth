'use client';
// ─────────────────────────────────────────────────────────────
//  Names72Grid · ע"ב שמות — רשת אינטראקטיבית של 72 השמות.
//  עוטף ב-<Cosmos> ומשתמש ב-GlowText / THEME מן מערכת העיצוב המשותפת.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';
import {
  NAMES_72,
  NAMES_72_DISPLAY,
  NAMES_72_SOURCE,
} from '@/lib/kavanot/names72';

// מספרים עבריים 1–72 לתצוגת "שם מ״ה"
const HEB_UNITS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const HEB_TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
function hebNumeral(n) {
  const tens = Math.floor(n / 10);
  const units = n % 10;
  let t = HEB_TENS[tens] || '';
  let u = HEB_UNITS[units] || '';
  // יד / טו / טז — צורות מקובלות למניעת אזכור שם
  if (n === 15) return 'ט״ו';
  if (n === 16) return 'ט״ז';
  const letters = (t + u).split('');
  if (letters.length === 1) return letters[0] + '׳';
  return letters.slice(0, -1).join('') + '״' + letters.slice(-1).join('');
}

export default function Names72Grid() {
  const [normalized, setNormalized] = useState(false);
  const [active, setActive] = useState(null);
  const list = normalized ? NAMES_72_DISPLAY : NAMES_72;

  return (
    <Cosmos>
      {/* קישור חזרה דק בפינה */}
      <a
        href="/"
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          zIndex: 6,
          fontFamily: THEME.sans,
          fontSize: 13,
          letterSpacing: 1,
          fontWeight: 300,
          color: THEME.dim,
          textDecoration: 'none',
          padding: '6px 12px',
          borderRadius: 999,
          border: '1px solid rgba(233,230,221,0.14)',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(4px)',
        }}
      >
        ← השער
      </a>

      <main
        style={{
          position: 'relative',
          maxWidth: 1040,
          margin: '0 auto',
          padding: '78px 18px 64px',
          textAlign: 'center',
        }}
      >
        {/* כותרת */}
        <header style={{ animation: 'kvFadeUp 1s ease both', marginBottom: 6 }}>
          <GlowText
            size="clamp(46px, 12vw, 84px)"
            weight={500}
            style={{ letterSpacing: 4, display: 'inline-block', lineHeight: 1.1 }}
          >
            ע״ב שֵׁמוֹת
          </GlowText>
          <p
            style={{
              fontFamily: THEME.serif,
              fontSize: 'clamp(15px, 4vw, 19px)',
              fontWeight: 400,
              color: 'rgba(233,230,221,0.82)',
              margin: '18px auto 0',
              maxWidth: 460,
              lineHeight: 1.7,
            }}
          >
            שבעים ושניים שמות בני שלוש אותיות · נגזרים משמות יד׳
          </p>
        </header>

        {/* קו מפריד */}
        <div
          style={{
            width: 54,
            height: 1,
            margin: '28px auto 30px',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />

        {/* מתג כתיב */}
        <div
          role="group"
          aria-label="בחירת כתיב"
          style={{
            display: 'inline-flex',
            gap: 6,
            padding: 4,
            marginBottom: 38,
            borderRadius: 999,
            border: '1px solid rgba(233,230,221,0.16)',
            background: 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <ToggleBtn active={!normalized} onClick={() => setNormalized(false)}>
            כתיב מקור
          </ToggleBtn>
          <ToggleBtn active={normalized} onClick={() => setNormalized(true)}>
            כתיב מנורמל
          </ToggleBtn>
        </div>

        {/* רשת השמות */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))',
            gap: 'clamp(8px, 1.8vw, 16px)',
            maxWidth: 920,
            margin: '0 auto',
          }}
        >
          {list.map((name, i) => {
            const num = i + 1;
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(isActive ? null : i)}
                aria-pressed={isActive}
                aria-label={`שם ${hebNumeral(num)} · ${name}`}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  padding: '16px 6px 14px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  background: isActive
                    ? 'rgba(255,255,255,0.07)'
                    : 'rgba(255,255,255,0.02)',
                  border: isActive
                    ? '1px solid rgba(255,255,255,0.4)'
                    : '1px solid rgba(233,230,221,0.1)',
                  boxShadow: isActive
                    ? '0 0 26px rgba(255,255,255,0.16)'
                    : 'none',
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                  transition:
                    'transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  zIndex: isActive ? 3 : 1,
                }}
              >
                {/* מספר דק */}
                <span
                  style={{
                    fontFamily: THEME.sans,
                    fontSize: 11,
                    fontWeight: 300,
                    letterSpacing: 1,
                    color: isActive ? 'rgba(233,230,221,0.7)' : THEME.faint,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {num}
                </span>

                {/* שלוש האותיות הזוהרות */}
                <span
                  dir="rtl"
                  style={{
                    fontFamily: THEME.serif,
                    fontSize: 'clamp(24px, 6vw, 32px)',
                    fontWeight: 500,
                    letterSpacing: 2,
                    lineHeight: 1,
                    color: THEME.light,
                    textShadow: isActive
                      ? '0 0 16px rgba(255,255,255,0.7), 0 0 38px rgba(255,255,255,0.4), 0 0 78px rgba(255,255,255,0.2)'
                      : '0 0 12px rgba(255,255,255,0.45), 0 0 28px rgba(255,255,255,0.2)',
                    transition: 'text-shadow 0.3s ease',
                  }}
                >
                  {name}
                </span>

                {/* כיתוב חושפני קטן */}
                {isActive && (
                  <span
                    style={{
                      fontFamily: THEME.serif,
                      fontSize: 12.5,
                      fontWeight: 400,
                      letterSpacing: 1,
                      color: 'rgba(233,230,221,0.62)',
                      marginTop: 2,
                      animation: 'kvFadeUp 0.4s ease both',
                    }}
                  >
                    שם {hebNumeral(num)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* כותרת תחתית — מקור */}
        <footer
          style={{
            marginTop: 52,
            fontFamily: THEME.sans,
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: 300,
            color: THEME.faint,
          }}
        >
          {NAMES_72_SOURCE}
        </footer>
      </main>
    </Cosmos>
  );
}

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '9px 20px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        fontFamily: THEME.serif,
        fontSize: 15,
        fontWeight: 400,
        letterSpacing: 1,
        color: active ? THEME.light : THEME.dim,
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        textShadow: active ? '0 0 14px rgba(255,255,255,0.35)' : 'none',
        boxShadow: active ? '0 0 18px rgba(255,255,255,0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </button>
  );
}
