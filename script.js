// Initialize Lucide icons
lucide.createIcons();

// State management
let currentStep = 1;
const totalSteps = 7;
let editId = null;
let mode = null;

// URL Parameter Handling
const urlParams = new URLSearchParams(window.location.search);
mode = urlParams.get('mode');
editId = urlParams.get('id');

// Select elements
const tabs = document.querySelectorAll('.tab');
const stepContents = document.querySelectorAll('.step-content');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const currencyInput = document.getElementById('currency-input');
const itemInput = document.getElementById('item-input');
const merchantInput = document.getElementById('merchant-input');
const amountInput = document.getElementById('amount-input');
const quantityInput = document.getElementById('quantity-input');
const itemScale = document.getElementById('item-scale');
const discountInput = document.getElementById('discount-input');
const feeInput = document.getElementById('fee-input');
const receiptInput = document.getElementById('receipt-input');
const receiptPreview = document.getElementById('receipt-preview');

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

if (categoryInput) {
  categoryInput.addEventListener('input', (e) => {
    updateCategoryIcon(e.target.value);
  });
}

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

// Initial load & Prefill
updateCategories('Expense');

// Default Author from User Profile
const authorInput = document.getElementById('author-input');
if (authorInput && !editId) {
  const ps = JSON.parse(localStorage.getItem('user_prefs') || '{"name":"Alex Doe"}');
  authorInput.value = ps.name || 'Alex Doe';
}

if (editId) {
  const db = JSON.parse(localStorage.getItem('transactions') || '[]');
  const tx = db.find(t => t.id == editId);
  if (tx) {
    if (document.getElementById('transaction-date')) document.getElementById('transaction-date').value = tx.date;
    if (document.getElementById('transaction-time')) document.getElementById('transaction-time').value = tx.time;
    if (document.getElementById('merchant-input')) document.getElementById('merchant-input').value = tx.merchant || '';
    if (document.getElementById('item-input')) document.getElementById('item-input').value = tx.name || '';
    if (document.getElementById('category-input')) {
        document.getElementById('category-input').value = tx.category;
        updateCategoryIcon(tx.category);
    }
    
    // Type Select
    typeButtons.forEach(btn => {
      if (btn.dataset.type === tx.type) {
        btn.click();
      }
    });

    // Amount & Details
    if (document.getElementById('amount-input')) document.getElementById('amount-input').value = tx.price || tx.amount;
    if (tx.qty && document.getElementById('quantity-input')) document.getElementById('quantity-input').value = tx.qty;
    if (tx.scale && document.getElementById('item-scale')) document.getElementById('item-scale').value = tx.scale;
    if (tx.discount && document.getElementById('discount-input')) document.getElementById('discount-input').value = tx.discount;
    if (tx.fee && document.getElementById('fee-input')) document.getElementById('fee-input').value = tx.fee;
    if (tx.author && document.getElementById('author-input')) document.getElementById('author-input').value = tx.author;
    if (tx.description && document.getElementById('transaction-description')) document.getElementById('transaction-description').value = tx.description;
    if (tx.currency && document.getElementById('currency-input')) {
        document.getElementById('currency-input').value = tx.currency;
        updateExchangeVisibility(tx.currency);
    }
    if (tx.accountPayment && document.getElementById('payment-account')) document.getElementById('payment-account').value = tx.accountPayment;
    if (tx.accountReceived && document.getElementById('received-account')) document.getElementById('received-account').value = tx.accountReceived;
    
    // Chips
    if (tx.tags) tx.tags.forEach(tag => addChip('tags-wrapper', tag));
    if (tx.projects) tx.projects.forEach(p => addChip('projects-wrapper', p));

    // Cleared status
    const clearedBtns = document.querySelectorAll('#cleared-selector .type-btn');
    clearedBtns.forEach(btn => {
      const isYes = btn.dataset.cleared === 'yes';
      if ((tx.cleared && isYes) || (!tx.cleared && !isYes)) {
        btn.click();
      }
    });

    if (mode === 'edit') {
      document.querySelector('.header-title span').innerText = 'Edit Transaction';
    } else {
      editId = null; // Don't update original if duplicating
      document.querySelector('.header-title span').innerText = 'Duplicate Transaction';
    }
  }
}

// Handle Cleared Status (Button Group)
const clearedButtons = document.querySelectorAll('#cleared-selector .type-btn');
clearedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    clearedButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Handle Currency Change
if (currencyInput) {
  currencyInput.addEventListener('change', (e) => {
    const currency = e.target.value.trim().toUpperCase();
    const datalist = document.getElementById('currency-list');
    const existingOptions = Array.from(datalist.options).map(opt => opt.value);
    
    if (currency && !existingOptions.includes(currency)) {
      const newOption = document.createElement('option');
      newOption.value = currency;
      if (datalist) datalist.appendChild(newOption);
    }
    
    // Update exchange rate visibility
    updateExchangeVisibility(currency);
  });

  currencyInput.addEventListener('input', (e) => {
    updateExchangeVisibility(e.target.value.trim().toUpperCase());
  });
}

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

