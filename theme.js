(function() {
  function applyAesthetics(theme, color, radius) {
    const root = document.documentElement;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--card-radius', radius + 'px');
    
    const themeMap = {
      dark: { bg: '#0f0f0f', card: '#1a1a1a', input: '#1f1f23', glass: 'rgba(255,255,255,0.03)', text: '#ffffff', border: '#27272a', sub: '#d4d4d8' },
      night: { bg: '#000000', card: '#0a0a0a', input: '#121212', glass: 'rgba(255,255,255,0.03)', text: '#ffffff', border: '#1a1a1a', sub: '#a1a1aa' },
      light: { bg: '#f8fafc', card: '#ffffff', input: '#f1f5f9', glass: 'rgba(0,0,0,0.03)', text: '#0f172a', border: '#e2e8f0', sub: '#64748b' },
      contrast: { bg: '#000000', card: '#000000', input: '#000000', glass: 'rgba(255,255,255,0.05)', text: '#ffffff', border: '#ffffff', sub: '#ffffff' }
    };

    const t = themeMap[theme] || themeMap.dark;
    root.style.setProperty('--bg-primary', t.bg);
    root.style.setProperty('--bg-secondary', t.card);
    root.style.setProperty('--bg-input', t.input);
    root.style.setProperty('--glass', t.glass);
    root.style.setProperty('--text-primary', t.text);
    root.style.setProperty('--border', t.border);
    root.style.setProperty('--text-secondary', t.sub);
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
    
    if (type === 'error') {
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<i data-lucide="x" style="width:14px;"></i>';
      closeBtn.style.cssText = 'background:none; border:none; color:var(--text-secondary); cursor:pointer; padding:4px; margin-left:auto; display:flex; align-items:center;';
      toast.appendChild(closeBtn);
      if (window.lucide) window.lucide.createIcons();
      closeBtn.onclick = () => {
        toast.style.animation = 'toast-out 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
      };
    } else {
      setTimeout(() => {
        toast.style.animation = 'toast-out 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
      }, 4000);
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
    `;
    document.head.appendChild(style);
  }

  function showConfirm(message, onConfirm) {
    let modal = document.getElementById('custom-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'custom-confirm-modal';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); display:none; z-index:10000; padding:1.5rem; flex-direction:column; justify-content:center; align-items:center;';
      modal.innerHTML = `
        <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:1.5rem; padding:2rem; max-width:400px; width:100%; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <div id="confirm-icon-box" style="width:64px; height:64px; border-radius:32px; background:rgba(239,68,68,0.1); color:#ef4444; display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem auto;">
            <i id="confirm-icon" data-lucide="alert-triangle" style="width:32px; height:32px;"></i>
          </div>
          <h3 id="confirm-title" style="font-weight:700; font-size:1.25rem; margin-bottom:0.75rem; color:var(--text-primary);">Confirm Action</h3>
          <p id="confirm-msg" style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:2rem; line-height:1.5;"></p>
          <div style="display:flex; gap:1rem; flex-direction:row;">
            <button id="btn-confirm-cancel" style="flex:1; padding:0.875rem; border-radius:1rem; border:1px solid var(--border); background:var(--glass); color:var(--text-primary); font-weight:600; cursor:pointer;">Cancel</button>
            <button id="btn-confirm-ok" style="flex:1; padding:0.875rem; border-radius:1rem; border:none; background:#ef4444; color:white; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(239,68,68,0.3);">Proceed</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    document.getElementById('confirm-msg').innerText = message;
    document.getElementById('confirm-title').innerText = 'Confirm Action';
    document.getElementById('confirm-icon-box').style.background = 'rgba(239,68,68,0.1)';
    document.getElementById('confirm-icon-box').style.color = '#ef4444';
    document.getElementById('btn-confirm-ok').style.background = '#ef4444';
    document.getElementById('confirm-icon').setAttribute('data-lucide', 'alert-triangle');

    modal.style.display = 'flex';
    if(window.lucide) window.lucide.createIcons();
    
    document.getElementById('btn-confirm-cancel').onclick = () => {
      modal.style.display = 'none';
    };
    
    document.getElementById('btn-confirm-ok').onclick = () => {
      modal.style.display = 'none';
      if(onConfirm) onConfirm();
    };
  }

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

  // --- SyncHub: Premium Progress Hub ---
  const SyncHub = {
    el: null, progressBar: null, statusText: null, titleText: null, percentText: null,

    init() {
      if (this.el) return;
      const hubHtml = `
        <div id="sync-hub-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 999999; flex-direction: column; align-items: center; justify-content: center; color: white; opacity: 0; transition: all 0.4s ease;">
          <div style="width: 100%; max-width: 320px; text-align: center; display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem;">
            <div style="position: relative; width: 84px; height: 84px; margin: 0 auto;">
              <div style="width: 84px; height: 84px; border: 3px solid rgba(139, 92, 246, 0.1); border-top-color: var(--accent); border-radius: 50%; animation: hub-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;"></div>
              <div id="sync-hub-percent" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; color: var(--accent); font-family: 'JetBrains Mono', monospace;">0%</div>
            </div>
            <div>
              <h3 id="sync-hub-title" style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem; letter-spacing: -0.02em;">Syncing</h3>
              <p id="sync-hub-status" style="opacity: 0.6; font-size: 0.75rem; min-height: 1.25rem; font-weight: 500;">Initializing...</p>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.02);">
               <div id="sync-hub-progress" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(90deg, var(--accent), #c084fc); transition: width 0.4s cubic-bezier(0.1, 0.7, 0.1, 1);"></div>
            </div>
            <div id="sync-hub-error-actions" style="display: none; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
               <p id="sync-hub-error-detail" style="color: #ef4444; font-size: 0.7rem; font-weight: 600; line-height: 1.4; background: rgba(239,68,68,0.05); padding: 0.75rem; border-radius: 0.75rem; border: 1px solid rgba(239,68,68,0.1);"></p>
               <button id="sync-hub-close" style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary); padding: 0.75rem; border-radius: 1rem; font-weight: 700; font-size: 0.8rem; cursor: pointer;">Acknowledge & Close</button>
            </div>
          </div>
        </div>
        <style> @keyframes hub-spin { to { transform: rotate(360deg); } } </style>
      `;
      const div = document.createElement('div');
      div.id = 'sync-hub-root';
      div.innerHTML = hubHtml;
      document.body.appendChild(div);
      this.el = document.getElementById('sync-hub-overlay');
      this.progressBar = document.getElementById('sync-hub-progress');
      this.statusText = document.getElementById('sync-hub-status');
      this.titleText = document.getElementById('sync-hub-title');
      this.percentText = document.getElementById('sync-hub-percent');
    },

    start(title, status) {
      this.init();
      this.titleText.innerText = title;
      this.statusText.innerText = status;
      this.update(0);
      this.el.style.display = 'flex';
      setTimeout(() => this.el.style.opacity = '1', 10);
    },

    update(percent, status) {
      if (!this.el) return;
      const p = Math.min(100, Math.max(0, percent));
      this.progressBar.style.width = p + '%';
      if (this.percentText) this.percentText.innerText = Math.round(p) + '%';
      if (status) this.statusText.innerText = status;
    },

    finish(msg, success = true, errorDetail = '') {
      if (success) {
        this.update(100, msg || 'Done!');
        document.getElementById('sync-hub-error-actions').style.display = 'none';
        setTimeout(() => {
          this.el.style.opacity = '0';
          setTimeout(() => this.el.style.display = 'none', 400);
        }, 1000);
      } else {
        this.update(100, 'Process Failed');
        this.titleText.innerText = 'Operation Error';
        this.titleText.style.color = '#ef4444';
        const errActions = document.getElementById('sync-hub-error-actions');
        const errDetailEl = document.getElementById('sync-hub-error-detail');
        errActions.style.display = 'flex';
        errDetailEl.innerText = errorDetail || msg || 'An unknown error occurred during sync.';
        
        document.getElementById('sync-hub-close').onclick = () => {
          this.el.style.opacity = '0';
          setTimeout(() => {
            this.el.style.display = 'none';
            this.titleText.style.color = 'white';
          }, 400);
        };
      }
    }
  };

  // Cloud Sync Engine
  const CloudSync = {
    pull: async (url, mode = 'overwrite', silent = false) => {
      if (!silent) SyncHub.start('Cloud Pull', 'Connecting to secure server...');
      try {
        if (!silent) SyncHub.update(15, 'Fetching remote ledger...');
        const res = await fetch(url + (url.includes('?') ? '&' : '?') + 'get=data');
        const data = await res.json();

        let count = 0;
        const keys = ['transactions', 'accounts', 'merchants', 'items', 'vault', 'budgets', 'goals', 'membership_cards'];
        
        if (mode === 'overwrite') {
          if (data.status === 'success') {
            SyncHub.update(40, 'Parsing cloud data entities...');
            const totalKeys = keys.filter(k => data[k]).length || 1;
            let processedKeys = 0;

            keys.forEach(key => {
              if (data[key]) {
                const stepLoad = 40 + ((processedKeys / totalKeys) * 50);
                SyncHub.update(stepLoad, `Processing ${key}...`);
                
                let remoteData = data[key];
                if (key === 'transactions') {
                  remoteData = remoteData.map(t => {
                    const parseVal = (v, def = 0) => {
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
                        if (parts[1].length === 3) s = s.replace(/,/g, '');
                        else s = s.replace(/,/g, '.');
                      }
                      return parseFloat(s.replace(/[^0-9.-]+/g, "")) || def;
                    };

                    const q = parseVal(t.qty, 1);
                    const d = parseVal(t.discount, 0);
                    const f = parseVal(t.fee, 0);
                    const ex = parseVal(t.exchangeRate, 1);
                    const unitPrice = parseVal(t.amount, 0);
                    t.id = t.id ? t.id.toString() : 'CLOUD-' + Date.now() + Math.random();
                    const calcTotal = ((q * unitPrice) - d + f) * ex;
                    t.total = (t.total !== undefined) ? parseVal(t.total) : calcTotal;
                    t.total = isNaN(t.total) ? 0 : t.total;
                    t.amount = unitPrice;
                    t.qty = q;
                    t.discount = d;
                    t.fee = f;
                    t.exchangeRate = ex;
                    return t;
                  });
                  count = remoteData.length;
                }
                localStorage.setItem(key, JSON.stringify(remoteData));
                processedKeys++;
              } else if (['transactions', 'accounts', 'merchants', 'items', 'vault'].includes(key)) {
                localStorage.removeItem(key);
              }
            });
          } else {
            throw new Error('Cloud returned an error or invalid status');
          }
        } else {
          // Merge Logic (Default) - Cloud is Master
          SyncHub.update(50, 'Merging local and remote entries...');
          if (data.transactions) {
            const remoteTxs = data.transactions.map(t => {
              const parseVal = (v, def = 0) => {
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
                  if (parts[1].length === 3) s = s.replace(/,/g, '');
                  else s = s.replace(/,/g, '.');
                }
                return parseFloat(s.replace(/[^0-9.-]+/g, "")) || def;
              };

              const q = parseVal(t.qty, 1);
              const d = parseVal(t.discount, 0);
              const f = parseVal(t.fee, 0);
              const ex = parseVal(t.exchangeRate, 1);
              const unitPrice = parseVal(t.amount, 0);
              t.id = t.id ? t.id.toString() : 'CLOUD-' + Date.now() + Math.random();
              const calcTotal = ((q * unitPrice) - d + f) * ex;
              t.total = (t.total !== undefined) ? parseVal(t.total) : calcTotal;
              t.total = isNaN(t.total) ? 0 : t.total;
              t.amount = unitPrice;
              t.qty = q;
              t.discount = d;
              t.fee = f;
              t.exchangeRate = ex;
              return t;
            });

            const localTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
            const cloudIds = new Set(remoteTxs.map(t => t.id.toString()));
            // Keep remote, add unique locals
            const uniqueLocals = localTxs.filter(t => !cloudIds.has(t.id.toString()));
            localStorage.setItem('transactions', JSON.stringify([...remoteTxs, ...uniqueLocals]));
            count = remoteTxs.length;
          }
        }

        SyncHub.update(95, 'Finalizing data extraction...');
        if (!data.accounts && !data.merchants && !data.items && typeof window.syncMasterData === 'function') {
          await window.syncMasterData();
        }

        if (!silent) SyncHub.finish(`Success! ${count} records processed.`);
        localStorage.setItem('last_cloud_sync', Date.now());
        return count;
      } catch (err) {
        if (!silent) SyncHub.finish('Pull failed', false, err.message);
        console.error('Cloud Sync Error:', err);
        throw err;
      }
    },
    push: async (url, silent = false) => {
      if (!silent) SyncHub.start('Cloud Push', 'Preparing complete ledger backup...');
      try {
        const keys = ['transactions', 'accounts', 'merchants', 'items', 'budgets', 'goals', 'membership_cards'];
        const payload = { updateTime: new Date().toISOString() };
        
        let processedKeys = 0;
        const totalKeys = keys.length;

        keys.forEach(key => {
          const stepLoad = (processedKeys / totalKeys) * 35; // First 35% is gathering
          if (!silent) SyncHub.update(stepLoad, `Gathering ${key}...`);
          payload[key] = JSON.parse(localStorage.getItem(key) || '[]');
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
          if (!silent) SyncHub.finish(`Successfully uploaded all sheets!`);
          localStorage.setItem('last_cloud_sync', Date.now());
          return payload.transactions.length;
        } else {
          throw new Error(result.message || 'Server error');
        }
      } catch (e) {
        if (!silent) SyncHub.finish('Push failed', false, e.message);
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
    let items = JSON.parse(localStorage.getItem('items') || '[]');

    let updated = false;
    const isDashboard = window.location.pathname.includes('index.html');
    const isItems = window.location.pathname.includes('items.html');
    
    // Quick Lookup Maps for O(1) exact match check
    const accMap = new Map(accounts.map(a => [a.name.toLowerCase(), a]));
    const merMap = new Map(merchants.map(m => [m.name.toLowerCase(), m]));
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
          } else if (!isDashboard || suggestionCount < MAX_SUGGESTIONS) {
             merchants.push({ id: Date.now() + Math.random(), name: t.merchant, type: t.category || 'Other' });
             merMap.set(mLower, { name: t.merchant });
             updated = true;
          }
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
          } else if (!isDashboard || suggestionCount < MAX_SUGGESTIONS) {
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
          } else if (suggestionCount < MAX_SUGGESTIONS || (!isDashboard && !isItems)) {
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
      localStorage.setItem('items', JSON.stringify(items));
      if (isDashboard && typeof window.renderDashboard === 'function') window.renderDashboard();
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

  async function triggerCloudSync() {
    const url = localStorage.getItem('cloud_sheet_url');
    if (!url) return;

    const pullIndicator = document.getElementById('pull-indicator');
    if (pullIndicator) {
      pullIndicator.querySelector('span').innerText = 'Syncing...';
      pullIndicator.querySelector('i').classList.add('animate-spin');
      pullIndicator.style.top = '20px';
    }

    try {
      const count = await window.CloudSync.pull(url, 'overwrite');
      if (pullIndicator) {
        pullIndicator.style.background = '#10b981';
        pullIndicator.innerHTML = `<i data-lucide="check" style="width:16px;"></i><span>Cloud Synced (${count})</span>`;
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
    if (!url) return;

    if (pullIndicator) {
      pullIndicator.querySelector('span').innerText = 'Pushing Data...';
      pullIndicator.querySelector('i').classList.add('animate-spin');
      pullIndicator.style.top = '30px';
      pullIndicator.style.background = '#0ea5e9';
    }

    try {
      await window.CloudSync.push(url);
      if (pullIndicator) {
        pullIndicator.style.background = '#10b981';
        pullIndicator.innerHTML = `<i data-lucide="check" style="width:16px;"></i><span>Cloud Updated!</span>`;
      }
      if(window.lucide) window.lucide.createIcons();
      
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
})();
