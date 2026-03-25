// Initialize Lucide icons
lucide.createIcons();

// State management
let currentStep = 1;
const totalSteps = 6;

// Select elements
const tabs = document.querySelectorAll('.tab');
const stepContents = document.querySelectorAll('.step-content');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const currencyInput = document.getElementById('currency-input');
// Conditional visibility elements
const paymentGroup = document.getElementById('payment-account-group');
const receivedGroup = document.getElementById('received-account-group');
const exchangeRateGroup = document.getElementById('exchange-rate-group');

// Handle Transaction Type Selection (Button Group)
const typeButtons = document.querySelectorAll('#type-selector .type-btn');

const categories = {
  'Expense': [
    // Daily Living
    { id: 'Food', label: 'Food & Groceries', icon: 'shopping-cart', desc: 'Purchases of food and household consumables from stores or markets.' },
    { id: 'Dining', label: 'Dining Out', icon: 'utensils', desc: 'Meals and drinks purchased at restaurants, cafés, or takeout.' },
    { id: 'Transport', label: 'Transportation', icon: 'car', desc: 'Public transport, fuel, ride-hailing, parking fees.' },
    { id: 'Personal', label: 'Personal Care', icon: 'sparkles', desc: 'Haircuts, toiletries, cosmetics, grooming services.' },
    { id: 'Clothing', label: 'Clothing & Apparel', icon: 'shirt', desc: 'Clothes, shoes, accessories purchases.' },
    // Bills & Utilities
    { id: 'Housing', label: 'Housing', icon: 'home', desc: 'Rent, mortgage payments, property maintenance.' },
    { id: 'Utilities', label: 'Utilities', icon: 'zap', desc: 'Electricity, water, gas bills.' },
    { id: 'Internet', label: 'Internet & Phone', icon: 'wifi', desc: 'Mobile plans, broadband, landline services.' },
    { id: 'Subs', label: 'Subscriptions', icon: 'clock', desc: 'Streaming services, software subscriptions, memberships.' },
    { id: 'Insurance', label: 'Insurance', icon: 'shield-alert', desc: 'Health, home, auto, or life insurance premiums.' },
    // Leisure
    { id: 'Fun', label: 'Entertainment', icon: 'ticket', desc: 'Movies, concerts, events, amusement parks.' },
    { id: 'Hobbies', label: 'Hobbies', icon: 'palette', desc: 'Books, games, crafts, and leisure activities.' },
    { id: 'Travel', label: 'Travel & Holidays', icon: 'plane', desc: 'Flights, hotels, tours, and vacation expenses.' },
    { id: 'Sport', label: 'Sports & Fitness', icon: 'dumbbell', desc: 'Gym memberships, sports equipment, fitness classes.' },
    // Financial Goals
    { id: 'Debt', label: 'Debt Repayment', icon: 'credit-card', desc: 'Loan payments, credit card repayments.' },
    { id: 'Edu', label: 'Education & Self-Development', icon: 'graduation-cap', desc: 'Tuition, courses, certifications, training.' },
    // Health
    { id: 'Medical', label: 'Medical & Dental', icon: 'stethoscope', desc: 'Doctor visits, hospital bills, dental care, prescriptions.' },
    { id: 'HealthIns', label: 'Health Insurance', icon: 'shield-plus', desc: 'Health insurance premiums and co-pays.' },
    { id: 'Wellness', label: 'Wellness', icon: 'leaf', desc: 'Spa, therapy, supplements, wellness programs.' },
    // Giving
    { id: 'Donate', label: 'Donations', icon: 'heart', desc: 'Contributions to charities, NGOs, or causes.' },
    { id: 'Family', label: 'Family Support', icon: 'users', desc: 'Allowances, remittances, or financial help to family.' },
    // Business
    { id: 'Office', label: 'Office Supplies', icon: 'paperclip', desc: 'Stationery, office equipment, work tools.' },
    { id: 'Pro', label: 'Professional Services', icon: 'briefcase', desc: 'Accounting, legal, consulting fees.' },
    { id: 'Ads', label: 'Marketing & Advertising', icon: 'megaphone', desc: 'Ads, promotions, marketing campaigns.' },
    { id: 'BizTravel', label: 'Business Travel', icon: 'luggage', desc: 'Transport, accommodation for work trips.' },
    // Other
    { id: 'Emergency', label: 'Unexpected Expenses', icon: 'alert-triangle', desc: 'Emergency repairs, sudden costs.' },
    { id: 'Misc', label: 'Miscellaneous', icon: 'box', desc: 'Anything that doesn\'t fit other categories.' }
  ],
  'Income': [
    { id: 'Salary', label: 'Salary / Wages', icon: 'banknote', desc: 'Regular pay from employment, including bonuses and overtime.' },
    { id: 'BizIncome', label: 'Business Income', icon: 'trending-up', desc: 'Revenue from self-employment, freelancing, or business sales.' },
    { id: 'RentIncome', label: 'Rental Income', icon: 'key', desc: 'Money earned from renting out property or equipment.' },
    { id: 'InvestIncome', label: 'Investment Income', icon: 'line-chart', desc: 'Dividends, interest, or profits from investments.' },
    { id: 'Gift', label: 'Gifts & Grants', icon: 'gift', desc: 'Monetary gifts, scholarships, or grants received.' },
    { id: 'Refund', label: 'Refunds & Rebates', icon: 'refresh-ccw', desc: 'Money returned from overpayment, tax refunds, or store rebates.' },
    { id: 'LoanIn', label: 'Loan Received', icon: 'hand-coins', desc: 'Loan, borrowed money.' }
  ],
  'Transfer': [
    { id: 'Bank', label: 'Bank Transfer', icon: 'landmark', desc: 'Moving funds between bank accounts.' },
    { id: 'CashOut', label: 'Cash Withdrawal', icon: 'wallet', desc: 'Taking cash from bank account to wallet.' },
    { id: 'CashIn', label: 'Cash Deposit', icon: 'landmark', desc: 'Depositing cash into a bank account.' },
    { id: 'Topup', label: 'E-Wallet Top-Up', icon: 'smartphone', desc: 'Adding funds from bank to e-wallet.' },
    { id: 'Withdraw', label: 'E-Wallet Withdrawal', icon: 'banknote', desc: 'Moving funds from e-wallet to bank.' },
    { id: 'Internal', label: 'Internal Transfer', icon: 'repeat', desc: 'Any other internal movement between your own accounts.' },
    { id: 'Trust', label: 'Custody / Trust Money', icon: 'shield', desc: 'Custody, trust money from others.' }
  ],
  'Savings': [
    { id: 'Save', label: 'Savings', icon: 'piggy-bank', desc: 'Money set aside for emergency fund or future needs.' }
  ],
  'Investment': [
    { id: 'Invest', label: 'Investments', icon: 'bar-chart-3', desc: 'Purchases of stocks, bonds, crypto, or other assets.' }
  ]
};

