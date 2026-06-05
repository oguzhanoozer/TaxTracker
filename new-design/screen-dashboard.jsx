/* ============================================================
   Ledger — AI Assistant card + Dashboard (JSX)
   ============================================================ */
const { useState: useStateAI } = React;

function AssistantCard({ go, compact }) {
  const [items, setItems] = useStateAI(DB.ASSISTANT);
  const [applied, setApplied] = useStateAI({});
  const apply = id => setApplied(a => ({ ...a, [id]: true }));

  return (
    <div className="grain" style={{ position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden',
      background: 'var(--ai-grad)', color: '#F4F1E9', padding: compact ? 20 : 24, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.22), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: 120, width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.10), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center',
          background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.22)', backdropFilter: 'blur(8px)' }}>
          <Icon name="sparkle" size={19} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.01em' }}>Ledger Assistant</div>
          <div style={{ fontSize: 12, opacity: .72 }}>Watching your books · updated 2 min ago</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Pill tone="green" dot="pulse" style={{ background: 'rgba(255,255,255,.16)', color: '#EAF7EF' }}>Live</Pill>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'grid', gap: 9 }}>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 14px',
            borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.14)', backdropFilter: 'blur(6px)' }}>
            <div style={{ marginTop: 1, opacity: .9, flexShrink: 0 }}>
              <Icon name={it.kind === 'flag' ? 'bell' : (it.kind === 'review' ? 'inbox' : 'wand')} size={17} />
            </div>
            <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.5, opacity: .96 }}>{it.text}</div>
            {applied[it.id]
              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600,
                  color: '#D6F5E2', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 1 }}><Icon name="check" size={15} />Applied</span>
              : <button className="focusable" onClick={() => { it.to ? go(it.to) : apply(it.id); }}
                  style={{ flexShrink: 0, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, borderRadius: 8,
                    background: 'rgba(255,255,255,.92)', color: '#1F2A24', border: 'none', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {it.cta}
                </button>}
          </div>
        ))}
      </div>
    </div>
  );
}
window.AssistantCard = AssistantCard;

/* ---------------- Dashboard ---------------- */
function Dashboard({ go }) {
  const stats = [
    { label: 'Income', value: 9600, cur: 'USD', delta: '+12%', tone: 'green', count: false },
    { label: 'Expenses', value: -3457.83, cur: 'USD', delta: '−4%', tone: 'neutral', count: false },
    { label: 'Net', value: 6142.17, cur: 'USD', delta: '+18%', tone: 'green', count: false },
    { label: 'Pending receipts', value: 4, count: true, delta: 'needs review', tone: 'amber' },
  ];
  const recent = DB.TX.slice(0, 6);
  const fmt = (v, cur) => (v < 0 ? '−' : '') + DB.symbol(cur) + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="stagger" style={{ display: 'grid', gap: 22, maxWidth: 1180 }}>
      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map(s => (
          <Card key={s.label} pad={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.07em' }}>{s.label}</span>
              <Pill tone={s.tone}>{s.delta}</Pill>
            </div>
            {s.count
              ? <div className="num serif" style={{ fontSize: 36, fontWeight: 400, letterSpacing: '-.02em' }}>{s.value}</div>
              : <div className="num" style={{ fontSize: 27, fontWeight: 500, letterSpacing: '-.02em', color: s.value < 0 ? 'var(--ink)' : 'var(--green)' }}>{fmt(s.value, s.cur)}</div>}
          </Card>
        ))}
      </div>

      <AssistantCard go={go} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 18 }}>
        {/* recent */}
        <Card pad={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
            <h3 className="serif" style={{ fontSize: 19 }}>Recent activity</h3>
            <Button variant="ghost" size="sm" iconRight="chevRight" onClick={() => go('transactions')}>All transactions</Button>
          </div>
          <div>
            {recent.map((t, i) => (
              <div key={t.id} onClick={() => go('detail', t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 20px', cursor: 'pointer',
                  borderBottom: i < recent.length - 1 ? '1px solid var(--hairline)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center',
                  background: 'var(--surface-2)', border: '1px solid var(--hairline)', color: 'var(--ink-2)' }}>
                  <Icon name={t.amount > 0 ? 'arrowDL' : 'arrowUR'} size={17} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.vendor}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{t.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {t.status === 'review' && <Pill tone="amber" dot>Review</Pill>}
                  {t.ai && <span title="Scanned by AI" style={{ color: 'var(--accent)', display: 'flex' }}><Icon name="sparkle" size={14} /></span>}
                  <Money amount={t.amount} cur={t.cur} size={13.5} weight={600} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* reminders */}
        <Card pad={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
            <h3 className="serif" style={{ fontSize: 19 }}>Upcoming</h3>
            <Icon name="clock" size={17} style={{ color: 'var(--ink-3)' }} />
          </div>
          <div>
            {DB.REMINDERS.map((r, i) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px',
                borderBottom: i < DB.REMINDERS.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                <div style={{ width: 42, textAlign: 'center', flexShrink: 0 }}>
                  <div className="num" style={{ fontSize: 15, fontWeight: 600 }}>{r.when.split(' ')[1] || r.when}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{r.when.split(' ')[0]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.sub}</div>
                </div>
                <Pill tone={r.kind === 'tax' ? 'red' : (r.kind === 'invoice' ? 'accent' : 'neutral')}>{r.days + 'd'}</Pill>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="primary" icon="upload" size="lg" onClick={() => go('inbox')}>Upload receipt</Button>
        <Button variant="default" icon="invoice" size="lg" onClick={() => go('invoices')}>Create invoice</Button>
        <Button variant="default" icon="plus" size="lg" onClick={() => go('transactions')}>Add manual transaction</Button>
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Dashboard = Dashboard;
