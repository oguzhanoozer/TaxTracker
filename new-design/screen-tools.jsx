/* ============================================================
   Ledger — Export + Import (CSV mapper)
   ============================================================ */
const { useState: useTl } = React;

function OptionRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--hairline)' }}>
      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</span>
      {children}
    </div>
  );
}

function ExportScreen({ go }) {
  const [fmt, setFmt] = useTl('csv');
  const [group, setGroup] = useTl('none');
  const [include, setInclude] = useTl('approved');
  const [from, setFrom] = useTl('2026-01-01');
  const [to, setTo] = useTl('2026-06-05');
  const count = include === 'approved' ? 412 : 478;
  const fmtMeta = { csv: '87 KB', xlsx: '142 KB', pdf: '1.2 MB' }[fmt];

  return (
    <div className="rise" style={{ maxWidth: 760, display: 'grid', gap: 18 }}>
      <Card pad={0}>
        <div style={{ padding: '18px 22px 6px' }}>
          <h3 className="serif" style={{ fontSize: 20 }}>Build your export</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Everything your accountant needs, in the shape they want it.</p>
        </div>
        <div style={{ padding: '0 22px' }}>
          <OptionRow label="Date range">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ ...inputStyle, width: 150 }} />
              <span style={{ color: 'var(--ink-3)' }}>→</span>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ ...inputStyle, width: 150 }} />
            </div>
          </OptionRow>
          <OptionRow label="Format">
            <Segmented value={fmt} onChange={setFmt} options={[{ value: 'csv', label: 'CSV' }, { value: 'xlsx', label: 'XLSX' }, { value: 'pdf', label: 'PDF' }]} />
          </OptionRow>
          <OptionRow label="Group by">
            <Segmented value={group} onChange={setGroup} options={[{ value: 'none', label: 'None' }, { value: 'category', label: 'Category' }, { value: 'project', label: 'Project' }, { value: 'month', label: 'Month' }]} />
          </OptionRow>
          <OptionRow label="Include">
            <Segmented value={include} onChange={setInclude} options={[{ value: 'all', label: 'All' }, { value: 'approved', label: 'Only approved' }]} />
          </OptionRow>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'var(--surface-2)', borderTop: '1px solid var(--hairline)', marginTop: 6 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Will export <strong className="num">{count}</strong> transactions · <span className="num">≈ {fmtMeta}</span>
          </div>
          <Button variant="primary" icon="download" size="lg">Download {fmt.toUpperCase()}</Button>
        </div>
      </Card>
    </div>
  );
}

function ImportScreen({ go }) {
  const [stage, setStage] = useTl('upload'); // upload | map | importing | done
  const [map, setMap] = useTl({ Date: 'Date', Description: 'Vendor', Amount: 'Amount', Cur: 'Currency', Memo: 'Notes' });
  const [prog, setProg] = useTl(0);

  const startImport = () => {
    setStage('importing'); setProg(0);
    const t = setInterval(() => setProg(p => {
      if (p >= 1) { clearInterval(t); setStage('done'); return 1; }
      return p + 0.07;
    }), 120);
  };

  if (stage === 'upload') return (
    <div className="rise" style={{ maxWidth: 760 }}>
      <div onClick={() => setStage('map')} style={{ border: '2px dashed var(--hairline-2)', borderRadius: 'var(--r-xl)', background: 'var(--surface)',
        padding: '56px 32px', textAlign: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hairline-2)'}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
          <Icon name="importI" size={28} />
        </div>
        <div className="serif" style={{ fontSize: 22 }}>Upload a CSV or XLSX</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 6 }}>Coming from QuickBooks, Excel, or another tool? Drop your file and we'll map the columns.</div>
        <div style={{ marginTop: 18 }}><Button variant="primary" icon="upload">Choose file</Button></div>
      </div>
    </div>
  );

  if (stage === 'importing' || stage === 'done') return (
    <div className="rise" style={{ maxWidth: 620 }}>
      <Card pad={28}>
        {stage === 'importing' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span className="spin" style={{ display: 'flex', color: 'var(--accent)' }}><Icon name="refresh" size={20} /></span>
              <h3 className="serif" style={{ fontSize: 20 }}>Importing 153 rows…</h3>
            </div>
            <div style={{ height: 8, borderRadius: 10, background: 'var(--hairline)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, prog * 100)}%`, background: 'var(--accent)', borderRadius: 10, transition: 'width .15s' }} />
            </div>
            <div className="num" style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 10 }}>{Math.round(Math.min(100, prog * 100))}% · {Math.round(Math.min(153, prog * 153))} of 153</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-soft)', color: 'var(--green)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><Icon name="check" size={28} /></div>
            <h3 className="serif" style={{ fontSize: 22 }}>149 of 153 imported</h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 6 }}>4 rows had issues and were skipped.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
              <Button variant="default" icon="download">Download 4 failed rows</Button>
              <Button variant="primary" onClick={() => go('transactions')}>View transactions</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  // map stage
  const fieldOpts = DB.LEDGER_FIELDS.map(f => ({ value: f, label: f }));
  return (
    <div className="rise" style={{ maxWidth: 1080, display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm" icon="chevLeft" onClick={() => setStage('upload')}>Back</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
          <Icon name="file" size={16} style={{ color: 'var(--ink-3)' }} />
          <span className="mono" style={{ fontSize: 12.5 }}>quickbooks_export_2026.csv</span>
          <Pill tone="neutral">153 rows</Pill>
        </div>
      </div>

      <Card pad={0}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
          <h3 className="serif" style={{ fontSize: 19 }}>Map your columns</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>Match each column in your file to a Ledger field.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, padding: 20 }}>
          {DB.IMPORT_HEADERS.map((h, i) => (
            <div key={h} style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 12, background: 'var(--surface-2)' }}>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600 }}>{h}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', margin: '2px 0 9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>e.g. {DB.IMPORT_ROWS[0][i]}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="chevDown" size={14} style={{ color: 'var(--accent)', transform: 'rotate(-90deg)' }} />
                <Select value={map[h]} onChange={v => setMap(m => ({ ...m, [h]: v }))} w="100%" options={fieldOpts} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card pad={0}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hairline)', fontSize: 12.5, color: 'var(--ink-3)' }}>Preview · first 5 rows</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface-2)' }}>
              {DB.IMPORT_HEADERS.map(h => <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{map[h] === '— skip —' ? <span style={{ color: 'var(--ink-3)', textDecoration: 'line-through' }}>{h}</span> : map[h]}</th>)}
            </tr></thead>
            <tbody>
              {DB.IMPORT_ROWS.map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--hairline)' }}>
                  {row.map((cell, ci) => <td key={ci} className={ci === 2 ? 'num' : ''} style={{ padding: '9px 14px', color: map[DB.IMPORT_HEADERS[ci]] === '— skip —' ? 'var(--ink-3)' : 'var(--ink)', opacity: map[DB.IMPORT_HEADERS[ci]] === '— skip —' ? .4 : 1 }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--surface-2)', borderTop: '1px solid var(--hairline)' }}>
          <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}><Pill tone="amber">2 rows flagged</Pill> <span style={{ marginLeft: 8 }}>missing currency — will default to USD</span></span>
          <Button variant="primary" icon="check" size="lg" onClick={startImport}>Import 153 rows</Button>
        </div>
      </Card>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Export = ExportScreen;
window.Screens.Import = ImportScreen;