const categoryInput = document.getElementById('category-input');
const categoryList = document.getElementById('category-list');
const categoryIconContainer = document.getElementById('category-icon-container');

function updateCategories(type) {
  const list = categories[type] || [];
  categoryList.innerHTML = list.map(cat => `<option value="${cat.label}">${cat.desc}</option>`).join('');
  
  // Set the first item of the new list as default selection and update icon
  if (list.length > 0) {
    categoryInput.value = list[0].label;
    updateCategoryIcon(list[0].label);
  }
}

function updateCategoryIcon(label) {
  let found = null;
  // Look through all category types
  Object.values(categories).forEach(group => {
    const item = group.find(c => c.label === label);
    if (item) found = item;
  });

  if (found && categoryIconContainer) {
    categoryIconContainer.innerHTML = `<i data-lucide="${found.icon}" style="width: 18px; color: var(--accent);"></i>`;
    lucide.createIcons();
  }
}

categoryInput.addEventListener('input', (e) => {
  updateCategoryIcon(e.target.value);
});

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update button states
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const type = btn.dataset.type;
    
    // Update Category Filtering
    updateCategories(type);

    // Update Account Visibility
    if (type === 'Income') {
      paymentGroup.style.display = 'none';
      receivedGroup.style.display = 'flex';
    } else if (type === 'Transfer' || type === 'Savings' || type === 'Investment') {
      paymentGroup.style.display = 'flex';
      receivedGroup.style.display = 'flex';
    } else { // Expense
      paymentGroup.style.display = 'flex';
      receivedGroup.style.display = 'none';
    }
  });
});

