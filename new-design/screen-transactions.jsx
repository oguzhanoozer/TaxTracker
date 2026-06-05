/* ============================================================
   Ledger — Transactions table
   ============================================================ */
const { useState: useTx, useMemo: useTxM } = React;

function Select({ value, onChange, options, placeholder, w }) {
  return (
    <div style={{ position: 'relative', width: w }}>
      <select value={value} onChange={e => onChange(e.target.value)} className="focusable"
        style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', padding: '8px 30px 8px 11px', fontSize: 13,
          fontWeight: 500, borderRadius: 'var(--r-md)', border: '1px solid var(--hairline-2)', background: 'var(--surface)',
          color: value ? 'var(--ink)' : 'var(--ink-3)', cursor: 'pointer' }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-3)' }}>
        <Icon name="chevDown" size={15} />
      </span>
    </div>
  );
}
window.Select = Select;

function Transactions({ go }) {
  const [txs, setTxs] = useTx(() => DB.TX.map(t => ({ ...t })));
  const [q, setQ] = useTx('');
  const [fCat, setFCat] = useTx('');
  const [fProj, setFProj] = useTx('');
  const [fStatus, setFStatus] = useTx('all');
  const [sortKey, setSortKey] = useTx('date');
  const [sortDir, setSortDir] = useTx('desc');
  const [sel, setSel] = useTx({});
  const [editing, setEditing] = useTx(null); // {id, field}

  const sort = key => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };

  const rows = useTxM(() => {
    let r = txs.filter(t => {
      if (fCat && t.cat !== fCat) return false;
      if (fProj && t.project !== fProj) return false;
      if (fStatus !== 'all' && t.status !== fStatus) return false;
      if (q) { const s = (t.vendor + ' ' + t.desc).toLowerCase(); if (!s.includes(q.toLowerCase())) return false; }
      return true;
    });
    r.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'amount') { av = a.amount; bv = b.amount; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return r;
  }, [txs, q, fCat, fProj, fStatus, sortKey, sortDir]);

  const selIds = Object.keys(sel).filter(k => sel[k]);
  const allSel = rows.length > 0 && rows.every(r => sel[r.id]);
  const toggleAll = () => { if (allSel) setSel({}); else { const s = {}; rows.forEach(r => s[r.id] = true); setSel(s); } };
  const setCat = (id, cat) => { setTxs(prev => prev.map(t => t.id === id ? { ...t, cat } : t)); setEditing(null); };
  const setStatus = (id, status) => { setTxs(prev => prev.map(t => t.id === id ? { ...t, status } : t)); setEditing(null); };
  const del = () => { setTxs(prev => prev.filter(t => !sel[t.id])); setSel({}); };

  const SortHead = ({ k, children, align }) => (
    <th onClick={() => sort(k)} style={{ textAlign: align || 'left', padding: '11px 14px', cursor: 'pointer',
      fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        {children}
        {sortKey === k && <Icon name="chevDown" size={13} style={{ transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none' }} />}
      </span>
    </th>
  );
  const th = (label, align) => <th style={{ textAlign: align || 'left', padding: '11px 14px', fontSize: 11, fontWeight: 700,
    color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{label}</th>;

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="rise" style={{ display: 'grid', gap: 16 }}>
      {/* filter bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}><Icon name="search" size={16} /></span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search vendor, description, tags…" className="focusable"
            style={{ width: '100%', padding: '9px 12px 9px 34px', fontSize: 13.5, borderRadius: 'var(--r-md)', border: '1px solid var(--hairline-2)', background: 'var(--surface)' }} />
        </div>
        <Select value={fCat} onChange={setFCat} placeholder="All categories" w={170}
          options={DB.CATEGORIES.map(c => ({ value: c.id, label: c.name }))} />
        <Select value={fProj} onChange={setFProj} placeholder="All projects" w={150}
          options={DB.PROJECTS.map(p => ({ value: p.id, label: p.name }))} />
        <Segmented value={fStatus} onChange={setFStatus} size="sm" options={[
          { value: 'all', label: 'All' }, { value: 'approved', label: 'Approved' }, { value: 'review', label: 'Review' }]} />
      </div>

      {/* table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* bulk bar */}
        {selIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: 'var(--accent-soft)', borderBottom: '1px solid var(--hairline)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{selIds.length} selected</span>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm" icon="layers">Categorize</Button>
            <Button variant="ghost" size="sm" icon="paperclip">Tag</Button>
            <Button variant="ghost" size="sm" icon="exportI" onClick={() => go('export')}>Export</Button>
            <Button variant="danger" size="sm" icon="trash" onClick={del}>Delete</Button>
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)', background: 'var(--surface-2)' }}>
                <th style={{ padding: '11px 14px', width: 40 }}>
                  <input type="checkbox" checked={allSel} onChange={toggleAll} style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </th>
                <SortHead k="date">Date</SortHead>
                <SortHead k="vendor">Vendor</SortHead>
                <SortHead k="amount" align="right">Amount</SortHead>
                {th('Category')}
                {th('Project')}
                {th('Tax', 'right')}
                {th('Status')}
                {th('', 'center')}
              </tr>
            </thead>
            <tbody>
              {rows.map(t => {
                const proj = DB.projById(t.project);
                const isEditCat = editing && editing.id === t.id && editing.field === 'cat';
                const isEditStatus = editing && editing.id === t.id && editing.field === 'status';
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--hairline)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '11px 14px' }}>
                      <input type="checkbox" checked={!!sel[t.id]} onChange={() => setSel(s => ({ ...s, [t.id]: !s[t.id] }))}
                        style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                    </td>
                    <td className="num" style={{ padding: '11px 14px', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{fmtDate(t.date)}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span onClick={() => go('detail', t.id)} style={{ fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}>
                        {t.vendor}
                        {t.ai && <span title="Scanned by AI" style={{ color: 'var(--accent)', display: 'flex' }}><Icon name="sparkle" size={12} /></span>}
                      </span>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{t.desc}</div>
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Money amount={t.amount} cur={t.cur} size={13.5} weight={600} />
                      <span className="num" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginLeft: 5 }}>{t.cur}</span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      {isEditCat
                        ? <Select value={t.cat} onChange={v => setCat(t.id, v)} options={DB.CATEGORIES.map(c => ({ value: c.id, label: c.name }))} w={155} />
                        : <span onClick={() => setEditing({ id: t.id, field: 'cat' })} title="Click to edit"
                            style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 6px', margin: '-3px -6px', borderRadius: 6 }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--hairline)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <CatChip id={t.cat} small />
                          </span>}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      {proj && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: proj.color }} />{proj.name}</span>}
                    </td>
                    <td className="num" style={{ padding: '11px 14px', textAlign: 'right', color: t.vat ? 'var(--ink-2)' : 'var(--ink-3)' }}>
                      {t.vat ? DB.symbol(t.cur) + t.vat.toFixed(2) : '—'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      {isEditStatus
                        ? <Select value={t.status} onChange={v => setStatus(t.id, v)} w={120}
                            options={[{ value: 'approved', label: 'Approved' }, { value: 'review', label: 'Review' }]} />
                        : <span onClick={() => setEditing({ id: t.id, field: 'status' })} style={{ cursor: 'pointer' }}>
                            {t.status === 'review'
                              ? <Pill tone="amber" dot>Review</Pill>
                              : <Pill tone="green" dot>Approved</Pill>}
                          </span>}
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'center', color: 'var(--ink-3)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {t.files > 0 && <span title={`${t.files} attachment(s)`} style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12 }}>
                          <Icon name="paperclip" size={14} />{t.files}</span>}
                        <span onClick={() => go('detail', t.id)} style={{ cursor: 'pointer', display: 'flex' }} title="Open"><Icon name="chevRight" size={16} /></span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--hairline)', background: 'var(--surface-2)' }}>
          <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{rows.length} of {txs.length} transactions</span>
          <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Tip: click a category or status to edit inline</span>
        </div>
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Transactions = Transactions;
