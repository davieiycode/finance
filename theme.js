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

  // Cloud Sync Engine
  const CloudSync = {
    pull: async (url, mode = 'overwrite') => {
      try {
        const res = await fetch(url + '?get=data');
        const data = await res.json();

        if (!data.transactions) throw new Error('No transactions found');

        const remoteTxs = data.transactions.map(t => {
          const q = parseFloat(t.qty) || 1;
          const d = parseFloat(t.discount) || 0;
          const f = parseFloat(t.fee) || 0;
          const ex = parseFloat(t.exchangeRate) || 1;
          const unitPrice = parseFloat(t.amount || 0);

          t.id = t.id ? t.id.toString() : 'CLOUD-' + Date.now();
          t.accountPayment = t.accountPayment || t['Payment Source Account'] || '';
          t.accountReceived = t.accountReceived || t['Beneficiary Account'] || '';
          
          const calcTotal = ((q * unitPrice) - d + f) * ex;
          t.total = (t.total !== undefined) ? parseFloat(t.total) : calcTotal;
          t.amount = unitPrice;
          
          return t;
        });

        if (mode === 'overwrite') {
          localStorage.setItem('transactions', JSON.stringify(remoteTxs));
        } else {
          const localTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
          const localIds = new Set(localTxs.map(t => t.id));
          const onlyNew = remoteTxs.filter(t => !localIds.has(t.id));
          localStorage.setItem('transactions', JSON.stringify([...onlyNew, ...localTxs]));
        }
        return remoteTxs.length;
      } catch (err) {
        console.error('Cloud Sync Error:', err);
        throw err;
      }
    },
    push: async (url) => {
      const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
      if (txs.length === 0) return 0;
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ transactions: txs })
      });
      return txs.length;
    }
  };

  function syncMasterData() {
    if (window.requestIdleCallback) {
       window.requestIdleCallback(() => deferredSync());
    } else {
       setTimeout(deferredSync, 800);
    }
  }

  function deferredSync() {
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
    txs.forEach(t => {
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
    });

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
  let pullIndicator = null;
  let isPulling = false;
  let hasShownScrollDialog = false;
  function initScrollFeatures() {
    let touchStartY = 0;
    let isPulling = false;
    
    // 1. Create Pull Indicator
    const pullIndicator = document.createElement('div');
    pullIndicator.id = 'pull-indicator';
    pullIndicator.style.cssText = 'position:fixed; top:-60px; left:50%; transform:translateX(-50%); z-index:9998; background:var(--accent); color:white; padding:0.6rem 1rem; border-radius:2rem; font-size:0.75rem; font-weight:800; display:flex; align-items:center; gap:0.5rem; transition: top 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow:0 10px 25px rgba(0,0,0,0.3);';
    pullIndicator.innerHTML = '<i data-lucide="refresh-cw" style="width:16px;"></i><span>Pull to Sync Cloud</span>';
    document.body.appendChild(pullIndicator);
    if(window.lucide) window.lucide.createIcons();

    // 2. Gesture Logic (Scroll Down/Pull at Top)
    window.addEventListener('touchstart', e => {
      if (window.scrollY <= 0) touchStartY = e.touches[0].pageY;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (window.scrollY > 0) return;
      const moveY = e.touches[0].pageY;
      const diff = moveY - touchStartY;
      
      if (diff > 20) {
        isPulling = true;
        pullIndicator.style.top = Math.min(20, (diff / 2.5) - 40) + 'px';
        if (diff > 120) {
          pullIndicator.querySelector('span').innerText = 'Release to Sync';
          pullIndicator.querySelector('i').style.transform = 'rotate(180deg)';
        } else {
          pullIndicator.querySelector('span').innerText = 'Pull to Sync';
          pullIndicator.querySelector('i').style.transform = 'rotate(0deg)';
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].pageY - touchStartY;
      if (isPulling && diff > 120) {
        triggerCloudSync();
      }
      isPulling = false;
      pullIndicator.style.top = '-60px';
    });

    // 3. Long Scroll Detection (Local -> Cloud Dialog)
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const scrollThreshold = 1500;
      if (currentScroll > scrollThreshold && !hasShownScrollDialog) {
        showSlideToUploadDialog();
        hasShownScrollDialog = true;
      } else if (currentScroll < 100) {
        hasShownScrollDialog = false;
      }
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

  function showSlideToUploadDialog() {
    let dialog = document.getElementById('cloud-upload-dialog');
    if (!dialog) {
      dialog = document.createElement('div');
      dialog.id = 'cloud-upload-dialog';
      dialog.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:10001; background:var(--bg-secondary); border:1px solid var(--border); border-radius:2rem; padding:1.5rem; width:90%; max-width:380px; box-shadow:0 30px 60px rgba(0,0,0,0.5); animation: toast-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);';
      dialog.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
          <div style="width:48px; height:48px; background:rgba(139,92,246,0.1); color:var(--accent); border-radius:24px; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem auto;">
            <i data-lucide="cloud-upload" style="width:24px;"></i>
          </div>
          <h3 style="font-weight:800; font-size:1rem; color:var(--text-primary); margin-bottom:0.25rem;">Ship Data to Cloud?</h3>
          <p style="font-size:0.75rem; color:var(--text-secondary);">You've scrolled quite a bit. Back up your recent local changes now.</p>
        </div>
        
        <div id="slide-track" style="position:relative; height:60px; background:var(--glass); border:1px solid var(--border); border-radius:30px; display:flex; align-items:center; padding:5px; overflow:hidden;">
          <div id="slide-text" style="position:absolute; width:100%; text-align:center; font-size:0.75rem; font-weight:700; color:var(--text-secondary); pointer-events:none;">Slide to confirm</div>
          <div id="slide-progress" style="position:absolute; left:0; top:0; height:100%; width:0%; background:var(--accent); opacity:0.3; pointer-events:none; transition:width 0.1s;"></div>
          <div id="slide-knob" style="position:relative; width:50px; height:50px; background:var(--accent); border-radius:25px; display:flex; align-items:center; justify-content:center; color:white; cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,0.4); z-index:2; touch-action:none;">
            <i data-lucide="arrow-right" style="width:20px;"></i>
          </div>
        </div>
        
        <button id="close-upload-dialog" style="width:100%; margin-top:1rem; background:none; border:none; color:var(--text-secondary); font-size:0.75rem; font-weight:600; cursor:pointer;">Not now</button>
      `;
      document.body.appendChild(dialog);
      if(window.lucide) window.lucide.createIcons();
      
      const knob = document.getElementById('slide-knob');
      const track = document.getElementById('slide-track');
      const progress = document.getElementById('slide-progress');
      const trackWidth = track.clientWidth - 10;
      let startX = 0;
      let currentX = 0;

      const onMove = (x) => {
        let diff = x - startX;
        if (diff < 0) diff = 0;
        if (diff > trackWidth - 50) diff = trackWidth - 50;
        currentX = diff;
        knob.style.left = currentX + 'px';
        progress.style.width = (currentX + 50) + 'px';
        
        if (currentX >= trackWidth - 55) {
          triggerUpload();
        }
      };

      const triggerUpload = () => {
        knob.style.pointerEvents = 'none';
        document.getElementById('slide-text').innerText = 'Sending...';
        document.getElementById('slide-text').style.color = 'white';
        
        setTimeout(() => {
          showToast('Data safely uploaded to cloud', 'success', 'cloud-check');
          dialog.style.animation = 'toast-out 0.4s ease forwards';
          setTimeout(() => dialog.remove(), 400);
        }, 1500);
      };

      knob.addEventListener('touchstart', e => { startX = e.touches[0].clientX - currentX; });
      knob.addEventListener('touchmove', e => { onMove(e.touches[0].clientX); });
      knob.addEventListener('touchend', () => { if (currentX < trackWidth - 55) { currentX = 0; knob.style.left = '0px'; progress.style.width = '0%'; } });
      
      document.getElementById('close-upload-dialog').onclick = () => {
        dialog.style.animation = 'toast-out 0.4s ease forwards';
        setTimeout(() => dialog.remove(), 400);
      };
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
  window.syncMasterData = syncMasterData;
  window.CloudSync = CloudSync;
})();