// Initial load
updateCategories('Expense');

// Handle Cleared Status (Button Group)
const clearedButtons = document.querySelectorAll('#cleared-selector .type-btn');
clearedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    clearedButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Handle Currency Change
currencyInput.addEventListener('change', (e) => {
  const currency = e.target.value.trim().toUpperCase();
  const datalist = document.getElementById('currency-list');
  const existingOptions = Array.from(datalist.options).map(opt => opt.value);
  
  if (currency && !existingOptions.includes(currency)) {
    const newOption = document.createElement('option');
    newOption.value = currency;
    datalist.appendChild(newOption);
  }
  
  // Update exchange rate visibility
  updateExchangeVisibility(currency);
});

currencyInput.addEventListener('input', (e) => {
  updateExchangeVisibility(e.target.value.trim().toUpperCase());
});

function updateExchangeVisibility(currency) {
  if (currency !== 'IDR' && currency !== '') {
    exchangeRateGroup.style.display = 'flex';
  } else {
    exchangeRateGroup.style.display = 'none';
  }
}

// Handle Picker Triggers
const dateInput = document.getElementById('transaction-date');
const timeInput = document.getElementById('transaction-time');

dateInput.addEventListener('click', () => {
  try { dateInput.showPicker(); } catch (e) {}
});

timeInput.addEventListener('click', () => {
  try { timeInput.showPicker(); } catch (e) {}
});

// Function to update the view
function updateStep(step) {
  currentStep = step;

  // Update tabs
  tabs.forEach(tab => {
    tab.classList.toggle('active', parseInt(tab.dataset.step) === step);
  });

  // Update content
  stepContents.forEach(content => {
    content.classList.toggle('active', parseInt(content.id.split('-')[1]) === step);
  });

  // Update buttons
  prevBtn.style.display = step === 1 ? 'none' : 'flex';

  if (step === totalSteps) {
    nextBtn.innerHTML = 'Save <i data-lucide="check" style="width: 16px;"></i>';
  } else {
    nextBtn.innerHTML = 'Next <i data-lucide="chevron-right" style="width: 16px;"></i>';
  }

  // Re-create icons for the dynamic button content
  lucide.createIcons();

  // Scroll active tab into view
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

// Event Listeners
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    updateStep(parseInt(tab.dataset.step));
  });
});

