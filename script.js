// script.js - Final Scrolling Form Version
lucide.createIcons();

let currentStep = 1;
const totalSteps = 7;
let editId = null;
let mode = null;

const urlParams = new URLSearchParams(window.location.search);
mode = urlParams.get('mode');
editId = urlParams.get('id');

const nextBtn = document.getElementById('next-btn'); // This is the Save button in header
const prevBtn = document.getElementById('prev-btn');
const amountInput = document.getElementById('amount-input');
const quantityInput = document.getElementById('quantity-input');
const itemScaleInput = document.getElementById('item-scale');
const discountInput = document.getElementById('discount-input');
const feeInput = document.getElementById('fee-input');
const currencyInput = document.getElementById('currency-input');
const receiptInput = document.getElementById('receipt-input');
const receiptPreview = document.getElementById('receipt-preview');

const typeButtons = document.querySelectorAll('#type-selector .type-btn');

// Numerical Helpers
const parseNum = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  
  let clean = val.toString().replace(/Rp/g, '').trim();
  if (!clean) return 0;

  // Indonesian format: 1.000.000,00 (dots=thousands, comma=decimal)
  // US/International: 1,000,000.00 (commas=thousands, dot=decimal)
  
  // Count counts
  const dots = (clean.match(/\./g) || []).length;
  const commas = (clean.match(/,/g) || []).length;

  if (dots > 1) { 
    // Multiple dots -> dots are definitely thousand separators
    clean = clean.replace(/\./g, '').replace(/,/g, '.');
  } else if (commas > 1) {
    // Multiple commas -> commas are definitely thousand separators
    clean = clean.replace(/,/g, '');
  } else if (dots === 1 && commas === 1) {
    // Both exist. Usually thousand.decimal
    const dotPos = clean.indexOf('.');
    const commaPos = clean.indexOf(',');
    if (dotPos < commaPos) { // 1.000,00
      clean = clean.replace(/\./g, '').replace(/,/g, '.');
    } else { // 1,000.00
      clean = clean.replace(/,/g, '');
    }
  } else if (dots === 1) {
    // Only one dot. Is it a thousand separator (1.000) or decimal (1.00)?
    const parts = clean.split('.');
    if (parts[1].length === 3) { // likely thousand
      clean = clean.replace(/\./g, '');
    } else { // likely decimal
      // keep it as is for parseFloat
    }
  } else if (commas === 1) {
    // Only one comma. Replace with dot for parseFloat
    clean = clean.replace(/,/g, '.');
  }

  // Final fallback to clean non-numeric junk but keep signs and decimals
  clean = clean.replace(/[^0-9.-]+/g, "");
  return parseFloat(clean) || 0;
};

const totalFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

function calculateTotal() {
  const qStr = document.getElementById('quantity-input')?.value || '1';
  const aStr = document.getElementById('amount-input')?.value || '0';
  const dStr = document.getElementById('discount-input')?.value || '0';
  const fStr = document.getElementById('fee-input')?.value || '0';
  const rStr = document.getElementById('exchange-rate-input')?.value || '1';
  
  const q = parseNum(qStr);
  const a = parseNum(aStr);
  const d = parseNum(dStr);
  const f = parseNum(fStr);
  const ex = parseNum(rStr);
  
  const subtotal = (q * a) - d + f;
  const total = subtotal * ex;
  
  const totalDisplay = document.getElementById('total-display');
  if (totalDisplay) totalDisplay.innerText = totalFormatter.format(total);
}

// Global Chip Function
window.addChip = (wrapperId, val) => {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const list = wrapper.querySelector('.chips-list');
  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.style.cssText = 'background: var(--border); padding: 4px 10px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; border: 1px solid var(--border);';
  chip.innerHTML = `<span>${val}</span><span style="cursor:pointer; font-weight:bold;" onclick="this.parentElement.remove()">×</span>`;
  if (list) list.appendChild(chip);
};

