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
  if (!val) return 0;
  return parseFloat(val.toString().replace(/[^0-9.-]+/g, "")) || 0;
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
        document.getElementById('sku-input').value = tx.sku || '';
        
        if (amountInput) amountInput.value = tx.price || 0;
        if (quantityInput) quantityInput.value = tx.qty || 1;
        if (discountInput) discountInput.value = tx.discount || 0;
        if (feeInput) feeInput.value = tx.fee || 0;
        if (currencyInput) currencyInput.value = tx.currency || 'IDR';
        
        const txType = (tx.type || 'Expense').toLowerCase();
        const typeBtn = Array.from(typeButtons).find(b => (b.dataset.type || '').toLowerCase() === txType);
        if (typeBtn) typeBtn.click();
        
        if (tx.tags) (Array.isArray(tx.tags) ? tx.tags : []).forEach(tg => addChip('tags-wrapper', tg));
        if (tx.projects) (Array.isArray(tx.projects) ? tx.projects : []).forEach(pj => addChip('projects-wrapper', pj));
        
        calculateTotal();
      }
    }
  } catch (e) { console.error(e); }
};

// Listeners for inputs
const nInputs = ['amount-input', 'quantity-input', 'exchange-rate-input', 'discount-input', 'fee-input'];
nInputs.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.oninput = calculateTotal;
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
      amount: parseNum(document.getElementById('total-display')?.innerText),
      price: parseNum(document.getElementById('amount-input')?.value),
      qty: parseNum(document.getElementById('quantity-input')?.value),
      scale: document.getElementById('item-scale')?.value,
      currency: document.getElementById('currency-input')?.value,
      author: document.getElementById('author-input').value,
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
    
    // Auto-cloud sync
    const curl = localStorage.getItem('cloud_sheet_url');
    if (curl) fetch(curl, { method: 'POST', body: JSON.stringify({ transactions: db }) }).catch(e => console.error(e));
    
    window.location.href = 'index.html';
  };
}

const dismissBtn = document.getElementById('dismiss-btn');
if (dismissBtn) dismissBtn.onclick = () => window.location.href = 'index.html';

const cancelBtn = document.getElementById('cancel-btn');
if (cancelBtn) cancelBtn.onclick = () => window.location.href = 'index.html';

// Initial Load
window.onload = () => {
  initForm();
  // Ensure all steps are shown for scrolling
  document.querySelectorAll('.step-content').forEach(el => el.style.display = 'flex');
  lucide.createIcons();
};
