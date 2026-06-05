/* ============================================================
   Ledger — shared components & icons (exports to window)
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Icons (functional, Lucide-ish) ---------- */
const PATHS = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  inbox: 'M3 13l2.5-8h13L21 13M3 13v6a1 1 0 001 1h16a1 1 0 001-1v-6M3 13h5l1.5 3h5L16 13h5',
  table: 'M3 5h18M3 5v14h18V5M9 5v14M3 12h18',
  file: 'M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8l-5-5zM14 3v5h5',
  invoice: 'M6 2h9l4 4v16H6V2zM15 2v5h4M9 13h6M9 17h6M9 9h2',
  exportI: 'M12 3v12m0-12l-4 4m4-4l4 4M5 15v4a1 1 0 001 1h12a1 1 0 001-1v-4',
  importI: 'M12 15V3m0 12l-4-4m4 4l4-4M5 15v4a1 1 0 001 1h12a1 1 0 001-1v-4',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 13a7.9 7.9 0 000-2l2-1.5-2-3.4-2.4 1a8 8 0 00-1.7-1l-.3-2.6H9.3L9 4.6a8 8 0 00-1.7 1l-2.4-1-2 3.4L3 11a7.9 7.9 0 000 2l-2 1.5 2 3.4 2.4-1a8 8 0 001.7 1l.3 2.6h4.6l.3-2.6a8 8 0 001.7-1l2.4 1 2-3.4L19.4 13z',
  files: 'M4 4h6l2 2h8v12a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z',
  sparkle: 'M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  filter: 'M3 5h18l-7 8v6l-4-2v-4L3 5z',
  chevDown: 'M6 9l6 6 6-6',
  chevRight: 'M9 6l6 6-6 6',
  chevLeft: 'M15 6l-6 6 6 6',
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  edit: 'M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3zM13.5 6.5l3 3',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  paperclip: 'M21 11l-8.5 8.5a4 4 0 01-6-6L13 6a2.5 2.5 0 014 3l-7 7a1 1 0 01-1.5-1.5l6.5-6.5',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z',
  arrowDL: 'M17 7L7 17m0 0h8m-8 0V9',
  arrowUR: 'M7 17L17 7m0 0H9m8 0v8',
  cloud: 'M7 18a4 4 0 01-.5-8A6 6 0 0118 9a3.5 3.5 0 01-.5 9H7z',
  cpu: 'M6 6h12v12H6zM9 9h6v6H9zM9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2',
  plane: 'M10 2l1.5 8L20 6l-1 3-6 4 1 7-2-1-1-5-4 2-1 3-1.5-1 1-4-3-2 2-1 7 2 1-8L10 2z',
  coffee: 'M3 8h13v5a5 5 0 01-5 5H8a5 5 0 01-5-5V8zM16 9h2.5a2.5 2.5 0 010 5H16M6 2v2M10 2v2',
  box: 'M12 2l9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10',
  users: 'M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM22 19v-1a4 4 0 00-3-3.8M16 4.2a3.5 3.5 0 010 6.6',
  megaphone: 'M3 11v2a1 1 0 001 1h2l3 5V5L6 10H4a1 1 0 00-1 1zM14 7a5 5 0 010 10M9 10v4',
  percent: 'M5 19L19 5M7.5 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.5 21a2 2 0 01-3 0',
  zoomIn: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.3-4.3M11 8v6M8 11h6',
  zoomOut: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.3-4.3M8 11h6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  refresh: 'M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  download: 'M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2',
  upload: 'M12 17V5m0 0L8 9m4-4l4 4M4 19h16',
  dot: '',
  grip: 'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 000 18M12 3a14 14 0 010 18',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  send: 'M22 3L11 14M22 3l-7 18-4-7-7-4 18-7z',
  wand: 'M5 19l9-9M14 6l1.5-1.5M18 10l1.5-1.5M15 4l.7 2.3L18 7l-2.3.7L15 10l-.7-2.3L12 7l2.3-.7L15 4z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
};

function Icon({ name, size = 18, stroke = 1.7, fill = false, style }) {
  const d = PATHS[name];
  if (name === 'sparkle' || (fill && name)) {
    return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', style,
      fill: name === 'sparkle' ? 'currentColor' : 'none', stroke: name === 'sparkle' ? 'none' : 'currentColor',
      strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' },
      React.createElement('path', { d }));
  }
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', style,
    fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d }));
}

/* ---------- Button ---------- */
function Button({ children, variant = 'default', size = 'md', icon, iconRight, onClick, style, title, full }) {
  const sizes = {
    sm: { padding: '5px 10px', fontSize: 12.5, gap: 6, h: 30 },
    md: { padding: '8px 14px', fontSize: 13.5, gap: 7, h: 38 },
    lg: { padding: '11px 20px', fontSize: 15, gap: 8, h: 46 },
  }[size];
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--accent-ink)', border: '1px solid var(--accent)' },
    default: { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--hairline-2)' },
    ghost:   { background: 'transparent', color: 'var(--ink-2)', border: '1px solid transparent' },
    soft:    { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid transparent' },
    danger:  { background: 'var(--surface)', color: 'var(--red)', border: '1px solid var(--hairline-2)' },
  }[variant];
  return React.createElement('button', {
    className: 'focusable', onClick, title,
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
      padding: sizes.padding, fontSize: sizes.fontSize, fontWeight: 600, borderRadius: 'var(--r-md)',
      height: sizes.h, lineHeight: 1, transition: 'all .14s ease', whiteSpace: 'nowrap',
      width: full ? '100%' : undefined, ...variants, ...style },
    onMouseEnter: e => { e.currentTarget.style.filter = 'brightness(.97)'; e.currentTarget.style.transform = 'translateY(-1px)'; },
    onMouseLeave: e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; },
  },
    icon && React.createElement(Icon, { name: icon, size: size === 'sm' ? 15 : 17 }),
    children && React.createElement('span', null, children),
    iconRight && React.createElement(Icon, { name: iconRight, size: size === 'sm' ? 15 : 17 }));
}

