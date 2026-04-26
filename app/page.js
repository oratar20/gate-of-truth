'use client';

import { useState, useEffect, useRef } from 'react';
import TreeOfLife from './components/TreeOfLife';

// ────────────────────────────────────────────────────────────
// TRANSLATIONS - all UI text in both languages
// ────────────────────────────────────────────────────────────
const t = {
  he: {
    title: 'שַׁעַר הָאֱמֶת',
    subtitle: 'GATE OF TRUTH',
    welcomeText1: 'מקום להניח בו את השאלות, את הספקות,',
    welcomeText2: 'ואת מה שמכביד על הלב.',
    welcomeText3: 'מענה מתוך עומק חכמת הקבלה — הזוהר, האר״י הקדוש,',
    welcomeText4: 'ותורת בעל הסולם.',
    enter: 'היכנס',
    disclaimer: 'כלי לחיזוק ולעיון. אינו מחליף רב חי או ייעוץ מקצועי.',
    stage1of3: '׀ שלב ראשון מתוך שלושה ׀',
    stage2of3: '׀ שלב שני מתוך שלושה ׀',
    stage3of3: '׀ שלב שלישי מתוך שלושה ׀',
    q1: 'עד כמה אתה מאמין בהשם?',
    q1Right: '1 — לא מאמין',
    q1Left: '10 — אמונה מלאה',
    q2: 'עד כמה אתה מאמין בתורת משה?',
    q2Right: '1 — לא מאמין',
    q2Left: '10 — ניתנה למשה בסיני',
    q3: 'מה הספק העיקרי שלך?',
    q3Sub1: 'כתוב בחופשיות את מה שמכביד עליך — שאלה, קושיה, חוויה,',
    q3Sub2: 'או כל דבר שמרחיק אותך מהאמונה.',
    q3Placeholder: 'לדוגמה: אם יש אלוהים טוב, איך הוא נותן לרע לקרות?',
    back: '← חזור',
    continue: 'המשך ←',
    openGate: 'פתח את השער ←',
    chatHeader: 'שַׁעַר הָאֱמֶת',
    restart: 'התחל מחדש',
    inputPlaceholder: 'המשך לשאול, להעמיק, או לשתף...',
    send: 'שלח',
    error: 'שגיאה',
    name: 'שער האמת',
    statusListening: 'האורות מתקבצים...',
    statusThinking: 'מקשיב ושואב מהמקור...',
    errorMsg: 'אירעה שגיאה. נסה שוב בעוד רגע.',
    sourcesShow: 'הצג',
    sourcesHide: 'הסתר',
    sourcesLabel: 'מקורות מ-Sefaria',
    sourcesSearch: '(חיפוש:',
    closeBracket: ')',
    languageOther: 'EN',
  },
  en: {
    title: 'Gate of Truth',
    subtitle: 'שַׁעַר הָאֱמֶת',
    welcomeText1: 'A place to lay down your questions, your doubts,',
    welcomeText2: 'and what weighs on the heart.',
    welcomeText3: 'Answers from the depth of Kabbalah — the Zohar, the holy Ari,',
    welcomeText4: 'and the teachings of Baal HaSulam.',
    enter: 'Enter',
    disclaimer: 'A tool for reflection and inspiration. Not a substitute for personal guidance or professional counsel.',
    stage1of3: '׀ Step 1 of 3 ׀',
    stage2of3: '׀ Step 2 of 3 ׀',
    stage3of3: '׀ Step 3 of 3 ׀',
    q1: 'How much do you believe in a higher power?',
    q1Right: '1 — No belief',
    q1Left: '10 — Full faith',
    q2: 'How much do you believe in revealed wisdom and sacred texts?',
    q2Right: '1 — No belief',
    q2Left: '10 — Deep belief',
    q3: 'What is your main doubt or question?',
    q3Sub1: 'Write freely about what weighs on you — a question, a struggle,',
    q3Sub2: 'an experience, or anything that distances you from faith.',
    q3Placeholder: 'For example: If there is a loving Source, why does suffering exist?',
    back: '← Back',
    continue: 'Continue →',
    openGate: 'Open the Gate →',
    chatHeader: 'Gate of Truth',
    restart: 'Start over',
    inputPlaceholder: 'Continue asking, going deeper, or sharing...',
    send: 'Send',
    error: 'Error',
    name: 'Gate of Truth',
    statusListening: 'The lights are gathering...',
    statusThinking: 'Listening and drawing from the source...',
    errorMsg: 'An error occurred. Please try again in a moment.',
    sourcesShow: 'Show',
    sourcesHide: 'Hide',
    sourcesLabel: 'sources from Sefaria',
    sourcesSearch: '(search:',
    closeBracket: ')',
    languageOther: 'עב',
  },
};

