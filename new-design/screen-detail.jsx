/* ============================================================
   Ledger — Transaction detail (verify + edit)
   ============================================================ */
const { useState: useDt, useEffect: useDtE } = React;

function Field({ label, conf, children, hint }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{label}</label>
        {conf != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 600,
          color: conf > 0.9 ? 'var(--accent)' : 'var(--amber)' }}><Icon name="sparkle" size={11} />{Math.round(conf * 100)}%</span>}
        {hint && <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
const inputStyle = { width: '100%', padding: '9px 12px', fontSize: 13.5, borderRadius: 'var(--r-md)',
  border: '1px solid var(--hairline-2)', background: 'var(--surface)', color: 'var(--ink)' };
window.Field = Field;
window.inputStyle = inputStyle;

function FauxReceipt({ tx, zoom }) {
  const items = [
    { n: tx.desc, v: Math.abs(tx.amount) - (tx.vat || 0) },
  ];
  return (
    <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform .2s', width: 320,
      background: '#fff', color: '#222', borderRadius: 4, padding: '28px 26px', boxShadow: '0 10px 40px rgba(0,0,0,.18)',
      fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7 }}>
      <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #bbb', paddingBottom: 12, marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, letterSpacing: '.04em' }}>{tx.vendor.toUpperCase()}</div>
        <div style={{ color: '#888', fontSize: 11 }}>Receipt · {tx.id.toUpperCase()}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>Date</span><span>{tx.date}</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: 12 }}><span>Method</span><span>VISA ••42</span></div>
      <div style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '10px 0', margin: '4px 0' }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ flex: 1 }}>{it.n}</span>
            <span>{DB.symbol(tx.cur)}{it.v.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {tx.vat > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>VAT</span><span>{DB.symbol(tx.cur)}{tx.vat.toFixed(2)}</span></div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', marginTop: 8 }}>
        <span>TOTAL</span><span>{DB.symbol(tx.cur)}{Math.abs(tx.amount).toFixed(2)}</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16, color: '#999', fontSize: 10 }}>★ THANK YOU ★<br />storeid 2207 · 14:32</div>
    </div>
  );
}