function showToast(message, type = 'success', iconName = 'check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  let typeClass = '';
  if (type === 'warning') typeClass = 'toast-warning';
  if (type === 'danger') typeClass = 'toast-danger';

  toast.className = `toast ${typeClass}`;
  toast.innerHTML = `<i data-lucide="${iconName}" style="width: 20px;"></i> <span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function isFormDirty() {
  const merchant = document.getElementById('merchant-input')?.value || '';
  const item = document.getElementById('item-input')?.value || '';
  const amount = document.getElementById('amount-input')?.value || '0';
  const desc = document.getElementById('transaction-description')?.value || '';
  
  // Basic check: if anything significant is filled
  return (merchant && merchant !== 'Pertashop Sambiroto') || 
         (item && item !== 'Pertamax') || 
         (parseFloat(amount.replace(/,/g, '')) > 0) || 
         (desc.trim() !== '');
}

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');
const previewCard = document.querySelector('.preview-card');

// Global Action Buttons
const dismissBtn = document.getElementById('dismiss-btn');
const cancelBtn = document.getElementById('cancel-btn');
const confirmModal = document.getElementById('confirm-modal');
const confirmDiscardBtn = document.getElementById('confirm-discard');
const cancelDiscardBtn = document.getElementById('cancel-discard');

if (previewCard) {
  previewCard.addEventListener('click', () => {
    const src = document.getElementById('receipt-img')?.src;
    if (src && lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      lightboxModal.style.display = 'flex';
      lucide.createIcons();
    }
  });
}

if (closeLightbox) {
  closeLightbox.onclick = () => {
    lightboxModal.style.display = 'none';
  };
}

// Close lightbox on backdrop click
if (lightboxModal) {
  lightboxModal.onclick = (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.style.display = 'none';
    }
  }
}

function handleFormExit(actionLabel) {
  if (isFormDirty()) {
    confirmModal.style.display = 'flex';
    lucide.createIcons();
  } else {
    showToast(`${actionLabel} successfully.`, 'warning', 'check-circle');
  }
}

if (dismissBtn) {
  dismissBtn.addEventListener('click', () => handleFormExit('Dismissed'));
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => handleFormExit('Cancelled'));
}

if (cancelDiscardBtn) {
  cancelDiscardBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
  });
}

if (confirmDiscardBtn) {
  confirmDiscardBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
    showToast('Changes discarded.', 'warning', 'trash-2');
    // Optionally: reset form or reload
    // location.reload(); 
  });
}

function validateStep(step) {
  if (step === 1) {
    const date = document.getElementById('transaction-date').value;
    const time = document.getElementById('transaction-time').value;
    const author = document.getElementById('author-input').value;
    if (!date) { showToast('Transaction Date is required.', 'danger', 'alert-triangle'); return false; }
    if (!time) { showToast('Transaction Time is required.', 'danger', 'alert-triangle'); return false; }
    if (!author) { showToast('Author is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 2) {
    const paymentAccount = document.getElementById('payment-account').value;
    const receivedAccount = document.getElementById('received-account').value;
    const currency = document.getElementById('currency-input').value;
    const type = document.querySelector('#type-selector .type-btn.active').dataset.type;

    if (paymentGroup.style.display !== 'none' && !paymentAccount) {
      showToast('Payment Account is required.', 'danger', 'alert-triangle');
      return false;
    }
    if (receivedGroup.style.display !== 'none' && !receivedAccount) {
      showToast('Received Account is required.', 'danger', 'alert-triangle');
      return false;
    }
    if (!currency) { showToast('Currency is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 3) {
    const category = document.getElementById('category-input').value;
    if (!category) { showToast('Category is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 4) {
    const itemName = document.getElementById('item-input').value;
    const quantity = document.getElementById('quantity-input').value;
    const scale = document.getElementById('item-scale').value;
    if (!itemName) { showToast('Item Name is required.', 'danger', 'alert-triangle'); return false; }
    if (!quantity || parseFloat(quantity) <= 0) { showToast('Quantity must be greater than 0.', 'danger', 'alert-triangle'); return false; }
    if (!scale) { showToast('Scale (Unit) is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 5) {
    const amount = document.getElementById('amount-input').value;
    if (!amount || parseFloat(amount.replace(/,/g, '')) <= 0) { 
      showToast('Amount must be greater than 0.', 'danger', 'alert-triangle'); 
      return false; 
    }
  }
  return true;
}

function showTransactionDetail() {
  const formContainer = document.querySelector('.container:not(#detail-view)');
  const detailView = document.getElementById('detail-view');
  
  // Data Extraction
  const itemName = document.getElementById('item-input')?.value || 'Item';
  const quantity = parseFloat(document.getElementById('quantity-input')?.value) || 0;
  const scale = document.getElementById('item-scale')?.value || '';
  const amountVal = parseFloat(document.getElementById('amount-input')?.value.replace(/,/g, '')) || 0;
  const discountVal = parseFloat(document.getElementById('discount-input')?.value.replace(/,/g, '')) || 0;
  const feeVal = parseFloat(document.getElementById('fee-input')?.value.replace(/,/g, '')) || 0;
  const totalDisplay = document.getElementById('total-display')?.innerText || 'Rp 0.00';
  
  const merchant = document.getElementById('merchant-input')?.value || 'Merchant';
  const categoryLabel = document.getElementById('category-input')?.value || 'General';
  const categoryIcon = document.querySelector('#category-icon-container i')?.dataset.lucide || 'box';
  const paymentAcc = document.getElementById('payment-account')?.value || '-';
  const receivedAcc = document.getElementById('received-account')?.value || '-';
  const dateVal = document.getElementById('transaction-date')?.value || '';
  const timeVal = document.getElementById('transaction-time')?.value || '';
  const statusActive = document.querySelector('#cleared-selector .type-btn.active')?.dataset.type || 'Cleared';

  // Receipt Breakdown HTML Generation
  const subtotal = quantity * amountVal;
  const format = (num) => 'Rp ' + num.toLocaleString('en-US', { minimumFractionDigits: 2 });
  
  let receiptHTML = `
    <div style="display: flex; justify-content: space-between; opacity: 0.7;">
      <span>${itemName} <span style="font-size: 0.75rem;">(x${quantity}${scale})</span></span>
      <span>${format(amountVal)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-weight: 600;">
      <span>Subtotal</span>
      <span>${format(subtotal)}</span>
    </div>
  `;

  if (discountVal > 0) {
    receiptHTML += `
      <div style="display: flex; justify-content: space-between; color: #ef4444;">
        <span>Promo Discount</span>
        <span>- ${format(discountVal)}</span>
      </div>
    `;
  }

  if (feeVal > 0) {
    receiptHTML += `
      <div style="display: flex; justify-content: space-between; color: #f59e0b;">
        <span>Additional Fee</span>
        <span>+ ${format(feeVal)}</span>
      </div>
    `;
  }

  receiptHTML += `
    <div style="margin-top: 0.5rem; border-top: 1px dashed var(--border); padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: 800; color: var(--accent); font-size: 1rem;">
      <span>Grand Total</span>
      <span>${totalDisplay}</span>
    </div>
  `;

  const getChips = (wrapperId) => {
    const chips = Array.from(document.querySelectorAll(`#${wrapperId} .chip span`)).map(s => s.innerText);
    if (chips.length === 0) return `<span style="color: var(--text-secondary); font-size: 0.8125rem;">-</span>`;
    return chips.map(tag => `<div class="chip" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">${tag}</div>`).join('');
  };

  // Date/Time
  let dateFinal = '-';
  if (dateVal) {
    const d = new Date(dateVal + 'T' + (timeVal || '00:00'));
    dateFinal = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
  }

  // Populate
  document.getElementById('detail-item-name').innerText = itemName;
  document.getElementById('detail-total').innerText = totalDisplay;
  document.getElementById('receipt-summary').innerHTML = receiptHTML;
  document.getElementById('detail-merchant').innerText = merchant;
  document.getElementById('detail-category').innerHTML = `<i data-lucide="${categoryIcon}" style="width: 16px;"></i> ${categoryLabel}`;
  document.getElementById('detail-account').innerText = receivedAcc !== '-' ? `${paymentAcc} → ${receivedAcc}` : paymentAcc;
  document.getElementById('detail-date').innerText = dateFinal;
  document.getElementById('detail-status').innerHTML = statusActive === 'Cleared' 
    ? `<span style="color: #22c55e; display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width:14px;"></i> Cleared</span>` 
    : `<span style="color: #ef4444; display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="alert-circle" style="width:14px;"></i> Uncleared</span>`;
  document.getElementById('detail-tags-list').innerHTML = getChips('tags-wrapper');
  document.getElementById('detail-projects-list').innerHTML = getChips('projects-wrapper');

  // Switch View
  if (formContainer) formContainer.style.display = 'none';
  detailView.style.display = 'flex';
  lucide.createIcons();

  // Share Actions logic
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      const shareData = {
        title: 'Transaction Details',
        text: `Transaction saved: ${itemName} for ${totalDisplay} at ${merchant}!`,
        url: window.location.href
      };
      
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          showToast('Share options: WhatsApp, Instagram, or Copy Link', 'warning', 'share-2');
        }
      } catch (err) {}
    };
  }
}