/* ---------- Pill / Badge ---------- */
function Pill({ children, tone = 'neutral', dot, soft = true, style }) {
  const map = {
    neutral: ['var(--ink-2)', 'var(--surface-2)'],
    blue:  ['var(--blue)', 'var(--blue-soft)'],
    green: ['var(--green)', 'var(--green-soft)'],
    amber: ['var(--amber)', 'var(--amber-soft)'],
    red:   ['var(--red)', 'var(--red-soft)'],
    accent:['var(--accent)', 'var(--accent-soft)'],
  };
  const [fg, bg] = map[tone] || map.neutral;
  return React.createElement('span', { style: {
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 100,
    fontSize: 11.5, fontWeight: 600, letterSpacing: '.01em', color: fg, whiteSpace: 'nowrap', flexShrink: 0,
    background: soft ? bg : 'transparent', border: soft ? 'none' : `1px solid ${fg}`, ...style } },
    dot && React.createElement('span', { className: dot === 'pulse' ? 'pulse-dot' : '', style: {
      width: 6, height: 6, borderRadius: 10, background: fg } }),
    children);
}

/* ---------- Card ---------- */
function Card({ children, style, pad = 20, hover, onClick }) {
  const [h, setH] = useState(false);
  return React.createElement('div', {
    onClick,
    onMouseEnter: () => hover && setH(true), onMouseLeave: () => hover && setH(false),
    style: { background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)',
      padding: pad, boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-sm)', transition: 'box-shadow .18s, transform .18s',
      transform: h ? 'translateY(-2px)' : 'none', cursor: onClick ? 'pointer' : 'default', ...style } }, children);
}

/* ---------- Money ---------- */
function Money({ amount, cur = 'USD', size = 14, weight = 500, sign = true, muted }) {
  const sym = DB.symbol(cur);
  const neg = amount < 0;
  const abs = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return React.createElement('span', { className: 'num', style: {
    fontSize: size, fontWeight: weight, letterSpacing: '-.01em',
    color: muted ? 'var(--ink-3)' : (neg ? 'var(--ink)' : 'var(--green)') } },
    sign && neg ? '−' : (sign && !neg ? '+' : ''), sym, abs);
}

/* ---------- Category chip ---------- */
function CatChip({ id, small }) {
  const c = DB.catById(id); if (!c) return null;
  return React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: small ? 12 : 13, fontWeight: 500, color: 'var(--ink)' } },
    React.createElement('span', { style: { width: 9, height: 9, borderRadius: 3, background: c.color,
      flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' } }),
    c.name);
}

/* ---------- Status pill for inbox ---------- */
function ScanStatus({ status }) {
  const map = {
    queued:  ['neutral', 'Queued', null],
    reading: ['blue', 'Reading…', 'pulse'],
    done:    ['green', 'Done', null],
    failed:  ['red', 'Failed', null],
  };
  const [tone, label, dot] = map[status] || map.queued;
  return React.createElement(Pill, { tone, dot: status === 'reading' ? 'pulse' : (status==='done'?true:dot) }, label);
}

/* ---------- Segmented control ---------- */
function Segmented({ options, value, onChange, size = 'md' }) {
  return React.createElement('div', { style: { display: 'inline-flex', background: 'var(--surface-2)',
    border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 3, gap: 2 } },
    options.map(o => {
      const v = typeof o === 'string' ? o : o.value;
      const label = typeof o === 'string' ? o : o.label;
      const active = v === value;
      return React.createElement('button', { key: v, className: 'focusable', onClick: () => onChange(v),
        style: { padding: size === 'sm' ? '4px 10px' : '6px 13px', fontSize: size === 'sm' ? 12.5 : 13,
          fontWeight: 600, border: 'none', borderRadius: 7,
          background: active ? 'var(--surface)' : 'transparent',
          color: active ? 'var(--ink)' : 'var(--ink-3)',
          boxShadow: active ? 'var(--shadow-sm)' : 'none', transition: 'all .15s' } }, label);
    }));
}

/* ---------- Tooltip-free thumbnail (receipt placeholder) ---------- */
function ReceiptThumb({ kind = 'pdf', w = 44, h = 56, vendor }) {
  return React.createElement('div', { style: { width: w, height: h, borderRadius: 6, flexShrink: 0,
    background: 'var(--surface-2)', border: '1px solid var(--hairline)', position: 'relative', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' } },
    React.createElement('div', { style: { position: 'absolute', inset: 6, display: 'flex', flexDirection: 'column', gap: 3 } },
      [...Array(4)].map((_, i) => React.createElement('div', { key: i, style: {
        height: 2.5, borderRadius: 2, background: 'var(--hairline-2)', width: `${[90, 60, 75, 40][i]}%` } }))),
    React.createElement(Icon, { name: kind === 'pdf' ? 'file' : 'eye', size: 15, style: { position: 'relative' } }));
}

Object.assign(window, { Icon, Button, Pill, Card, Money, CatChip, ScanStatus, Segmented, ReceiptThumb });