// Input Formatting (Live Thousand Separators + Decimals up to 10 places)
function formatInputLocale(e) {
  const raw = e.target.value;

  // Allow typing a decimal point or trailing zeros (don't reformat mid-entry)
  // Only reformat when there's no incomplete decimal being typed
  const trailingDecimal = /[.,]\d{0,10}$/.test(raw) && !/[.,]$/.test(raw);

  // Normalize: accept both '.' and ',' as decimal separator
  // Detect decimal part: last '.' or ',' that isn't a thousands separator
  let intPart = raw;
  let decPart = '';

  // Find decimal separator (last '.' or ',')
  const lastDot = raw.lastIndexOf('.');
  const lastComma = raw.lastIndexOf(',');
  const decIdx = Math.max(lastDot, lastComma);

  if (decIdx !== -1) {
    const afterDec = raw.slice(decIdx + 1);
    // It's a decimal separator if what follows is ≤10 digits and not purely a thousands pattern
    if (/^\d{0,10}$/.test(afterDec)) {
      intPart = raw.slice(0, decIdx);
      decPart = afterDec.slice(0, 10); // max 10 decimal digits
    }
  }

  // Strip non-numeric from int part
  const intClean = intPart.replace(/[^0-9]/g, '');

  if (!intClean && !decPart) {
    e.target.value = '';
    calculateTotal();
    return;
  }

  // Format integer part with ID locale thousands separator
  const intFormatted = intClean ? new Intl.NumberFormat('id-ID').format(intClean) : '0';

  // If decimal point was just typed (trailing separator), preserve it so user can keep typing
  if (/[.,]$/.test(raw)) {
    e.target.value = intFormatted + ',';
  } else if (decPart !== '') {
    e.target.value = intFormatted + ',' + decPart;
  } else {
    e.target.value = intFormatted;
  }

  calculateTotal();
}

// Rebuild/Sync Metadata (Accounts, Merchants, Items) from Transactions
function rebuildMetadataFromTransactions(txs, mode = 'merge') {
  if (!txs || txs.length === 0) return { accounts: 0, merchants: 0, items: 0, skipped: 0 };

  const currentAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  const currentMerchants = JSON.parse(localStorage.getItem('merchants') || '[]');
  const currentItems = JSON.parse(localStorage.getItem('items') || '[]');

  const accSet = new Set();
  const merSet = new Set();
  const itemSet = new Set();

  const newAccounts = mode === 'merge' ? [...currentAccounts] : [];
  const newMerchants = mode === 'merge' ? [...currentMerchants] : [];
  const newItems = mode === 'merge' ? [...currentItems] : [];

  // Stats for reporting
  const stats = {
    accounts: 0,
    merchants: 0,
    items: 0,
    skipped: 0
  };

  // Track existing names for easy lookup
  newAccounts.forEach(a => accSet.add(a.name.toLowerCase()));
  newMerchants.forEach(m => merSet.add(m.name.toLowerCase()));
  newItems.forEach(i => itemSet.add(i.name.toLowerCase()));

  txs.forEach(t => {
    // 1. Extraction of Accounts
    const accNames = [
      t.accountPayment || t['Payment Source Account'] || t.account,
      t.accountReceived || t['Beneficiary Account']
    ].filter(a => a && a.trim() && a !== '-');
    
    accNames.forEach(name => {
      const cleanName = name.trim();
      if (!accSet.has(cleanName.toLowerCase())) {
        newAccounts.push({
          id: Date.now() + Math.random(),
          name: cleanName,
          type: 'Auto-extracted',
          balance: 0,
          number: '-',
          status: 'Active',
          color: '#8b5cf6'
        });
        accSet.add(cleanName.toLowerCase());
        stats.accounts++;
      } else {
        stats.skipped++;
      }
    });

    // 2. Extraction of Merchants
    const merchantName = t.merchant || t.Merchant || t['Merchant Name'] || t['Merchant'];
    if (merchantName && merchantName.trim() && merchantName !== '-') {
      const cleanM = merchantName.trim();
      if (!merSet.has(cleanM.toLowerCase())) {
        newMerchants.push({
          id: Date.now() + Math.random(),
          name: cleanM,
          type: t.categoryGroup || t.category || 'Other',
          address: '',
          map: ''
        });
        merSet.add(cleanM.toLowerCase());
        stats.merchants++;
      } else {
        stats.skipped++;
      }
    }

    // 3. Extraction of Items
    const itemName = t.name || t.Name || t['Item Name'] || t['Item'] || t.item;
    if (itemName && itemName.trim() && itemName !== '-' && itemName !== 'Imported Transaction') {
      const cleanI = itemName.trim();
      if (!itemSet.has(cleanI.toLowerCase())) {
        newItems.push({
          id: Date.now() + Math.random(),
          name: cleanI,
          category: t.category || 'General',
          price: t.amount || 0,
          unit: t.qtyScale || 'pcs',
          status: 'Active',
          image: ''
        });
        itemSet.add(cleanI.toLowerCase());
        stats.items++;
      } else {
        stats.skipped++;
      }
    }
  });

  localStorage.setItem('accounts', JSON.stringify(newAccounts));
  localStorage.setItem('merchants', JSON.stringify(newMerchants));
  localStorage.setItem('items', JSON.stringify(newItems));
  
  const msg = `Auto-extraction: ${stats.accounts} Acc, ${stats.merchants} Mer, ${stats.items} Items. Duplicates: ${stats.skipped}`;
  console.log(msg);
  return stats;
}

