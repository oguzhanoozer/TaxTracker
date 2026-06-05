/* ============================================================
   Ledger — mock data (plain script, attaches to window.DB)
   ============================================================ */
(function () {
  const CATEGORIES = [
    { id: 'software',   name: 'Software & SaaS',   color: '#3D63D6', icon: 'cloud' },
    { id: 'hardware',   name: 'Hardware',          color: '#7A52C4', icon: 'cpu' },
    { id: 'travel',     name: 'Travel',            color: '#C2542E', icon: 'plane' },
    { id: 'meals',      name: 'Meals & Coffee',    color: '#B5852F', icon: 'coffee' },
    { id: 'office',     name: 'Office & Supplies', color: '#2E7D52', icon: 'box' },
    { id: 'contract',   name: 'Contractors',       color: '#1F4A3B', icon: 'users' },
    { id: 'marketing',  name: 'Marketing',         color: '#C23B6B', icon: 'megaphone' },
    { id: 'income',     name: 'Client Income',     color: '#1E8A56', icon: 'arrow-down-left' },
    { id: 'fees',       name: 'Bank & Fees',       color: '#837C6D', icon: 'percent' },
  ];

  const PROJECTS = [
    { id: 'northwind', name: 'Northwind Co.',  color: '#1F4A3B' },
    { id: 'atlas',     name: 'Atlas Rebrand',  color: '#3D63D6' },
    { id: 'internal',  name: 'Internal / Ops', color: '#837C6D' },
    { id: 'side',      name: 'Side hustle',    color: '#C2542E' },
  ];

  const VENDORS = ['Figma','Linear','Vercel','AWS','Notion','Apple','Uber','Deutsche Bahn',
    'Blue Bottle Coffee','WeWork','Adobe','GitHub','OpenAI','Anthropic','Stripe','Fiverr',
    'Upwork','Google Workspace','1Password','Framer'];

  const CURRENCIES = ['USD','EUR','GBP'];
  const symbol = c => ({USD:'$',EUR:'€',GBP:'£'}[c] || '$');

  // deterministic-ish transactions
  const TX = [
    { id:'t1041', date:'2026-06-04', vendor:'OpenAI', desc:'API usage — May', amount:-184.20, cur:'USD', cat:'software', project:'northwind', vat:0, status:'approved', files:1, ai:true },
    { id:'t1040', date:'2026-06-04', vendor:'Blue Bottle Coffee', desc:'Client meeting', amount:-18.50, cur:'USD', cat:'meals', project:'northwind', vat:1.48, status:'review', files:1, ai:true },
    { id:'t1039', date:'2026-06-03', vendor:'Northwind Co.', desc:'Invoice #024 — sprint 3', amount:6400.00, cur:'USD', cat:'income', project:'northwind', vat:0, status:'approved', files:1, ai:false },
    { id:'t1038', date:'2026-06-03', vendor:'Vercel', desc:'Pro plan', amount:-20.00, cur:'USD', cat:'software', project:'internal', vat:0, status:'approved', files:1, ai:true },
    { id:'t1037', date:'2026-06-02', vendor:'Deutsche Bahn', desc:'Berlin → Munich', amount:-129.90, cur:'EUR', cat:'travel', project:'atlas', vat:9.10, status:'review', files:1, ai:true },
    { id:'t1036', date:'2026-06-02', vendor:'Figma', desc:'Organization seat', amount:-45.00, cur:'USD', cat:'software', project:'atlas', vat:0, status:'approved', files:1, ai:true },
    { id:'t1035', date:'2026-06-01', vendor:'WeWork', desc:'Hot desk — June', amount:-320.00, cur:'EUR', cat:'office', project:'internal', vat:51.10, status:'approved', files:1, ai:true },
    { id:'t1034', date:'2026-05-30', vendor:'Upwork', desc:'Illustration — Atlas', amount:-540.00, cur:'USD', cat:'contract', project:'atlas', vat:0, status:'approved', files:2, ai:false },
    { id:'t1033', date:'2026-05-29', vendor:'Apple', desc:'Studio Display', amount:-1599.00, cur:'USD', cat:'hardware', project:'internal', vat:0, status:'approved', files:1, ai:true },
    { id:'t1032', date:'2026-05-28', vendor:'Atlas Rebrand', desc:'Invoice #023 — deposit', amount:3200.00, cur:'EUR', cat:'income', project:'atlas', vat:0, status:'approved', files:1, ai:false },
    { id:'t1031', date:'2026-05-27', vendor:'Adobe', desc:'Creative Cloud', amount:-59.99, cur:'USD', cat:'software', project:'internal', vat:0, status:'approved', files:1, ai:true },
    { id:'t1030', date:'2026-05-26', vendor:'Uber', desc:'Airport → office', amount:-34.10, cur:'USD', cat:'travel', project:'northwind', vat:0, status:'approved', files:1, ai:true },
    { id:'t1029', date:'2026-05-25', vendor:'Stripe', desc:'Processing fees', amount:-87.44, cur:'USD', cat:'fees', project:'internal', vat:0, status:'approved', files:0, ai:false },
    { id:'t1028', date:'2026-05-24', vendor:'Notion', desc:'Team plan', amount:-32.00, cur:'USD', cat:'software', project:'internal', vat:0, status:'approved', files:1, ai:true },
    { id:'t1027', date:'2026-05-22', vendor:'GitHub', desc:'Copilot + Team', amount:-44.00, cur:'USD', cat:'software', project:'internal', vat:0, status:'approved', files:1, ai:true },
    { id:'t1026', date:'2026-05-20', vendor:'Fiverr', desc:'Voiceover — promo', amount:-120.00, cur:'USD', cat:'contract', project:'side', vat:0, status:'approved', files:1, ai:false },
    { id:'t1025', date:'2026-05-18', vendor:'Google Workspace', desc:'2 seats', amount:-24.00, cur:'USD', cat:'software', project:'internal', vat:0, status:'approved', files:1, ai:true },
    { id:'t1024', date:'2026-05-15', vendor:'Anthropic', desc:'Claude — Max', amount:-100.00, cur:'USD', cat:'software', project:'northwind', vat:0, status:'approved', files:1, ai:true },
  ];

  // unsorted inbox documents
  const INBOX = [
    { id:'u1', name:'IMG_4821.HEIC', kind:'photo', status:'done',    vendor:'Blue Bottle Coffee', amount:-18.50, cur:'USD', cat:'meals', conf:0.97, ms:'May 4' },
    { id:'u2', name:'invoice_vercel.pdf', kind:'pdf', status:'done', vendor:'Vercel', amount:-20.00, cur:'USD', cat:'software', conf:0.99, ms:'May 4' },
    { id:'u3', name:'scan_bahn_ticket.pdf', kind:'pdf', status:'reading', vendor:null, amount:null, cur:null, conf:null, ms:'now', progress:0.6 },
    { id:'u4', name:'receipt_wework.jpg', kind:'photo', status:'reading', vendor:null, amount:null, cur:null, conf:null, ms:'now', progress:0.3 },
    { id:'u5', name:'figma_may.pdf', kind:'pdf', status:'queued',   vendor:null, amount:null, cur:null, conf:null, ms:'queued' },
    { id:'u6', name:'IMG_4830.HEIC', kind:'photo', status:'queued', vendor:null, amount:null, cur:null, conf:null, ms:'queued' },
    { id:'u7', name:'blurry_lunch.jpg', kind:'photo', status:'failed', vendor:null, amount:null, cur:null, conf:null, ms:'2m ago', error:'Image too blurry to read' },
    { id:'u8', name:'apple_invoice.pdf', kind:'pdf', status:'done',  vendor:'Apple', amount:-1599.00, cur:'USD', cat:'hardware', conf:0.95, ms:'May 29' },
  ];

  const REMINDERS = [
    { id:'r1', label:'Q2 VAT return', sub:'Deadline · files to accountant', when:'Jul 31', kind:'tax', days:56 },
    { id:'r2', label:'WeWork — Hot desk', sub:'Recurring · €320 / mo', when:'Jul 1', kind:'recurring', days:26 },
    { id:'r3', label:'Adobe Creative Cloud', sub:'Recurring · $59.99 / mo', when:'Jun 27', kind:'recurring', days:22 },
    { id:'r4', label:'Northwind — Invoice #025', sub:'Sprint 4 · ready to bill', when:'Jun 10', kind:'invoice', days:5 },
  ];

  const ASSISTANT = [
    { id:'a1', kind:'review',  text:'4 documents finished scanning and need a quick look.', cta:'Review inbox', to:'inbox' },
    { id:'a2', kind:'suggest', text:'I matched “OpenAI” to Software & SaaS with 97% confidence — 3 similar receipts ready to auto-file.', cta:'Apply 3 suggestions' },
    { id:'a3', kind:'flag',    text:'Apple — Studio Display ($1,599) is unusually large for Hardware this month. Worth confirming it’s a business asset.', cta:'Open transaction', to:'detail' },
  ];

  // invoice draft
  const INVOICE = {
    number: '025',
    project: 'northwind',
    billTo: 'Northwind Co.\n14 Harbor Lane\nLisbon, 1100-038\nPortugal',
    currency: 'USD',
    due: '2026-06-25',
    items: [
      { id:'i1', desc:'Product design — Sprint 4', qty:1, unit:4800, tax:0 },
      { id:'i2', desc:'Design system maintenance', qty:12, unit:120, tax:0 },
      { id:'i3', desc:'User testing sessions', qty:3, unit:160, tax:0 },
    ],
    notes: 'Net 20. Wire transfer details on file. Thank you!',
  };

  // import csv preview
  const IMPORT_ROWS = [
    ['2026-05-04','Blue Bottle','18.50','USD','Coffee w/ client'],
    ['2026-05-04','Vercel Inc.','20.00','USD','Hosting'],
    ['2026-05-02','DB Bahn','129.90','EUR','Train Berlin Munich'],
    ['2026-05-01','WeWork','320.00','EUR','Desk'],
    ['2026-04-30','Upwork *Atlas','540.00','USD','Illustration'],
  ];
  const IMPORT_HEADERS = ['Date','Description','Amount','Cur','Memo'];
  const LEDGER_FIELDS = ['Date','Vendor','Amount','Currency','Category','Notes','— skip —'];

  window.DB = {
    CATEGORIES, PROJECTS, VENDORS, CURRENCIES, symbol,
    TX, INBOX, REMINDERS, ASSISTANT, INVOICE, IMPORT_ROWS, IMPORT_HEADERS, LEDGER_FIELDS,
    catById: id => CATEGORIES.find(c => c.id === id),
    projById: id => PROJECTS.find(p => p.id === id),
  };
})();
