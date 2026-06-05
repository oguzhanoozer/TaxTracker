/* ============================================================
   Ledger — App shell, sidebar, topbar, router
   ============================================================ */
const { useState: useS, useEffect: useE } = React;

const NAV = [
  { group: 'Books', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'inbox', label: 'Unsorted inbox', icon: 'inbox', badge: 4 },
    { id: 'transactions', label: 'Transactions', icon: 'table' },
  ]},
  { group: 'Tools', items: [
    { id: 'invoices', label: 'Invoices', icon: 'invoice' },
    { id: 'export', label: 'Export', icon: 'exportI' },
    { id: 'import', label: 'Import', icon: 'importI' },
  ]},
];

function Wordmark({ size = 22 }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9 } },
    React.createElement('div', { style: { width: 30, height: 30, borderRadius: 8, background: 'var(--accent)',
      color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: 'var(--font-display)',
      fontSize: 19, fontWeight: 500, boxShadow: 'var(--shadow-sm)' } }, 'L'),
    React.createElement('span', { className: 'serif', style: { fontSize: size, fontWeight: 500, letterSpacing: '-.02em' } }, 'Ledger'));
}
window.Wordmark = Wordmark;

function Sidebar({ route, go }) {
  return React.createElement('aside', { style: { position: 'fixed', top: 0, left: 0, bottom: 0, width: 'var(--sidebar-w)',
    background: 'var(--paper-2)', borderRight: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column',
    padding: '20px 14px', zIndex: 30 } },
    React.createElement('div', { style: { padding: '4px 8px 22px' } }, React.createElement(Wordmark, null)),

    React.createElement('nav', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto' } },
      NAV.map(g => React.createElement('div', { key: g.group },
        React.createElement('div', { style: { fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase',
          letterSpacing: '.08em', padding: '0 8px 8px' } }, g.group),
        React.createElement('div', { style: { display: 'grid', gap: 2 } },
          g.items.map(it => {
            const active = route === it.id || (it.id === 'transactions' && route === 'detail');
            return React.createElement('button', { key: it.id, className: 'focusable', onClick: () => go(it.id),
              style: { display: 'flex', alignItems: 'center', gap: 11, padding: '8px 9px', borderRadius: 'var(--r-md)',
                border: 'none', background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--ink)' : 'var(--ink-2)',
                fontWeight: active ? 600 : 500, fontSize: 13.5, textAlign: 'left', width: '100%',
                boxShadow: active ? 'var(--shadow-sm)' : 'none', transition: 'all .14s' },
              onMouseEnter: e => { if (!active) e.currentTarget.style.background = 'color-mix(in oklab, var(--surface) 55%, transparent)'; },
              onMouseLeave: e => { if (!active) e.currentTarget.style.background = 'transparent'; } },
              React.createElement('span', { style: { color: active ? 'var(--accent)' : 'var(--ink-3)', display: 'flex' } },
                React.createElement(Icon, { name: it.icon, size: 18 })),
              React.createElement('span', { style: { flex: 1 } }, it.label),
              it.badge && React.createElement('span', { className: 'num', style: { fontSize: 11, fontWeight: 700, color: 'var(--amber)',
                background: 'var(--amber-soft)', padding: '1px 7px', borderRadius: 100 } }, it.badge));
          })))) ),

    // footer: settings + user + public site
    React.createElement('div', { style: { display: 'grid', gap: 2, paddingTop: 12, borderTop: '1px solid var(--hairline)' } },
      React.createElement('button', { className: 'focusable', onClick: () => go('settings'),
        style: { display: 'flex', alignItems: 'center', gap: 11, padding: '8px 9px', borderRadius: 'var(--r-md)', border: 'none',
          background: route === 'settings' ? 'var(--surface)' : 'transparent', color: route === 'settings' ? 'var(--ink)' : 'var(--ink-2)',
          fontWeight: route === 'settings' ? 600 : 500, fontSize: 13.5, textAlign: 'left', width: '100%', boxShadow: route==='settings'?'var(--shadow-sm)':'none' } },
        React.createElement('span', { style: { color: route==='settings'?'var(--accent)':'var(--ink-3)', display:'flex' } }, React.createElement(Icon, { name: 'settings', size: 18 })),
        'Settings'),
      React.createElement('button', { className: 'focusable', onClick: () => go('landing'),
        style: { display: 'flex', alignItems: 'center', gap: 11, padding: '8px 9px', borderRadius: 'var(--r-md)', border: 'none',
          background: 'transparent', color: 'var(--ink-3)', fontWeight: 500, fontSize: 13.5, textAlign: 'left', width: '100%' } },
        React.createElement('span', { style: { display:'flex' } }, React.createElement(Icon, { name: 'globe', size: 18 })),
        'View public site'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 9px 4px' } },
        React.createElement('div', { style: { width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-ink)',
          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 } }, 'MR'),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, 'Mara Reyes'),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--ink-3)' } }, 'Self-hosted')),
        React.createElement(Icon, { name: 'chevDown', size: 15, style: { color: 'var(--ink-3)' } }))));
}