function populateDatalists() {
  const db = JSON.parse(localStorage.getItem('transactions') || '[]');
  console.log(`Populating datalists from ${db.length} transactions...`);
  
  const sets = {
    merchants: new Set(),
    items: new Set(),
    categories: new Set(['Food & Beverage', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Education', 'Investment', 'Other']),
    accounts: new Set(),
    authors: new Set(['User']),
    tags: new Set(['Monthly', 'Priority']),
    projects: new Set(['General'])
  };

  db.forEach(t => {
    // Aggressive extraction from all possible key variations
    const m = t.merchant || t.Merchant || t['Merchant Name'] || t['Merchant'];
    if (m && m !== '-') sets.merchants.add(m.toString().trim());

    const n = t.name || t.Name || t['Item Name'] || t['Item'] || t.item;
    if (n && n !== '-' && n !== 'Imported Transaction') sets.items.add(n.toString().trim());

    const c = t.category || t.Category || t['Category'];
    if (c && c !== '-') sets.categories.add(c.toString().trim());

    const ap = t.accountPayment || t['Payment Source Account'] || t.account;
    if (ap && ap !== '-') sets.accounts.add(ap.toString().trim());

    const ar = t.accountReceived || t['Beneficiary Account'];
    if (ar && ar !== '-') sets.accounts.add(ar.toString().trim());

    const au = t.author || t.Author || t['Author'];
    if (au && au !== '-') sets.authors.add(au.toString().trim());
    
    if (t.tags && Array.isArray(t.tags)) t.tags.forEach(tg => sets.tags.add(tg.toString().trim()));
    if (t.projects && Array.isArray(t.projects)) t.projects.forEach(pj => sets.projects.add(pj.toString().trim()));
  });

  // If sync yielded accounts, use them exclusively to avoid default confusion
  if (sets.accounts.size === 0) {
    ['Cash', 'Bank Account', 'Credit Card', 'E-Wallet'].forEach(a => sets.accounts.add(a));
  }

  const fill = (id, items) => {
    const dl = document.getElementById(id);
    if (dl) {
      dl.innerHTML = Array.from(items).sort().map(i => `<option value="${i}">`).join('');
    }
  };

  fill('merchant-list', sets.merchants);
  fill('item-list', sets.items);
  fill('category-list', sets.categories);
  fill('payment-list', sets.accounts);
  fill('received-list', sets.accounts);
  fill('author-list', sets.authors);
  fill('tag-suggestions', sets.tags);
  fill('project-suggestions', sets.projects);
}

window.updateReceiptPreview = (val) => {
  if (!receiptPreview) return;
  const card = receiptPreview.querySelector('.preview-card');
  const emptyState = document.getElementById('receipt-empty-state');
  const img = document.getElementById('receipt-img');
  if (val && val.length > 0) {
    if (emptyState) emptyState.style.display = 'none';
    if (card) card.style.display = 'block';
    if (img) img.src = val;
  } else {
    if (emptyState) emptyState.style.display = 'block';
    if (card) card.style.display = 'none';
  }
};

const initForm = () => {
  try {
    const db = JSON.parse(localStorage.getItem('transactions') || '[]');
    if ((mode === 'edit' || mode === 'duplicate') && editId) {
      const tx = db.find(t => t.id == editId);
      if (tx) {
        document.getElementById('transaction-date').value = tx.date || '';
        document.getElementById('transaction-time').value = tx.time || '';
        document.getElementById('author-input').value = tx.author || '';
        document.getElementById('item-input').value = tx.name || '';
        document.getElementById('merchant-input').value = tx.merchant || '';
        document.getElementById('category-input').value = tx.category || '';
        document.getElementById('transaction-description').value = tx.description || '';
        
        if (amountInput) {
          // Migration: In old structure, tx.amount was Total and tx.price was Unit Price
          // In new structure, tx.amount is Unit Price and tx.total is Total
          if (tx.total === undefined && tx.amount !== undefined) {
             amountInput.value = tx.price || (tx.amount / (tx.qty || 1));
          } else {
             amountInput.value = tx.amount || 0;
          }
        }
        if (quantityInput) quantityInput.value = tx.qty || 1;
        if (discountInput) discountInput.value = tx.discount || 0;
        if (feeInput) feeInput.value = tx.fee || 0;
        if (currencyInput) currencyInput.value = tx.currency || 'IDR';
        
        const rateInput = document.getElementById('exchange-rate-input');
        if (rateInput) rateInput.value = tx.exchangeRate || 1.00;

        const pAcc = document.getElementById('payment-account');
        if (pAcc) pAcc.value = tx.accountPayment || '';
        const rAcc = document.getElementById('received-account');
        if (rAcc) rAcc.value = tx.accountReceived || '';
        
        const txType = (tx.type || 'Expense').toLowerCase();
        typeButtons.forEach(btn => {
          if ((btn.dataset.type || '').toLowerCase() === txType) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        const clearedBtns = document.querySelectorAll('#cleared-selector .type-btn');
        const isCleared = tx.cleared !== false;
        clearedBtns.forEach(btn => {
          if (btn.dataset.cleared === (isCleared ? 'yes' : 'no')) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        
        if (tx.tags) (Array.isArray(tx.tags) ? tx.tags : []).forEach(tg => addChip('tags-wrapper', tg));
        if (tx.projects) (Array.isArray(tx.projects) ? tx.projects : []).forEach(pj => addChip('projects-wrapper', pj));
        
        calculateTotal();

        // Update account groups visibility for edit mode
        const pGroup = document.getElementById('payment-account-group');
        const rGroup = document.getElementById('received-account-group');
        const txTypeLower = txType.toLowerCase();
        const multiAccount = ['transfer', 'savings', 'investment'].includes(txTypeLower);
        
        if (txTypeLower === 'income') {
          if (pGroup) pGroup.style.display = 'none';
          if (rGroup) rGroup.style.display = 'block';
        } else if (multiAccount) {
          if (pGroup) pGroup.style.display = 'block';
          if (rGroup) rGroup.style.display = 'block';
        } else {
          if (pGroup) pGroup.style.display = 'block';
          if (rGroup) rGroup.style.display = 'none';
        }
      }
    }
  } catch (e) { console.error(e); }
};

// Listeners for inputs (With live formatting for currency/qty + decimal support)
const locInputs = ['amount-input', 'quantity-input', 'discount-input', 'fee-input'];
locInputs.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.oninput = formatInputLocale;
});

// Exchange rate also supports decimals — use the same decimal-aware formatter
const rawInputs = ['exchange-rate-input'];
rawInputs.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.oninput = formatInputLocale;
});

// Save Logic
if (nextBtn) {
  nextBtn.onclick = (e) => {
    e.preventDefault();
    const tx = {
      id: mode === 'edit' ? parseInt(editId) : Date.now(),
      date: document.getElementById('transaction-date').value,
      time: document.getElementById('transaction-time').value,
      name: document.getElementById('item-input').value,
      merchant: document.getElementById('merchant-input').value,
      type: document.querySelector('#type-selector .type-btn.active')?.dataset.type || 'Expense',
      category: document.getElementById('category-input').value,
      amount: parseNum(document.getElementById('amount-input')?.value), // amount is unit price
      qty: parseNum(document.getElementById('quantity-input')?.value),
      discount: parseNum(document.getElementById('discount-input')?.value),
      fee: parseNum(document.getElementById('fee-input')?.value),
      total: parseNum(document.getElementById('total-display')?.innerText), // total is final result
      exchangeRate: parseNum(document.getElementById('exchange-rate-input')?.value) || 1.00,
      scale: document.getElementById('item-scale')?.value,
      currency: document.getElementById('currency-input')?.value,
      author: document.getElementById('author-input').value,
      accountPayment: document.getElementById('payment-account')?.value,
      accountReceived: document.getElementById('received-account')?.value,
      tags: Array.from(document.querySelectorAll('#tags-wrapper .chip span:first-child')).map(s => s.innerText),
      projects: Array.from(document.querySelectorAll('#projects-wrapper .chip span:first-child')).map(s => s.innerText),
      description: document.getElementById('transaction-description').value,
      receipt: document.getElementById('receipt-input').value,
      cleared: document.querySelector('#cleared-selector .type-btn.active')?.dataset.cleared === 'yes'
    };
    
    let db = JSON.parse(localStorage.getItem('transactions') || '[]');
    if (mode === 'edit') {
       const idx = db.findIndex(t => t.id == editId);
       if (idx !== -1) db[idx] = tx; else db.push(tx);
    } else {
       db.push(tx);
    }
    localStorage.setItem('transactions', JSON.stringify(db));
    
    showToast(mode === 'edit' ? 'Transaction updated successfully' : 'Transaction saved successfully', 'success', 'check-circle');
    
    // Auto-cloud sync
    const curl = localStorage.getItem('cloud_sheet_url');
    if (curl) fetch(curl, { method: 'POST', body: JSON.stringify({ transactions: db }) }).catch(e => console.error(e));
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  };
}

const dismissBtn = document.getElementById('dismiss-btn');
if (dismissBtn) dismissBtn.onclick = () => window.location.href = 'index.html';

const cancelBtn = document.getElementById('cancel-btn');
if (cancelBtn) cancelBtn.onclick = () => window.location.href = 'index.html';

// Initial Load
window.onload = () => {
  populateDatalists();
  initForm();
  
  // Ensure all steps are shown for scrolling
  document.querySelectorAll('.step-content').forEach(el => el.style.display = 'flex');

  // Interactive selectors
  typeButtons.forEach(btn => {
    btn.onclick = () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Interactive Account Display based on Type
      const pGroup = document.getElementById('payment-account-group');
      const rGroup = document.getElementById('received-account-group');
      const type = btn.dataset.type.toLowerCase();
      const multiAccount = ['transfer', 'savings', 'investment'].includes(type);

      if (multiAccount) {
        if (pGroup) pGroup.style.display = 'block';
        if (rGroup) rGroup.style.display = 'block';
      } else if (type === 'income') {
        if (pGroup) pGroup.style.display = 'none';
        if (rGroup) rGroup.style.display = 'block';
      } else {
        if (pGroup) pGroup.style.display = 'block';
        if (rGroup) rGroup.style.display = 'none';
      }
    };
  });

  const clearedBtns = document.querySelectorAll('#cleared-selector .type-btn');
  clearedBtns.forEach(btn => {
    btn.onclick = () => {
      clearedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  // Chip input handlers
  const setupChipInput = (wrapperId) => {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const input = wrapper.querySelector('input');
    if (!input) return;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = input.value.trim();
        if (val) {
          addChip(wrapperId, val);
          input.value = '';
        }
      }
    };
  };
  setupChipInput('tags-wrapper');
  setupChipInput('projects-wrapper');

  lucide.createIcons();
};