// Detail View Actions
const btnDoneView = document.getElementById('btn-done');
const btnCloseDetailView = document.getElementById('close-detail');
if (btnDoneView) btnDoneView.onclick = () => location.reload();
if (btnCloseDetailView) btnCloseDetailView.onclick = () => location.reload();

nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (!validateStep(currentStep)) return;

  if (currentStep < totalSteps) {
    updateStep(currentStep + 1);
  } else {
    // Construct dynamic success message (Toast)
    const itemName = document.getElementById('item-input')?.value || 'Item';
    const merchant = document.getElementById('merchant-input')?.value || 'Merchant';
    const quantity = document.getElementById('quantity-input')?.value || '0';
    const scale = document.getElementById('item-scale')?.value || '';
    const date = document.getElementById('transaction-date')?.value || '';
    const time = document.getElementById('transaction-time')?.value || '';
    
    let dateStr = date + ' ' + time;
    try {
      if (date) {
        const d = new Date(date + 'T' + (time || '00:00'));
        dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
      }
    } catch (err) {}

    const successMsg = `${quantity} ${scale} ${itemName} has been successfully saved in the ${merchant} at ${dateStr}!`;
    showToast(successMsg);
    
    // Show Summary Detail View
    setTimeout(showTransactionDetail, 1200);
  }
});

prevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentStep > 1) {
    updateStep(currentStep - 1);
  }
});


// Number formatting logic
const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 10
});

const simpleNumberFormatter = (val) => {
  if (!val) return '0.00';
  
  // Clean value but keep the decimal point
  let cleanVal = val.toString().replace(/,/g, '');
  let num = parseFloat(cleanVal);
  if (isNaN(num)) return '0.00';

  // Format with grouping but allow up to 10 decimals
  return numberFormatter.format(num);
};

// Add formatting listeners to all numeric fields
const numericInputs = document.querySelectorAll('.number-input');

function setupInputFormatting(input) {
  input.addEventListener('blur', (e) => {
    e.target.value = simpleNumberFormatter(e.target.value);
  });
  
  // Initial format from load
  if (input.value) input.value = simpleNumberFormatter(input.value);
}

numericInputs.forEach(setupInputFormatting);

// Calculation logic
const quantityInput = document.getElementById('quantity-input');
const amountInput = document.getElementById('amount-input');
const discountInput = document.getElementById('discount-input');
const feeInput = document.getElementById('fee-input');
const totalDisplay = document.getElementById('total-display');
const breakdownDisplay = document.getElementById('calculation-breakdown');
const itemScale = document.getElementById('item-scale');

const totalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function calculateTotal() {
  const qStr = quantityInput.value.replace(/,/g, '') || '0';
  const aStr = amountInput.value.replace(/,/g, '') || '0';
  const dStr = discountInput.value.replace(/,/g, '') || '0';
  const fStr = feeInput.value.replace(/,/g, '') || '0';

  const q = parseFloat(qStr) || 0;
  const a = parseFloat(aStr) || 0;
  const d = parseFloat(dStr) || 0;
  const f = parseFloat(fStr) || 0;

  const total = (q * a) - d + f;
  
  // Format breakdown: (Quantity Scale x Amount) - Discount + Fee
  const unit = itemScale.value || 'pcs';
  breakdownDisplay.innerText = `(${q.toLocaleString('en-US', {maximumFractionDigits: 10})} ${unit} x Rp ${a.toLocaleString()}) - Rp ${d.toLocaleString()} + Rp ${f.toLocaleString()}`;
  
  // Update total (2 decimals)
  totalDisplay.innerText = totalFormatter.format(total);
}

// Add listeners for live calculation
[quantityInput, amountInput, discountInput, feeInput, itemScale].forEach(el => {
  el.addEventListener('input', calculateTotal);
  el.addEventListener('change', calculateTotal);
});

// Simple number increment/decrement simulation
document.querySelectorAll('.number-input-group').forEach(group => {
  const input = group.querySelector('.number-input');
  const minus = group.querySelector('[data-lucide="minus"]')?.closest('.num-btn');
  const plus = group.querySelector('[data-lucide="plus"]')?.closest('.num-btn');

  if (minus && plus) {
    minus.onclick = () => {
      let val = parseFloat(input.value.replace(/,/g, '')) || 0;
      input.value = numberFormatter.format(Math.max(0, val - 1));
      calculateTotal();
    };
    plus.onclick = () => {
      let val = parseFloat(input.value.replace(/,/g, '')) || 0;
      input.value = numberFormatter.format(val + 1);
      calculateTotal();
    };
  }
});