const PAGE_META = {
  dashboard:    { title: 'Good morning, Mara', sub: 'Thursday, June 5 · here\u2019s where you stand this month' },
  inbox:        { title: 'Unsorted inbox', sub: 'Drop receipts and invoices \u2014 the AI reads them for you' },
  transactions: { title: 'Transactions', sub: 'Your full ledger' },
  invoices:     { title: 'Invoice generator', sub: 'Bill clients from the same place your costs live' },
  export:       { title: 'Export', sub: 'Hand a clean file to your accountant' },
  import:       { title: 'Import', sub: 'Bring transactions in from another tool' },
  settings:     { title: 'Settings', sub: 'Configure Ledger to fit how you work' },
};

function Topbar({ route, go, period, setPeriod }) {
  const meta = PAGE_META[route] || {};
  const showPeriod = route === 'dashboard';
  return React.createElement('header', { style: { position: 'sticky', top: 0, zIndex: 20, height: 'var(--topbar-h)',
    display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px', background: 'color-mix(in oklab, var(--paper) 86%, transparent)',
    backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--hairline)' } },
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('h1', { className: 'serif', style: { fontSize: 22, fontWeight: 500, letterSpacing: '-.02em', lineHeight: 1.1 } }, meta.title),
      meta.sub && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 } }, meta.sub)),
    showPeriod && React.createElement(Segmented, { value: period, onChange: setPeriod,
      options: [{value:'day',label:'Day'},{value:'week',label:'Week'},{value:'month',label:'Month'},{value:'year',label:'Year'}] }),
    React.createElement('button', { className: 'focusable', title: 'Search',
      style: { width: 38, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--hairline-2)', background: 'var(--surface)',
        color: 'var(--ink-2)', display: 'grid', placeItems: 'center' } }, React.createElement(Icon, { name: 'search', size: 18 })),
    React.createElement(Button, { variant: 'primary', icon: 'upload', onClick: () => go('inbox') }, 'Upload'));
}

function Placeholder({ name }) {
  return React.createElement('div', { style: { display: 'grid', placeItems: 'center', height: 400, color: 'var(--ink-3)' } },
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement(Icon, { name: 'layers', size: 30 }),
      React.createElement('div', { className: 'serif', style: { fontSize: 22, marginTop: 12, color: 'var(--ink-2)' } }, name),
      React.createElement('div', { style: { fontSize: 13, marginTop: 4 } }, 'Coming up next \u2014 building this screen.')));
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "display": "serif",
  "accent": "auto"
}/*EDITMODE-END*/;
const ACCENTS = {
  auto:   null,
  pine:   ['#1F4A3B', '#2C6650'],
  indigo: ['#3D3BC4', '#5654DA'],
  clay:   ['#BD5733', '#CE6A45'],
  plum:   ['#6A4A8C', '#8466A8'],
  gold:   ['#9A7B17', '#B5852F'],
};

