/* ============================================================
   Ledger — Unsorted inbox (upload + live AI scan)
   ============================================================ */
const { useState: useIn, useEffect: useInE, useRef: useInR } = React;

const SCAN_RESULTS = [
  { vendor: 'Deutsche Bahn', amount: -129.90, cur: 'EUR', cat: 'travel', conf: 0.94 },
  { vendor: 'WeWork', amount: -320.00, cur: 'EUR', cat: 'office', conf: 0.91 },
  { vendor: 'Figma', amount: -45.00, cur: 'USD', cat: 'software', conf: 0.98 },
  { vendor: 'Notion', amount: -32.00, cur: 'USD', cat: 'software', conf: 0.96 },
];

function Inbox({ go }) {
  const [docs, setDocs] = useIn(() => DB.INBOX.map(d => ({ ...d })));
  const [filter, setFilter] = useIn('all');
  const [sel, setSel] = useIn({});
  const [drag, setDrag] = useIn(false);
  const fileRef = useInR(null);
  const resIdx = useInR(0);

  // live engine: advance reading progress, promote queued -> reading
  useInE(() => {
    const t = setInterval(() => {
      setDocs(prev => {
        let next = prev.map(d => {
          if (d.status === 'reading') {
            const p = (d.progress || 0) + 0.08 + Math.random() * 0.06;
            if (p >= 1) {
              const r = SCAN_RESULTS[(resIdx.current++) % SCAN_RESULTS.length];
              return { ...d, status: 'done', progress: 1, vendor: r.vendor, amount: r.amount, cur: r.cur, cat: r.cat, conf: r.conf, ms: 'just now' };
            }
            return { ...d, progress: p };
          }
          return d;
        });
        const reading = next.filter(d => d.status === 'reading').length;
        if (reading < 2) {
          const q = next.find(d => d.status === 'queued');
          if (q) next = next.map(d => d.id === q.id ? { ...d, status: 'reading', progress: 0.02, ms: 'now' } : d);
        }
        return next;
      });
    }, 600);
    return () => clearInterval(t);
  }, []);

  const addFiles = (names) => {
    const items = names.map((n, i) => ({ id: 'n' + Date.now() + i, name: n, kind: /\.pdf$/i.test(n) ? 'pdf' : 'photo',
      status: 'queued', vendor: null, amount: null, cur: null, conf: null, ms: 'queued' }));
    setDocs(prev => [...items, ...prev]);
  };
  const onPick = e => { const f = [...(e.target.files || [])].map(f => f.name); if (f.length) addFiles(f); };
  const onDrop = e => { e.preventDefault(); setDrag(false);
    const f = [...(e.dataTransfer.files || [])].map(f => f.name);
    addFiles(f.length ? f : ['receipt_' + Math.floor(Math.random() * 9000) + '.jpg']); };

  const retry = id => setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'reading', progress: 0.02, error: null, ms: 'now' } : d));

  const counts = {
    all: docs.length,
    pending: docs.filter(d => d.status === 'queued' || d.status === 'reading').length,
    done: docs.filter(d => d.status === 'done').length,
    failed: docs.filter(d => d.status === 'failed').length,
  };
  const shown = docs.filter(d => filter === 'all' ? true
    : filter === 'pending' ? (d.status === 'queued' || d.status === 'reading')
    : d.status === filter);

  const doneIds = docs.filter(d => d.status === 'done').map(d => d.id);
  const selCount = Object.values(sel).filter(Boolean).length;
  const toggle = id => setSel(s => ({ ...s, [id]: !s[id] }));
  const approve = () => {
    setDocs(prev => prev.filter(d => !sel[d.id]));
    setSel({});
  };

  return (
    <div className="stagger" style={{ display: 'grid', gap: 20, maxWidth: 1180 }}>
      {/* drop zone */}
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
        onClick={() => fileRef.current && fileRef.current.click()}
        style={{ border: `2px dashed ${drag ? 'var(--accent)' : 'var(--hairline-2)'}`, borderRadius: 'var(--r-xl)',
          background: drag ? 'var(--accent-soft)' : 'var(--surface)', padding: '34px 32px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 22, transition: 'all .18s', boxShadow: 'var(--shadow-sm)' }}>
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic" onChange={onPick} style={{ display: 'none' }} />
        <div style={{ width: 60, height: 60, borderRadius: 16, flexShrink: 0, display: 'grid', placeItems: 'center',
          background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <Icon name="upload" size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 21, color: 'var(--ink)' }}>Drop receipts &amp; invoices here</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3 }}>
            Single or bulk · PDF, JPG, PNG, HEIC. The AI reads vendor, amount, currency and VAT, then files it for you.
          </div>
        </div>
        <Button variant="primary" icon="plus">Choose files</Button>
      </div>

      {/* filter + bulk bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Segmented value={filter} onChange={setFilter} options={[
          { value: 'all', label: `All ${counts.all}` },
          { value: 'pending', label: `Pending ${counts.pending}` },
          { value: 'done', label: `Done ${counts.done}` },
          { value: 'failed', label: `Failed ${counts.failed}` },
        ]} />
        <div style={{ flex: 1 }} />
        {selCount > 0
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>{selCount} selected</span>
              <Button variant="ghost" size="sm" onClick={() => setSel({})}>Clear</Button>
              <Button variant="primary" size="sm" icon="check" onClick={approve}>Approve → Transactions</Button>
            </div>
          : <Button variant="default" size="sm" icon="check"
              onClick={() => { const s = {}; doneIds.forEach(id => s[id] = true); setSel(s); }}
              style={{ opacity: doneIds.length ? 1 : .5 }}>Select all done ({doneIds.length})</Button>}
      </div>

      {/* grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(268px, 1fr))', gap: 14 }}>
        {shown.map(d => {
          const isSel = !!sel[d.id];
          const canSel = d.status === 'done';
          return (
            <div key={d.id} style={{ background: 'var(--surface)', border: `1.5px solid ${isSel ? 'var(--accent)' : 'var(--hairline)'}`,
              borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: isSel ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              transition: 'all .15s' }}>
              {/* top: thumb + status */}
              <div style={{ display: 'flex', gap: 12, padding: 14 }}>
                <div style={{ position: 'relative' }}>
                  <ReceiptThumb kind={d.kind} w={52} h={66} />
                  {d.status === 'reading' && <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: 6 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <ScanStatus status={d.status} />
                    {canSel && <input type="checkbox" checked={isSel} onChange={() => toggle(d.id)}
                      style={{ width: 17, height: 17, accentColor: 'var(--accent)', cursor: 'pointer' }} />}
                  </div>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{d.ms}</div>
                </div>
              </div>

              {/* bottom: result / progress / error */}
              <div style={{ borderTop: '1px solid var(--hairline)', padding: '12px 14px', background: 'var(--surface-2)', minHeight: 62 }}>
                {d.status === 'done' && (
                  <div onClick={() => go('detail', 't1040')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{d.vendor}</span>
                      <span style={{ flexShrink: 0 }}><Money amount={d.amount} cur={d.cur} size={14} weight={600} /></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
                      {d.cat && <CatChip id={d.cat} small />}
                      <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>
                        <Icon name="sparkle" size={12} />{Math.round((d.conf || .9) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
                {d.status === 'reading' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--blue)', fontWeight: 600 }}>
                      <Icon name="sparkle" size={13} /> Extracting fields…
                    </div>
                    <div style={{ height: 5, borderRadius: 10, background: 'var(--hairline)', marginTop: 9, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (d.progress || 0) * 100)}%`, background: 'var(--blue)', borderRadius: 10, transition: 'width .5s ease' }} />
                    </div>
                  </div>
                )}
                {d.status === 'queued' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-3)' }}>
                    <Icon name="clock" size={14} /> Waiting in line…
                  </div>
                )}
                {d.status === 'failed' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--red)' }}>{d.error || 'Could not read'}</span>
                    <Button variant="ghost" size="sm" icon="refresh" onClick={() => retry(d.id)}>Retry</Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Inbox = Inbox;
