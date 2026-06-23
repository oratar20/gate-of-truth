'use client';
// ─────────────────────────────────────────────────────────────
//  HavayaView · שם הוי"ה — השם המפורש, מילוייו, וצירופיו.
//  שלושה חלקים: כותרת (יהוה), ארבעת המילויים, שנים-עשר הצירופים.
//  תוכן מאומת בלבד — שיוך חודש→צירוף: רק ניסן נעול, השאר ממתין למקור.
// ─────────────────────────────────────────────────────────────
import { Cosmos, GlowText, THEME, useCosmosChrome } from '@/components/kavanot/Cosmos';
import {
  SHEM, gematria, MILUIM, TZERUFIM, MONTH_TZERUF, HAVAYA_SOURCE,
} from '@/lib/kavanot/havaya';

export default function HavayaView() {
  const { reduce } = useCosmosChrome();

  return (
    <Cosmos stars={48} dir="rtl">
      {/* קישור חזרה דק בפינה */}
      <a href="/" style={{
        position: 'absolute', top: 16, right: 18, zIndex: 6,
        fontFamily: THEME.sans, fontSize: 13, letterSpacing: 1,
        color: THEME.faint, textDecoration: 'none', fontWeight: 300,
        padding: '6px 12px', borderRadius: 999,
        border: '1px solid rgba(233,230,221,0.12)',
        background: 'rgba(255,255,255,0.03)',
      }}>← השער</a>

      <div style={{
        maxWidth: 760, margin: '0 auto', padding: '0 20px',
        animation: reduce ? 'none' : 'kvFadeUp 1.1s ease both',
      }}>
        <Hero reduce={reduce} />
        <Miluim />
        <Tzerufim />
        <Footer />
      </div>
    </Cosmos>
  );
}

// ── 1 · כותרת: ארבע האותיות הגדולות והזוהרות ──
function Hero({ reduce }) {
  return (
    <section style={{
      minHeight: '62dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '64px 0 30px',
    }}>
      <div dir="rtl" style={{
        display: 'flex', gap: 'clamp(8px, 4vw, 30px)', lineHeight: 1,
        animation: reduce ? 'none' : 'kvBreathe 8s ease-in-out infinite',
      }}>
        {SHEM.map((ch, i) => (
          <GlowText key={i} serif size="clamp(58px, 20vw, 130px)" weight={500}
            style={{ letterSpacing: 0 }}>
            {ch}
          </GlowText>
        ))}
      </div>

      <div style={{
        marginTop: 30, fontFamily: THEME.sans, fontSize: 14, letterSpacing: 3,
        color: THEME.dim, fontWeight: 300,
      }}>
        שֵׁם הֲוָיָ״ה · השם המפורש
      </div>

      <Divider />
    </section>
  );
}