export default function Home() {
  const [language, setLanguage] = useState('he');
  const [stage, setStage] = useState('welcome');
  const [godBelief, setGodBelief] = useState(5);
  const [torahBelief, setTorahBelief] = useState(5);
  const [mainDoubt, setMainDoubt] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [expandedSources, setExpandedSources] = useState({});
  const [errorDetails, setErrorDetails] = useState('');
  const messagesEndRef = useRef(null);

  // Active translation
  const tx = t[language];
  const isRTL = language === 'he';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, searchStatus]);

  const colors = {
    bg: '#06040f',
    deepBlue: '#0d0a1f',
    midPurple: '#1a0d2e',
    deepPurple: '#2a1a4a',
    gold: '#d4a854',
    goldBright: '#ffd66e',
    goldDim: '#8a6a30',
    cream: '#f4ecd8',
    creamMuted: '#a89e88',
    purpleLight: '#9d7fff',
    purpleGlow: '#c8b3ff',
    error: '#d97757',
  };

  const fontTitle = '"Frank Ruhl Libre", "David Libre", "Cormorant Garamond", "Times New Roman", serif';
  const fontBody = isRTL
    ? '"Frank Ruhl Libre", "David Libre", "Times New Roman", serif'
    : '"Cormorant Garamond", "Frank Ruhl Libre", "Times New Roman", serif';

  const treeIntensity = stage === 'welcome' ? 1 : stage === 'chat' ? 0.5 : 0.7;

  const sendToBackend = async (allMessages) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: allMessages,
        godBelief,
        torahBelief,
        language,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`${response.status}: ${errText.slice(0, 300)}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  };

  const startChat = async () => {
    if (!mainDoubt.trim()) return;
    setStage('chat');
    setLoading(true);
    setSearchStatus(tx.statusListening);
    setErrorDetails('');
    const initial = [{ role: 'user', content: mainDoubt }];
    setMessages(initial);
    try {
      const data = await sendToBackend(initial);
      setSearchStatus('');
      setMessages([...initial, { role: 'assistant', content: data.text, sources: data.sources, keywords: data.keywords }]);
    } catch (err) {
      setErrorDetails(err.message || 'Unknown error');
      setMessages([...initial, { role: 'assistant', content: tx.errorMsg, isError: true }]);
    }
    setSearchStatus('');
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setSearchStatus(tx.statusThinking);
    setErrorDetails('');
    try {
      const data = await sendToBackend(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: data.text, sources: data.sources, keywords: data.keywords }]);
    } catch (err) {
      setErrorDetails(err.message || 'Unknown error');
      setMessages([...newMessages, { role: 'assistant', content: tx.errorMsg, isError: true }]);
    }
    setSearchStatus('');
    setLoading(false);
  };

  const reset = () => {
    setStage('welcome');
    setGodBelief(5);
    setTorahBelief(5);
    setMainDoubt('');
    setMessages([]);
    setInput('');
    setExpandedSources({});
    setErrorDetails('');
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'he' ? 'en' : 'he'));
  };

  const LetterOrnament = ({ letter = 'א', size = 60 }) => (
    <div style={{
      width: size, height: size, margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.goldBright}30 0%, transparent 70%)`,
        animation: 'pulseGlow 3s ease-in-out infinite',
      }} />
      <div style={{
        fontSize: size * 0.6, fontFamily: fontTitle,
        color: colors.goldBright,
        textShadow: `0 0 20px ${colors.gold}, 0 0 40px ${colors.gold}80`,
        fontWeight: 400, position: 'relative', zIndex: 1,
      }}>{letter}</div>
    </div>
  );

  const Divider = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem 0', width: '100%' }}>
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${colors.gold} 50%, transparent)` }} />
      <div style={{ width: '6px', height: '6px', margin: '0 14px', transform: 'rotate(45deg)', background: colors.goldBright, boxShadow: `0 0 10px ${colors.gold}` }} />
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${colors.gold} 50%, transparent)` }} />
    </div>
  );

  const Slider = ({ value, onChange, leftLabel, rightLabel }) => {
    const percent = ((value - 1) / 9) * 100;
    return (
      <div style={{ width: '100%' }} dir="ltr">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            fontFamily: fontTitle, fontSize: '5rem', fontWeight: 500,
            color: colors.goldBright,
            textShadow: `0 0 30px ${colors.gold}, 0 0 60px ${colors.gold}80`,
            letterSpacing: '0.02em', lineHeight: 1,
          }}>{value}</div>
        </div>
        <input
          type="range" min="1" max="10" value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="gate-slider"
          style={{
            width: '100%', appearance: 'none', WebkitAppearance: 'none', height: '2px',
            background: `linear-gradient(to right, ${colors.goldBright} 0%, ${colors.gold} ${percent}%, ${colors.deepPurple} ${percent}%, ${colors.deepPurple} 100%)`,
            outline: 'none', cursor: 'pointer', borderRadius: '2px',
          }}
        />
        <div dir={isRTL ? 'rtl' : 'ltr'} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: colors.creamMuted, fontFamily: fontBody, fontSize: '0.95rem' }}>
          <span>{isRTL ? rightLabel : rightLabel}</span>
          <span>{isRTL ? leftLabel : leftLabel}</span>
        </div>
      </div>
    );
  };

  const SourcesPanel = ({ sources, keywords, msgIdx }) => {
    if (!sources || sources.length === 0) return null;
    const isExpanded = expandedSources[msgIdx];
    return (
      <div style={{ marginTop: '1.2rem', borderTop: `1px solid ${colors.gold}40`, paddingTop: '0.8rem' }}>
        <button
          onClick={() => setExpandedSources({ ...expandedSources, [msgIdx]: !isExpanded })}
          style={{
            background: 'transparent', border: 'none',
            color: colors.goldBright, fontFamily: fontBody, fontSize: '0.85rem',
            cursor: 'pointer', padding: 0, opacity: 0.9, letterSpacing: '0.05em',
          }}
        >
          ✦ {isExpanded ? tx.sourcesHide : tx.sourcesShow} {sources.length} {tx.sourcesLabel} {keywords && `${tx.sourcesSearch} ${keywords}${tx.closeBracket}`} {isExpanded ? '▲' : '▼'}
        </button>
        {isExpanded && (
          <div style={{ marginTop: '0.8rem' }}>
            {sources.map((s, i) => (
              <div key={i} style={{
                background: `${colors.bg}cc`,
                border: `1px solid ${colors.gold}50`,
                borderRadius: '4px', padding: '0.8rem 1rem', marginBottom: '0.6rem',
                backdropFilter: 'blur(8px)',
              }} dir="rtl">
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    color: colors.goldBright, fontFamily: fontTitle,
                    fontSize: '1rem', fontWeight: 500, textDecoration: 'none',
                    display: 'inline-block', marginBottom: '0.4rem',
                    textShadow: `0 0 10px ${colors.gold}40`,
                  }}>
                  {s.heRef || s.ref} ↗
                </a>
                <div style={{ fontSize: '0.95rem', color: colors.creamMuted, lineHeight: 1.7, fontFamily: '"Frank Ruhl Libre", serif' }}>
                  {s.text.slice(0, 350)}{s.text.length > 350 ? '...' : ''}
                </div>
                {s.categories && s.categories.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: colors.goldDim, marginTop: '0.4rem', letterSpacing: '0.05em' }}>
                    {s.categories.join(' › ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const primaryButtonStyle = {
    fontFamily: fontBody, fontSize: '1.1rem', color: colors.bg,
    background: `linear-gradient(135deg, ${colors.goldBright} 0%, ${colors.gold} 100%)`,
    border: 'none', padding: '0.85rem 2.4rem', borderRadius: '2px', cursor: 'pointer',
    letterSpacing: '0.1em', fontWeight: 600,
    boxShadow: `0 0 30px ${colors.gold}60, 0 0 60px ${colors.gold}30, inset 0 0 20px rgba(255,255,255,0.2)`,
    transition: 'all 0.25s ease',
  };

  const ghostButtonStyle = {
    fontFamily: fontBody, fontSize: '1.05rem', color: colors.creamMuted,
    background: 'transparent', border: `1px solid ${colors.gold}80`,
    padding: '0.75rem 2rem', borderRadius: '2px', cursor: 'pointer',
    letterSpacing: '0.08em', transition: 'all 0.2s ease',
  };

  const glassCard = {
    background: `linear-gradient(135deg, ${colors.midPurple}aa, ${colors.bg}cc)`,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.gold}30`,
    borderRadius: '6px',
    boxShadow: `0 0 60px ${colors.gold}15, inset 0 0 60px ${colors.midPurple}40`,
  };

  // ────────────────────────────────────────────────────────────
  // LANGUAGE TOGGLE - floating button always visible
  // ────────────────────────────────────────────────────────────
  const LanguageToggle = () => (
    <button
      onClick={toggleLanguage}
      style={{
        position: 'fixed',
        top: '1.2rem',
        [isRTL ? 'left' : 'right']: '1.2rem',
        zIndex: 100,
        background: `linear-gradient(135deg, ${colors.midPurple}cc, ${colors.bg}dd)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.gold}60`,
        borderRadius: '20px',
        padding: '0.5rem 1rem',
        color: colors.goldBright,
        fontFamily: fontBody,
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.1em',
        boxShadow: `0 0 20px ${colors.gold}30`,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = colors.goldBright;
        e.target.style.boxShadow = `0 0 30px ${colors.gold}60`;
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = `${colors.gold}60`;
        e.target.style.boxShadow = `0 0 20px ${colors.gold}30`;
      }}
    >
      🌐 {tx.languageOther}
    </button>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{
      minHeight: '100vh', width: '100%',
      fontFamily: fontBody, color: colors.cream,
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');

        .gate-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px; border-radius: 50%;
          background: radial-gradient(circle, ${colors.goldBright}, ${colors.gold});
          cursor: pointer;
          box-shadow: 0 0 25px ${colors.goldBright}, 0 0 50px ${colors.gold}80, 0 2px 8px rgba(0,0,0,0.5);
          border: 2px solid ${colors.bg}; transition: transform 0.15s ease;
        }
        .gate-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .gate-slider::-moz-range-thumb {
          width: 24px; height: 24px; border-radius: 50%;
          background: radial-gradient(circle, ${colors.goldBright}, ${colors.gold});
          cursor: pointer;
          box-shadow: 0 0 25px ${colors.goldBright}, 0 0 50px ${colors.gold}80;
          border: 2px solid ${colors.bg};
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glowBreath {
          0%, 100% { box-shadow: 0 0 30px ${colors.gold}60, 0 0 60px ${colors.gold}30; }
          50% { box-shadow: 0 0 50px ${colors.gold}90, 0 0 100px ${colors.gold}50; }
        }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .fade-in { animation: fadeIn 1.4s ease-out forwards; }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .glow-breath { animation: glowBreath 4s ease-in-out infinite; }
        .typing-dot {
          display: inline-block; width: 8px; height: 8px; border-radius: 50%;
          background: ${colors.goldBright}; margin: 0 3px;
          animation: pulse 1.4s ease-in-out infinite;
          box-shadow: 0 0 10px ${colors.gold};
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        .status-shimmer {
          background: linear-gradient(90deg, ${colors.creamMuted} 0%, ${colors.goldBright} 50%, ${colors.creamMuted} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          color: transparent; animation: shimmer 2.5s linear infinite;
        }
        textarea::placeholder, input::placeholder { color: ${colors.creamMuted}; opacity: 0.5; }
        textarea, input[type=text] { caret-color: ${colors.goldBright}; }
        button.primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px ${colors.goldBright}80, 0 0 100px ${colors.gold}50, inset 0 0 25px rgba(255,255,255,0.3);
        }
        button.ghost-btn:hover {
          background: ${colors.gold}15;
          border-color: ${colors.goldBright};
          color: ${colors.cream};
        }
      `}</style>

      <TreeOfLife intensity={treeIntensity} />

      <div style={{
        position: 'fixed', inset: 0,
        background: stage === 'chat'
          ? `radial-gradient(ellipse at center, ${colors.bg}60 0%, ${colors.bg}cc 100%)`
          : `radial-gradient(ellipse at center, ${colors.bg}30 0%, ${colors.bg}80 100%)`,
        zIndex: 2, pointerEvents: 'none',
        transition: 'background 1s ease',
      }} />

      <LanguageToggle />

      <div style={{
        maxWidth: '720px', margin: '0 auto',
        position: 'relative', zIndex: 3, padding: '2rem 1rem',
      }}>

        {stage === 'welcome' && (
          <div className="fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div className="float-anim">
              <LetterOrnament letter="א" size={70} />
            </div>
            <h1 style={{
              fontFamily: fontTitle, fontSize: 'clamp(3rem, 9vw, 5rem)',
              fontWeight: 500, color: colors.cream,
              margin: '2rem 0 0.5rem', letterSpacing: '0.05em',
              textShadow: `0 0 40px ${colors.gold}80, 0 0 80px ${colors.gold}40`,
            }}>{tx.title}</h1>
            <div style={{
              color: colors.goldBright, fontSize: '0.9rem', letterSpacing: '0.4em',
              fontFamily: fontBody, marginTop: '0.5rem', opacity: 0.85,
            }}>✦  {tx.subtitle}  ✦</div>
            <Divider />
            <p style={{
              fontFamily: fontBody, fontSize: 'clamp(1rem, 2.4vw, 1.2rem)',
              lineHeight: 2, color: colors.cream,
              maxWidth: '520px', margin: '0 auto 1.5rem', fontWeight: 300,
              letterSpacing: '0.02em', opacity: 0.92,
            }}>
              {tx.welcomeText1}
              <br />{tx.welcomeText2}
            </p>
            <p style={{
              fontFamily: fontBody, fontSize: '0.95rem', lineHeight: 1.8,
              color: colors.creamMuted, maxWidth: '500px', margin: '0 auto 2.5rem',
              fontStyle: 'italic',
            }}>
              {tx.welcomeText3}
              <br />{tx.welcomeText4}
            </p>
            <button
              onClick={() => setStage('q1')}
              className="primary-btn glow-breath"
              style={{
                fontFamily: fontBody, fontSize: '1.25rem', color: colors.bg,
                background: `linear-gradient(135deg, ${colors.goldBright} 0%, ${colors.gold} 100%)`,
                border: 'none', padding: '1rem 3.5rem', borderRadius: '2px',
                cursor: 'pointer', letterSpacing: '0.15em', fontWeight: 600,
                transition: 'all 0.25s ease',
              }}
            >{tx.enter}</button>
            <div style={{
              marginTop: '5rem', fontSize: '0.8rem',
              color: colors.creamMuted, opacity: 0.5, lineHeight: 1.7,
              maxWidth: '420px', margin: '5rem auto 0',
            }}>{tx.disclaimer}</div>
          </div>
        )}

        {stage === 'q1' && (
          <div className="fade-up" style={{ paddingTop: '5rem' }}>
            <div style={{ ...glassCard, padding: '3rem 2rem' }}>
              <div style={{ textAlign: 'center', color: colors.goldBright, fontSize: '0.85rem', letterSpacing: '0.4em', marginBottom: '2rem', opacity: 0.85 }}>
                {tx.stage1of3}
              </div>
              <h2 style={{ fontFamily: fontTitle, fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)', fontWeight: 400, textAlign: 'center', marginBottom: '3rem', lineHeight: 1.5, color: colors.cream, textShadow: `0 0 20px ${colors.gold}40` }}>
                {tx.q1}
              </h2>
              <Slider value={godBelief} onChange={setGodBelief} leftLabel={tx.q1Left} rightLabel={tx.q1Right} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', gap: '1rem' }}>
                <button onClick={() => setStage('welcome')} className="ghost-btn" style={ghostButtonStyle}>{tx.back}</button>
                <button onClick={() => setStage('q2')} className="primary-btn" style={primaryButtonStyle}>{tx.continue}</button>
              </div>
            </div>
          </div>
        )}

        {stage === 'q2' && (
          <div className="fade-up" style={{ paddingTop: '5rem' }}>
            <div style={{ ...glassCard, padding: '3rem 2rem' }}>
              <div style={{ textAlign: 'center', color: colors.goldBright, fontSize: '0.85rem', letterSpacing: '0.4em', marginBottom: '2rem', opacity: 0.85 }}>
                {tx.stage2of3}
              </div>
              <h2 style={{ fontFamily: fontTitle, fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)', fontWeight: 400, textAlign: 'center', marginBottom: '3rem', lineHeight: 1.5, color: colors.cream, textShadow: `0 0 20px ${colors.gold}40` }}>
                {tx.q2}
              </h2>
              <Slider value={torahBelief} onChange={setTorahBelief} leftLabel={tx.q2Left} rightLabel={tx.q2Right} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', gap: '1rem' }}>
                <button onClick={() => setStage('q1')} className="ghost-btn" style={ghostButtonStyle}>{tx.back}</button>
                <button onClick={() => setStage('q3')} className="primary-btn" style={primaryButtonStyle}>{tx.continue}</button>
              </div>
            </div>
          </div>
        )}

        {stage === 'q3' && (
          <div className="fade-up" style={{ paddingTop: '4rem' }}>
            <div style={{ ...glassCard, padding: '3rem 2rem' }}>
              <div style={{ textAlign: 'center', color: colors.goldBright, fontSize: '0.85rem', letterSpacing: '0.4em', marginBottom: '2rem', opacity: 0.85 }}>
                {tx.stage3of3}
              </div>
              <h2 style={{ fontFamily: fontTitle, fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)', fontWeight: 400, textAlign: 'center', marginBottom: '1.2rem', lineHeight: 1.5, color: colors.cream, textShadow: `0 0 20px ${colors.gold}40` }}>
                {tx.q3}
              </h2>
              <p style={{ textAlign: 'center', color: colors.creamMuted, marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.8 }}>
                {tx.q3Sub1}
                <br />{tx.q3Sub2}
              </p>
              <textarea
                value={mainDoubt}
                onChange={(e) => setMainDoubt(e.target.value)}
                placeholder={tx.q3Placeholder}
                rows={7}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                  width: '100%', background: `${colors.bg}aa`,
                  border: `1px solid ${colors.gold}50`, borderRadius: '4px',
                  padding: '1.2rem', color: colors.cream, fontFamily: fontBody,
                  fontSize: '1.1rem', lineHeight: 1.8, resize: 'vertical', outline: 'none',
                  boxSizing: 'border-box', backdropFilter: 'blur(4px)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => { e.target.style.borderColor = colors.goldBright; e.target.style.boxShadow = `0 0 25px ${colors.gold}50`; }}
                onBlur={(e) => { e.target.style.borderColor = `${colors.gold}50`; e.target.style.boxShadow = 'none'; }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', gap: '1rem' }}>
                <button onClick={() => setStage('q2')} className="ghost-btn" style={ghostButtonStyle}>{tx.back}</button>
                <button
                  onClick={startChat}
                  disabled={!mainDoubt.trim()}
                  className="primary-btn"
                  style={{ ...primaryButtonStyle, opacity: mainDoubt.trim() ? 1 : 0.4, cursor: mainDoubt.trim() ? 'pointer' : 'not-allowed' }}
                >{tx.openGate}</button>
              </div>
            </div>
          </div>
        )}

        {stage === 'chat' && (
          <div className="fade-in" style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', minHeight: '95vh' }}>
            <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: `1px solid ${colors.gold}30`, marginBottom: '1.5rem' }}>
              <LetterOrnament letter="א" size={40} />
              <div style={{
                fontFamily: fontTitle, fontSize: '1.5rem', color: colors.cream,
                marginTop: '0.5rem', letterSpacing: '0.05em',
                textShadow: `0 0 20px ${colors.gold}60`,
              }}>{tx.chatHeader}</div>
              <button
                onClick={reset} className="ghost-btn"
                style={{
                  background: 'transparent', border: `1px solid ${colors.gold}80`,
                  color: colors.creamMuted, fontFamily: fontBody, fontSize: '0.85rem',
                  padding: '0.3rem 1rem', borderRadius: '2px', cursor: 'pointer', marginTop: '0.8rem',
                  transition: 'all 0.2s ease',
                }}
              >{tx.restart}</button>
            </div>

            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {messages.map((msg, i) => (
                <div key={i} className="fade-up" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end' }}>
                  <div style={{
                    maxWidth: '92%',
                    width: msg.role === 'assistant' ? '92%' : 'auto',
                    padding: '1.2rem 1.5rem',
                    background: msg.role === 'user'
                      ? `linear-gradient(135deg, ${colors.deepPurple}aa, ${colors.midPurple}cc)`
                      : `linear-gradient(135deg, ${colors.midPurple}cc, ${colors.bg}dd)`,
                    border: msg.isError
                      ? `1px solid ${colors.error}80`
                      : msg.role === 'assistant'
                        ? `1px solid ${colors.gold}50`
                        : `1px solid ${colors.purpleLight}40`,
                    borderRadius: '6px',
                    color: colors.cream, fontFamily: fontBody, fontSize: '1.05rem',
                    lineHeight: 1.9, whiteSpace: 'pre-wrap', backdropFilter: 'blur(10px)',
                    boxShadow: msg.role === 'assistant' && !msg.isError
                      ? `0 0 40px ${colors.gold}20, inset 0 0 30px ${colors.midPurple}40`
                      : `0 0 20px ${colors.purpleLight}15`,
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: msg.isError ? colors.error : colors.goldBright,
                        letterSpacing: '0.3em', marginBottom: '0.9rem', opacity: 0.9,
                        textShadow: msg.isError ? 'none' : `0 0 10px ${colors.gold}60`,
                      }}>✦ {msg.isError ? tx.error : tx.name}</div>
                    )}
                    {msg.content}
                    {msg.isError && errorDetails && i === messages.length - 1 && (
                      <div style={{
                        marginTop: '0.8rem', padding: '0.6rem',
                        background: `${colors.error}15`, border: `1px solid ${colors.error}40`,
                        borderRadius: '3px', fontSize: '0.8rem', fontFamily: 'monospace',
                        direction: 'ltr', textAlign: 'left', color: colors.creamMuted,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      }}>{errorDetails}</div>
                    )}
                    {msg.role === 'assistant' && !msg.isError && (
                      <SourcesPanel sources={msg.sources} keywords={msg.keywords} msgIdx={i} />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <div style={{
                    padding: '1.2rem 1.5rem',
                    background: `linear-gradient(135deg, ${colors.midPurple}cc, ${colors.bg}dd)`,
                    border: `1px solid ${colors.gold}50`,
                    borderRadius: '6px', minWidth: '300px', backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 40px ${colors.gold}20`,
                  }}>
                    {searchStatus ? (
                      <div className="status-shimmer" style={{ fontFamily: fontBody, fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                        ✦ {searchStatus}
                      </div>
                    ) : (
                      <>
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{
              position: 'sticky', bottom: 0, paddingTop: '1rem', paddingBottom: '0.5rem',
              background: `linear-gradient(to top, ${colors.bg}, ${colors.bg}cc 70%, transparent)`,
            }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={tx.inputPlaceholder}
                  rows={2}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  style={{
                    flex: 1, background: `${colors.bg}cc`,
                    border: `1px solid ${colors.gold}50`, borderRadius: '4px',
                    padding: '0.9rem 1.1rem', color: colors.cream, fontFamily: fontBody,
                    fontSize: '1.05rem', lineHeight: 1.6, resize: 'none', outline: 'none',
                    boxSizing: 'border-box', backdropFilter: 'blur(8px)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = colors.goldBright; e.target.style.boxShadow = `0 0 20px ${colors.gold}40`; }}
                  onBlur={(e) => { e.target.style.borderColor = `${colors.gold}50`; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="primary-btn"
                  style={{
                    background: `linear-gradient(135deg, ${colors.goldBright}, ${colors.gold})`,
                    color: colors.bg, border: 'none', padding: '0.9rem 1.5rem', borderRadius: '4px',
                    fontFamily: fontBody, fontSize: '1rem', fontWeight: 600,
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    opacity: input.trim() && !loading ? 1 : 0.4, letterSpacing: '0.1em',
                    height: 'fit-content',
                    boxShadow: `0 0 20px ${colors.gold}60`,
                    transition: 'all 0.2s ease',
                  }}
                >{tx.send}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