if (dateInput) {
  dateInput.addEventListener('click', () => {
    try { dateInput.showPicker(); } catch (e) {}
  });
}

if (timeInput) {
  timeInput.addEventListener('click', () => {
    try { timeInput.showPicker(); } catch (e) {}
  });
}



//// Function to update the view
function updateStep(step) {
  if (step < 1 || step > totalSteps) return;
  currentStep = step;

  // Re-query current page elements to ensure synchronization
  const localTabs = document.querySelectorAll('.tab');
  const localContents = document.querySelectorAll('.step-content');

  // Update tabs (breadcrumbs)
  localTabs.forEach(tab => {
    const tabStep = parseInt(tab.dataset.step);
    if (!tabStep) return;
    
    if (tabStep < step) {
      tab.classList.add('completed');
      tab.classList.remove('active');
    } else if (tabStep === step) {
      tab.classList.remove('completed');
      tab.classList.add('active');
    } else {
      tab.classList.remove('completed', 'active');
    }
  });

  // Update step contents
  localContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === `step-${step}`) {
      content.classList.add('active');
    }
  });

  // Re-create icons for the dynamic button content
  lucide.createIcons();

  // Scroll active tab into view
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function adjustNum(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  let curr = parseFloat(el.value.replace(/,/g, '')) || 0;
  el.value = (curr + val).toString();
  el.dispatchEvent(new Event('input'));
}
window.adjustNum = adjustNum;


// Event Listeners (Tabs handled at end of script)

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

// Optimized Suggestion Datalist Mapping
if (itemInput) {
  const catalog = JSON.parse(localStorage.getItem('items') || '[]');
  const list = document.getElementById('item-list');
  if (list) {
     list.innerHTML = catalog.map(i => {
        const meta = [i.manu, i.model, i.sku].filter(x => x).join(' • ');
        return `<option value="${i.name}">${meta}</option>`;
     }).join('');
  }
}

function validateItemName() {
  const val = itemInput.value.toLowerCase().trim();
  const suggestionBox = document.getElementById('item-suggestion');
  const suggestedNameEl = document.getElementById('suggested-item-name');
  
  if (val.length < 2) {
    if (suggestionBox) suggestionBox.style.display = 'none';
    return;
  }

  const catalog = JSON.parse(localStorage.getItem('items') || '[]');
  const match = catalog.find(i => 
    (i.name.toLowerCase().includes(val) || 
     (i.sku && i.sku.toLowerCase().includes(val)) || 
     (i.model && i.model.toLowerCase().includes(val)) || 
     (i.notes && i.notes.toLowerCase().includes(val))) &&
     i.name.toLowerCase() !== val
  );

  if (match) {
    if (suggestedNameEl) suggestedNameEl.innerText = match.name;
    if (suggestionBox) suggestionBox.style.display = 'block';
    
    if (suggestedNameEl) {
      suggestedNameEl.onclick = () => {
        itemInput.value = match.name;
        if (suggestionBox) suggestionBox.style.display = 'none';
        itemInput.dispatchEvent(new Event('input'));
      };
    }
  } else {
    if (suggestionBox) suggestionBox.style.display = 'none';
  }
}
window.validateItemName = validateItemName;

function validateMerchantName() {
  const val = merchantInput.value.toLowerCase().trim();
  const suggestionBox = document.getElementById('merchant-suggestion');
  const suggestedNameEl = document.getElementById('suggested-merchant-name');
  
  if (val.length < 2) {
    if (suggestionBox) suggestionBox.style.display = 'none';
    return;
  }

  const merchants = JSON.parse(localStorage.getItem('merchants') || '[]');
  const match = merchants.find(m => 
    (m.name.toLowerCase().includes(val) || 
     (m.city && m.city.toLowerCase().includes(val)) || 
     (m.category && m.category.toLowerCase().includes(val))) &&
     m.name.toLowerCase() !== val
  );

  if (match) {
    if (suggestedNameEl) suggestedNameEl.innerText = match.name;
    if (suggestionBox) suggestionBox.style.display = 'block';
    
    if (suggestedNameEl) {
      suggestedNameEl.onclick = () => {
        merchantInput.value = match.name;
        if (suggestionBox) suggestionBox.style.display = 'none';
        merchantInput.dispatchEvent(new Event('input'));
      };
    }
  } else {
    if (suggestionBox) suggestionBox.style.display = 'none';
  }
}
window.validateMerchantName = validateMerchantName;

// Hardware-Accelerated SKU Scanner
const scanBtn = document.getElementById('scan-sku-btn');
const scannerOverlay = document.getElementById('reader-container');
const scannerClose = document.getElementById('close-scanner');
let html5QrCode;