function TweaksUI({ tw, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Visual style" />
      <TweakRadio label="Palette" value={tw.theme} options={['paper', 'slate', 'carbon']} onChange={v => setTweak('theme', v)} />
      <TweakRadio label="Display font" value={tw.display} options={['serif', 'grotesk']} onChange={v => setTweak('display', v)} />
      <TweakSection label="Accent" />
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', padding: '4px 0 2px' }}>
        {Object.keys(ACCENTS).map(k => {
          const a = ACCENTS[k];
          const active = tw.accent === k;
          return (
            <button key={k} onClick={() => setTweak('accent', k)} title={k}
              style={{ width: 30, height: 30, borderRadius: 8, cursor: 'pointer', padding: 0,
                border: active ? '2px solid #fff' : '2px solid transparent',
                boxShadow: active ? '0 0 0 2px #5b6b7a' : 'inset 0 0 0 1px rgba(0,0,0,.15)',
                background: a ? `linear-gradient(135deg, ${a[0]}, ${a[1]})` : 'conic-gradient(from 90deg, #1F4A3B, #3D3BC4, #BD5733, #9A7B17, #1F4A3B)' }} />
          );
        })}
      </div>
    </TweaksPanel>
  );
}

function App() {
  const [route, setRoute] = useS('dashboard');
  const [detailId, setDetailId] = useS('t1040');
  const [period, setPeriod] = useS('month');
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const go = (r, id) => { if (id) setDetailId(id); setRoute(r); window.scrollTo(0, 0); const m = document.querySelector('#scroller'); if (m) m.scrollTop = 0; };

  // apply theme + tweaks to root
  useE(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', tw.theme || 'paper');
    root.style.setProperty('--font-display', tw.display === 'grotesk' ? 'var(--font-sans)' : 'var(--font-serif)');
    const a = ACCENTS[tw.accent];
    if (a) { root.style.setProperty('--accent', a[0]); root.style.setProperty('--accent-2', a[1]); }
    else { root.style.removeProperty('--accent'); root.style.removeProperty('--accent-2'); }
  }, [tw.theme, tw.display, tw.accent]);

  const S = window.Screens || {};
  const screenFor = () => {
    switch (route) {
      case 'dashboard': return React.createElement(S.Dashboard, { go });
      case 'inbox': return S.Inbox ? React.createElement(S.Inbox, { go }) : React.createElement(Placeholder, { name: 'Unsorted inbox' });
      case 'transactions': return S.Transactions ? React.createElement(S.Transactions, { go }) : React.createElement(Placeholder, { name: 'Transactions' });
      case 'detail': return S.Detail ? React.createElement(S.Detail, { go, id: detailId }) : React.createElement(Placeholder, { name: 'Transaction detail' });
      case 'invoices': return S.Invoices ? React.createElement(S.Invoices, { go }) : React.createElement(Placeholder, { name: 'Invoices' });
      case 'export': return S.Export ? React.createElement(S.Export, { go }) : React.createElement(Placeholder, { name: 'Export' });
      case 'import': return S.Import ? React.createElement(S.Import, { go }) : React.createElement(Placeholder, { name: 'Import' });
      case 'settings': return S.Settings ? React.createElement(S.Settings, { go }) : React.createElement(Placeholder, { name: 'Settings' });
      default: return React.createElement(S.Dashboard, { go });
    }
  };

  // Landing renders full-bleed, no shell
  if (route === 'landing') {
    return React.createElement(React.Fragment, null,
      S.Landing ? React.createElement(S.Landing, { go }) : React.createElement(Placeholder, { name: 'Landing page' }),
      React.createElement(TweaksUI, { tw, setTweak }));
  }

  return React.createElement('div', null,
    React.createElement(Sidebar, { route, go }),
    React.createElement('div', { id: 'scroller', style: { marginLeft: 'var(--sidebar-w)', minHeight: '100vh' } },
      React.createElement(Topbar, { route, go, period, setPeriod }),
      React.createElement('main', { key: route, className: 'rise', style: { padding: '28px 32px 80px' } }, screenFor())),
    React.createElement(TweaksUI, { tw, setTweak }));
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