// ── 2 · ארבעת המילויים ──
function Miluim() {
  return (
    <section style={{ padding: '14px 0 40px' }}>
      <SectionTitle>ארבעת המילויים</SectionTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 26 }}>
        {MILUIM.map((m) => {
          const computed = gematria(m.spelling.join(''));
          const verified = computed === m.value;
          return (
            <div key={m.id} style={{
              padding: '20px 20px 18px', borderRadius: 16,
              border: '1px solid rgba(233,230,221,0.12)',
              background: 'rgba(255,255,255,0.025)',
              backdropFilter: 'blur(3px)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                gap: 14, flexWrap: 'wrap',
              }}>
                <GlowText serif size={26} weight={500} style={{ letterSpacing: 1 }}>
                  {m.name}
                </GlowText>
                <span style={{
                  fontFamily: THEME.sans, fontSize: 13, letterSpacing: 1,
                  color: THEME.dim, fontWeight: 300,
                }}>
                  {m.sefira}
                </span>
              </div>

              {/* אותיות המילוי מרווחות */}
              <div dir="rtl" style={{
                marginTop: 16, display: 'flex', gap: 'clamp(10px, 4vw, 26px)',
                flexWrap: 'wrap', alignItems: 'baseline',
              }}>
                {m.spelling.map((w, i) => (
                  <span key={i} style={{
                    fontFamily: THEME.serif, fontSize: 'clamp(24px, 7vw, 34px)',
                    fontWeight: 400, color: THEME.light, letterSpacing: 3,
                    textShadow: '0 0 12px rgba(255,255,255,0.4), 0 0 28px rgba(255,255,255,0.18)',
                  }}>{w}</span>
                ))}
              </div>

              {/* גימטריה כעובדה מאומתת */}
              <div style={{
                marginTop: 16, fontFamily: THEME.sans, fontSize: 13.5,
                color: THEME.dim, fontWeight: 300, display: 'flex',
                alignItems: 'center', gap: 8, flexWrap: 'wrap',
              }}>
                <span style={{ letterSpacing: 1 }}>גימטריה</span>
                <span style={{
                  fontFamily: THEME.serif, fontSize: 18, color: THEME.parchment,
                  fontWeight: 500,
                }}>
                  {computed}
                </span>
                {verified && (
                  <span style={{ color: THEME.faint, fontSize: 12.5 }}>
                    = {m.value} ✓
                  </span>
                )}
              </div>

              <p style={{
                margin: '12px 0 0', fontFamily: THEME.sans, fontSize: 14,
                lineHeight: 1.8, color: THEME.dim, fontWeight: 300,
              }}>
                {m.note}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 3 · שנים-עשר הצירופים ──
function Tzerufim() {
  const months = Object.entries(MONTH_TZERUF);

  return (
    <section style={{ padding: '14px 0 40px' }}>
      <SectionTitle>שנים-עשר הצירופים</SectionTitle>

      <p style={{
        marginTop: 14, fontFamily: THEME.sans, fontSize: 13.5, lineHeight: 1.8,
        color: THEME.faint, fontWeight: 300, textAlign: 'center', maxWidth: 460,
        marginInline: 'auto',
      }}>
        שתים-עשרה התמורות הנבדלות של אותיות השם.
      </p>

      {/* רשת הצירופים */}
      <div style={{
        marginTop: 26, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(108px, 1fr))',
        gap: 12,
      }}>
        {TZERUFIM.map((t, i) => (
          <div key={i} dir="rtl" style={{
            padding: '16px 8px', borderRadius: 14, textAlign: 'center',
            border: '1px solid rgba(233,230,221,0.1)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <GlowText serif size="clamp(22px, 6vw, 28px)" weight={500}
              style={{ letterSpacing: 2 }}>
              {t}
            </GlowText>
          </div>
        ))}
      </div>

      {/* חודש → צירוף — שקיפות: רק ניסן משויך */}
      <div style={{ marginTop: 40 }}>
        <div style={{
          fontFamily: THEME.sans, fontSize: 13, letterSpacing: 3,
          color: THEME.dim, fontWeight: 300, textAlign: 'center', marginBottom: 18,
        }}>
          חודש → צירוף
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {months.map(([month, tzeruf]) => (
            <div key={month} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 14, padding: '11px 16px', borderRadius: 10,
              background: tzeruf ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: tzeruf
                ? '1px solid rgba(233,230,221,0.16)'
                : '1px solid rgba(233,230,221,0.05)',
            }}>
              <span style={{
                fontFamily: THEME.sans, fontSize: 15,
                color: tzeruf ? THEME.parchment : THEME.faint,
                fontWeight: 300,
              }}>
                {month}
              </span>
              {tzeruf ? (
                <GlowText serif size={20} weight={500} style={{ letterSpacing: 2 }}>
                  {tzeruf}
                </GlowText>
              ) : (
                <span style={{
                  fontFamily: THEME.sans, fontSize: 12, letterSpacing: 1,
                  color: THEME.faint, fontWeight: 300, fontStyle: 'italic',
                }}>
                  ממתין למקור
                </span>
              )}
            </div>
          ))}
        </div>

        <p style={{
          margin: '18px 0 0', fontFamily: THEME.sans, fontSize: 12.5, lineHeight: 1.8,
          color: THEME.faint, fontWeight: 300, textAlign: 'center',
        }}>
          רק ניסן משויך כאן (מוסכם). שאר השיוכים ממתינים למקור מאומת.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '20px 0 56px', textAlign: 'center' }}>
      <Divider />
      <div style={{
        marginTop: 22, fontFamily: THEME.sans, fontSize: 11.5, letterSpacing: 2,
        color: THEME.faint, fontWeight: 300,
      }}>
        {HAVAYA_SOURCE}
      </div>
    </footer>
  );
}

// ── עזרי-תצוגה משותפים ──
function SectionTitle({ children }) {
  return (
    <h2 style={{
      margin: 0, textAlign: 'center', fontFamily: THEME.serif,
      fontSize: 'clamp(22px, 6vw, 30px)', fontWeight: 500, color: THEME.parchment,
      letterSpacing: 1, textShadow: '0 0 18px rgba(255,255,255,0.18)',
    }}>
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div style={{
      width: 44, height: 1, margin: '26px auto 0',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
    }} />
  );
}
