'use client';
// ─────────────────────────────────────────────────────────────
//  שער האמת · דף השער (Hub)
//  נקודת הכניסה המאוחדת — מפצלת אל ההתבוננות, השיחה, והמודולים.
// ─────────────────────────────────────────────────────────────
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';

const GATES = [
  { href: '/reveal', label: 'הִתְבּוֹנְנוּת', sub: 'השם השולט עכשיו · סריקת הרגע לפי מקום ושעה', primary: true },
  { href: '/ask', label: 'שְׁאַל', sub: 'מענה מעומק הקבלה · מבוסס מקורות', primary: true },
  { href: '/sefirot', label: 'עֵץ הַסְּפִירוֹת', sub: 'עשר הספירות · ירידת האור', primary: false },
  { href: '/names', label: 'ע״ב שֵׁמוֹת', sub: 'שבעים ושניים השמות', primary: false },
  { href: '/havaya', label: 'שֵׁם הֲוָיָ״ה', sub: 'השם וצירופיו', primary: false },
];

function Gate({ href, label, sub, primary }) {
  return (
    <a href={href} style={{
      display: 'block', textDecoration: 'none', textAlign: 'center',
      padding: primary ? '26px 22px' : '18px 16px',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(233,230,221,0.16)',
      backdropFilter: 'blur(4px)',
      transition: 'transform .25s ease, border-color .25s ease, box-shadow .25s ease, background .25s ease',
    }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-3px)';
        el.style.borderColor = 'rgba(255,255,255,0.5)';
        el.style.background = 'rgba(255,255,255,0.05)';
        el.style.boxShadow = '0 0 36px rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.borderColor = 'rgba(233,230,221,0.16)';
        el.style.background = 'rgba(255,255,255,0.025)';
        el.style.boxShadow = 'none';
      }}
    >
      <GlowText size={primary ? 'clamp(28px, 7vw, 40px)' : 'clamp(22px, 5.5vw, 30px)'} weight={500}>
        {label}
      </GlowText>
      <div style={{
        marginTop: 10, fontFamily: THEME.sans, fontWeight: 300,
        fontSize: primary ? 14 : 12.5, letterSpacing: 1,
        color: THEME.dim,
      }}>{sub}</div>
    </a>
  );
}

export default function Hub() {
  const primary = GATES.filter((g) => g.primary);
  const secondary = GATES.filter((g) => !g.primary);
  return (
    <Cosmos stars={48}>
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 22px', maxWidth: 640, margin: '0 auto',
        animation: 'kvFadeUp 1s ease both',
      }}>
        <GlowText size="clamp(46px, 12vw, 76px)" weight={500} style={{ letterSpacing: 3 }}>
          שַׁעַר הָאֱמֶת
        </GlowText>
        <div style={{
          marginTop: 14, fontFamily: THEME.sans, fontWeight: 300,
          fontSize: 12.5, letterSpacing: 6, color: THEME.faint,
        }}>✦ &nbsp; GATE OF TRUTH &nbsp; ✦</div>

        <div style={{
          width: 46, height: 1, margin: '30px 0 34px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
        }} />

        <p style={{
          maxWidth: 380, textAlign: 'center', margin: 0,
          fontFamily: THEME.serif, fontSize: 17, lineHeight: 1.95, fontWeight: 400,
          color: 'rgba(233,230,221,0.8)',
        }}>
          מקום להניח בו את השאלות — ולעלות אל הרגע.
          <br />מענה מעומק הקבלה, והתבוננות בשמות הקודש.
        </p>

        <div style={{
          width: '100%', marginTop: 44, display: 'grid', gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}>
          {primary.map((g) => <Gate key={g.href} {...g} />)}
        </div>

        <div style={{
          width: '100%', marginTop: 16, display: 'grid', gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        }}>
          {secondary.map((g) => <Gate key={g.href} {...g} />)}
        </div>

        <div style={{
          marginTop: 46, fontSize: 11.5, letterSpacing: 1.5, lineHeight: 1.7,
          color: THEME.faint, maxWidth: 420, textAlign: 'center',
        }}>
          כלי לחיזוק ולעיון. אינו מחליף רב חי או ייעוץ מקצועי.
        </div>
      </div>
    </Cosmos>
  );
}
