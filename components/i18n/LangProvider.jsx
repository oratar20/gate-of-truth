'use client';
// ─────────────────────────────────────────────────────────────
//  LangProvider + LangSelector — בחירת שפה (he/en/es), נשמר ב-localStorage.
//  עוטף את האפליקציה ב-layout. useLang() לקריאת השפה בכל קומפוננטה.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from 'react';
import { LANGS, LANG_LABEL, isRTL, getStoredLang, storeLang } from '@/lib/i18n';

const LangCtx = createContext({ lang: 'he', setLang: () => {} });
export const useLang = () => useContext(LangCtx);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('he');

  useEffect(() => { setLangState(getStoredLang()); }, []);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    }
  }, [lang]);

  const setLang = (l) => { storeLang(l); setLangState(l); };

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      {children}
      <LangSelector lang={lang} setLang={setLang} />
    </LangCtx.Provider>
  );
}

function LangSelector({ lang, setLang }) {
  return (
    <div style={{
      position: 'fixed', top: '1.15rem', left: '1.15rem', zIndex: 200,
      display: 'flex', gap: 2, padding: 3, borderRadius: 999,
      background: 'rgba(10,8,16,0.6)', border: '1px solid rgba(233,230,221,0.18)',
      backdropFilter: 'blur(8px)',
    }}>
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button key={l} onClick={() => setLang(l)} aria-label={LANG_LABEL[l]} style={{
            padding: '4px 10px', borderRadius: 999, cursor: 'pointer', border: 'none',
            fontFamily: "'Assistant', sans-serif", fontSize: 12, letterSpacing: 0.5,
            fontWeight: active ? 600 : 300,
            background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
            color: active ? '#fbfaf5' : 'rgba(233,230,221,0.55)',
            transition: 'all .2s ease',
          }}>
            {l === 'he' ? 'עב' : l === 'en' ? 'EN' : 'ES'}
          </button>
        );
      })}
    </div>
  );
}
