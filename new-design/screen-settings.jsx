/* ============================================================
   Ledger — Settings (LLM routing panel hero)
   ============================================================ */
const { useState: useSt } = React;

const PROVIDERS = {
  openai:    { name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'] },
  anthropic: { name: 'Anthropic', models: ['claude-sonnet-4', 'claude-haiku-4'] },
  mistral:   { name: 'Mistral', models: ['mistral-large', 'pixtral-12b'] },
  google:    { name: 'Google', models: ['gemini-2.0-flash', 'gemini-1.5-pro'] },
};
const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: 'users' },
  { id: 'business', label: 'Business', icon: 'box' },
  { id: 'currencies', label: 'Currencies', icon: 'percent' },
  { id: 'categories', label: 'Categories', icon: 'layers' },
  { id: 'projects', label: 'Projects', icon: 'paperclip' },
  { id: 'fields', label: 'Fields', icon: 'edit' },
  { id: 'llm', label: 'LLM', icon: 'sparkle' },
  { id: 'backups', label: 'Backups', icon: 'cloud' },
  { id: 'danger', label: 'Danger', icon: 'trash' },
];

function LLMTaskRow({ task, sub, defProvider, defModel, defTemp }) {
  const [provider, setProvider] = useSt(defProvider);
  const [model, setModel] = useSt(defModel);
  const [temp, setTemp] = useSt(defTemp);
  const [testing, setTesting] = useSt(false);
  const [result, setResult] = useSt(false);

  const runTest = () => { setTesting(true); setResult(false); setTimeout(() => { setTesting(false); setResult(true); }, 1500); };
  const models = PROVIDERS[provider].models;

  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)', padding: 18, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>{task}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Select value={provider} onChange={v => { setProvider(v); setModel(PROVIDERS[v].models[0]); setResult(false); }} w={130}
            options={Object.entries(PROVIDERS).map(([k, v]) => ({ value: k, label: v.name }))} />
          <Select value={model} onChange={v => { setModel(v); setResult(false); }} w={150} options={models.map(m => ({ value: m, label: m }))} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>temp</span>
            <input type="range" min={0} max={1} step={0.1} value={temp} onChange={e => setTemp(parseFloat(e.target.value))}
              style={{ width: 88, accentColor: 'var(--accent)' }} />
            <span className="num" style={{ fontSize: 12, width: 22, color: 'var(--ink-2)' }}>{temp.toFixed(1)}</span>
          </div>
          <Button variant="default" size="sm" icon={testing ? 'refresh' : 'wand'} onClick={runTest} style={testing ? {} : {}}>
            <span className={testing ? 'spin' : ''} style={{ display: testing ? 'none' : 'inline' }} />{testing ? 'Testing…' : 'Test'}
          </Button>
        </div>
      </div>
      {result && (
        <div className="rise" style={{ marginTop: 14, borderTop: '1px solid var(--hairline)', paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--accent)', fontWeight: 600, marginBottom: 8 }}>
            <Icon name="check" size={14} /> Parsed sample receipt in 1.2s · valid against schema
          </div>
          <pre className="mono" style={{ margin: 0, padding: 14, borderRadius: 'var(--r-md)', background: 'var(--paper-2)', border: '1px solid var(--hairline)',
            fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)', overflowX: 'auto' }}>{`{
  "vendor": "Blue Bottle Coffee",
  "date": "2026-05-04",
  "amount": 18.50,
  "currency": "USD",
  "vat": 1.48,
  "category": "meals",
  "confidence": 0.97
}`}</pre>
        </div>
      )}
    </div>
  );
}

function SettingsScreen({ go }) {
  const [panel, setPanel] = useSt('llm');

  return (
    <div className="rise" style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 26, maxWidth: 1140, alignItems: 'start' }}>
      {/* sub nav */}
      <div style={{ display: 'grid', gap: 2, position: 'sticky', top: 84 }}>
        {SETTINGS_NAV.map(n => {
          const active = panel === n.id;
          return (
            <button key={n.id} onClick={() => setPanel(n.id)} className="focusable"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 'var(--r-md)', border: 'none',
                background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--ink)' : 'var(--ink-2)', fontWeight: active ? 600 : 500,
                fontSize: 13.5, textAlign: 'left', cursor: 'pointer', boxShadow: active ? 'var(--shadow-sm)' : 'none' }}>
              <span style={{ color: active ? 'var(--accent)' : 'var(--ink-3)', display: 'flex' }}><Icon name={n.icon} size={17} /></span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.id === 'danger' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)' }} />}
            </button>
          );
        })}
      </div>

      {/* panel */}
      <div>
        {panel === 'llm' && (
          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 className="serif" style={{ fontSize: 24, whiteSpace: 'nowrap' }}>Language models</h2>
                <Pill tone="accent" dot>Multi-provider</Pill>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 4, maxWidth: 560 }}>
                Pick the right model for each job. Every response is validated against a Zod schema before it touches your books — if a model misbehaves, the fallback takes over.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <LLMTaskRow task="Document parsing" sub="Receipt / invoice image → structured fields (vision)" defProvider="openai" defModel="gpt-4o" defTemp={0.1} />
              <LLMTaskRow task="Categorization suggestions" sub="RAG against your past transactions" defProvider="anthropic" defModel="claude-haiku-4" defTemp={0.3} />
              <LLMTaskRow task="Invoice line summarization" sub="Turn raw transactions into tidy line items" defProvider="google" defModel="gemini-2.0-flash" defTemp={0.4} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 'var(--r-lg)', background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}>
              <Icon name="layers" size={20} style={{ color: 'var(--accent)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Fallback chain</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>If the primary provider is down, retry order: OpenAI → Anthropic → Mistral</div>
              </div>
              <Button variant="ghost" size="sm" icon="edit">Edit</Button>
            </div>
          </div>
        )}

        {panel === 'categories' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="serif" style={{ fontSize: 24 }}>Categories</h2>
              <Button variant="primary" size="sm" icon="plus">New category</Button>
            </div>
            <Card pad={0}>
              {DB.CATEGORIES.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: i < DB.CATEGORIES.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: c.color + '22', color: c.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={c.icon} size={16} /></span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                  <span style={{ width: 16, height: 16, borderRadius: 5, background: c.color }} />
                  <Icon name="edit" size={16} style={{ color: 'var(--ink-3)', cursor: 'pointer' }} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {panel === 'business' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
            <h2 className="serif" style={{ fontSize: 24 }}>Business</h2>
            <Card pad={22}>
              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="Company name"><input style={inputStyle} defaultValue="Mara Reyes Studio" /></Field>
                <Field label="Address"><textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} defaultValue={'Rua do Carmo 12\n1200-093 Lisbon, Portugal'} /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Tax ID"><input style={inputStyle} defaultValue="PT-509 221 884" /></Field>
                  <Field label="Invoice color"><div style={{ display: 'flex', gap: 8 }}>{['#1F4A3B', '#1E1B16', '#BD5733', '#3D63D6'].map(c => <span key={c} style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer', border: c === '#1F4A3B' ? '2px solid var(--ink)' : '2px solid transparent' }} />)}</div></Field>
                </div>
              </div>
            </Card>
          </div>
        )}

        {panel === 'fields' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 620 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="serif" style={{ fontSize: 24 }}>Custom fields</h2>
              <Button variant="primary" size="sm" icon="plus">Add field</Button>
            </div>
            <Card pad={0}>
              {[{ n: 'Reimbursable?', t: 'Toggle' }, { n: 'Meeting notes', t: 'Textarea' }, { n: 'Client PO #', t: 'Text' }].map((f, i) => (
                <div key={f.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < 2 ? '1px solid var(--hairline)' : 'none' }}>
                  <Icon name="grip" size={16} style={{ color: 'var(--ink-3)', cursor: 'grab' }} />
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{f.n}</span>
                  <Pill tone="neutral">{f.t}</Pill>
                  <Icon name="edit" size={16} style={{ color: 'var(--ink-3)', cursor: 'pointer' }} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {panel === 'backups' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 620 }}>
            <h2 className="serif" style={{ fontSize: 24 }}>Backups</h2>
            <Card pad={22}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div><div style={{ fontWeight: 600 }}>Create a backup now</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Zips your database + all uploaded files</div></div>
                <Button variant="primary" icon="cloud">Create backup</Button>
              </div>
            </Card>
            <Card pad={0}>
              {[{ d: 'Jun 5, 2026 · 04:00', s: '142 MB' }, { d: 'Jun 4, 2026 · 04:00', s: '141 MB' }, { d: 'Jun 3, 2026 · 04:00', s: '139 MB' }].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: i < 2 ? '1px solid var(--hairline)' : 'none' }}>
                  <Icon name="cloud" size={17} style={{ color: 'var(--ink-3)' }} />
                  <span className="num" style={{ flex: 1, fontSize: 13 }}>{b.d}</span>
                  <span className="num" style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{b.s}</span>
                  <Button variant="ghost" size="sm" icon="download">Download</Button>
                  <Button variant="ghost" size="sm" icon="refresh">Restore</Button>
                </div>
              ))}
            </Card>
          </div>
        )}

        {['profile', 'currencies', 'projects', 'danger'].includes(panel) && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
            <h2 className="serif" style={{ fontSize: 24 }}>{SETTINGS_NAV.find(n => n.id === panel).label}</h2>
            <Card pad={panel === 'danger' ? 22 : 22}>
              {panel === 'danger' ? (
                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div><div style={{ fontWeight: 600, color: 'var(--red)' }}>Wipe all data</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Deletes every transaction and file. Cannot be undone.</div></div>
                    <Button variant="danger" icon="trash">Wipe data</Button>
                  </div>
                  <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div><div style={{ fontWeight: 600, color: 'var(--red)' }}>Delete account</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Remove your account and self-hosted instance data.</div></div>
                    <Button variant="danger" icon="x">Delete</Button>
                  </div>
                </div>
              ) : panel === 'profile' ? (
                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 18 }}>MR</div>
                    <Button variant="default" size="sm">Change avatar</Button>
                  </div>
                  <Field label="Name"><input style={inputStyle} defaultValue="Mara Reyes" /></Field>
                  <Field label="Email"><input style={inputStyle} defaultValue="mara@reyes.studio" /></Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Locale"><Select value="en-US" onChange={() => {}} w="100%" options={[{ value: 'en-US', label: 'English (US)' }, { value: 'pt-PT', label: 'Português' }]} /></Field>
                    <Field label="Timezone"><Select value="lisbon" onChange={() => {}} w="100%" options={[{ value: 'lisbon', label: 'Europe/Lisbon' }, { value: 'berlin', label: 'Europe/Berlin' }]} /></Field>
                  </div>
                </div>
              ) : panel === 'currencies' ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  <Field label="Default currency"><Select value="USD" onChange={() => {}} w="100%" options={DB.CURRENCIES.map(c => ({ value: c, label: c }))} /></Field>
                  <Field label="Exchange-rate provider"><Select value="ecb" onChange={() => {}} w="100%" options={[{ value: 'ecb', label: 'European Central Bank (daily)' }, { value: 'openx', label: 'Open Exchange Rates' }]} /></Field>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Active: USD · EUR · GBP — historical rates auto-applied at transaction date.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {DB.PROJECTS.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                      <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{p.name}</span>
                      <Icon name="edit" size={15} style={{ color: 'var(--ink-3)', cursor: 'pointer' }} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Settings = SettingsScreen;
