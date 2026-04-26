'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * עץ הספירות - Tree of Life background
 * Animated SVG with 10 sefirot, 22 paths, flowing energy, and floating Hebrew letters
 */
export default function TreeOfLife({ intensity = 1 }) {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sefirot positions on a 100x140 viewBox (Lurianic arrangement)
  const sefirot = [
    { id: 'keter', name: 'כתר', x: 50, y: 8, color: '#ffffff', glow: '#e8d4ff' },
    { id: 'chochmah', name: 'חכמה', x: 80, y: 22, color: '#9d7fff', glow: '#c8b3ff' },
    { id: 'binah', name: 'בינה', x: 20, y: 22, color: '#7c5cff', glow: '#a98fff' },
    { id: 'chesed', name: 'חסד', x: 80, y: 50, color: '#6da8ff', glow: '#a3caff' },
    { id: 'gevurah', name: 'גבורה', x: 20, y: 50, color: '#ff5577', glow: '#ff95a8' },
    { id: 'tiferet', name: 'תפארת', x: 50, y: 64, color: '#ffd66e', glow: '#ffe8a8' },
    { id: 'netzach', name: 'נצח', x: 80, y: 88, color: '#a3e87f', glow: '#c8f0a8' },
    { id: 'hod', name: 'הוד', x: 20, y: 88, color: '#ff8c5a', glow: '#ffb38a' },
    { id: 'yesod', name: 'יסוד', x: 50, y: 104, color: '#9d7fff', glow: '#c8b3ff' },
    { id: 'malchut', name: 'מלכות', x: 50, y: 128, color: '#d4a574', glow: '#e8c8a3' },
  ];

  const sefBy = (id) => sefirot.find((s) => s.id === id);

  // 22 paths between sefirot (corresponding to the 22 letters of aleph-bet)
  const paths = [
    ['keter', 'chochmah'],
    ['keter', 'binah'],
    ['keter', 'tiferet'],
    ['chochmah', 'binah'],
    ['chochmah', 'chesed'],
    ['chochmah', 'tiferet'],
    ['binah', 'gevurah'],
    ['binah', 'tiferet'],
    ['chesed', 'gevurah'],
    ['chesed', 'tiferet'],
    ['chesed', 'netzach'],
    ['gevurah', 'tiferet'],
    ['gevurah', 'hod'],
    ['tiferet', 'netzach'],
    ['tiferet', 'hod'],
    ['tiferet', 'yesod'],
    ['netzach', 'hod'],
    ['netzach', 'yesod'],
    ['netzach', 'malchut'],
    ['hod', 'yesod'],
    ['hod', 'malchut'],
    ['yesod', 'malchut'],
  ];

  // Floating Hebrew letters - the 22 letters of the aleph-bet
  const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

  // Canvas-based nebula and floating letters
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Floating letters state
    const letters = Array.from({ length: 30 }, () => ({
      char: hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)],
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      size: 14 + Math.random() * 32,
      opacity: 0.04 + Math.random() * 0.12,
      hue: 250 + Math.random() * 60,
      pulseSpeed: 0.4 + Math.random() * 0.8,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Distant stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5,
      brightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      time += 0.008;

      // Clear with deep nebula gradient
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h));
      grad.addColorStop(0, '#1a0d2e');
      grad.addColorStop(0.3, '#0d0a1f');
      grad.addColorStop(0.7, '#06040f');
      grad.addColorStop(1, '#020108');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Nebula clouds (multiple soft blobs)
      ctx.globalCompositeOperation = 'screen';
      const blobs = [
        { x: 0.2 + Math.sin(time * 0.3) * 0.05, y: 0.3, size: 400, color: 'rgba(80, 40, 180, 0.08)' },
        { x: 0.8 + Math.cos(time * 0.2) * 0.05, y: 0.5, size: 500, color: 'rgba(120, 60, 200, 0.06)' },
        { x: 0.5, y: 0.7 + Math.sin(time * 0.4) * 0.05, size: 600, color: 'rgba(40, 20, 100, 0.07)' },
        { x: 0.3 + Math.cos(time * 0.25) * 0.05, y: 0.85, size: 350, color: 'rgba(180, 120, 60, 0.04)' },
      ];
      blobs.forEach((b) => {
        const blobGrad = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.size);
        blobGrad.addColorStop(0, b.color);
        blobGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = blobGrad;
        ctx.fillRect(0, 0, w, h);
      });
      ctx.globalCompositeOperation = 'source-over';

      // Stars (twinkling)
      stars.forEach((s) => {
        const twinkle = (Math.sin(time * s.twinkleSpeed + s.twinkleOffset) + 1) / 2;
        const alpha = s.brightness * (0.4 + twinkle * 0.6);
        ctx.fillStyle = `rgba(255, 240, 210, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating Hebrew letters
      ctx.font = 'serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      letters.forEach((l) => {
        l.x += l.vx;
        l.y += l.vy;
        if (l.x < -0.05) l.x = 1.05;
        if (l.x > 1.05) l.x = -0.05;
        if (l.y < -0.05) l.y = 1.05;
        if (l.y > 1.05) l.y = -0.05;

        const pulse = (Math.sin(time * l.pulseSpeed + l.pulseOffset) + 1) / 2;
        const alpha = l.opacity * (0.5 + pulse * 0.5) * intensity;
        ctx.font = `${l.size}px "Frank Ruhl Libre", serif`;
        ctx.fillStyle = `hsla(${l.hue}, 70%, 75%, ${alpha})`;
        ctx.shadowColor = `hsla(${l.hue}, 80%, 60%, ${alpha * 1.5})`;
        ctx.shadowBlur = l.size * 0.6;
        ctx.fillText(l.char, l.x * w, l.y * h);
      });
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, mounted]);

  return (
    <>
      {/* Animated nebula canvas (background layer) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Tree of Life SVG - layered above nebula */}
      <svg
        viewBox="0 0 100 140"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: '95vh',
          width: 'auto',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.55 * intensity,
          mixBlendMode: 'screen',
        }}
      >
        <defs>
          {/* Glow filter for sefirot */}
          <filter id="sefirahGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for keter */}
          <filter id="keterGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Path gradient with flowing animation */}
          <linearGradient id="pathFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffd66e" stopOpacity="0">
              <animate attributeName="offset" values="-0.3;1.3" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="0.15" stopColor="#ffd66e" stopOpacity="0.9">
              <animate attributeName="offset" values="-0.15;1.45" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="0.3" stopColor="#ffd66e" stopOpacity="0">
              <animate attributeName="offset" values="0;1.6" dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Aura gradient for each sefirah */}
          {sefirot.map((s) => (
            <radialGradient key={`grad-${s.id}`} id={`aura-${s.id}`}>
              <stop offset="0%" stopColor={s.color} stopOpacity="1" />
              <stop offset="40%" stopColor={s.glow} stopOpacity="0.6" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* The 22 paths (Netivot) */}
        {paths.map(([fromId, toId], i) => {
          const from = sefBy(fromId);
          const to = sefBy(toId);
          if (!from || !to) return null;
          return (
            <g key={`path-${i}`}>
              {/* Base path - subtle */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#ffd66e"
                strokeWidth="0.15"
                strokeOpacity="0.25"
              />
              {/* Animated flowing energy */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#pathFlow)"
                strokeWidth="0.3"
                opacity="0.8"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            </g>
          );
        })}

        {/* The 10 sefirot */}
        {sefirot.map((s, i) => {
          const isKeter = s.id === 'keter';
          const radius = isKeter ? 5 : 4;
          return (
            <g key={s.id}>
              {/* Outer aura - large soft glow */}
              <circle
                cx={s.x}
                cy={s.y}
                r={radius * 2.2}
                fill={`url(#aura-${s.id})`}
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values={`${radius * 2}; ${radius * 2.6}; ${radius * 2}`}
                  dur={`${3 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3; 0.6; 0.3"
                  dur={`${3 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Mid glow ring */}
              <circle
                cx={s.x}
                cy={s.y}
                r={radius * 1.3}
                fill={s.glow}
                opacity="0.4"
                filter={isKeter ? 'url(#keterGlow)' : 'url(#sefirahGlow)'}
              >
                <animate
                  attributeName="opacity"
                  values="0.3; 0.7; 0.3"
                  dur={`${2.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Core sphere */}
              <circle
                cx={s.x}
                cy={s.y}
                r={radius * 0.6}
                fill={s.color}
                filter={isKeter ? 'url(#keterGlow)' : 'url(#sefirahGlow)'}
              />

              {/* Inner bright point */}
              <circle
                cx={s.x}
                cy={s.y}
                r={radius * 0.2}
                fill="#ffffff"
                opacity="0.9"
              >
                <animate
                  attributeName="opacity"
                  values="0.7; 1; 0.7"
                  dur={`${1.5 + i * 0.15}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Sefirah Hebrew name - very subtle */}
              <text
                x={s.x}
                y={s.y + radius + 2.5}
                fill="#ffd66e"
                fontSize="1.6"
                textAnchor="middle"
                fontFamily='"Frank Ruhl Libre", serif'
                opacity="0.4"
              >
                {s.name}
              </text>
            </g>
          );
        })}

        {/* Or Ein Sof - infinite light emanating from above keter */}
        <circle cx="50" cy="-15" r="35" fill="url(#aura-keter)" opacity="0.3">
          <animate attributeName="opacity" values="0.2; 0.4; 0.2" dur="8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </>
  );
}