function Detail({ go, id }) {
  const tx0 = DB.TX.find(t => t.id === id) || DB.TX[1];
  const [tx, setTx] = useDt(tx0);
  const [zoom, setZoom] = useDt(1);
  const [reimb, setReimb] = useDt(true);
  const [rerunning, setRerunning] = useDt(false);
  const [page, setPage] = useDt(1);
  useDtE(() => { setTx(DB.TX.find(t => t.id === id) || DB.TX[1]); }, [id]);

  const upd = (k, v) => setTx(t => ({ ...t, [k]: v }));
  const idx = DB.TX.findIndex(t => t.id === tx.id);
  const next = () => { const n = DB.TX[(idx + 1) % DB.TX.length]; go('detail', n.id); };
  const prev = () => { const n = DB.TX[(idx - 1 + DB.TX.length) % DB.TX.length]; go('detail', n.id); };
  const rerun = () => { setRerunning(true); setTimeout(() => setRerunning(false), 1600); };

  useDtE(() => {
    const h = e => { if (e.key === 'j' || e.key === 'J') next(); if (e.key === 'k' || e.key === 'K') prev(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  });

  return (
    <div className="rise" style={{ maxWidth: 1180 }}>
      {/* breadcrumb / nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Button variant="ghost" size="sm" icon="chevLeft" onClick={() => go('transactions')}>Transactions</Button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{idx + 1} of {DB.TX.length}</span>
        <Button variant="default" size="sm" icon="chevLeft" onClick={prev} title="Previous (K)" />
        <Button variant="default" size="sm" icon="chevRight" onClick={next} title="Next (J)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 22, alignItems: 'start' }}>
        {/* preview */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div style={{ position: 'relative', background: 'var(--surface-2)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)',
            padding: 28, minHeight: 460, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden' }}>
            {rerunning && <div className="shimmer" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />}
            <FauxReceipt tx={tx} zoom={zoom} />
            {/* zoom controls */}
            <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', gap: 6, background: 'var(--surface)',
              border: '1px solid var(--hairline-2)', borderRadius: 'var(--r-md)', padding: 4, boxShadow: 'var(--shadow-sm)' }}>
              <button className="focusable" onClick={() => setZoom(z => Math.max(.6, z - .15))} style={{ border: 'none', background: 'none', padding: 5, color: 'var(--ink-2)', display: 'flex' }}><Icon name="zoomOut" size={17} /></button>
              <button className="focusable" onClick={() => setZoom(z => Math.min(1.6, z + .15))} style={{ border: 'none', background: 'none', padding: 5, color: 'var(--ink-2)', display: 'flex' }}><Icon name="zoomIn" size={17} /></button>
            </div>
          </div>
          {/* multi-page */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12 }}>
            {[1, 2].map(p => <button key={p} onClick={() => setPage(p)} className="focusable"
              style={{ width: 44, height: 56, borderRadius: 6, border: `1.5px solid ${page === p ? 'var(--accent)' : 'var(--hairline-2)'}`,
                background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', fontSize: 11 }}>{p}</button>)}
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>2 pages</span>
          </div>
        </div>

        {/* form */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <h2 className="serif" style={{ fontSize: 25, whiteSpace: 'nowrap' }}>{tx.vendor}</h2>
                {tx.ai && <Pill tone="accent" dot>AI extracted</Pill>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Verify the fields below, then approve.</div>
            </div>
            <Button variant="default" size="sm" icon="refresh" onClick={rerun}>{rerunning ? 'Re-running…' : 'Re-run AI'}</Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Vendor" conf={tx.ai ? 0.97 : null} hint="autocompletes from past vendors">
                <input style={inputStyle} value={tx.vendor} onChange={e => upd('vendor', e.target.value)} list="vendors" />
                <datalist id="vendors">{DB.VENDORS.map(v => <option key={v} value={v} />)}</datalist>
              </Field>
            </div>
            <Field label="Date" conf={tx.ai ? 0.99 : null}>
              <input type="date" style={inputStyle} value={tx.date} onChange={e => upd('date', e.target.value)} />
            </Field>
            <Field label="Amount" conf={tx.ai ? 0.96 : null}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="num" style={{ ...inputStyle, flex: 1 }} value={Math.abs(tx.amount)} onChange={e => upd('amount', -Math.abs(parseFloat(e.target.value) || 0))} />
                <Select value={tx.cur} onChange={v => upd('cur', v)} w={90} options={DB.CURRENCIES.map(c => ({ value: c, label: c }))} />
              </div>
            </Field>
            <Field label="VAT / Tax" conf={tx.ai ? 0.88 : null}>
              <input className="num" style={inputStyle} value={tx.vat || 0} onChange={e => upd('vat', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Category" conf={tx.ai ? 0.93 : null} hint="create new inline">
              <Select value={tx.cat} onChange={v => upd('cat', v)} w="100%"
                options={[...DB.CATEGORIES.map(c => ({ value: c.id, label: c.name })), { value: '__new', label: '+ Create new…' }]} />
            </Field>
            <Field label="Project">
              <Select value={tx.project} onChange={v => upd('project', v)} w="100%"
                options={DB.PROJECTS.map(p => ({ value: p.id, label: p.name }))} />
            </Field>

            {/* custom fields */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--hairline)', paddingTop: 16, marginTop: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Custom fields</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 14px' }}>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>Reimbursable?</span>
                <button onClick={() => setReimb(r => !r)} className="focusable" style={{ width: 44, height: 25, borderRadius: 20, border: 'none',
                  background: reimb ? 'var(--accent)' : 'var(--hairline-2)', position: 'relative', transition: 'background .18s', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 3, left: reimb ? 22 : 3, width: 19, height: 19, borderRadius: '50%', background: '#fff', transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
                </button>
              </div>
              <Field label="Meeting notes">
                <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} placeholder="Add context for this expense…" defaultValue={tx.cat === 'meals' ? 'Kickoff lunch with Northwind product team.' : ''} />
              </Field>
            </div>
          </div>

          {/* actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--hairline)' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Keyboard: <kbd className="num" style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--hairline-2)' }}>J</kbd> / <kbd className="num" style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--hairline-2)' }}>K</kbd> to navigate</span>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" onClick={() => go('transactions')}>Cancel</Button>
            <Button variant="primary" icon="check" onClick={next}>Approve &amp; next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Detail = Detail;
