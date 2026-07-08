'use client';
// ─────────────────────────────────────────────────────────────
//  שער האמת · דף השער (Hub) — רב-לשוני (he/en/es)
// ─────────────────────────────────────────────────────────────
import { Cosmos, GlowText, THEME } from '@/components/kavanot/Cosmos';
import { useLang } from '@/components/i18n/LangProvider';
import { t, isRTL } from '@/lib/i18n';

const GATES = [
  { href: '/reveal', key: 'gate.reveal', primary: true },
  { href: '/ask', key: 'gate.ask', primary: true },
  { href: '/limud', key: 'gate.limud', primary: true },
  { href: '/hazkara', key: 'gate.hazkara', primary: false },
  { href: '/sefirot', key: 'gate.sefirot', primary: false },
  { href: '/names', key: 'gate.names', primary: false },
  { href: '/havaya', key: 'gate.havaya', primary: false },
];

function Gate({ href, label, sub, primary }) {
  return (
    <a href={href} style={{
      display: 'block', textDecoration: 'none', textAlign: 'center',
      padding: primary ? '26px 22px' : '18px 16px', borderRadius: 14,
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(233,230,221,0.16)',
      backdropFilter: 'blur(4px)',
      transition: 'transform .25s ease, border-color .25s ease, box-shadow .25s ease, background .25s ease',
    }}
      onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = 'translateY(-3px)'; el.style.borderColor = 'rgba(255,255,255,0.5)'; el.style.background = 'rgba(255,255,255,0.05)'; el.style.boxShadow = '0 0 36px rgba(255,255,255,0.12)'; }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(233,230,221,0.16)'; el.style.background = 'rgba(255,255,255,0.025)'; el.style.boxShadow = 'none'; }}
    >
      <GlowText size={primary ? 'clamp(26px, 6.5vw, 38px)' : 'clamp(20px, 5vw, 28px)'} weight={500}>{label}</GlowText>
      <div style={{ marginTop: 10, fontFamily: THEME.sans, fontWeight: 300, fontSize: primary ? 13.5 : 12.5, letterSpacing: 0.6, color: THEME.dim }}>{sub}</div>
    </a>
  );
}

export default function Hub() {
  const { lang } = useLang();
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  const primary = GATES.filter((g) => g.primary);
  const secondary = GATES.filter((g) => !g.primary);
  const intro = t('hub.intro', lang).split('\n');

  return (
    <Cosmos stars={48} dir={dir}>
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '48px 22px',
        maxWidth: 640, margin: '0 auto', animation: 'kvFadeUp 1s ease both',
      }}>
        <GlowText size="clamp(46px, 12vw, 76px)" weight={500} style={{ letterSpacing: 3 }}>{t('gate.title', lang)}</GlowText>
        <div style={{ marginTop: 14, fontFamily: THEME.sans, fontWeight: 300, fontSize: 12.5, letterSpacing: 5, color: THEME.faint }}>✦ &nbsp; {t('gate.subtitle', lang)} &nbsp; ✦</div>

        <div style={{ width: 46, height: 1, margin: '30px 0 34px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }} />

        <p style={{ maxWidth: 400, textAlign: 'center', margin: 0, fontFamily: THEME.serif, fontSize: 17, lineHeight: 1.95, fontWeight: 400, color: 'rgba(233,230,221,0.8)' }}>
          {intro[0]}{intro[1] && <><br />{intro[1]}</>}
        </p>

        <div style={{ width: '100%', marginTop: 44, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {primary.map((g) => <Gate key={g.href} href={g.href} primary label={t(`${g.key}.label`, lang)} sub={t(`${g.key}.sub`, lang)} />)}
        </div>
        <div style={{ width: '100%', marginTop: 16, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {secondary.map((g) => <Gate key={g.href} href={g.href} label={t(`${g.key}.label`, lang)} sub={t(`${g.key}.sub`, lang)} />)}
        </div>

        <div style={{ marginTop: 46, fontSize: 11.5, letterSpacing: 1.5, lineHeight: 1.7, color: THEME.faint, maxWidth: 440, textAlign: 'center' }}>
          {t('hub.disclaimer', lang)}
        </div>
      </div>
    </Cosmos>
  );
}