if (scanBtn) {
  scanBtn.onclick = () => {
    scannerOverlay.style.display = 'flex';
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" }, 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        itemInput.value = decodedText;
        stopScanner();
        // Trigger validation and meta-sync
        validateItemName();
        itemInput.dispatchEvent(new Event('input'));
        if (typeof showToast === 'function') showToast(`SKU Scanned: ${decodedText}`, 'success');
      },
      (errorMessage) => {}
    ).catch(err => {
      console.error(err);
      if (typeof showToast === 'function') showToast('Camera access required.', 'error');
      stopScanner();
    });
  };
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      scannerOverlay.style.display = 'none';
    }).catch(() => {
      scannerOverlay.style.display = 'none';
    });
  } else {
    scannerOverlay.style.display = 'none';
  }
}

if (scannerClose) scannerClose.onclick = stopScanner;

// Existing logic remains below...
window.validateItemName = validateItemName;

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
  previewCard.addEventListener('dblclick', (e) => {
    e.preventDefault();
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
    showToast(`${actionLabel} successfully.`, 'warning', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
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
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  });
}

function validateStep(step) {
  // Always permit navigation during Edit Mode
  if (mode === 'edit') return true;

  if (step === 1) { // Date & Time
    const date = document.getElementById('transaction-date').value;
    const time = document.getElementById('transaction-time').value;
    const author = document.getElementById('author-input').value;
    if (!date) { showToast('Transaction Date is required.', 'danger', 'alert-triangle'); return false; }
    if (!time) { showToast('Transaction Time is required.', 'danger', 'alert-triangle'); return false; }
    if (!author) { showToast('Author is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 2) { // Item Details
    const itemName = document.getElementById('item-input').value;
    if (!itemName) { showToast('Item Name is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 3) { // Category & Type
    const category = document.getElementById('category-input').value;
    const type = document.querySelector('#type-selector .type-btn.active')?.dataset.type;
    if (!category) { showToast('Category is required.', 'danger', 'alert-triangle'); return false; }
    if (!type) { showToast('Transaction Type is required.', 'danger', 'alert-triangle'); return false; }
  } else if (step === 4) { // Price & Quantity
    const quantity = document.getElementById('quantity-input').value;
    const amount = document.getElementById('amount-input').value;
    if (!quantity || parseFloat(quantity) <= 0) { showToast('Quantity must be greater than 0.', 'danger', 'alert-triangle'); return false; }
    if (!amount || parseFloat(amount.replace(/,/g, '')) < 0) { 
      showToast('Price must be 0 or more.', 'danger', 'alert-triangle'); 
      return false; 
    }
  } else if (step === 5) { // Accounts
      const type = document.querySelector('#type-selector .type-btn.active').dataset.type;
      const paymentAccount = document.getElementById('payment-account').value;
      const receivedAccount = document.getElementById('received-account').value;

      if (['Expense', 'Transfer', 'Savings', 'Investment'].includes(type) && !paymentAccount) {
        showToast('Payment Account is required.', 'danger', 'alert-triangle');
        return false;
      }
      if (['Income', 'Transfer'].includes(type) && !receivedAccount) {
        showToast('Received Account is required.', 'danger', 'alert-triangle');
        return false;
      }
  } else if (step === 6) { // Description & Tags (no mandatory fields for now)
    // Optional step, no validation needed unless specific fields become mandatory
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
  const statusActive = document.querySelector('#cleared-selector .type-btn.active')?.dataset.cleared || 'no'; // Corrected to dataset.cleared
  // Receipt Breakdown HTML Generation (Thermal Print Aesthetic)
  const subtotal = quantity * amountVal;
  const format = (num) => 'Rp ' + num.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const rowStyle = 'display: flex; justify-content: space-between; font-family: "DM Mono", monospace; font-size: 0.75rem;';
  
  let receiptHTML = `
    <div style="${rowStyle} opacity: 0.8; margin-bottom: 0.25rem;">
      <span>${itemName} [x${quantity}${scale}]</span>
      <span>${format(amountVal)}</span>
    </div>
    <div style="${rowStyle} font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
      <span>Subtotal</span>
      <span>${format(subtotal)}</span>
    </div>
  `;

  if (discountVal > 0) {
    receiptHTML += `
      <div style="${rowStyle} color: #ef4444;">
        <span>Promo Discount</span>
        <span>- ${format(discountVal)}</span>
      </div>
    `;
  }

  if (feeVal > 0) {
    receiptHTML += `
      <div style="${rowStyle} color: #f59e0b;">
        <span>Additional Fee</span>
        <span>+ ${format(feeVal)}</span>
      </div>
    `;
  }

  receiptHTML += `
    <div style="margin-top: 0.75rem; border-top: 1px dashed var(--border); padding-top: 0.75rem; display: flex; justify-content: space-between; font-weight: 800; color: var(--accent); font-size: 1.125rem; font-family: 'DM Mono", monospace;">
      <span>Total Paid</span>
      <span>${totalDisplay}</span>
    </div>
  `;

  const getChips = (wrapperId) => {
    const chipsArr = Array.from(document.querySelectorAll(`#${wrapperId} .chip span`)).map(s => s.innerText);
    if (chipsArr.length === 0) return `<span style="color: var(--text-secondary); font-size: 0.8125rem;">-</span>`;
    return chipsArr.map(tag => `<div class="chip" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">${tag}</div>`).join('');
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
  
  const type = document.querySelector('#type-selector .type-btn.active')?.dataset.type;
  let accountDisplay = '';
  if (type === 'Income') {
    accountDisplay = receivedAcc;
  } else if (type === 'Expense' || type === 'Savings' || type === 'Investment') {
    accountDisplay = paymentAcc;
  } else if (type === 'Transfer') {
    accountDisplay = `${paymentAcc} → ${receivedAcc}`;
  }
  document.getElementById('detail-account').innerText = accountDisplay;

  // Update detail view content
  const statusEl = document.getElementById('detail-status');
  const updateStatusUI = (cleared) => {
    if (!statusEl) return;
    statusEl.innerHTML = cleared === 'yes' 
      ? `<span style="color: #32D74B; display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width:14px;"></i> Cleared</span>` 
      : `<span style="color: #FF453A; display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="alert-circle" style="width:14px;"></i> Uncleared</span>`;
    lucide.createIcons();
  };
  
  updateStatusUI(statusActive);

  // Link Clearing Status Buttons to Logic
  const clearedBtns = document.querySelectorAll('#cleared-selector .type-btn');
  clearedBtns.forEach(btn => {
    btn.onclick = () => {
       clearedBtns.forEach(b => b.classList.remove('active'));
       btn.classList.add('active');
       const newVal = btn.dataset.cleared;
       updateStatusUI(newVal);

       // Update DB
       const txId = mode === 'edit' ? parseInt(editId) : (tx ? tx.id : null);
       if (txId) {
          let db = JSON.parse(localStorage.getItem('transactions') || '[]');
          const idx = db.findIndex(t => t.id == txId);
          if (idx !== -1) {
             db[idx].cleared = (newVal === 'yes');
             localStorage.setItem('transactions', JSON.stringify(db));
             showToast(`Transaction marked as ${newVal === 'yes' ? 'Cleared' : 'Uncleared'}.`, 'info', 'check-circle');
          }
       }
    };
  });

  document.getElementById('detail-tags-list').innerHTML = getChips('tags-wrapper');
  document.getElementById('detail-projects-list').innerHTML = getChips('projects-wrapper');

  // Switch View
  if (formContainer) formContainer.style.display = 'none';
  detailView.style.display = 'flex';
  lucide.createIcons();

  // Share Actions logic (Custom Modal)
  const shareBtn = document.getElementById('btn-share');
  const shareModal = document.getElementById('share-modal');
  const closeShare = document.getElementById('close-share');

  if (shareBtn) {
    shareBtn.onclick = () => {
      shareModal.style.display = 'flex';
      lucide.createIcons();
    };
  }

  if (closeShare) {
    closeShare.onclick = () => {
      shareModal.style.display = 'none';
    };
  }
}

// Detail View Actions
const btnDoneView = document.getElementById('btn-done');
const btnCloseDetailView = document.getElementById('close-detail');
if (btnDoneView) btnDoneView.onclick = () => window.location.href = 'index.html';
if (btnCloseDetailView) btnCloseDetailView.onclick = () => window.location.href = 'index.html';

if (nextBtn) {
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Validate everything in one go since it's a single page flow
    let isAllValid = true;
    for (let s = 1; s <= totalSteps; s++) {
       if (!validateStep(s)) {
          const invalidEl = document.getElementById(`step-${s}`);
          if (invalidEl) invalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          isAllValid = false;
          break;
       }
    }

    if (!isAllValid) return;
  
    if (false) { // Skip step navigation
       // ...
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
      
      // SAVE TO LOCAL STORAGE
      const isCleared = document.querySelector('#cleared-selector .type-btn.active')?.dataset.cleared === 'yes';
      const tx = {
        id: mode === 'edit' ? parseInt(editId) : Date.now(),
        sku: document.getElementById('sku-input')?.value || '',
        name: itemName,
        merchant: merchant,
        amount: parseFloat((document.getElementById('total-display')?.innerText || '0').replace(/[^0-9.-]+/g, "")) || 0,
        price: parseFloat((amountInput?.value || '0').replace(/[^0-9.-]+/g, "")) || 0,
        qty: parseFloat(quantityInput?.value) || 0,
        scale: itemScale?.value || '',
        discount: parseFloat((discountInput?.value || '0').replace(/[^0-9.-]+/g, "")) || 0,
        fee: parseFloat((feeInput?.value || '0').replace(/[^0-9.-]+/g, "")) || 0,
        category: categoryInput?.value || 'Misc',
        type: document.querySelector('#type-selector .type-btn.active')?.dataset.type || 'Expense',
        date: date || new Date().toISOString().split('T')[0],
        time: time || '00:00',
        cleared: isCleared,
        author: document.getElementById('author-input')?.value || '',
        tags: Array.from(document.querySelectorAll('#tags-wrapper .chip span')).map(s => s.innerText),
        projects: Array.from(document.querySelectorAll('#projects-wrapper .chip span')).map(s => s.innerText),
        description: document.getElementById('transaction-description')?.value || '',
        currency: currencyInput?.value || 'IDR',
        exchangeRate: parseFloat((document.getElementById('exchange-rate-input')?.value || '1').replace(/[^0-9.-]+/g, "")) || 1,
        accountPayment: document.getElementById('payment-account')?.value || '',
        accountReceived: document.getElementById('received-account')?.value || '',
        receipt: (receiptInput?.value) ? document.getElementById('receipt-img')?.src : ''
      };
  
      // Merchant database auto-sync
      const mNormalized = (merchant || '').trim();
      if (mNormalized && !['Merchant', 'Placeholder'].includes(mNormalized)) {
          let mList = JSON.parse(localStorage.getItem('merchants') || '[]');
          if (mList.length === 0) {
              mList = [
                  { id: 1, name: 'Abata Donuts & Coffee Yosodipuro', category: 'Food & Beverage', status: 'Active', color: '#8B5CF6', address: 'Jl. Yosodipuro No.52D, Surakarta' },
                  { id: 2, name: 'Supermarket Solo', category: 'Groceries', status: 'Active', color: '#10b981', address: 'Jl. Slamet Riyadi, Surakarta' }
              ];
          }
          const exists = mList.some(m => m.name.toLowerCase() === mNormalized.toLowerCase());
          if (!exists) {
              mList.push({
                  id: Date.now(),
                  name: mNormalized,
                  category: tx.category,
                  status: 'Active',
                  color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
                  address: 'Auto-created from dashboard'
              });
          }
          localStorage.setItem('merchants', JSON.stringify(mList));
      }
  
      // Item database auto-sync
      const iNormalized = (itemName || '').trim();
      if (iNormalized && !['Item', 'Placeholder'].includes(iNormalized)) {
          let iList = JSON.parse(localStorage.getItem('items') || '[]');
          if (iList.length === 0) {
              iList = [
                  { id: 1, name: '3 Ayam Mie Telur Kuning 200 g', category: 'Food & Groceries', status: 'Active', price: 5300, unit: 'pcs' },
                  { id: 2, name: 'Pertamax', category: 'Transport', status: 'Active', price: 13500, unit: 'L' }
              ];
          }
          const exists = iList.some(i => i.name.toLowerCase() === iNormalized.toLowerCase());
          if (!exists) {
              iList.push({
                  id: Date.now(),
                  name: iNormalized,
                  category: tx.category,
                  price: tx.price,
                  unit: tx.scale || 'pcs',
                  status: 'Active',
                  manu: '',
                  model: '',
                  sku: '',
                  notes: 'Auto-created from dashboard'
              });
          }
          localStorage.setItem('items', JSON.stringify(iList));
      }
  
      let db = JSON.parse(localStorage.getItem('transactions') || '[]');
      if (mode === 'edit') {
         const index = db.findIndex(t => t.id == editId);
         if (index !== -1) {
            db[index] = tx;
         } else {
            db.push(tx); // Fallback if record was missing
         }
      } else {
         db.push(tx);
      }
      localStorage.setItem('transactions', JSON.stringify(db));
  
      // CLOUD AUTO-SAVE
      const cloudUrl = localStorage.getItem('cloud_sheet_url');
      if (cloudUrl) {
         console.log(`Auto-saving ${db.length} transactions to cloud...`);
         fetch(cloudUrl, {
            method: 'POST',
            body: JSON.stringify({ transactions: db })
         }).catch(err => console.error('Auto-save failed', err));
      }
  
      // Show Summary Detail View
      setTimeout(showTransactionDetail, 1200);
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  });
}


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
const totalDisplay = document.getElementById('total-display');
const breakdownDisplay = document.getElementById('calculation-breakdown');

function formatInputLive(e) {
  const input = e.target;
  let cursorPosition = input.selectionStart;
  let originalLength = input.value.length;
  
  let val = input.value.replace(/[^0-9.]/g, '');
  const parts = val.split('.');
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
  
  if (val === "") {
    input.value = "";
    return;
  }

  let [intPart, decPart] = val.split('.');
  let formattedInt = intPart === "" ? "" : parseInt(intPart).toLocaleString('en-US');
  
  // If user just typed a dot, we should preserve it
  let finalVal = decPart !== undefined ? formattedInt + "." + decPart : formattedInt;
  input.value = finalVal;
  
  let newLength = input.value.length;
  input.setSelectionRange(cursorPosition + (newLength - originalLength), cursorPosition + (newLength - originalLength));
}

const totalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function calculateTotal() {
  const qStr = (quantityInput?.value || '0').replace(/,/g, '') || '0';
  const aStr = (amountInput?.value || '0').replace(/,/g, '') || '0';
  const dStr = (discountInput?.value || '0').replace(/,/g, '') || '0';
  const fStr = (feeInput?.value || '0').replace(/,/g, '') || '0';
  const exRateStr = (document.getElementById('exchange-rate-input')?.value || '1').replace(/,/g, '') || '1';

  const q = parseFloat(qStr) || 0;
  const a = parseFloat(aStr) || 0;
  const d = parseFloat(dStr) || 0;
  const f = parseFloat(fStr) || 0;
  const exRate = parseFloat(exRateStr) || 1;

  // Calculate In Chosen Currency FIRST, then convert to IDR
  const subtotal = (q * a) - d + f;
  const total = subtotal * exRate;
  
  const unit = itemScale?.value || 'pcs';
  const cur = currencyInput?.value || 'IDR';

  if (breakdownDisplay) {
     let formula = `(${q.toLocaleString('id-ID')} ${unit} x ${cur} ${a.toLocaleString('id-ID')})`;
     if (d > 0) formula += ` - ${cur} ${d.toLocaleString('id-ID')}`;
     if (f > 0) formula += ` + ${cur} ${f.toLocaleString('id-ID')}`;
     if (cur !== 'IDR') formula += ` x Rate ${exRate.toLocaleString('id-ID')}`;
     breakdownDisplay.innerText = formula;
  }
  
  if (totalDisplay) {
     totalDisplay.innerText = totalFormatter.format(total);
  }
}

// Add listeners for live calculation and formatting
const exRateInput = document.getElementById('exchange-rate-input');

[quantityInput, amountInput, discountInput, feeInput, exRateInput].forEach(el => {
  if (el) {
    el.addEventListener('input', (e) => {
       formatInputLive(e);
       calculateTotal();
    });
  }
});

if (itemScale) itemScale.addEventListener('input', calculateTotal);

if (currencyInput) {
  const toggleExchangeRate = () => {
    if (exchangeRateGroup) {
      exchangeRateGroup.style.display = (currencyInput.value !== 'IDR') ? 'block' : 'none';
      lucide.createIcons(); // ensure refresh-cw is drawn
    }
  };
  currencyInput.addEventListener('input', toggleExchangeRate);
  currencyInput.addEventListener('change', toggleExchangeRate);
  // Initial check
  toggleExchangeRate();
}

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

window.addChip = (wrapperId, val) => {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const input = wrapper.querySelector('input');
  const trimmed = val.trim();
  if (!trimmed) return;

  const existing = Array.from(wrapper.querySelectorAll('.chip')).map(c => c.dataset.value);
  if (existing.includes(trimmed)) {
    if (input) input.value = '';
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

  if (input) wrapper.insertBefore(chip, input);
  else wrapper.appendChild(chip);
  lucide.createIcons();
  if (input) input.value = '';
};

// Multi-select Tags Logic
function setupTagInput(wrapperId) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const input = wrapper.querySelector('input');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(wrapperId, input.value);
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
        addChip(wrapperId, val);
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

// (quantityInput, amountInput, etc. are already declared at the top)

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

// Populating Item Suggestions from Global Catalog
const itemSuggestions = document.getElementById('item-list');
const catalogItems = JSON.parse(localStorage.getItem('items') || '[]');

if (itemSuggestions && catalogItems.length > 0) {
  itemSuggestions.innerHTML = catalogItems.map(i => {
    const meta = [i.manu, i.model, i.sku, i.notes].filter(x => x).join(' • ');
    return `<option value="${i.name}">${meta}</option>`;
  }).join('');
}

function handleAutoFill(val) {
   if (!val) return;
   
   // SEARCH THROUGH HISTORY
   const historyDb = JSON.parse(localStorage.getItem('transactions') || '[]');
   // We search from latest to oldest
   const latestMatch = [...historyDb].reverse().find(t => t.name.toLowerCase() === val.toLowerCase());
   
   if (latestMatch) {
      // populate form
      if (latestMatch.type) {
         const typeBtn = Array.from(typeButtons).find(b => b.dataset.type === latestMatch.type);
         if (typeBtn) typeBtn.click();
      }
      if (latestMatch.merchant) merchantInput.value = latestMatch.merchant;
      if (latestMatch.category) {
         categoryInput.value = latestMatch.category;
         updateCategoryIcon(latestMatch.category);
      }
      if (latestMatch.currency) currencyInput.value = latestMatch.currency;
      if (latestMatch.description) {
         const descEl = document.getElementById('transaction-description');
         if (descEl) descEl.value = latestMatch.description;
      }

      // Step 4 Pricing
      if (latestMatch.qty) quantityInput.value = latestMatch.qty;
      if (latestMatch.scale) itemScale.value = latestMatch.scale;
      if (latestMatch.price) amountInput.value = latestMatch.price;
      if (latestMatch.discount) discountInput.value = latestMatch.discount;
      if (latestMatch.fee) feeInput.value = latestMatch.fee;

      calculateTotal();
      updatePriceInsight();
      showToast(`Restored details for "${val}" from history`, 'info', 'wand-2');
      return true;
   }
   return false;
}

if (itemInput) {
  // Use input event for instant reaction when picking from datalist
  itemInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    // Only autofill if the value matches exactly one of our known items in history or catalog
    const historyDbNames = JSON.parse(localStorage.getItem('transactions') || '[]').map(t => t.name.toLowerCase());
    if (historyDbNames.includes(val.toLowerCase())) {
       handleAutoFill(val);
    }
  });

  itemInput.addEventListener('change', (e) => {
    const val = e.target.value.trim();
    if (!val) return;
    handleAutoFill(val);
  });
}

if (amountInput) {
  amountInput.addEventListener('input', updatePriceInsight);
}

if (receiptInput) {
  const updateReceiptPreview = (val) => {
    if (!receiptPreview) return;
    const card = receiptPreview.querySelector('.preview-card');
    const emptyState = document.getElementById('receipt-empty-state');
    const img = document.getElementById('receipt-img');
    const isSpecial = val.includes('Indomaret') || val.includes('Alfamart') || val.includes('Bensin');
    
    if (val.length > 0) {
      if (emptyState) emptyState.style.display = 'none';
      if (card) card.style.display = 'block';
      if (img) {
         img.src = isSpecial ? '/Users/rafieiy/.gemini/antigravity/brain/8433b4ab-9906-4905-b9b7-e56872277bf6/receipt_thumbnail_mockup_1774474517929.png' : val;
      }
    } else {
      if (emptyState) emptyState.style.display = 'block';
      if (card) card.style.display = 'none';
      lucide.createIcons();
    }
  };

  receiptInput.addEventListener('input', (e) => updateReceiptPreview(e.target.value));
  updateReceiptPreview(receiptInput.value);
}

function populateDatalists() {
  const txDb = JSON.parse(localStorage.getItem('transactions') || '[]');
  const mDb = JSON.parse(localStorage.getItem('merchants') || '[]');
  const iDb = JSON.parse(localStorage.getItem('items') || '[]');
  
  // Merchant list
  const merchantSet = new Set(mDb.map(m => m.name));
  txDb.forEach(t => { if (t.merchant) merchantSet.add(t.merchant); });
  const mList = document.getElementById('merchant-list');
  if (mList) mList.innerHTML = Array.from(merchantSet).map(m => `<option value="${m}">`).join('');

  // Currency list (International Standards)
  const currencies = [
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'CHF', name: 'Swiss Franc' }
  ];
  const curList = document.getElementById('currency-list');
  if (curList) curList.innerHTML = currencies.map(c => `<option value="${c.code}">${c.name}</option>`).join('');

  // Scale list (Metric & Common Units)
  const scales = [
    { name: 'pcs', desc: 'pieces (satuan)' },
    { name: 'kg', desc: 'kilogram (berat)' },
    { name: 'g', desc: 'gram (berat)' },
    { name: 'L', desc: 'Litre (volume)' },
    { name: 'ml', desc: 'millilitre (volume)' },
    { name: 'pack', desc: 'package (kemasan)' },
    { name: 'box', desc: 'box (kotak)' },
    { name: 'set', desc: 'set (rangkaian)' },
    { name: 'pair', desc: 'pair (pasang)' },
    { name: 'm', desc: 'metre (panjang)' },
    { name: 'cm', desc: 'centimetre (panjang)' },
    { name: 'sqm', desc: 'square metre (luas)' },
    { name: 'hour', desc: 'hour (waktu/jam)' },
    { name: 'day', desc: 'day (waktu/hari)' },
    { name: 'person', desc: 'person (per orang)' },
    { name: 'plate', desc: 'plate (piring)' }
  ];
  const sList = document.getElementById('scale-list');
  if (sList) sList.innerHTML = scales.map(s => `<option value="${s.name}">${s.desc}</option>`).join('');

  // Account lists
  const accounts = JSON.parse(localStorage.getItem('financial_accounts') || '["Cash", "Bank BCA", "BSI Account", "GoPay", "ShopeePay"]');
  const pList = document.getElementById('payment-list');
  const rList = document.getElementById('received-list');
  const accOptions = accounts.map(a => `<option value="${a.name || a}">`).join('');
  if (pList) pList.innerHTML = accOptions;
  if (rList) rList.innerHTML = accOptions;

  // Receipt list
  const receiptSet = new Set(['Indomaret Struk', 'Alfamart Digital', 'Bensin Kita']);
  txDb.forEach(t => { if (t.receipt && !t.receipt.startsWith('data:')) receiptSet.add(t.receipt); });
  const recList = document.getElementById('receipt-list');
  if (recList) recList.innerHTML = Array.from(receiptSet).map(r => `<option value="${r}">`).join('');

  // Metadata
  const tagSet = new Set(['Urgent', 'Essential', 'Personal', 'Work']);
  const proSet = new Set(['House Reno', 'Vacation 2026', 'Daily Life']);
  txDb.forEach(t => {
     if (t.tags) t.tags.forEach(tg => tagSet.add(tg));
     if (t.projects) t.projects.forEach(p => proSet.add(p));
  });
  const tSug = document.getElementById('tag-suggestions');
  const pSug = document.getElementById('project-suggestions');
  if (tSug) tSug.innerHTML = Array.from(tagSet).map(t => `<option value="${t}">`).join('');
  if (pSug) pSug.innerHTML = Array.from(proSet).map(p => `<option value="${p}">`).join('');
}

// Re-initialize Tabs for transaction.html explicitly
if (document.querySelector('.tabs')) {
  const transactionTabs = document.querySelectorAll('.tab');
  transactionTabs.forEach(tab => {
    tab.onclick = () => {
       const targetStep = parseInt(tab.dataset.step);
       // Allow jumping freely if in edit mode, or if jumping backward
       if (mode === 'edit' || targetStep < currentStep) {
          updateStep(targetStep);
       } else {
          // If jumping forward in new mode, validate intervening steps
          for (let s = currentStep; s < targetStep; s++) {
             if (!validateStep(s)) return;
          }
          updateStep(targetStep);
       }
    };
  });
}

const initForm = () => {
  const db = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  if ((mode === 'edit' || mode === 'duplicate') && editId) {
    const tx = db.find(t => t.id == editId);
    if (tx) {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };

      setVal('transaction-date', tx.date);
      setVal('transaction-time', tx.time);
      setVal('author-input', tx.author);
      setVal('item-input', tx.name);
      setVal('merchant-input', tx.merchant);
      setVal('category-input', tx.category || 'Misc');
      setVal('transaction-description', tx.description);
      setVal('sku-input', tx.sku);
      
      if (amountInput) amountInput.value = (tx.price || 0).toLocaleString('id-ID');
      if (quantityInput) quantityInput.value = tx.qty || 1;
      if (itemScale) itemScale.value = tx.scale || 'pcs';
      if (discountInput) discountInput.value = (tx.discount || 0).toLocaleString('id-ID');
      if (feeInput) feeInput.value = (tx.fee || 0).toLocaleString('id-ID');
      
      if (currencyInput) {
        currencyInput.value = tx.currency || 'IDR';
        if (typeof toggleExchangeRate === 'function') toggleExchangeRate();
      }
      const exRateInput = document.getElementById('exchange-rate-input');
      if (exRateInput) exRateInput.value = (tx.exchangeRate || 1).toLocaleString('id-ID');
      
      const typeBtn = Array.from(typeButtons).find(b => b.dataset.type === tx.type);
      if (typeBtn) typeBtn.click();
      
      setVal('payment-account', tx.accountPayment);
      setVal('received-account', tx.accountReceived);
      
      if (tx.tags) tx.tags.forEach(tag => addChip('tags-wrapper', tag));
      if (tx.projects) tx.projects.forEach(p => addChip('projects-wrapper', p));
      
      if (tx.receipt) {
        if (receiptInput) receiptInput.value = tx.receipt;
        if (typeof updateReceiptPreview === 'function') updateReceiptPreview(tx.receipt);
      }
      
      const clearedBtn = Array.from(document.querySelectorAll('#cleared-selector .type-btn')).find(b => b.dataset.cleared === (tx.cleared ? 'yes' : 'no'));
      if (clearedBtn) clearedBtn.click();
      
      calculateTotal();
      if (typeof updateCategoryIcon === 'function') updateCategoryIcon(tx.category);
    }
  } else {
    // New Mode
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const authorEl = document.getElementById('author-input');
    if (authorEl && profile.name) authorEl.value = profile.name;
    const now = new Date();
    const dateEl = document.getElementById('transaction-date');
    if (dateEl) dateEl.valueAsDate = now;
    const timeEl = document.getElementById('transaction-time');
    if (timeEl) timeEl.value = now.toTimeString().slice(0, 5);
  }
};

// Re-initialize Tabs for transaction.html explicitly
const initTabs = () => {
  const transactionTabs = document.querySelectorAll('.tab');
  if (transactionTabs.length > 0) {
    transactionTabs.forEach(tab => {
      tab.onclick = () => {
         const targetStep = parseInt(tab.dataset.step);
         if (mode === 'edit' || targetStep < currentStep) {
            updateStep(targetStep);
         } else {
            for (let s = currentStep; s < targetStep; s++) {
               if (!validateStep(s)) return;
            }
            updateStep(targetStep);
         }
      };
    });
  }
};

// Initial Call
populateDatalists();
if (document.getElementById('transaction-date')) initForm();
initTabs();
if (typeof updateAccountInputs === 'function') updateAccountInputs();
if (typeof renderSummary === 'function') renderSummary();
lucide.createIcons();