// Update initial total
calculateTotal();

// Multi-select Tags Logic
function setupTagInput(wrapperId) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const input = wrapper.querySelector('input');
  if (!input) return;

  const addTag = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    
    // Prevent duplicates
    const existing = Array.from(wrapper.querySelectorAll('.chip')).map(c => c.dataset.value);
    if (existing.includes(trimmed)) {
      input.value = ''; // Just clear and ignore
      return;
    }

    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.dataset.value = trimmed;
    chip.innerHTML = `<span>${trimmed}</span><i data-lucide="x" style="width: 12px; cursor: pointer;"></i>`;
    
    chip.querySelector('i').onclick = (e) => {
      e.stopPropagation();
      chip.remove();
    };

    wrapper.insertBefore(chip, input);
    lucide.createIcons();
    input.value = ''; // CLEAR AFTER ADDING
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input.value);
    }
    if (e.key === 'Backspace' && !input.value) {
      const chips = wrapper.querySelectorAll('.chip');
      if (chips.length > 0) chips[chips.length - 1].remove();
    }
  });

  input.addEventListener('input', (e) => {
    const val = input.value;
    const listId = input.getAttribute('list');
    if (!listId) return;
    const list = document.getElementById(listId);
    if (list) {
      const options = Array.from(list.options).map(o => o.value);
      if (options.includes(val)) {
        addTag(val);
      }
    }
  });

  wrapper.onclick = () => input.focus();
}

setupTagInput('tags-wrapper');
setupTagInput('projects-wrapper');

// Mock history for auto-fill based on Item Name
const itemHistory = {
  'Pertamax': { amount: 12200, scale: 'L', discount: 0, fee: 0 },
  'Car Wash': { amount: 50000, scale: 'trans', discount: 0, fee: 0 },
  'Coffee Latte': { amount: 35000, scale: 'cup', discount: 5000, fee: 0 },
  'Gaming Subscription': { amount: 150000, scale: 'subs', discount: 0, fee: 2500 }
};

const itemInput = document.getElementById('item-input');
// (quantityInput, amountInput, etc. are already declared at line 287)

function updatePriceInsight() {
  const insight = document.getElementById('price-insight');
  if (!insight || !itemInput) return;

  const itemName = itemInput.value;
  const currentVal = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
  const history = itemHistory[itemName];

  if (history && currentVal > 0) {
    const diff = currentVal - history.amount;
    if (diff === 0) {
      insight.style.display = 'none';
    } else {
      insight.style.display = 'flex';
      const isUp = diff > 0;
      const color = isUp ? '#ef4444' : '#22c55e';
      const icon = isUp ? 'trending-up' : 'trending-down';
      const text = isUp ? 'more expensive' : 'cheaper';
      
      const diffFormatted = Math.abs(diff).toLocaleString();
      insight.style.color = color;
      insight.innerHTML = `<i data-lucide="${icon}" style="width: 14px;"></i> <span>Rp ${diffFormatted} ${text} than last time</span>`;
      lucide.createIcons();
    }
  } else {
    insight.style.display = 'none';
  }
}

if (itemInput) {
  itemInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const history = itemHistory[val];
    
    if (quantityInput) quantityInput.value = '1';
    if (receiptInput) receiptInput.value = '';
    if (receiptPreview) receiptPreview.style.display = 'none';

    if (history) {
      if (amountInput) amountInput.value = history.amount;
      if (itemScale) itemScale.value = history.scale;
      if (discountInput) discountInput.value = history.discount;
      if (feeInput) feeInput.value = history.fee;
      calculateTotal();
    }
    updatePriceInsight(); // NEW
  });
}

if (amountInput) {
  amountInput.addEventListener('input', updatePriceInsight);
}

if (receiptInput) {
  receiptInput.addEventListener('input', (e) => {
    receiptPreview.style.display = e.target.value.includes('Indomaret') ? 'block' : 'none';
  });
  
  // Initial
  receiptPreview.style.display = receiptInput.value.includes('Indomaret') ? 'block' : 'none';
}
