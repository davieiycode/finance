(function() {
  function applyAesthetics(theme, color, radius) {
    const root = document.documentElement;
    root.style.setProperty('--card-radius', radius + 'px');
    
    // Brand Specs Mapping — Dynamic Adaptation
    const themeMap = {
      dark: { 
        bg: '#121212', card: '#1a1a1a', input: '#121212', glass: 'rgba(255,255,255,0.04)', 
        text: '#ffffff', border: 'rgba(255,255,255,0.1)', sub: '#888780', accent: '#1D9E75', sec: '#EF9F27' 
      },
      obsidian: { 
        bg: '#000000', card: '#0a0a0a', input: '#000000', glass: 'rgba(255,255,255,0.05)', 
        text: '#ffffff', border: '#161616', sub: '#a1a1aa', accent: '#5DCAA5', sec: '#FAC775' 
      },
      night: { 
        bg: '#04342C', card: '#085041', input: '#04342C', glass: 'rgba(255,255,255,0.02)', 
        text: '#ffffff', border: 'rgba(255,255,255,0.05)', sub: '#9FE1CB', accent: '#5DCAA5', sec: '#FAC775' 
      },
      light: { 
        bg: '#F1EFE8', card: '#ffffff', input: '#F1EFE8', glass: 'rgba(0,0,0,0.03)', 
        text: '#2C2C2A', border: '#B4B2A9', sub: '#5F5E5A', accent: '#0F6E56', sec: '#BA7517' 
      }
    };

    const t = themeMap[theme] || themeMap.dark;
    root.style.setProperty('--bg-primary', t.bg);
    root.style.setProperty('--bg-secondary', t.card);
    root.style.setProperty('--bg-input', t.input);
    root.style.setProperty('--glass', t.glass);
    root.style.setProperty('--text-primary', t.text);
    root.style.setProperty('--border', t.border);
    root.style.setProperty('--text-secondary', t.sub);
    root.style.setProperty('--accent', t.accent || color);
    root.style.setProperty('--accent-secondary', t.sec);
    document.body.style.color = t.text;
    document.body.style.backgroundColor = t.bg;
  }

  function initGlobalTheme() {
    const ps = JSON.parse(localStorage.getItem('user_prefs') || '{"name":"Alex Doe","theme":"dark","color":"#8b5cf6","radius":16,"lock":true}');
    applyAesthetics(ps.theme || 'dark', ps.color || '#8b5cf6', ps.radius || 16);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGlobalTheme();
      checkAuthWall();
      if (typeof initScrollFeatures === 'function') initScrollFeatures();
    });
  } else {
    initGlobalTheme();
    checkAuthWall();
    if (typeof initScrollFeatures === 'function') initScrollFeatures();
  }

  function checkAuthWall() {
    const isConnectPage = window.location.pathname.includes('connect.html');
    const cloudUrl = localStorage.getItem('cloud_sheet_url');
    
    if (!cloudUrl && !isConnectPage) {
      window.location.href = 'connect.html';
    }
  }

  function showToast(message, type = 'success', icon = 'check-circle') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:9999; display:flex; flex-direction:column; align-items:center; pointer-events:none; width: 90%; max-width: 400px;';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-left: 4px solid ${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#f59e0b')};
      color: var(--text-primary);
      padding: 1rem 1.25rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 0.8rem;
      min-width: 300px;
      pointer-events: auto;
      animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      margin-bottom: 0.5rem;
    `;
    
    toast.innerHTML = `
      <i data-lucide="${icon}" style="width: 20px; color: ${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#f59e0b')};"></i>
      <span style="font-size: 0.875rem; font-weight: 500;">${message}</span>
    `;
    
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    
    setTimeout(() => {
      toast.style.animation = 'toast-out 0.4s ease forwards';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Animation styles if not present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      @keyframes toast-in {
        from { opacity: 0; transform: translateY(20px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes toast-out {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
      }
    `;
    document.head.appendChild(style);
  }

  // --- Premium UI: Universal Confirmation Modal ---
  function showConfirm(message, onConfirm, title = 'Authentication Required') {
    let modal = document.getElementById('custom-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'custom-confirm-modal';
      modal.className = 'modal-backdrop';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(20px); display:none; z-index:99999; padding:1.5rem; flex-direction:column; justify-content:center; align-items:center; opacity:0; transition:opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1);';
      modal.innerHTML = `
        <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:2.5rem; padding:2.5rem 2rem; max-width:380px; width:100%; text-align:center; box-shadow:0 30px 60px -12px rgba(0,0,0,0.8); transform:scale(0.9); transition:transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);">
          <div id="confirm-icon-box" style="width:80px; height:80px; border-radius:40px; background:rgba(139,92,246,0.1); color:var(--accent); display:flex; align-items:center; justify-content:center; margin:0 auto 2rem auto; border: 1px solid rgba(139,92,246,0.2);">
            <i id="confirm-icon" data-lucide="help-circle" style="width:36px; height:36px;"></i>
          </div>
          <h3 id="confirm-title" style="font-weight:800; font-size:1.5rem; margin-bottom:0.75rem; color:var(--text-primary); letter-spacing:-0.03em;">Confirm</h3>
          <p id="confirm-msg" style="color:var(--text-secondary); font-size:0.9375rem; margin-bottom:2.5rem; line-height:1.6; font-weight:500;"></p>
          <div style="display:flex; gap:1rem; width:100%;">
            <button id="btn-confirm-cancel" style="flex:1; padding:1.125rem; border-radius:1.25rem; border:1px solid var(--border); background:rgba(255,255,255,0.02); color:var(--text-primary); font-weight:700; cursor:pointer; font-size:0.9rem;">Cancel</button>
            <button id="btn-confirm-ok" style="flex:1.5; padding:1.125rem; border-radius:1.25rem; border:none; background:var(--accent); color:white; font-weight:800; cursor:pointer; font-size:0.9rem; box-shadow:0 12px 24px -6px rgba(139,92,246,0.5);">Proceed</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    // Dynamic styling based on message
    const isDestructive = message.toLowerCase().includes('delete') || message.toLowerCase().includes('remove') || message.toLowerCase().includes('clear');
    const iconBox = document.getElementById('confirm-icon-box');
    const icon = document.getElementById('confirm-icon');
    const okBtn = document.getElementById('btn-confirm-ok');
    const titleEl = document.getElementById('confirm-title');

    titleEl.innerText = title;
    document.getElementById('confirm-msg').innerText = message;
    
    if (isDestructive) {
      iconBox.style.background = 'rgba(239,68,68,0.1)';
      iconBox.style.color = '#ef4444';
      iconBox.style.borderColor = 'rgba(239,68,68,0.2)';
      okBtn.style.background = '#ef4444';
      okBtn.style.boxShadow = '0 12px 24px -6px rgba(239,68,68,0.5)';
      icon.setAttribute('data-lucide', 'trash-2');
    } else {
      iconBox.style.background = 'rgba(139,92,246,0.1)';
      iconBox.style.color = 'var(--accent)';
      iconBox.style.borderColor = 'rgba(139,92,246,0.2)';
      okBtn.style.background = 'var(--accent)';
      okBtn.style.boxShadow = '0 12px 24px -6px rgba(139,92,246,0.5)';
      icon.setAttribute('data-lucide', 'alert-circle');
    }

    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.firstElementChild.style.transform = 'scale(1)';
    }, 10);

    if(window.lucide) window.lucide.createIcons();
    
    document.getElementById('btn-confirm-cancel').onclick = () => {
      modal.style.opacity = '0';
      modal.firstElementChild.style.transform = 'scale(0.9)';
      setTimeout(() => modal.style.display = 'none', 400);
    };
    
    document.getElementById('btn-confirm-ok').onclick = () => {
      modal.style.opacity = '0';
      modal.firstElementChild.style.transform = 'scale(0.9)';
      setTimeout(() => {
        modal.style.display = 'none';
        if(onConfirm) onConfirm();
      }, 400);
    };
  }

  // --- Premium Progress Hub (Sync & Exports) ---
  const SyncHub = {
    el: null, progressBar: null, statusText: null, titleText: null, percentText: null, iconBox: null,

    init() {
      if (this.el) return;
      const hubHtml = `
        <div id="sync-hub-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(25px); z-index: 999999; flex-direction: column; align-items: center; justify-content: center; color: white; opacity: 0; transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);">
          <div style="width: 100%; max-width: 360px; text-align: center; display: flex; flex-direction: column; gap: 2rem; padding: 2.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 3rem; box-shadow: 0 40px 100px rgba(0,0,0,0.8);">
            <div style="position: relative; width: 100px; height: 100px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 100px; height: 100px; transform: rotate(-90deg);">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="4"></circle>
                <circle id="sync-hub-circle" cx="50" cy="50" r="46" fill="transparent" stroke="var(--accent)" stroke-width="4" stroke-dasharray="290" stroke-dashoffset="290" stroke-linecap="round" style="transition: stroke-dashoffset 0.6s cubic-bezier(0.1, 0.7, 0.1, 1);"></circle>
              </svg>
              <div id="sync-hub-icon-box" style="position: absolute; display: flex; align-items: center; justify-content: center; color: var(--accent); animation: hub-pulse 2s infinite ease-in-out;">
                <i data-lucide="cloud-lightning" style="width: 32px; height: 32px;"></i>
              </div>
            </div>
            <div>
              <h3 id="sync-hub-title" style="font-weight: 900; font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: -0.04em; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Syncing</h3>
              <p id="sync-hub-status" style="opacity: 0.5; font-size: 0.8125rem; min-height: 1.25rem; font-weight: 500; letter-spacing: 0.02em;">Initializing Neural Link...</p>
            </div>
            <div style="display: flex; justify-content: center;">
               <div id="sync-hub-percent" style="font-weight: 900; font-size: 0.75rem; color: var(--accent); font-family: 'Inter', sans-serif; background: rgba(139, 92, 246, 0.1); padding: 0.4rem 1rem; border-radius: 2rem; border: 1px solid rgba(139, 92, 246, 0.2);">0%</div>
            </div>
          </div>
        </div>
        <style> 
          @keyframes hub-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.85); opacity: 0.7; } }
        </style>
      `;
      const div = document.createElement('div');
      div.id = 'sync-hub-root';
      div.innerHTML = hubHtml;
      document.body.appendChild(div);
      this.el = document.getElementById('sync-hub-overlay');
      this.circle = document.getElementById('sync-hub-circle');
      this.statusText = document.getElementById('sync-hub-status');
      this.titleText = document.getElementById('sync-hub-title');
      this.percentText = document.getElementById('sync-hub-percent');
      this.iconBox = document.getElementById('sync-hub-icon-box');
    },

    start(title, status) {
      this.init();
      this.titleText.innerText = title;
      this.statusText.innerText = status;
      this.update(0);
      this.el.style.display = 'flex';
      if(window.lucide) window.lucide.createIcons();
      setTimeout(() => this.el.style.opacity = '1', 10);
    },

    update(percent, status) {
      if (!this.el) return;
      const p = Math.min(100, Math.max(0, percent));
      const offset = 290 - (p / 100 * 290);
      this.circle.style.strokeDashoffset = offset;
      if (this.percentText) this.percentText.innerText = Math.round(p) + '%';
      if (status) this.statusText.innerText = status;
    },

    finish(msg, success = true) {
      this.update(100, msg || 'Optimized!');
      if (this.iconBox) this.iconBox.innerHTML = '<i data-lucide="check" style="width: 32px; height: 32px; color: #10b981;"></i>';
      if(window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        this.el.style.opacity = '0';
        setTimeout(() => {
          this.el.style.display = 'none';
          // Restore icon for next use
          if (this.iconBox) this.iconBox.innerHTML = '<i data-lucide="cloud-lightning" style="width: 32px; height: 32px;"></i>';
          if(window.lucide) window.lucide.createIcons();
        }, 600);
      }, 1200);
    }
  };

  function getSimilarity(s1, s2) {
    s1 = s1.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    s2 = s2.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    const w1 = s1.split(/\s+/).filter(w => w.length > 2);
    const w2 = s2.split(/\s+/).filter(w => w.length > 2);
    const intersect = w1.filter(x => w2.includes(x));
    if (intersect.length > 0) return 0.6 + (0.4 * intersect.length / Math.max(w1.length, w2.length));
    return 0;
  }

  // Cloud Sync Engine
  const CloudSync = {
    pull: async (url, mode = 'merge') => {
      SyncHub.start('Cloud Pull', 'Connecting to secure server...');
      const COLUMN_MAP = {
        'id': 'id',
        'transactionid': 'id',
        'accountid': 'id',
        'itemid': 'id',
        'merchantid': 'id',
        'date': 'date',
        'tanggal': 'date',
        'time': 'time',
        'waktu': 'time',
        'jam': 'time',
        'category': 'category',
        'kategori': 'category',
        'categorygroup': 'categoryGroup',
        'merchant': 'merchant',
        'merchantname': 'merchant',
        'toko': 'merchant',
        'penjual': 'merchant',
        'namatoko': 'merchant',
        'name': 'name',
        'itemname': 'name',
        'item': 'name',
        'namaitem': 'name',
        'description': 'description',
        'deskripsi': 'description',
        'keterangan': 'description',
        'notes': 'notes',
        'catatan': 'notes',
        'amount': 'amount',
        'amountperunit': 'amount',
        'price': 'amount',
        'harga': 'amount',
        'hargasatuan': 'amount',
        'currency': 'currency',
        'matauang': 'currency',
        'exchangerate': 'exchangeRate',
        'kurs': 'exchangeRate',
        'qty': 'qty',
        'quantity': 'qty',
        'jumlah': 'qty',
        'banyaknya': 'qty',
        'scale': 'scale',
        'unitscale': 'scale',
        'unit': 'scale',
        'satuan': 'scale',
        'type': 'type',
        'tipe': 'type',
        'cleared': 'cleared',
        'status': 'status',
        'paymentsourceaccount': 'accountPayment',
        'accountpayment': 'accountPayment',
        'account': 'accountPayment',
        'sumber': 'accountPayment',
        'rekening': 'accountPayment',
        'akun': 'accountPayment',
        'beneficiaryaccount': 'accountReceived',
        'accountreceived': 'accountReceived',
        'tujuan': 'accountReceived',
        'rekeningtujuan': 'accountReceived',
        'receipt': 'receipt',
        'struk': 'receipt',
        'bukti': 'receipt',
        'tags': 'tags',
        'analyticstags': 'tags',
        'label': 'tags',
        'project': 'projects',
        'projects': 'projects',
        'associatedproject': 'projects',
        'proyek': 'projects',
        'kegiatan': 'projects',
        'author': 'author',
        'authorname': 'author',
        'kreator': 'author',
        'namakreator': 'author',
        'user': 'author',
        'creator': 'author',
        'penulis': 'author',
        'discount': 'discount',
        'diskon': 'discount',
        'potongan': 'discount',
        'potonganharga': 'discount',
        'fee': 'fee',
        'additionalfee': 'fee',
        'biaya': 'fee',
        'pajak': 'fee',
        'tax': 'fee',
        'ongkir': 'fee',
        'total': 'total',
        'budgetamount': 'budgetAmount',
        'budgetperiod': 'budgetPeriod',
        'flow': 'flow',
        'year': 'year',
        'tahun': 'year',
        'month': 'month',
        'bulan': 'month',
        'updatetime': 'updateTime',
        'xp': 'xp'
      };

      try {
        SyncHub.update(15, 'Fetching remote ledger...');
        const res = await fetch(url + (url.includes('?') ? '&' : '?') + 'get=data');
        const data = await res.json();

        let count = 0;
        const keys = ['transactions', 'accounts', 'merchants', 'authors', 'items', 'vault', 'budgets', 'goals', 'membership_cards', 'user_prefs', 'pin_enabled'];
        const objectKeys = ['user_prefs']; // Keys that store objects, not arrays
        const reverseMap = (obj) => {
          const newObj = {};
          Object.keys(obj).forEach(k => {
            const hNorm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
            const internalKey = COLUMN_MAP[hNorm] || k;
            newObj[internalKey] = obj[k];
          });
          return newObj;
        };

        const sanitizeNum = (v, def = 0) => {
          if (v === undefined || v === null || v === '') return def;
          if (typeof v === 'number') return v;
          let s = v.toString().replace(/Rp/g, '').trim();
          if (s.includes(',') && s.includes('.')) {
            const lastComma = s.lastIndexOf(',');
            const lastDot = s.lastIndexOf('.');
            if (lastComma > lastDot) s = s.replace(/\./g, '').replace(/,/g, '.');
            else s = s.replace(/,/g, '');
          } else if (s.includes(',')) {
            const parts = s.split(',');
            if (parts[1] && parts[1].length === 3) s = s.replace(/,/g, '');
            else s = s.replace(/,/g, '.');
          }
          return parseFloat(s.replace(/[^0-9.-]+/g, "")) || def;
        };

        const sanitizeArr = (v) => {
          if (Array.isArray(v)) return v;
          if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(s => s);
          return [];
        };

        if (data.status === 'success') {
          SyncHub.update(40, 'Parsing cloud data entities...');

          // 1. Process Transactions with Column Mapping & Field Derivation
          if (data.transactions) {
            SyncHub.update(50, 'Merging transactions...');
            const remoteTxs = data.transactions.map(rawT => {
              const t = reverseMap(rawT);
              
              const q = sanitizeNum(t.qty, 1);
              const d = sanitizeNum(t.discount, 0);
              const f = sanitizeNum(t.fee, 0);
              const ex = sanitizeNum(t.exchangeRate, 1);
              const unitPrice = sanitizeNum(t.amount, 0);
              
              t.id = t.id ? t.id.toString() : 'CLOUD-' + Date.now() + Math.random();
              const calcTotal = ((q * unitPrice) - d + f) * ex;
              t.total = (t.total !== undefined) ? sanitizeNum(t.total) : calcTotal;
              t.amount = unitPrice;
              t.qty = q;
              t.discount = d;
              t.fee = f;
              t.exchangeRate = ex;
              t.xp = sanitizeNum(t.xp, 10);
              t.tags = sanitizeArr(t.tags);
              t.projects = sanitizeArr(t.projects);
              t.cleared = (t.cleared === true || t.cleared === 'TRUE' || t.cleared === 'Yes');
              
              // Robust extraction for Merchant and Author to avoid missing data from spreadsheet variations
              t.merchant = t.merchant || t.Merchant || rawT['Merchant'] || rawT['merchant'] || rawT['Merchant Name'] || '-';
              t.author = t.author || t.Author || rawT['Author'] || rawT['author'] || rawT['Kreator'] || '-';
              
              // Generate Derived Fields if missing
              if (t.date && !t.year) {
                const dateObj = new Date(t.date);
                if (!isNaN(dateObj)) {
                  t.year = dateObj.getFullYear();
                  t.month = dateObj.getMonth() + 1;
                }
              }
              if (!t.flow) {
                const type = (t.type || 'Expense').toLowerCase();
                t.flow = ['income', 'inflow', 'received'].includes(type) ? 'Inflow' : 'Outflow';
              }
              if (!t.updateTime) t.updateTime = new Date().toISOString();
              
              return t;
            });

            const localTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
            
            if (mode === 'overwrite') {
              // Safety check for overwrite
              if (remoteTxs.length === 0 && localTxs.length > 0) {
                 SyncHub.finish('Pull ABORTED: Cloud is empty.', false);
                 alert('Peringatan: Data di Cloud kosong. Jika dilanjutkan, data di HP akan terhapus. Gunakan "Cloud Push" terlebih dahulu.');
                 return 0;
              }
              localStorage.setItem('transactions', JSON.stringify(remoteTxs));
              count = remoteTxs.length;
            } else {
              // Smart Merge by ID and Update Time
              const localMap = new Map(localTxs.map(t => [t.id.toString(), t]));
              const mergedTxs = [...remoteTxs];
              const remoteIds = new Set(remoteTxs.map(t => t.id.toString()));

              // Add unique locals (new entries not yet in cloud)
              localTxs.forEach(lt => {
                if (!remoteIds.has(lt.id.toString())) {
                  mergedTxs.push(lt);
                } else {
                  // If in both, keep the one with latest updateTime
                  const rt = remoteTxs.find(r => r.id.toString() === lt.id.toString());
                  const rTime = new Date(rt.updateTime || 0).getTime();
                  const lTime = new Date(lt.updateTime || 0).getTime();
                  if (lTime > rTime) {
                    // Local is newer (likely manual edit in app)
                    const idx = mergedTxs.findIndex(r => r.id.toString() === rt.id.toString());
                    mergedTxs[idx] = lt;
                  }
                }
              });

              mergedTxs.sort((a,b) => new Date(b.date + ' ' + (b.time || '00:00')) - new Date(a.date + ' ' + (a.time || '00:00')));
              localStorage.setItem('transactions', JSON.stringify(mergedTxs));
              count = mergedTxs.length;
            }
          }

          // 2. Process Metadata Keys
          const otherKeys = ['accounts', 'merchants', 'authors', 'items', 'vault', 'budgets', 'goals', 'membership_cards', 'user_prefs', 'pin_enabled'];
          otherKeys.forEach(key => {
            if (data[key]) {
              SyncHub.update(80, `Updating ${key}...`);
              localStorage.setItem(key, typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]));
            }
          });

          SyncHub.update(95, 'Finalizing sync...');
          if (typeof window.syncMasterData === 'function') await window.syncMasterData();
          SyncHub.finish(`Success! ${count} records synced.`);
          return count;
        } else {
          throw new Error(data.message || 'Cloud returned error status');
        }
      } catch (err) {
        SyncHub.finish('Pull failed. Check connection.', false);
        console.error('Cloud Sync Error:', err);
        throw err;
      }
    },

    push: async (url) => {
      SyncHub.start('Cloud Push', 'Preparing complete ledger backup...');
      
      const COLUMN_MAP = {
        'id': 'Transaction ID',
        'date': 'Date',
        'time': 'Time',
        'category': 'Category',
        'categoryGroup': 'Category Group',
        'merchant': 'Merchant',
        'name': 'Item Name',
        'description': 'Description',
        'amount': 'Amount (per Unit)',
        'currency': 'Currency',
        'exchangeRate': 'Exchange Rate',
        'qty': 'Quantity',
        'scale': 'Unit Scale',
        'type': 'Type',
        'cleared': 'Cleared',
        'accountPayment': 'Payment Source Account',
        'accountReceived': 'Beneficiary Account',
        'receipt': 'Receipt',
        'tags': 'Analytics Tags',
        'projects': 'Associated Project',
        'author': 'Author',
        'discount': 'Discount',
        'fee': 'Additional Fee',
        'total': 'Total',
        'budgetAmount': 'Budget Amount',
        'budgetPeriod': 'Budget Period',
        'flow': 'Flow',
        'year': 'Year',
        'month': 'Month',
        'updateTime': 'Update Time',
        'xp': 'XP'
      };

      try {
        const keys = ['transactions', 'accounts', 'merchants', 'authors', 'items', 'budgets', 'goals', 'membership_cards', 'user_prefs', 'pin_enabled'];
        const objectKeys = ['user_prefs'];
        const payload = { updateTime: new Date().toISOString() };
        
        let processedKeys = 0;
        const totalKeys = keys.length;

        keys.forEach(key => {
          const stepLoad = (processedKeys / totalKeys) * 35;
          SyncHub.update(stepLoad, `Gathering ${key}...`);
          const raw = localStorage.getItem(key);
          let data = objectKeys.includes(key) ? JSON.parse(raw || '{}') : JSON.parse(raw || '[]');
          
          if (key === 'transactions') {
            // Map to spreadsheet columns
            data = data.map(t => {
              const mapped = {};
              Object.keys(t).forEach(k => {
                const sheetKey = COLUMN_MAP[k] || k;
                mapped[sheetKey] = t[k];
              });
              
              // Ensure Derived Fields are present for Spreadsheet
              if (t.date) {
                const dateObj = new Date(t.date);
                if (!isNaN(dateObj)) {
                  mapped['Year'] = mapped['Year'] || dateObj.getFullYear();
                  mapped['Month'] = mapped['Month'] || dateObj.getMonth() + 1;
                }
              }
              if (!mapped['Flow']) {
                const type = (t.type || 'Expense').toLowerCase();
                mapped['Flow'] = ['income', 'inflow', 'received'].includes(type) ? 'Inflow' : 'Outflow';
              }
              mapped['Update Time'] = t.updateTime || new Date().toISOString();
              
              // Formatting for spreadsheet visibility
              if (Array.isArray(t.tags)) mapped['Analytics Tags'] = t.tags.join(', ');
              if (Array.isArray(t.projects)) mapped['Associated Project'] = t.projects.join(', ');
              
              return mapped;
            });
          }
          
          payload[key] = data;
          processedKeys++;
        });

        if (payload.transactions.length === 0 && payload.accounts.length === 0) {
          SyncHub.finish('No data to backup');
          return 0;
        }

        SyncHub.update(40, `Synchronizing ${payload.transactions.length} records to cloud...`);
        
        // Final upload stage
        const res = await fetch(url, { 
          method: 'POST', 
          body: JSON.stringify(payload) 
        });
        
        SyncHub.update(85, 'Verifying cloud ledger integrity...');
        const result = await res.json();
        if (result.status === 'success') {
          SyncHub.finish(`Successfully uploaded all sheets!`);
          return payload.transactions.length;
        } else {
          throw new Error(result.message || 'Server error');
        }
      } catch (e) {
        SyncHub.finish('Push failed: ' + e.message, false);
        throw e;
      }
    }
  };

  async function syncMasterData() {
    return new Promise((resolve) => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => resolve(deferredSync()));
      } else {
        setTimeout(() => resolve(deferredSync()), 400);
      }
    });
  }

  async function deferredSync() {
    const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
    if (txs.length === 0) return;

    let accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    let merchants = JSON.parse(localStorage.getItem('merchants') || '[]');
    let authors = JSON.parse(localStorage.getItem('authors') || '[]');
    let items = JSON.parse(localStorage.getItem('items') || '[]');

    let updated = false;
    const isDashboard = window.location.pathname.includes('index.html');
    const isItems = window.location.pathname.includes('items.html');
    
    // Quick Lookup Maps for O(1) exact match check
    const accMap = new Map(accounts.map(a => [a.name.toLowerCase(), a]));
    const merMap = new Map(merchants.map(m => [m.name.toLowerCase(), m]));
    const autMap = new Map(authors.map(a => [a.name.toLowerCase(), a]));
    const itMap = new Map(items.map(i => [(i.name || '').toLowerCase(), i]));

    let suggestionCount = 0;
    const MAX_SUGGESTIONS = 3;

    // Process transactions
    for (let i = 0; i < txs.length; i++) {
      const t = txs[i];
      if (i % 100 === 0 && txs.length > 200) {
        SyncHub.update(95 + (i / txs.length * 4), `Analyzing metadata (${i}/${txs.length})...`);
      }

      // 1. Merchant Sync
      if (t.merchant && t.merchant !== '-') {
        const mLower = t.merchant.toLowerCase();
        if (!merMap.has(mLower)) {
          const similar = (suggestionCount < MAX_SUGGESTIONS && isDashboard) ? merchants.find(m => getSimilarity(m.name, t.merchant) > 0.45) : null;
          if (similar) {
             showMergeCard('merchant', t.merchant, similar);
             suggestionCount++;
          } else {
             merchants.push({ id: Date.now() + Math.random(), name: t.merchant, type: t.category || 'Other' });
             merMap.set(mLower, { name: t.merchant });
             updated = true;
          }
        }
      }

      // 1b. Author Sync
      if (t.author && t.author !== '-') {
        const aLower = t.author.toLowerCase();
        if (!autMap.has(aLower)) {
           authors.push({ id: Date.now() + Math.random(), name: t.author, role: 'Member' });
           autMap.set(aLower, { name: t.author });
           updated = true;
        }
      }

      // 2. Account Sync
      const tAccs = [t.accountPayment, t.accountReceived].filter(a => a && a !== '-');
      tAccs.forEach(name => {
        const aLower = name.toLowerCase();
        if (!accMap.has(aLower)) {
          const similar = (suggestionCount < MAX_SUGGESTIONS && isDashboard) ? accounts.find(a => getSimilarity(a.name, name) > 0.45) : null;
          if (similar) {
             showMergeCard('account', name, similar);
             suggestionCount++;
          } else {
             accounts.push({ id: Date.now() + Math.random(), name: name, type: 'Vault/Savings', balance: 0, status: 'Active', color: '#8b5cf6' });
             accMap.set(aLower, { name: name });
             updated = true;
          }
        }
      });

      // 3. Item Sync
      if (t.name && t.name !== '-') {
        const iLower = (t.name || '').toLowerCase();
        if (!itMap.has(iLower)) {
          const similar = (suggestionCount < MAX_SUGGESTIONS && (isDashboard || isItems)) ? items.find(i => getSimilarity(i.name, t.name) > 0.45) : null;
          if (similar) {
             showMergeCard('item', t.name, similar);
             suggestionCount++;
          } else {
             items.push({ id: Date.now() + Math.random(), name: t.name, category: t.category || 'General', price: t.amount || 0, unit: t.scale || 'pcs', status: 'Active' });
             itMap.set(iLower, { name: t.name });
             updated = true;
          }
        }
      }
    }

    // 4. Duplicate Transaction Detection (Check only last 100 entries)
    if (isDashboard && suggestionCount < MAX_SUGGESTIONS) {
      const seen = new Map();
      txs.slice(-100).forEach(t => {
        const key = `${t.date}-${t.merchant}-${t.amount}-${t.type}`;
        if (seen.has(key)) {
           if (suggestionCount < MAX_SUGGESTIONS) {
             showMergeCard('transaction', t, seen.get(key));
             suggestionCount++;
           }
        } else {
           seen.set(key, t);
        }
      });
    }

    if (updated) {
      localStorage.setItem('accounts', JSON.stringify(accounts));
      localStorage.setItem('merchants', JSON.stringify(merchants));
      localStorage.setItem('authors', JSON.stringify(authors));
      localStorage.setItem('items', JSON.stringify(items));
      if (isDashboard && typeof window.renderDashboard === 'function') window.renderDashboard();
    }
    
    // Always refresh the audit badge if on dashboard
    if (isDashboard && typeof window.refreshMaintenanceHub === 'function') {
      window.refreshMaintenanceHub();
    }
  }

  function showMergeCard(type, source, target) {
    const sourceId = type === 'transaction' ? source.id : source;
    const syncId = `merge-${type}-${btoa(sourceId).replace(/=/g,'')}`;
    if (document.getElementById(syncId)) return;

    const listEl = document.getElementById('merge-center') || 
                   document.getElementById('item-list') || 
                   document.getElementById('merchant-list') || 
                   document.getElementById('account-list');
    if (!listEl) return;

    const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
    let affected = [];
    if (type === 'item') affected = txs.filter(t => (t.name || '').toLowerCase() === source.toLowerCase());
    else if (type === 'merchant') affected = txs.filter(t => (t.merchant || '').toLowerCase() === source.toLowerCase());
    else if (type === 'account') affected = txs.filter(t => (t.accountPayment || '').toLowerCase() === source.toLowerCase() || (t.accountReceived || '').toLowerCase() === source.toLowerCase());

    const card = document.createElement('div');
    card.id = syncId;
    card.style.cssText = 'background:var(--bg-secondary); border:1px solid rgba(139, 92, 246, 0.3); border-left: 4px solid var(--accent); border-radius:1.5rem; padding:1.5rem; margin-bottom:1.25rem; display:flex; flex-direction:column; gap:0.5rem; box-shadow:0 15px 35px rgba(0,0,0,0.2); animation: toast-in 0.4s ease-out;';
    
    let icon = 'git-merge', label = 'Clean Data', detail = '';
    if (type === 'item') { icon = 'package'; label = 'Item Matching'; detail = `Merge "<b>${source}</b>" into <b>${target.name}</b>?`; }
    else if (type === 'merchant') { icon = 'building-2'; label = 'Merchant Matching'; detail = `Merge <b>${source}</b> as <b>${target.name}</b>?`; }
    else if (type === 'account') { icon = 'landmark'; label = 'Account/Vault Matching'; detail = `Is <b>${source}</b> same as <b>${target.name}</b>?`; }
    else if (type === 'transaction') { icon = 'copy'; label = 'Duplicate Detected'; detail = `Potential duplicate transaction found in ${source.merchant}.`; }

    const previewId = `preview-${syncId}`;
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:1.25rem;">
        <div style="width:52px; height:52px; border-radius:14px; background:rgba(139, 92, 246, 0.1); color:var(--accent); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i data-lucide="${icon}" style="width:28px;"></i>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:0.9rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem; letter-spacing:-0.01em;">
            ${label}
            <span style="font-size:0.6rem; background:var(--accent); color:white; padding:2px 6px; border-radius:10px; text-transform:uppercase; font-weight:900;">PRO</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:3px; line-height:1.4;">${detail}</div>
        </div>
        <button class="preview-toggle" style="background:var(--bg-input); border:1px solid var(--border); color:var(--text-secondary); cursor:pointer; width:32px; height:32px; border-radius:16px; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-down" style="width:16px;"></i>
        </button>
      </div>
      
      <div id="${previewId}" style="display:none; margin-top:1rem; background:rgba(0,0,0,0.2); border-radius:1rem; padding:0.75rem; border:1px dashed var(--border); max-height:180px; overflow-y:auto;">
         <div style="font-size:0.65rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.75rem; letter-spacing:0.05em;">Affected Transactions (${affected.length || 0})</div>
         <div style="display:flex; flex-direction:column; gap:1rem;">
           ${affected.length > 0 ? affected.slice(0, 10).map(t => `
             <div style="display:flex; justify-content:space-between; align-items:center;">
               <div>
                  <div style="font-size:0.75rem; font-weight:600; color:var(--text-primary);">${t.merchant || 'General'}</div>
                  <div style="font-size:0.6rem; color:var(--text-secondary);">${t.date}</div>
               </div>
               <div style="font-size:0.75rem; font-weight:800; color:var(--text-primary);">Rp ${t.amount.toLocaleString('id-ID')}</div>
             </div>
           `).join('') : '<div style="font-size:0.75rem; color:var(--text-secondary); text-align:center; padding:1rem;">No transactions found to merge.</div>'}
         </div>
         ${affected.length > 10 ? `<div style="text-align:center; padding-top:1rem; font-size:0.65rem; color:var(--accent); font-weight:700;">+ ${affected.length - 10} more in history</div>` : ''}
      </div>

      <div style="display:flex; gap:0.75rem; margin-top:0.75rem;">
        <button class="btn-ignore" style="flex:1; padding:0.75rem; border-radius:1rem; border:1px solid var(--border); background:rgba(255,255,255,0.03); color:var(--text-secondary); font-size:0.75rem; font-weight:600; cursor:pointer; transition:0.2s;">Cancel Sync</button>
        <button class="btn-merge" style="flex:1; padding:0.75rem; border-radius:1rem; border:none; background:var(--accent); color:white; font-size:0.75rem; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(139, 92, 246, 0.2); transition:0.2s;">
           ${type === 'transaction' ? 'Eliminate' : (type === 'item' ? 'To Catalog' : 'Approve')}
        </button>
      </div>
    `;

    listEl.insertBefore(card, listEl.firstChild);
    if (window.lucide) window.lucide.createIcons();

    card.querySelector('.preview-toggle').onclick = () => {
      const p = document.getElementById(previewId);
      const isHidden = p.style.display === 'none';
      p.style.display = isHidden ? 'block' : 'none';
      card.querySelector('.preview-toggle i').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    };

    const hoverStyle = (el, iconBg) => {
      el.onmouseenter = () => { el.style.borderColor = 'var(--accent)'; };
      el.onmouseleave = () => { el.style.borderColor = 'rgba(139, 92, 24, 0.2)'; };
    };

    card.querySelector('.btn-ignore').onclick = () => {
      if (type !== 'transaction') {
        if (type === 'item') {
          let its = JSON.parse(localStorage.getItem('items') || '[]');
          its.push({ id: Date.now(), name: source, category: 'General', status: 'Active', price: 0, unit: 'pcs' });
          localStorage.setItem('items', JSON.stringify(its));
        } else if (type === 'merchant') {
          let mer = JSON.parse(localStorage.getItem('merchants') || '[]');
          mer.push({ id: Date.now(), name: source, type: 'Other' });
          localStorage.setItem('merchants', JSON.stringify(mer));
        } else if (type === 'account') {
          let acc = JSON.parse(localStorage.getItem('accounts') || '[]');
          acc.push({ id: Date.now(), name: source, type: 'Manual', balance: 0, status: 'Active' });
          localStorage.setItem('accounts', JSON.stringify(acc));
        }
        showToast(`Saved ${source} as separate entry`, 'success');
      }
      card.remove();
      if (window.location.pathname.includes('index.html')) window.location.reload();
    };

    card.querySelector('.btn-merge').onclick = () => {
      let txs = JSON.parse(localStorage.getItem('transactions') || '[]');
      if (type === 'transaction') {
         txs = txs.filter(t => t.id !== source.id);
         localStorage.setItem('transactions', JSON.stringify(txs));
         showToast('Duplicate transaction removed', 'success', 'trash-2');
      } else {
        txs.forEach(t => {
          if (type === 'item' && (t.name || '').toLowerCase() === source.toLowerCase()) t.name = target.name;
          if (type === 'merchant' && (t.merchant || '').toLowerCase() === source.toLowerCase()) t.merchant = target.name;
          if (type === 'account') {
            if ((t.accountPayment || '').toLowerCase() === source.toLowerCase()) t.accountPayment = target.name;
            if ((t.accountReceived || '').toLowerCase() === source.toLowerCase()) t.accountReceived = target.name;
          }
        });
        localStorage.setItem('transactions', JSON.stringify(txs));
        showToast(`${label} completed`, 'success', icon);
      }
      card.remove();
      window.location.reload();
    };
  }

  // Pull-to-Sync & Long-Scroll Logic
  let touchStartY = 0;
  let isPulling = false;
  let pullIndicator = null;

  function initScrollFeatures() {
    // 1. Create Pull Indicator
    pullIndicator = document.createElement('div');
    pullIndicator.id = 'pull-indicator';
    pullIndicator.style.cssText = 'position:fixed; top:-60px; left:50%; transform:translateX(-50%); z-index:9998; background:var(--accent); color:white; padding:0.6rem 1rem; border-radius:2rem; font-size:0.75rem; font-weight:800; display:flex; align-items:center; gap:0.5rem; transition: top 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease; box-shadow:0 10px 25px rgba(0,0,0,0.3); white-space:nowrap;';
    pullIndicator.innerHTML = '<i data-lucide="refresh-cw" style="width:16px;"></i><span>Pull to Sync</span>';
    document.body.appendChild(pullIndicator);
    if(window.lucide) window.lucide.createIcons();

    // 2. Gesture Logic (Multi-stage Pull to Refresh)
    window.addEventListener('touchstart', e => {
      if (window.scrollY <= 0) touchStartY = e.touches[0].pageY;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (window.scrollY > 0) return;
      const moveY = e.touches[0].pageY;
      const diff = moveY - touchStartY;
      
      if (diff > 20) {
        if (!isPulling) isPulling = true;
        
        // Dynamic feedback based on depth
        pullIndicator.style.top = Math.min(30, (diff / 2.5) - 40) + 'px';
        
        const label = pullIndicator.querySelector('span');
        const icon = pullIndicator.querySelector('i');
        
        if (diff > 260) {
          // Long Pull stage (Push)
          label.innerText = 'Release to Push Backup ☁️';
          pullIndicator.style.background = '#0ea5e9'; // Blue for cloud push
          icon.style.transform = 'rotate(360deg) scale(1.2)';
        } else if (diff > 120) {
          // Normal pull stage (Pull)
          label.innerText = 'Release to Sync Cloud';
          pullIndicator.style.background = 'var(--accent)';
          icon.style.transform = 'rotate(180deg)';
        } else {
          label.innerText = 'Pull Down to Sync';
          pullIndicator.style.background = 'var(--accent)';
          icon.style.transform = 'rotate(0deg)';
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', e => {
      if (!isPulling) return;
      const diff = e.changedTouches[0].pageY - touchStartY;
      
      if (diff > 260) {
        triggerCloudPush();
      } else if (diff > 120) {
        triggerCloudSync();
      }
      
      isPulling = false;
      setTimeout(() => {
        if (!isPulling && pullIndicator.style.top !== '-60px' && !pullIndicator.innerText.includes('ing...')) {
          pullIndicator.style.top = '-60px';
        }
      }, 300);
    });
  }

  async function triggerCloudSync(mode = 'merge') {
    const url = localStorage.getItem('cloud_sheet_url');
    if (!url) {
      if (window.showToast) window.showToast('Cloud URL not set. Connect your ledger.', 'warning', 'link-2');
      return;
    }

    const pullIndicator = document.getElementById('pull-indicator');
    if (pullIndicator) {
      pullIndicator.querySelector('span').innerText = (mode === 'overwrite' ? 'Overwriting...' : 'Syncing...');
      pullIndicator.querySelector('i').classList.add('animate-spin');
      pullIndicator.style.top = '20px';
    }

    try {
      if (window.showToast) window.showToast(`Initialising ${mode} sync...`, 'info', 'cloud');
      const count = await window.CloudSync.pull(url, mode);
      if (pullIndicator) {
        pullIndicator.style.background = '#10b981';
        pullIndicator.innerHTML = `<i data-lucide="check" style="width:16px;"></i><span>Cloud ${mode === 'overwrite' ? 'Restored' : 'Synced'} (${count})</span>`;
      }
      if(window.lucide) window.lucide.createIcons();
      
      setTimeout(() => {
        if (pullIndicator) pullIndicator.style.top = '-60px';
        setTimeout(() => location.reload(), 500);
      }, 1500);
    } catch (err) {
      if (pullIndicator) {
        pullIndicator.style.background = '#ef4444';
        pullIndicator.innerHTML = `<i data-lucide="alert-circle" style="width:16px;"></i><span>Sync Failed</span>`;
        setTimeout(() => { pullIndicator.style.top = '-60px'; }, 2000);
      }
    }
  }

  async function triggerCloudPush() {
    const url = localStorage.getItem('cloud_sheet_url');
    if (!url) {
      if (window.showToast) window.showToast('Cloud URL not set. Connect your ledger.', 'warning', 'link-2');
      return;
    }

    if (pullIndicator) {
      pullIndicator.innerHTML = `<i data-lucide="refresh-cw" class="animate-spin" style="width:16px;"></i><span>Pushing Data...</span>`;
      pullIndicator.style.top = '30px';
      pullIndicator.style.background = '#0ea5e9';
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      await window.CloudSync.push(url);
      const now = new Date().toLocaleString('id-ID');
      localStorage.setItem('last_cloud_sync', now);
      updateSyncUI(now);

      if (pullIndicator) {
        pullIndicator.style.background = '#10b981';
        pullIndicator.innerHTML = `<i data-lucide="check" style="width:16px;"></i><span>Cloud Updated!</span>`;
      }
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        if (pullIndicator) pullIndicator.style.top = '-60px';
      }, 1500);
    } catch (err) {
      if (pullIndicator) {
        pullIndicator.style.background = '#ef4444';
        pullIndicator.innerHTML = `<i data-lucide="alert-circle" style="width:16px;"></i><span>Upload Failed</span>`;
        setTimeout(() => { if (pullIndicator) pullIndicator.style.top = '-60px'; }, 2000);
      }
    }
  }

  function updateSyncUI(time) {
    const displayTime = time || 'Never';
    // Settings Page
    const el = document.getElementById('last-sync-display');
    if (el) {
      el.innerText = `Last Cloud Sync: ${displayTime}`;
      el.style.opacity = time ? '1' : '0.5';
    }

    // Dashboard
    const dashEl = document.getElementById('dash-last-sync');
    const dashIcon = document.querySelector('#dash-sync-info i');
    if (dashEl) {
      dashEl.innerText = `Cloud: ${displayTime}`;
      if (dashIcon) {
        dashIcon.style.color = time ? '#10b981' : '#f59e0b';
        dashIcon.setAttribute('data-lucide', time ? 'cloud-check' : 'cloud-off');
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  // Animation styles if not present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      @keyframes toast-in {
        from { opacity: 0; transform: translateY(20px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes toast-out {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
      }
      .animate-spin { animation: spin 1s linear infinite; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGlobalTheme();
      initScrollFeatures();
      checkAuthWall();
      syncMasterData();
    });
  } else {
    initGlobalTheme();
    initScrollFeatures();
    checkAuthWall();
    syncMasterData();
  }

  // Export for manual calls
  window.refreshGlobalTheme = initGlobalTheme;
  window.applyAesthetics = applyAesthetics;
  window.showToast = showToast;
  window.showConfirm = showConfirm;
  window.SyncHub = SyncHub;
  window.syncMasterData = syncMasterData;
  window.CloudSync = CloudSync;
  window.triggerCloudPush = triggerCloudPush;
  window.triggerCloudSync = triggerCloudSync;
  window.updateSyncUI = updateSyncUI;
})();
