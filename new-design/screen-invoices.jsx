/* ============================================================
   Ledger — Invoice generator (form + live preview)
   ============================================================ */
const { useState: useInv } = React;

function Invoices({ go }) {
  const [inv, setInv] = useInv(() => JSON.parse(JSON.stringify(DB.INVOICE)));
  const [tpl, setTpl] = useInv('classic');
  const [sent, setSent] = useInv(false);

  const upd = (k, v) => setInv(s => ({ ...s, [k]: v }));
  const updItem = (id, k, v) => setInv(s => ({ ...s, items: s.items.map(it => it.id === id ? { ...it, [k]: v } : it) }));
  const addItem = () => setInv(s => ({ ...s, items: [...s.items, { id: 'i' + Date.now(), desc: 'New line item', qty: 1, unit: 0, tax: 0 }] }));
  const delItem = id => setInv(s => ({ ...s, items: s.items.filter(it => it.id !== id) }));
  const prefill = () => setInv(s => ({ ...s, items: [
    { id: 'p1', desc: 'Product design — Sprint 4', qty: 1, unit: 4800, tax: 0 },
    { id: 'p2', desc: 'Design system maintenance', qty: 12, unit: 120, tax: 0 },
    { id: 'p3', desc: 'User testing sessions', qty: 3, unit: 160, tax: 0 },
    { id: 'p4', desc: 'Async standups & reviews', qty: 8, unit: 95, tax: 0 },
  ] }));

  const sym = DB.symbol(inv.currency);
  const sub = inv.items.reduce((a, it) => a + it.qty * it.unit, 0);
  const total = sub;
  const proj = DB.projById(inv.project);
  const tplColor = { classic: '#1F4A3B', mono: '#1E1B16', clay: '#BD5733' }[tpl];

  return (
    <div className="rise" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 22, alignItems: 'start', maxWidth: 1240 }}>
      {/* left: templates + form */}
      <div style={{ display: 'grid', gap: 16, position: 'sticky', top: 84 }}>
        <Card pad={16}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 11 }}>Template</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[{ id: 'classic', c: '#1F4A3B', n: 'Pine' }, { id: 'mono', c: '#1E1B16', n: 'Ink' }, { id: 'clay', c: '#BD5733', n: 'Clay' }].map(t => (
              <button key={t.id} onClick={() => setTpl(t.id)} className="focusable"
                style={{ padding: 10, borderRadius: 'var(--r-md)', border: `1.5px solid ${tpl === t.id ? 'var(--accent)' : 'var(--hairline-2)'}`,
                  background: 'var(--surface)', cursor: 'pointer', display: 'grid', gap: 6, placeItems: 'center' }}>
                <span style={{ width: '100%', height: 6, borderRadius: 3, background: t.c }} />
                <span style={{ fontSize: 11.5, fontWeight: 600 }}>{t.n}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card pad={16}>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Bill to">
              <textarea style={{ ...inputStyle, minHeight: 76, resize: 'vertical', fontSize: 13 }} value={inv.billTo} onChange={e => upd('billTo', e.target.value)} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Currency"><Select value={inv.currency} onChange={v => upd('currency', v)} w="100%" options={DB.CURRENCIES.map(c => ({ value: c, label: c }))} /></Field>
              <Field label="Due date"><input type="date" style={inputStyle} value={inv.due} onChange={e => upd('due', e.target.value)} /></Field>
            </div>
            <button onClick={prefill} className="focusable" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', borderRadius: 'var(--r-md)',
              border: '1px dashed var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600, fontSize: 13, textAlign: 'left', cursor: 'pointer' }}>
              <Icon name="sparkle" size={16} />
              <span style={{ flex: 1 }}>Pre-fill from {proj ? proj.name : 'project'}<div style={{ fontWeight: 500, fontSize: 11.5, opacity: .8 }}>Pulls unbilled transactions as line items</div></span>
            </button>
          </div>
        </Card>

        <div style={{ display: 'grid', gap: 8 }}>
          <Button variant="primary" icon="download" full size="lg">Download PDF</Button>
          <Button variant="default" icon="mail" full onClick={() => { setSent(true); setTimeout(() => setSent(false), 2200); }}>{sent ? 'Sent via email ✓' : 'Send via email'}</Button>
        </div>
      </div>

      {/* right: live preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Live preview · A4</span>
          <Button variant="ghost" size="sm" icon="plus" onClick={addItem}>Add line item</Button>
        </div>
        <div style={{ background: '#fff', color: '#1a1a1a', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-lg)',
          padding: '46px 48px', maxWidth: 720, fontFamily: 'var(--font-sans)' }}>
          {/* header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${tplColor}`, paddingBottom: 22, marginBottom: 26 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 30, height: 30, borderRadius: 7, background: tplColor, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontSize: 18 }}>L</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: '#1a1a1a' }}>Ledger</span>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 8, lineHeight: 1.5 }}>Mara Reyes Studio<br />tax ID · PT-509 221 884</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: tplColor, letterSpacing: '-.02em' }}>Invoice</div>
              <div className="num" style={{ fontSize: 13, color: '#666', marginTop: 4 }}>#{inv.number}</div>
              <div className="num" style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Due {inv.due}</div>
            </div>
          </div>
          {/* bill to */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 26 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Bill to</div>
              <div style={{ fontSize: 13, color: '#333', whiteSpace: 'pre-line', lineHeight: 1.55 }}>{inv.billTo}</div>
            </div>
            {proj && <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Project</div>
              <div style={{ fontSize: 13, color: '#333' }}>{proj.name}</div>
            </div>}
          </div>
          {/* items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #e5e5e5' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 10.5, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Description</th>
              <th style={{ textAlign: 'right', padding: '8px 0', width: 50, fontSize: 10.5, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '8px 0', width: 90, fontSize: 10.5, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Unit</th>
              <th style={{ textAlign: 'right', padding: '8px 0', width: 100, fontSize: 10.5, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Amount</th>
              <th style={{ width: 26 }}></th>
            </tr></thead>
            <tbody>
              {inv.items.map(it => (
                <tr key={it.id} style={{ borderBottom: '1px solid #f0f0f0' }} className="invrow">
                  <td style={{ padding: '9px 0' }}>
                    <input value={it.desc} onChange={e => updItem(it.id, 'desc', e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 13, color: '#222', padding: '2px 4px', borderRadius: 4 }} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <input className="num" value={it.qty} onChange={e => updItem(it.id, 'qty', parseFloat(e.target.value) || 0)}
                      style={{ border: 'none', background: 'transparent', width: 44, fontSize: 13, color: '#222', textAlign: 'right', padding: '2px 4px', borderRadius: 4 }} />
                  </td>
                  <td className="num" style={{ textAlign: 'right', color: '#666' }}>
                    <input className="num" value={it.unit} onChange={e => updItem(it.id, 'unit', parseFloat(e.target.value) || 0)}
                      style={{ border: 'none', background: 'transparent', width: 80, fontSize: 13, color: '#666', textAlign: 'right', padding: '2px 4px', borderRadius: 4 }} />
                  </td>
                  <td className="num" style={{ textAlign: 'right', color: '#222', fontWeight: 600 }}>{sym}{(it.qty * it.unit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => delItem(it.id)} style={{ border: 'none', background: 'none', color: '#ccc', cursor: 'pointer', display: 'flex', padding: 2 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#c0392b'} onMouseLeave={e => e.currentTarget.style.color = '#ccc'}><Icon name="x" size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <div style={{ width: 240 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: '#666' }}>
                <span>Subtotal</span><span className="num">{sym}{sub.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: '#666' }}>
                <span>Tax</span><span className="num">{sym}0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `2px solid ${tplColor}`, marginTop: 6, fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>
                <span>Total</span><span className="num">{sym}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 30, paddingTop: 18, borderTop: '1px solid #eee', fontSize: 12, color: '#999', lineHeight: 1.6 }}>{inv.notes}</div>
        </div>
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Invoices = Invoices;
