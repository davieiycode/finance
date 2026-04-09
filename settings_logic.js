
// settings_logic.js - Logic for settings.html
window.AVATAR_SVGS = [
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c1"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c1)"><rect width="80" height="80" fill="#0F6E56" /><path d="M-5 68 Q18 52 40 68 Q62 84 85 68L85 88L-5 88Z" fill="#1D9E75" /><path d="M-5 52 Q18 36 40 52 Q62 68 85 52L85 72L-5 72Z" fill="#5DCAA5" /><path d="M-5 36 Q18 20 40 36 Q62 52 85 36L85 56L-5 56Z" fill="#9FE1CB" /><path d="M-5 20 Q18 4 40 20 Q62 36 85 20L85 40L-5 40Z" fill="#E1F5EE" opacity="0.55" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c2"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c2)"><rect width="80" height="80" fill="#412402" /><g transform="translate(40,40)"><polygon points="0,0 -9,-42 9,-42" fill="#EF9F27" /><polygon points="0,0 -9,-42 9,-42" fill="#BA7517" transform="rotate(45)" /><polygon points="0,0 -9,-42 9,-42" fill="#FAC775" transform="rotate(90)" /><polygon points="0,0 -9,-42 9,-42" fill="#BA7517" transform="rotate(135)" /><polygon points="0,0 -9,-42 9,-42" fill="#EF9F27" transform="rotate(180)" /><polygon points="0,0 -9,-42 9,-42" fill="#BA7517" transform="rotate(225)" /><polygon points="0,0 -9,-42 9,-42" fill="#FAC775" transform="rotate(270)" /><polygon points="0,0 -9,-42 9,-42" fill="#BA7517" transform="rotate(315)" /></g><circle cx="40" cy="40" r="14" fill="#FAC775" /><circle cx="40" cy="40" r="7" fill="#412402" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c3"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c3)"><rect width="80" height="80" fill="#185FA5" /><g transform="rotate(45,40,40)"><rect x="2" y="2" width="18" height="18" fill="#378ADD" /><rect x="30" y="2" width="18" height="18" fill="#042C53" /><rect x="58" y="2" width="18" height="18" fill="#378ADD" /><rect x="2" y="30" width="18" height="18" fill="#042C53" /><rect x="30" y="30" width="18" height="18" fill="#B5D4F4" /><rect x="58" y="30" width="18" height="18" fill="#042C53" /><rect x="2" y="58" width="18" height="18" fill="#378ADD" /><rect x="30" y="58" width="18" height="18" fill="#042C53" /><rect x="58" y="58" width="18" height="18" fill="#378ADD" /></g></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c4"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c4)"><rect width="80" height="80" fill="#3C3489" /><circle cx="40" cy="12" r="22" fill="#534AB7" /><circle cx="65" cy="27" r="22" fill="#534AB7" /><circle cx="65" cy="53" r="22" fill="#7F77DD" /><circle cx="40" cy="68" r="22" fill="#7F77DD" /><circle cx="15" cy="53" r="22" fill="#534AB7" /><circle cx="15" cy="27" r="22" fill="#7F77DD" /><circle cx="40" cy="40" r="13" fill="#CECBF6" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c5"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c5)"><rect width="80" height="80" fill="#173404" /><rect x="0" y="54" width="80" height="26" fill="#27500A" /><polygon points="40,6 74,54 6,54" fill="#3B6D11" /><polygon points="60,14 90,58 30,58" fill="#639922" /><polygon points="20,18 58,66 -18,66" fill="#C0DD97" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c6"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c6)"><rect width="80" height="80" fill="#4A1B0C" /><polygon points="0,0 42,0 24,44 0,34" fill="#993C1D" /><polygon points="42,0 80,0 80,28 50,42" fill="#D85A30" /><polygon points="24,44 50,42 64,80 6,74" fill="#F0997B" /><polygon points="64,80 80,56 80,80" fill="#D85A30" /><polygon points="0,34 24,44 6,74 0,80" fill="#71280F" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c7"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c7)"><rect width="80" height="80" fill="#2C2C2A" /><circle cx="22" cy="20" r="13" fill="#085041" /><circle cx="60" cy="24" r="9" fill="#633806" /><circle cx="36" cy="55" r="16" fill="#0F6E56" /><circle cx="64" cy="58" r="11" fill="#BA7517" /><circle cx="14" cy="58" r="7" fill="#EF9F27" /><circle cx="52" cy="10" r="6" fill="#9FE1CB" /><circle cx="72" cy="40" r="5" fill="#FAC775" /><circle cx="28" cy="38" r="3" fill="#5DCAA5" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c8"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c8)"><rect width="80" height="80" fill="#042C53" /><path d="M6 76 Q40 22 74 76" fill="none" stroke="#185FA5" stroke-width="13" /><path d="M14 68 Q40 30 66 68" fill="none" stroke="#378ADD" stroke-width="10" /><path d="M22 60 Q40 38 58 60" fill="none" stroke="#7F77DD" stroke-width="8" /><circle cx="40" cy="56" r="7" fill="#B5D4F4" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c9"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c9)"><rect width="80" height="80" fill="#412402" /><polygon points="-22,-22 18,-22 -22,18" fill="#633806" /><polygon points="18,-22 60,-22 -22,60 -22,18" fill="#854F0B" /><polygon points="60,-22 102,-22 102,18 -22,102 -22,60" fill="#BA7517" /><polygon points="102,18 102,60 18,102 -22,102" fill="#EF9F27" /><polygon points="102,60 102,102 60,102" fill="#FAC775" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c10"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c10)"><rect width="80" height="80" fill="#501313" /><polygon points="40,4 56,20 40,36 24,20" fill="#A32D2D" /><polygon points="56,24 72,40 56,56 40,40" fill="#E24B4A" /><polygon points="40,44 56,60 40,76 24,60" fill="#A32D2D" /><polygon points="24,24 40,40 24,56 8,40" fill="#E24B4A" /><polygon points="40,28 52,40 40,52 28,40" fill="#F7C1C1" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c11"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c11)"><rect width="80" height="80" fill="#04342C" /><circle cx="38" cy="43" r="36" fill="none" stroke="#085041" stroke-width="7" /><circle cx="43" cy="37" r="27" fill="none" stroke="#0F6E56" stroke-width="6" /><circle cx="37" cy="44" r="18" fill="none" stroke="#1D9E75" stroke-width="5" /><circle cx="43" cy="38" r="10" fill="none" stroke="#9FE1CB" stroke-width="4" /><circle cx="40" cy="40" r="3" fill="#E1F5EE" /></g></svg>`,
  `<svg viewBox="0 0 80 80"><defs><clipPath id="c12"><circle cx="40" cy="40" r="40" /></clipPath></defs><g clip-path="url(#c12)"><rect width="80" height="80" fill="#26215C" /><polygon points="0,0 80,0 0,80" fill="#3C3489" /><polygon points="80,0 80,80 0,80" fill="#085041" /><circle cx="26" cy="28" r="18" fill="#7F77DD" /><circle cx="56" cy="54" r="15" fill="#1D9E75" /><circle cx="26" cy="28" r="8" fill="#EEEDFE" /><circle cx="56" cy="54" r="7" fill="#9FE1CB" /></g></svg>`
];

const APP_VERSION = 'v3.3.3';
const BUILD_DATE = '2026.04.09';

// settings_logic.js - Logic for settings.html

let viewStack = ['p-view-main'];

const updateBreadcrumbs = (viewId, title) => {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;
  
  if (viewId === 'main') {
    bc.innerHTML = `<span class="breadcrumb-item breadcrumb-active">Settings</span>`;
  } else {
    bc.innerHTML = `
      <span class="breadcrumb-item" onclick="goBack('main')" style="cursor:pointer; opacity:0.5;">Settings</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item breadcrumb-active">${title}</span>
    `;
  }
};

window.showPView = (vId, title) => {
  const targetId = 'p-view-' + vId;
  const currentId = viewStack[viewStack.length - 1];
  
  if (targetId === currentId) return;

  document.querySelectorAll('.settings-view').forEach(v => v.style.display = 'none');
  const targetEl = document.getElementById(targetId);
  if (targetEl) targetEl.style.display = (vId === 'main') ? 'block' : 'flex';
  
  updateBreadcrumbs(vId, title);
  
  if (vId === 'categories') window.renderCategoryList();
  if (vId === 'scales') window.renderScaleList();
  if (vId === 'tags') window.renderTagList();
  if (vId === 'projects') window.renderProjectList();

  if (vId === 'main') {
    viewStack = ['p-view-main'];
  } else {
    viewStack.push(targetId);
  }
  if (window.lucide) window.lucide.createIcons();
};

window.goBack = (target) => {
  if (target === 'main') {
    viewStack = ['p-view-main'];
    document.querySelectorAll('.settings-view').forEach(v => v.style.display = 'none');
    document.getElementById('p-view-main').style.display = 'block';
    updateBreadcrumbs('main', 'Settings');
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  if (viewStack.length > 1) {
    viewStack.pop();
    const prevId = viewStack[viewStack.length - 1];
    document.querySelectorAll('.settings-view').forEach(v => v.style.display = 'none');
    const targetEl = document.getElementById(prevId);
    if (targetEl) targetEl.style.display = (prevId === 'p-view-main') ? 'block' : 'flex';
    
    // Update title based on ID
    const titles = {
      'p-view-main': 'Settings',
      'p-view-personal': 'Profile Details',
      'p-view-prefs': 'App Aesthetics',
      'p-view-report': 'Export Center',
      'p-view-import': 'Import Gateway',
      'p-view-cloud': 'Cloud Node',
      'p-view-security': 'Privacy Hub',
      'p-view-pin-setup': 'Setup PIN',
      'p-view-tutorial': 'Setup Guide',
      'p-view-import-mapping': 'Matrix Mapping',
      'p-view-categories': 'Category Lab',
      'p-view-cat-editor': 'Edit Category',
      'p-view-scales': 'Scale Matrix',
      'p-view-scale-editor': 'Edit Scale',
      'p-view-tags': 'Tag Engine',
      'p-view-tag-editor': 'Edit Tag',
      'p-view-projects': 'Project Hub',
      'p-view-project-editor': 'Edit Project'
    };
    const vId = prevId.replace('p-view-', '');
    if (vId === 'categories') window.renderCategoryList();
    if (vId === 'scales') window.renderScaleList();
    if (vId === 'tags') window.renderTagList();
    if (vId === 'projects') window.renderProjectList();
    updateBreadcrumbs(vId, titles[prevId]);
    if (window.lucide) window.lucide.createIcons();
  } else {
    window.location.href = 'index.html';
  }
};

window.clearAllData = () => {
    const confirmText = "Are you absolutely sure? This will PERMANENTLY DELETE all transactions, accounts, and settings on this device.";
    if (window.showConfirm) {
        window.showConfirm(confirmText, () => {
            localStorage.clear();
            if (window.showToast) window.showToast('All data cleared!', 'success', 'trash-2');
            setTimeout(() => location.href = 'index.html', 1000);
        });
    } else {
        if (confirm(confirmText)) {
            localStorage.clear();
            alert('All data cleared!');
            location.href = 'index.html';
        }
    }
};

let pdfThemeColor = [139, 92, 246];
window.setPdfColor = (rgbOrHex, el) => {
  if (typeof rgbOrHex === 'string' && rgbOrHex.startsWith('#')) {
    const r = parseInt(rgbOrHex.slice(1, 3), 16);
    const g = parseInt(rgbOrHex.slice(3, 5), 16);
    const b = parseInt(rgbOrHex.slice(5, 7), 16);
    pdfThemeColor = [r, g, b];
  } else {
    pdfThemeColor = rgbOrHex;
  }
  document.querySelectorAll('#p-view-report .color-bubble').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
};

window.exportToPDF = () => {
  if (typeof SyncHub !== 'undefined' && SyncHub.start) SyncHub.start('Exporting PDF', 'Drawing document canvas...');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tableStartY = 85;
  const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
  const prefs = JSON.parse(localStorage.getItem('user_prefs') || '{}');
  const userName = prefs.name || 'User';
  const reportTitle = document.getElementById('pdf-title').value || 'Financial Audit Report';

  if (typeof SyncHub !== 'undefined' && SyncHub.update) SyncHub.update(20, 'Generating header and summary...');
  // Header
  doc.setFontSize(22);
  doc.setTextColor(pdfThemeColor[0], pdfThemeColor[1], pdfThemeColor[2]);
  doc.text(reportTitle, 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated for: ${userName}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

  // Summary Box
  doc.setDrawColor(240);
  doc.setFillColor(249, 250, 251);
  doc.rect(14, 45, 182, 30, 'F');

  doc.setFontSize(11);
  doc.setTextColor(0);
  const totalBal = parseInt(localStorage.getItem('total_balance') || '0');
  doc.text(`Current Total Balance: Rp ${totalBal.toLocaleString('id-ID')}`, 20, 55);
  doc.text(`Total Records: ${txs.length} transactions`, 20, 65);

  // Dynamic Column Mapping
  const columns = [];
  const headCols = [];
  if (document.getElementById('col-date').checked) { columns.push('date'); headCols.push('Date'); }
  if (document.getElementById('col-merch').checked) { columns.push('merchant'); headCols.push('Merchant'); }
  if (document.getElementById('col-item').checked) { columns.push('name'); headCols.push('Item'); }
  if (document.getElementById('col-cat').checked) { columns.push('category'); headCols.push('Category'); }
  if (document.getElementById('col-total').checked) { columns.push('amountDisplay'); headCols.push('Amount'); }

  const tableData = txs.map(t => {
    const row = [];
    t.amountDisplay = t.type === 'Expense' ? `-Rp ${t.total.toLocaleString('id-ID')}` : `+Rp ${t.total.toLocaleString('id-ID')}`;
    columns.forEach(col => row.push(t[col] || '-'));
    return row;
  });

  if (typeof SyncHub !== 'undefined' && SyncHub.update) SyncHub.update(50, 'Processing row data...');
  doc.autoTable({
    startY: tableStartY,
    head: [headCols],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: pdfThemeColor },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: tableStartY }
  });

  if (typeof SyncHub !== 'undefined' && SyncHub.update) SyncHub.update(90, 'Saving file to device...');
  doc.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  if (typeof SyncHub !== 'undefined' && SyncHub.finish) SyncHub.finish('PDF Generated Successfully!');
};

window.exportToDataFormat = (type) => {
  if (typeof SyncHub !== 'undefined' && SyncHub.start) SyncHub.start(`Exporting ${type.toUpperCase()}`, 'Parsing records...');
  const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
  if (txs.length === 0) { if (typeof SyncHub !== 'undefined' && SyncHub.finish) SyncHub.finish('No data found.', false); return; }

  const reportTitle = document.getElementById('pdf-title').value || 'Finance_Ledger';
  const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.${type}`;

  // Column selection logic
  const columns = [];
  const labels = [];
  if (document.getElementById('col-date').checked) { columns.push('date'); labels.push('Date'); }
  if (document.getElementById('col-merch').checked) { columns.push('merchant'); labels.push('Merchant'); }
  if (document.getElementById('col-item').checked) { columns.push('name'); labels.push('Item'); }
  if (document.getElementById('col-cat').checked) { columns.push('category'); labels.push('Category'); }
  if (document.getElementById('col-total').checked) { columns.push('total'); labels.push('Amount'); }

  const exportData = txs.map(t => {
    const item = {};
    columns.forEach((col, idx) => {
      item[labels[idx]] = t[col];
    });
    return item;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  if (type === 'xlsx') {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, fileName);
  } else {
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  if (typeof SyncHub !== 'undefined' && SyncHub.finish) SyncHub.finish(`${type.toUpperCase()} Exported Successfully!`);
};

let importRawData = [];
let importHeaders = [];
let currentImportMode = 'merge';

window.handleImport = (input) => {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const raw = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

    if (raw.length === 0) { alert('No data found in file.'); return; }

    importRawData = raw;
    importHeaders = Object.keys(raw[0]);

    showImportMapping();
  };
  reader.readAsArrayBuffer(file);
};

function showImportMapping() {
  const fields = [
    { id: 'm-date', label: 'Date', terms: ['date', 'tanggal', 'waktu'] },
    { id: 'm-merchant', label: 'Merchant', terms: ['merchant', 'toko', 'vendor', 'payee'] },
    { id: 'm-item', label: 'Item / Name', terms: ['item', 'name', 'nama', 'barang', 'keterangan'] },
    { id: 'm-category', label: 'Category', terms: ['category', 'kategori', 'jenis'] },
    { id: 'm-amount', label: 'Unit Price', terms: ['price', 'harga', 'cost', 'unit price'] },
    { id: 'm-qty', label: 'Quantity', terms: ['qty', 'jumlah', 'quantity', 'volume'] },
    { id: 'm-discount', label: 'Discount', terms: ['discount', 'diskon', 'potongan'] },
    { id: 'm-fee', label: 'Additional Fee', terms: ['fee', 'biaya', 'admin'] },
    { id: 'm-scale', label: 'Unit / Scale', terms: ['unit', 'scale', 'satuan'] },
    { id: 'm-payment', label: 'Payment Source Account', terms: ['payment', 'source', 'akun', 'bank', 'sumber'] },
    { id: 'm-received', label: 'Beneficiary Account', terms: ['received', 'beneficiary', 'tujuan', 'penerima'] },
    { id: 'm-id', label: 'Transaction ID (Unique)', terms: ['id', 'uuid', 'transaction id', 'no'] }
  ];

  const container = document.getElementById('mapping-fields');
  container.innerHTML = '';

  fields.forEach(f => {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label class="label" style="font-size:0.7rem; opacity:0.6; margin-bottom:0.3rem; display:block;">${f.label.toUpperCase()}</label>
      <div class="select-wrapper">
        <select id="${f.id}" class="f-input" style="width:100%; appearance:none; background:var(--bg-input); border:1px solid var(--border); border-radius:0.75rem; padding:0.8rem; color:white;">
          <option value="">-- Ignore Field --</option>
          ${importHeaders.map(h => `<option value="${h}">${h}</option>`).join('')}
        </select>
      </div>
    `;
    container.appendChild(div);

    // Auto-match
    const select = div.querySelector('select');
    const match = importHeaders.find(h => f.terms.some(t => h.toLowerCase().includes(t)));
    if (match) select.value = match;
  });

  showPView('import-mapping', 'Map File Columns');
}

window.executeImport = () => {
  if (typeof SyncHub !== 'undefined' && SyncHub.start) SyncHub.start('Importing Data', 'Mapping columns and preparing workspace...');
  const mapping = {
    date: document.getElementById('m-date').value,
    merchant: document.getElementById('m-merchant').value,
    name: document.getElementById('m-item').value,
    category: document.getElementById('m-category').value,
    amount: document.getElementById('m-amount').value,
    qty: document.getElementById('m-qty').value,
    discount: document.getElementById('m-discount').value,
    fee: document.getElementById('m-fee').value,
    scale: document.getElementById('m-scale').value,
    payment: document.getElementById('m-payment').value,
    received: document.getElementById('m-received').value,
    txId: document.getElementById('m-id').value
  };

  const currentTxs = JSON.parse(localStorage.getItem('transactions') || '[]');

  if (typeof SyncHub !== 'undefined' && SyncHub.update) SyncHub.update(25, `Parsing ${importRawData.length} records...`);
  const imported = importRawData.map((row, idx) => {
    const parseRowVal = (key) => {
      let val = row[mapping[key]];
      if (val === undefined || val === null || val === '') return 0;
      if (typeof val === 'number') return val;

      let clean = val.toString().replace(/Rp/g, '').trim();
      if (clean.includes(',') && !clean.includes('.')) {
        clean = clean.replace(/,/g, '.');
      } else if (clean.includes('.')) {
        clean = clean.replace(/\./g, '').replace(/,/g, '.');
      } else {
        clean = clean.replace(/[^0-9.-]+/g, "");
      }
      return parseFloat(clean) || 0;
    };

    const unitPrice = Math.abs(parseRowVal('amount'));
    const quantity = parseRowVal('qty') || 1;
    const discount = parseRowVal('discount') || 0;
    const fee = parseRowVal('fee') || 0;
    const total = (quantity * unitPrice) - discount + fee;
    const rowId = row[mapping.txId] || ('IMP-' + btoa(unescape(encodeURIComponent((row[mapping.date] || '') + (row[mapping.name] || '') + (row[mapping.merchant] || '') + total))).substring(0, 16));

    return {
      id: rowId,
      date: (row[mapping.date] || new Date().toISOString().split('T')[0]).toString().split('T')[0],
      merchant: row[mapping.merchant] || '-',
      name: row[mapping.name] || 'Imported Transaction',
      amount: unitPrice,
      total: total,
      qty: quantity,
      discount: discount,
      fee: fee,
      scale: row[mapping.scale] || 'pcs',
      category: row[mapping.category] || 'Uncategorized',
      accountPayment: row[mapping.payment] || '',
      accountReceived: row[mapping.received] || '',
      type: row.Type || row.type || (total < 0 ? 'Income' : 'Expense'),
      cleared: true,
      author: 'System (Import)'
    };
  });

  if (typeof SyncHub !== 'undefined' && SyncHub.update) SyncHub.update(70, 'Merging imported data with local ledger...');
  let finalData = [];
  let skippedCount = 0;
  if (currentImportMode === 'merge') {
    const existingIds = new Set(currentTxs.map(t => t.id));
    const filteredNew = imported.filter(t => {
      if (existingIds.has(t.id)) {
        skippedCount++;
        return false;
      }
      return true;
    });
    finalData = [...filteredNew, ...currentTxs];
  } else {
    finalData = imported;
  }
  localStorage.setItem('transactions', JSON.stringify(finalData));

  if (typeof SyncHub !== 'undefined' && SyncHub.finish) SyncHub.finish(`Imported ${imported.length} tx. Skipped ${skippedCount} dups.`);
  setTimeout(() => location.reload(), 1500);
};

window.setImportMode = (mode) => {
  currentImportMode = mode;
  document.querySelectorAll('[id^="import-"]').forEach(el => el.classList.remove('active'));
  document.getElementById('import-' + mode).classList.add('active');
};

window.copyScriptCode = () => {
  const code = `function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const timezone = ss.getSpreadsheetTimeZone();
  const response = { status: 'success' };
  const relevantKeywords = ['transaction', 'transaksi', 'merchant', 'toko', 'penjual', 'author', 'kreator', 'user', 'penulis', 'anggota', 'account', 'rekening', 'akun', 'item', 'barang', 'produk', 'member', 'membership', 'categories', 'scales', 'unitscale', 'vault', 'brankas', 'budget', 'anggaran', 'goal', 'target', 'voucher', 'kupon', 'setting', 'pref', 'tag', 'project'];

  sheets.forEach(sh => {
    const name = sh.getName().toLowerCase();
    if (!relevantKeywords.some(k => name.includes(k))) return;

    const data = sh.getDataRange().getValues();
    if (data.length < 2 && !name.includes('setting') && !name.includes('pref')) { 
      let emptyKey = name + 's';
      if (name.includes('transaction') || name.includes('transaksi')) emptyKey = 'transactions';
      else if (name.includes('merchant') || name.includes('toko') || name.includes('penjual')) emptyKey = 'merchants';
      else if (name.includes('author') || name.includes('kreator') || name.includes('user') || name.includes('penulis')) emptyKey = 'authors';
      else if (name.includes('account') || name.includes('rekening') || name.includes('akun')) emptyKey = 'accounts';
      else if (name.includes('item') || name.includes('barang') || name.includes('produk')) emptyKey = 'items';
      else if (name.includes('membership') || name.includes('member')) emptyKey = 'membership_cards';
      else if (name.includes('category') || name.includes('categories')) emptyKey = 'categories_db';
      else if (name.includes('scale')) emptyKey = 'scales_db';
      else if (name.includes('tag')) emptyKey = 'tags';
      else if (name.includes('project')) emptyKey = 'projects';
      else if (name.includes('budget')) emptyKey = 'budgets';
      else if (name.includes('goal') || name.includes('target')) emptyKey = 'goals';
      else if (name.includes('voucher') || name.includes('kupon')) emptyKey = 'vouchers';
      
      response[emptyKey] = []; 
      return; 
    }

    const headers = data.shift();
    const records = data.map(row => {
      let r = {};
      headers.forEach((h, i) => {
        let v = row[i];
        let hName = (h || '').toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!hName) return;

        // Normalization Mapping
        if (hName === 'accountid' || hName === 'itemid' || hName === 'merchantid' || hName === 'transactionid' || hName === 'categoryid' || hName === 'tagid' || hName === 'projectid' || hName === 'budgetid' || hName === 'goalid' || hName === 'memberid' || hName === 'voucherid' || hName === 'authorid') r.id = v;
        else if (hName === 'accountname' || hName === 'itemname' || hName === 'merchantname' || hName === 'category' || hName === 'tagname' || hName === 'projectname' || hName === 'goalname' || hName === 'membername' || hName === 'authorname') r.name = v;
        else if (hName === 'accounttype' || hName === 'type' || (hName === 'category' && name === 'merchant')) r.type = v;
        else if (hName === 'provider') r.provider = v;
        else if (hName === 'currentbalance' || hName === 'balance' || hName === 'currentamount') r.balance = parseFloat(v) || 0;
        else if (hName === 'openingbalance') r.openingBalance = parseFloat(v) || 0;
        else if (hName === 'status') r.status = v;
        else if (hName === 'itemcategory' || hName === 'projectcategory') r.category = v;
        else if (hName === 'manufacturer') r.manu = v;
        else if (hName === 'model') r.model = v;
        else if (hName === 'stockkeepingunit' || hName === 'sku') r.sku = v;
        else if (hName === 'defaultunitprice' || hName === 'price' || hName === 'amountperunit') r.price = parseFloat(v) || 0;
        else if (hName === 'unit' || hName === 'unitscale') r.unit = v;
        else if (hName === 'warrantyexpirydate' || hName === 'expirydate' || hName === 'expiry' || hName === 'deadline') r.expiry = v;
        else if (hName === 'notes') r.notes = v;
        else if (hName === 'merchant') r.merchant = v;
        else if (hName === 'author') r.author = v;
        else if (hName === 'preferencekey') r.key = v;
        else if (hName === 'settingvalue') r.value = v;
        else r[hName] = v; // Capture all other columns as-is
        
        // Transaction Specific Time/Date Normalization
        if (name === 'transaction') {
          if (hName === 'date') {
            if (v instanceof Date) v = Utilities.formatDate(v, timezone, "yyyy-MM-dd");
            else if (typeof v === 'string' && v.includes('T')) v = v.split('T')[0];
            r.date = v;
          }
          else if (hName === 'time') {
            if (v instanceof Date) v = Utilities.formatDate(v, timezone, "HH:mm");
            r.time = v ? v.toString() : '';
          }
        }
      });
      return r;
    });

    // Smart Sheet Name Mapping
    let finalKey = name + 's'; 
    if (name.includes('transaction') || name.includes('transaksi')) finalKey = 'transactions';
    else if (name.includes('merchant') || name.includes('toko') || name.includes('penjual')) finalKey = 'merchants';
    else if (name.includes('author') || name.includes('kreator') || name.includes('user') || name.includes('penulis') || name.includes('anggota')) finalKey = 'authors';
    else if (name.includes('account') || name.includes('rekening') || name.includes('akun')) finalKey = 'accounts';
    else if (name.includes('item') || name.includes('barang') || name.includes('produk')) finalKey = 'items';
    else if (name.includes('membership') || name.includes('member')) finalKey = 'membership_cards';
    else if (name.includes('categories') || name.includes('category_db')) finalKey = 'categories_db';
    else if (name.includes('scale')) finalKey = 'scales_db';
    else if (name.includes('tag')) finalKey = 'tags';
    else if (name.includes('project')) finalKey = 'projects';
    else if (name.includes('vault') || name.includes('brankas')) finalKey = 'vault';
    else if (name.includes('budget') || name.includes('anggaran')) finalKey = 'budgets';
    else if (name.includes('goal') || name.includes('target')) finalKey = 'goals';
    else if (name.includes('voucher') || name.includes('kupon')) finalKey = 'vouchers';
    else if (name.includes('setting') || name.includes('pref')) {
      // Special Handling for Settings (Object instead of Array)
      const settingsObj = {};
      data.forEach(row => {
        if (row[0]) settingsObj[row[0]] = row[1];
      });
      response['user_prefs'] = settingsObj;
      return; 
    }
    
    response[finalKey] = records;
  });

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const entities = [
      { key: 'transactions', sheetName: 'transaction', headers: [
        'transactionID', 'date', 'time', 'category', 'merchant', 'itemName', 'amountPerUnit', 'quantity', 'unitScale', 'type', 'cleared', 'paymentSourceAccount', 'beneficiaryAccount', 'receipt', 'tags', 'projects', 'author', 'discount', 'fee', 'total', 'updateTime', 'description', 'currency', 'exchangeRate'
      ]},
      { key: 'accounts', sheetName: 'account', headers: [
        'accountID', 'accountName', 'accountType', 'currency', 'openingBalance', 'currentBalance', 'status', 'notes', 'cardColor', 'updateTime', 'accountNumber', 'accountImage'
      ]},
      { key: 'merchants', sheetName: 'merchant', headers: [
        'merchantID', 'merchantName', 'category', 'status', 'phone', 'address', 'updateTime', 'email', 'website', 'bankAccountDetails', 'notes', 'gMapsLink'
      ]},
      { key: 'items', sheetName: 'item', headers: [
        'itemID', 'itemName', 'itemCategory', 'unitScale', 'amountPerUnit', 'manufacturer', 'model', 'SKU', 'updateTime', 'currency', 'warrantyExpiryDate', 'notes', 'itemImage'
      ]},
      { key: 'authors', sheetName: 'author', headers: ['authorID', 'authorName', 'roleType', 'updateTime'] },
      { key: 'membership_cards', sheetName: 'member', headers: ['memberID', 'memberName', 'code', 'expiryDate', 'type', 'color', 'notes', 'memberImage'] },
      { key: 'categories_db', sheetName: 'category', headers: ['categoryID', 'category', 'categoryGroup', 'type', 'description', 'updateTime'] },
      { key: 'scales_db', sheetName: 'unitScale', headers: ['unitScale', 'description'] },
      { key: 'vouchers', sheetName: 'voucher', headers: ['voucherID', 'voucherName', 'provider', 'voucherCode', 'expiryDate', 'status', 'updateTime', 'notes'] },
      { key: 'budgets', sheetName: 'budget', headers: ['budgetID', 'category', 'type', 'budgetAmount', 'currency', 'status', 'updateTime'] },
      { key: 'goals', sheetName: 'goal', headers: ['goalID', 'goalName', 'targetAmount', 'currentAmount', 'deadline', 'status', 'updateTime'] },
      { key: 'tags', sheetName: 'tag', headers: ['tagID', 'tagName', 'tagGroup', 'description', 'updateTime'] },
      { key: 'projects', sheetName: 'project', headers: ['projectID', 'projectName', 'startDate', 'endDate', 'budgetAmount', 'status', 'updateTime', 'author', 'description'] },
      { key: 'user_prefs', sheetName: 'settings', headers: ['preferenceKey', 'settingValue'] }
    ];

    entities.forEach(ent => {
      const data = contents[ent.key];
      if (!data) return;
      
      let sheet = ss.getSheetByName(ent.sheetName);
      if (!sheet) { sheet = ss.insertSheet(ent.sheetName); }
      
      const rows = [ent.headers];
      
      if (ent.key === 'user_prefs') {
        if (typeof data === 'object' && !Array.isArray(data)) {
           const sRows = [['preferenceKey', 'settingValue']];
           for (let k in data) {
             sRows.push([k, typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k]]);
           }
           sheet.getRange(1, 1, sheet.getLastRow() || 1, 2).clearContent();
           sheet.getRange(1, 1, sRows.length, 2).setValues(sRows);
           return; 
        }
      }

      data.forEach(item => {
        const row = ent.headers.map(h => {
          const hNorm = h.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          if (hNorm === 'accountid' || hNorm === 'itemid' || hNorm === 'merchantid' || hNorm === 'transactionid' || hNorm === 'categoryid' || hNorm === 'tagid' || hNorm === 'projectid' || hNorm === 'budgetid' || hNorm === 'goalid' || hNorm === 'memberid' || hNorm === 'voucherid' || hNorm === 'authorid' || hNorm === 'id') return item.id || item[h] || '';
          if (hNorm === 'accountname' || hNorm === 'itemname' || hNorm === 'merchantname' || hNorm === 'vouchername' || hNorm === 'goalname' || hNorm === 'tagname' || hNorm === 'projectname' || hNorm === 'membername' || hNorm === 'authorname' || hNorm === 'category' || hNorm === 'name') return item.name || item[h] || '';
          if (hNorm === 'unitscale' || hNorm === 'unit') return item.name || item.unit || item[h] || '';
          if (hNorm === 'provider') return item.provider || item[h] || '';
          if (hNorm === 'code' || hNorm === 'vouchercode') return item.code || item[h] || '';
          if (hNorm === 'currentbalance' || hNorm === 'currentamount') return item.balance !== undefined ? item.balance : (item.saved !== undefined ? item.saved : (item[h] !== undefined ? item[h] : 0));
          if (hNorm === 'openingbalance') return item.openingBalance !== undefined ? item.openingBalance : (item.balance !== undefined ? item.balance : (item[h] !== undefined ? item[h] : 0));
          if (hNorm === 'defaultunitprice' || hNorm === 'amountperunit') return item.price !== undefined ? item.price : (item.amount !== undefined ? item.amount : (item[h] !== undefined ? item[h] : 0));
          if (hNorm === 'stockkeepingunit') return item.sku || item[h] || '';
          if (hNorm === 'warrantyexpirydate' || hNorm === 'expirydate' || hNorm === 'deadline') return item.expiry || item.deadline || item.dueDate || item[h] || '';
          if (hNorm === 'startdate') return item.start || item[h] || '';
          if (hNorm === 'enddate') return item.end || item[h] || '';
          if (hNorm === 'targetamount') return item.target !== undefined ? item.target : (item[h] !== undefined ? item[h] : 0);
          if (hNorm === 'currentamount') return item.saved !== undefined ? item.saved : (item[h] !== undefined ? item[h] : 0);
          if (hNorm === 'manufacturer') return item.manu || item[h] || '';
          if (hNorm === 'itemcategory' || hNorm === 'projectcategory' || hNorm === 'category') return item.category || item[h] || '';
          if (hNorm === 'categorygroup' || hNorm === 'taggroup') return item.group || item[h] || '';
          if (hNorm === 'type' || hNorm === 'roletype') return item.type || item.role || item[h] || '';
          if (hNorm === 'description' || hNorm === 'notes') return item.description || item.notes || item[h] || '';
          if (hNorm === 'budgetamount') return item.budget !== undefined ? item.budget : (item.amount !== undefined ? item.amount : (item.budgetAmount !== undefined ? item.budgetAmount : (item[h] !== undefined ? item[h] : 0)));
          if (hNorm === 'cardcolor' || hNorm === 'color') return item.color || item[h] || '';
          if (hNorm === 'accountimage' || hNorm === 'merchantimage' || hNorm === 'itemimage' || hNorm === 'memberimage' || hNorm === 'logo') return item.logo || item.image || item[h] || '';
          if (hNorm === 'currency') return item.currency || item[h] || '';
          if (hNorm === 'exchangerate') return item.exchangeRate || item.exchangerate || item[h] || 1;
          if (hNorm === 'updatetime') return Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm");
          
          if (ent.key === 'merchants' && hNorm === 'category') return item.type || item[h] || '';
          if (ent.key === 'authors' && hNorm === 'authorname') return item.name || item[h] || '';
          
          if (ent.key === 'transactions') {
            if (h === 'paymentSourceAccount') return item.accountPayment || item[h] || '';
            if (h === 'beneficiaryAccount') return item.accountReceived || item[h] || '';
            if (h === 'merchant') return item.merchant || item[h] || '';
            if (h === 'author') return item.author || item[h] || '';
            if (h === 'amountPerUnit') return item.amount !== undefined ? item.amount : (item[h] !== undefined ? item[h] : 0);
            if (h === 'tags') return Array.isArray(item.tags) ? item.tags.join(', ') : (item[h] || '');
            if (h === 'projects') return Array.isArray(item.projects) ? item.projects.join(', ') : (item[h] || '');
            if (h === 'cleared') return (item.cleared !== undefined) ? (item.cleared ? 'Yes' : 'No') : (item[h] || 'No');
            if (h === 'year' && item.date) return item.date.split('-')[0];
            if (h === 'month' && item.date) return item.date.split('-')[1];
          }

          for (let k in item) {
            if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === hNorm) {
                let v = item[k];
                if (Array.isArray(v)) return v.join(', ');
                return v;
            }
          }
          return '';
        });
        rows.push(row);
      });

      sheet.getRange(1, 1, sheet.getLastRow() || 1, ent.headers.length).clearContent();
      sheet.getRange(1, 1, rows.length, ent.headers.length).setValues(rows);
      sheet.getRange(1, 1, 1, ent.headers.length).setFontWeight('bold').setBackground('#f3f3f3');
      sheet.setFrozenRows(1);
    });

      return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }
`;
  navigator.clipboard.writeText(code);
  alert('Script code copied to clipboard!');
};

window.setupBiometric = async (enabled) => {
  if (!enabled) {
    localStorage.setItem('bio_enabled', 'false');
    updateBioUI(false);
    return;
  }

  const isAvailable = window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (!isAvailable) { 
    alert('Biometric authentication is not supported or requires HTTPS.'); 
    document.getElementById('pref-bio-toggle').checked = false;
    return; 
  }

  alert('Activating device biometrics...');
  localStorage.setItem('bio_enabled', 'true'); 
  updateBioUI(true);
};

function updateBioUI(enabled) {
  const toggle = document.getElementById('pref-bio-toggle');
  if (toggle) toggle.checked = enabled;
  const status = document.getElementById('p-sub-bio-status');
  if (status) status.innerText = enabled ? 'Neural Validation Active' : 'Inactive';
}

window.togglePIN = (enabled) => {
  if (enabled && !localStorage.getItem('app_pin')) {
    showPView('pin-setup', 'Setup Your PIN');
  } else {
    localStorage.setItem('pin_enabled', enabled);
  }
};


// Preferences Logic
let tempTheme = 'dark';
let tempAccent = '#8b5cf6';
let tempRadius = 16;
let selectedAvatar = '👤';

window.setAppTheme = (t) => {
  tempTheme = t;
  document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
  const tc = document.getElementById('tc-' + t);
  if (tc) tc.classList.add('active');
  if (window.applyAesthetics) window.applyAesthetics(t, tempAccent, tempRadius);
};

window.setAccent = (c, el) => {
  tempAccent = c;
  document.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  if (window.applyAesthetics) window.applyAesthetics(tempTheme, c, tempRadius);
};

window.updateRadius = (v) => {
  tempRadius = v;
  if (window.applyAesthetics) window.applyAesthetics(tempTheme, tempAccent, v);
};

window.setAvatar = (av, el) => {
  selectedAvatar = av;
  document.querySelectorAll('.av-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
};

function renderAvatarPicker() {
  const picker = document.getElementById('avatar-picker');
  if (!picker) return;
  
  // Clear but keep the default one
  const def = picker.querySelector('span')?.innerText === '👤' ? picker.querySelector('.av-item') : null;
  picker.innerHTML = '';
  
  window.AVATAR_SVGS.forEach((svg, idx) => {
    const item = document.createElement('div');
    const val = `svg:${idx}`;
    item.className = 'av-item';
    if (selectedAvatar === val) item.classList.add('active');
    item.onclick = (e) => window.setAvatar(val, item);
    item.innerHTML = svg;
    picker.appendChild(item);
  });
  
  // Add the default one back
  const defItem = document.createElement('div');
  defItem.className = 'av-item';
  if (selectedAvatar === '👤') defItem.classList.add('active');
  defItem.onclick = (e) => window.setAvatar('👤', defItem);
  defItem.innerHTML = '<span>👤</span>';
  picker.appendChild(defItem);
}

window.savePrefs = () => {
  const prefs = {
    name: document.getElementById('pref-name').value,
    email: document.getElementById('pref-email').value,
    theme: tempTheme,
    color: tempAccent,
    radius: tempRadius,
    avatar: selectedAvatar
  };
  localStorage.setItem('user_prefs', JSON.stringify(prefs));
  if (window.showToast) window.showToast('Settings saved successfully!', 'success', 'check-circle');
  
  // Update Profile Header instantly
  window.initSettings();
  
  // Auto-sync
  const cloudUrl = localStorage.getItem('cloud_sheet_url');
  if (cloudUrl && window.triggerCloudPush) {
    window.triggerCloudPush();
  }
};

window.initSettings = () => {
  const ps = JSON.parse(localStorage.getItem('user_prefs') || '{"name":"User","theme":"dark","color":"#8b5cf6","radius":16}');
  document.getElementById('pref-name').value = ps.name || '';
  document.getElementById('pref-email').value = ps.email || '';
  document.getElementById('cloud-url').value = localStorage.getItem('cloud_sheet_url') || '';
  
  tempTheme = ps.theme || 'dark';
  tempAccent = ps.color || '#1D9E75';
  tempRadius = ps.radius || 16;
  selectedAvatar = ps.avatar || '👤';

  // Render AVATARS first
  renderAvatarPicker();

  const tc = document.getElementById('tc-' + tempTheme);
  if (tc) tc.classList.add('active');
  const rr = document.getElementById('radius-range');
  if (rr) rr.value = tempRadius;

  document.querySelectorAll('.av-item').forEach(item => {
    const onc = item.getAttribute('onclick') || '';
    item.classList.toggle('active', onc.includes(`'${selectedAvatar}'`));
  });

  const pinEnabled = localStorage.getItem('pin_enabled') === 'true';
  const pinToggle = document.getElementById('pref-pin-toggle');
  if (pinToggle) pinToggle.checked = pinEnabled;

  const pinStatus = document.getElementById('p-sub-pin-status');
  if (pinStatus) pinStatus.innerText = localStorage.getItem('app_pin') ? 'Active' : 'Not set';

  if (window.updateSyncUI) window.updateSyncUI(localStorage.getItem('last_cloud_sync'));
  
  const bioEnabled = localStorage.getItem('bio_enabled') === 'true';
  updateBioUI(bioEnabled);
  
  // Sync Profile Header
  const headerName = document.getElementById('s-header-name');
  const headerEmail = document.getElementById('s-header-email');
  const headerAv = document.getElementById('s-header-avatar');
  
  if (headerName) headerName.innerText = ps.name || 'User';
  if (headerEmail) headerEmail.innerText = ps.email || 'Show profile details';
  if (headerAv) {
    if (selectedAvatar.startsWith('svg:')) {
      const idx = parseInt(selectedAvatar.split(':')[1]);
      headerAv.innerHTML = window.AVATAR_SVGS[idx] || '👤';
      headerAv.style.background = 'none';
      headerAv.style.border = 'none';
    } else if (selectedAvatar.startsWith('http') || selectedAvatar.startsWith('file')) {
      headerAv.innerHTML = `<img src="${selectedAvatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
      headerAv.style.background = 'none';
    } else {
      headerAv.innerHTML = selectedAvatar;
      headerAv.style.background = 'var(--glass)';
      headerAv.style.border = '1px solid var(--border)';
    }
  }

  if (window.lucide) window.lucide.createIcons();
};

// PIN Logic
let currentPin = '';
let pinSetupMode = 'first';
let firstPin = '';

window.addPin = (num) => {
  if (currentPin.length < 4) {
    currentPin += num;
    updatePinDots();
    if (currentPin.length === 4) setTimeout(handlePinComplete, 300);
  }
};

window.delPin = () => { currentPin = currentPin.slice(0, -1); updatePinDots(); };

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`pin-${i}`);
    if (dot) dot.classList.toggle('filled', i <= currentPin.length);
  }
}

function handlePinComplete() {
  if (pinSetupMode === 'first') {
    firstPin = currentPin; currentPin = ''; pinSetupMode = 'confirm';
    document.getElementById('pin-prompt').innerText = 'Confirm your secure code';
    updatePinDots();
  } else {
    if (currentPin === firstPin) {
      localStorage.setItem('app_pin', currentPin);
      localStorage.setItem('pin_enabled', 'true');
      document.getElementById('p-sub-pin-status').innerText = 'Active';
      document.getElementById('pref-pin-toggle').checked = true;
      showPView('security', 'Security Hub');
      currentPin = ''; pinSetupMode = 'first';
    } else {
      alert('PINs do not match. Try again.');
      currentPin = ''; pinSetupMode = 'first';
      document.getElementById('pin-prompt').innerText = 'Enter a 4-digit secure code';
      updatePinDots();
    }
  }
}

window.syncCloud = async (mode) => {
  const btn = mode === 'pull' ? document.getElementById('pull-btn') : document.getElementById('push-btn');
  if (!btn) return;

  const originalHtml = btn.innerHTML;
  btn.style.opacity = '0.7';
  btn.style.pointerEvents = 'none';
  btn.innerHTML = `<i data-lucide="refresh-cw" class="animate-spin" style="width:16px;"></i><span>${mode === 'pull' ? 'PULLING...' : 'PUSHING...'}</span>`;
  if (window.lucide) window.lucide.createIcons();
  
  try {
    if (window.triggerCloudSync && mode === 'pull') {
        const syncMode = Array.from(document.getElementsByName('sync_strategy')).find(r => r.checked)?.value || 'merge';
        await window.triggerCloudSync(syncMode);
    } else if (window.triggerCloudPush && mode === 'push') {
        await window.triggerCloudPush();
    }
  } catch (err) {
    if (window.showToast) window.showToast('Sync process failed. Check your link.', 'error');
  } finally {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.innerHTML = originalHtml;
    if (window.lucide) window.lucide.createIcons();
  }
};

window.updateApp = () => {
    if (confirm('Clear cache and reload the application?')) {
        location.reload(true);
    }
};

// Database Management: Categories
let editingCatId = null;
window.renderCategoryList = () => {
    const list = document.getElementById('categories-db-list');
    if (!list) return;
    const db = JSON.parse(localStorage.getItem('categories_db') || '[]');
    if (db.length === 0) {
        // Init with some defaults if empty
        const defaults = [
            { id: 1, name: 'Food & Beverage', group: 'Life Needs', type: 'Expense', description: 'Groceries, dining, drinks, and snacks.' },
            { id: 2, name: 'Transportation', group: 'Mobility', type: 'Expense', description: 'Fuel, public transit, parking, and maintenance.' },
            { id: 3, name: 'Shopping', group: 'Lifestyle', type: 'Expense', description: 'Clothes, electronics, and personal items.' },
            { id: 4, name: 'Salary', group: 'Income', type: 'Income', description: 'Primary monthly income source.' }
        ];
        localStorage.setItem('categories_db', JSON.stringify(defaults));
        return window.renderCategoryList();
    }

    list.innerHTML = db.map(c => `
        <div class="sett-list-item" style="padding:0.75rem; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:1rem;">
            <div style="flex:1;">
                <div style="font-weight:700; font-size:0.9rem;">${c.name}</div>
                <div style="font-size:0.65rem; color:var(--text-secondary); opacity:0.6;">${c.group} • ${c.type}</div>
            </div>
            <div style="display:flex; gap:0.5rem;">
                <button onclick="editCategory('${c.id}')" style="background:none; border:none; color:var(--accent); cursor:pointer;"><i data-lucide="edit-3" style="width:16px;"></i></button>
                <button onclick="deleteCategory('${c.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i data-lucide="trash-2" style="width:16px;"></i></button>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
};

window.newCategory = () => {
    editingCatId = null;
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-group').value = '';
    document.getElementById('cat-type').value = 'Expense';
    document.getElementById('cat-desc').value = '';
    showPView('cat-editor', 'New Category');
};

window.editCategory = (id) => {
    const db = JSON.parse(localStorage.getItem('categories_db') || '[]');
    const cat = db.find(c => c.id == id);
    if (!cat) return;
    editingCatId = id;
    document.getElementById('cat-name').value = cat.name;
    document.getElementById('cat-group').value = cat.group;
    document.getElementById('cat-type').value = cat.type;
    document.getElementById('cat-desc').value = cat.description || '';
    showPView('cat-editor', 'Edit Category');
};

window.saveCategory = () => {
    const db = JSON.parse(localStorage.getItem('categories_db') || '[]');
    const cat = {
        id: editingCatId || Date.now(),
        name: document.getElementById('cat-name').value.trim(),
        group: document.getElementById('cat-group').value.trim(),
        type: document.getElementById('cat-type').value,
        description: document.getElementById('cat-desc').value.trim()
    };
    if (!cat.name || !cat.group) { alert('Name and Group are required'); return; }

    if (editingCatId) {
        const idx = db.findIndex(c => c.id === editingCatId);
        db[idx] = cat;
    } else {
        db.push(cat);
    }
    localStorage.setItem('categories_db', JSON.stringify(db));
    showToast('Category saved', 'success', 'check-circle');
    goBack();
};

window.deleteCategory = (id) => {
    window.showConfirm('Delete this category definition?', () => {
        let db = JSON.parse(localStorage.getItem('categories_db') || '[]');
        db = db.filter(c => c.id != id);
        localStorage.setItem('categories_db', JSON.stringify(db));
        window.renderCategoryList();
    });
};

// Database Management: Scales
let editingScaleId = null;
window.renderScaleList = () => {
    const list = document.getElementById('scales-db-list');
    if (!list) return;
    const db = JSON.parse(localStorage.getItem('scales_db') || '[]');
    if (db.length === 0) {
        const defaults = [
            { id: 1, name: 'pcs', description: 'Pieces - Standard unit for individual items.' },
            { id: 2, name: 'kg', description: 'Kilogram - Mass/Weight for groceries or fuel.' },
            { id: 3, name: 'gr', description: 'Gram - Precision weight for small items.' },
            { id: 4, name: 'L', description: 'Liter - Volume for liquid items.' },
            { id: 5, name: 'ml', description: 'Milliliter - Small volume precision for medicinal or cosmetic items.' },
            { id: 6, name: 'pack', description: 'Package - Wrapped or bundled items.' },
            { id: 7, name: 'box', description: 'Box - Packaged sets or cartons.' },
            { id: 8, name: 'btl', description: 'Bottle - Single beverage or liquid container.' }
        ];
        localStorage.setItem('scales_db', JSON.stringify(defaults));
        return window.renderScaleList();
    }

    list.innerHTML = db.map(s => `
        <div class="sett-list-item" style="padding:0.75rem; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:1rem;">
            <div style="flex:1;">
                <div style="font-weight:700; font-size:0.9rem;">${s.name}</div>
                <div style="font-size:0.6rem; color:var(--text-secondary); opacity:0.6; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;">${s.description}</div>
            </div>
            <div style="display:flex; gap:0.5rem;">
                <button onclick="editScale('${s.id}')" style="background:none; border:none; color:var(--accent); cursor:pointer;"><i data-lucide="edit-3" style="width:16px;"></i></button>
                <button onclick="deleteScale('${s.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i data-lucide="trash-2" style="width:16px;"></i></button>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
};

window.newScale = () => {
    editingScaleId = null;
    document.getElementById('scale-name').value = '';
    document.getElementById('scale-desc').value = '';
    showPView('scale-editor', 'New Unit Scale');
};

window.editScale = (id) => {
    const db = JSON.parse(localStorage.getItem('scales_db') || '[]');
    const s = db.find(x => x.id == id);
    if (!s) return;
    editingScaleId = id;
    document.getElementById('scale-name').value = s.name;
    document.getElementById('scale-desc').value = s.description;
    showPView('scale-editor', 'Edit Scale');
};

window.saveScale = () => {
    const db = JSON.parse(localStorage.getItem('scales_db') || '[]');
    const s = {
        id: editingScaleId || Date.now(),
        name: document.getElementById('scale-name').value.trim(),
        description: document.getElementById('scale-desc').value.trim()
    };
    if (!s.name) { alert('Scale ID is required'); return; }

    if (editingScaleId) {
        const idx = db.findIndex(x => x.id === editingScaleId);
        db[idx] = s;
    } else {
        db.push(s);
    }
    localStorage.setItem('scales_db', JSON.stringify(db));
    showToast('Scale saved', 'success', 'check-circle');
    goBack();
};

window.deleteScale = (id) => {
    window.showConfirm('Delete this scale definition?', () => {
        let db = JSON.parse(localStorage.getItem('scales_db') || '[]');
        db = db.filter(x => x.id != id);
        localStorage.setItem('scales_db', JSON.stringify(db));
        window.renderScaleList();
    });
};

// Tag Management
let editingTagId = null;
window.renderTagList = () => {
    const db = JSON.parse(localStorage.getItem('tags') || '[]');
    const list = document.getElementById('tags-db-list');
    if (!db.length) {
        list.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.5; font-size:0.8rem;">No tags defined</div>';
        return;
    }
    list.innerHTML = db.map(t => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:1rem; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
                   <i data-lucide="tag" style="width:14px; color:#10b981;"></i> ${t.name}
                   <span style="font-size:0.6rem; background:var(--accent); color:white; padding:2px 6px; border-radius:4px; font-weight:800;">${t.group || 'General'}</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.25rem;">${t.description || 'No description'}</div>
            </div>
            <div style="display:flex; gap:0.5rem;">
                <button onclick="editTag('${t.id}')" style="background:none; border:none; color:var(--accent); cursor:pointer;"><i data-lucide="edit-3" style="width:16px;"></i></button>
                <button onclick="deleteTag('${t.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i data-lucide="trash-2" style="width:16px;"></i></button>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
};

window.newTag = () => {
    editingTagId = null;
    document.getElementById('tag-name').value = '';
    document.getElementById('tag-group').value = '';
    document.getElementById('tag-desc').value = '';
    document.getElementById('tag-status').value = 'Active';
    showPView('tag-editor', 'New Analytics Tag');
};

window.editTag = (id) => {
    const db = JSON.parse(localStorage.getItem('tags') || '[]');
    const t = db.find(x => x.id == id);
    if (!t) return;
    editingTagId = id;
    document.getElementById('tag-name').value = t.name;
    document.getElementById('tag-group').value = t.group || '';
    document.getElementById('tag-desc').value = t.description || '';
    document.getElementById('tag-status').value = t.status || 'Active';
    showPView('tag-editor', 'Edit Tag');
};

window.saveTag = () => {
    const db = JSON.parse(localStorage.getItem('tags') || '[]');
    const t = {
        id: editingTagId || Date.now(),
        name: document.getElementById('tag-name').value.trim(),
        group: document.getElementById('tag-group').value.trim(),
        description: document.getElementById('tag-desc').value.trim(),
        status: document.getElementById('tag-status').value,
        updateTime: new Date().toISOString()
    };
    if (!t.name) { alert('Tag Name is required'); return; }

    if (editingTagId) {
        const idx = db.findIndex(x => x.id === editingTagId);
        db[idx] = t;
    } else {
        db.push(t);
    }
    localStorage.setItem('tags', JSON.stringify(db));
    showToast('Tag saved', 'success', 'check-circle');
    goBack();
};

window.deleteTag = (id) => {
    window.showConfirm('Delete this tag definition?', () => {
        let db = JSON.parse(localStorage.getItem('tags') || '[]');
        db = db.filter(x => x.id != id);
        localStorage.setItem('tags', JSON.stringify(db));
        window.renderTagList();
    });
};

// Project Management
let editingProjId = null;
window.renderProjectList = () => {
    const db = JSON.parse(localStorage.getItem('projects') || '[]');
    const list = document.getElementById('projects-db-list');
    if (!db.length) {
        list.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.5; font-size:0.8rem;">No projects defined</div>';
        return;
    }
    list.innerHTML = db.map(p => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:1rem; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
                   <i data-lucide="briefcase" style="width:14px; color:#8b5cf6;"></i> ${p.name}
                   <span style="font-size:0.6rem; background:rgba(139,92,246,0.1); color:var(--accent); padding:2px 6px; border-radius:4px; font-weight:800;">${p.category || 'Standard'}</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.25rem;">Mgr: ${p.manager || '-'} | Budget: ${p.currency || 'IDR'} ${parseFloat(p.budget).toLocaleString()}</div>
            </div>
            <div style="display:flex; gap:0.5rem;">
                <button onclick="editProject('${p.id}')" style="background:none; border:none; color:var(--accent); cursor:pointer;"><i data-lucide="edit-3" style="width:16px;"></i></button>
                <button onclick="deleteProject('${p.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i data-lucide="trash-2" style="width:16px;"></i></button>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
};

window.newProject = () => {
    editingProjId = null;
    document.getElementById('proj-name').value = '';
    document.getElementById('proj-cat').value = '';
    document.getElementById('proj-manager').value = '';
    document.getElementById('proj-start').value = '';
    document.getElementById('proj-end').value = '';
    document.getElementById('proj-budget').value = '0';
    document.getElementById('proj-currency').value = 'IDR';
    document.getElementById('proj-desc').value = '';
    document.getElementById('proj-status').value = 'Active';
    showPView('project-editor', 'New Project Strategy');
};

window.editProject = (id) => {
    const db = JSON.parse(localStorage.getItem('projects') || '[]');
    const p = db.find(x => x.id == id);
    if (!p) return;
    editingProjId = id;
    document.getElementById('proj-name').value = p.name;
    document.getElementById('proj-cat').value = p.category || '';
    document.getElementById('proj-manager').value = p.manager || '';
    document.getElementById('proj-start').value = p.start || '';
    document.getElementById('proj-end').value = p.end || '';
    document.getElementById('proj-budget').value = p.budget || 0;
    document.getElementById('proj-currency').value = p.currency || 'IDR';
    document.getElementById('proj-desc').value = p.description || '';
    document.getElementById('proj-status').value = p.status || 'Active';
    showPView('project-editor', 'Edit Project');
};

window.saveProject = () => {
    const db = JSON.parse(localStorage.getItem('projects') || '[]');
    const p = {
        id: editingProjId || Date.now(),
        name: document.getElementById('proj-name').value.trim(),
        category: document.getElementById('proj-cat').value.trim(),
        manager: document.getElementById('proj-manager').value.trim(),
        start: document.getElementById('proj-start').value,
        end: document.getElementById('proj-end').value,
        budget: parseFloat(document.getElementById('proj-budget').value) || 0,
        currency: document.getElementById('proj-currency').value,
        description: document.getElementById('proj-desc').value.trim(),
        status: document.getElementById('proj-status').value,
        updateTime: new Date().toISOString()
    };
    if (!p.name) { alert('Project Name is required'); return; }

    if (editingProjId) {
        const idx = db.findIndex(x => x.id === editingProjId);
        db[idx] = p;
    } else {
        db.push(p);
    }
    localStorage.setItem('projects', JSON.stringify(db));
    showToast('Project initiated', 'success', 'check-circle');
    goBack();
};

window.deleteProject = (id) => {
    window.showConfirm('Terminate this project record?', () => {
        let db = JSON.parse(localStorage.getItem('projects') || '[]');
        db = db.filter(x => x.id != id);
        localStorage.setItem('projects', JSON.stringify(db));
        window.renderProjectList();
    });
};

document.addEventListener('DOMContentLoaded', initSettings);

// QR Cloud Setup Functions
function toggleUrlVisibility() {
  const input = document.getElementById('s-cloud-url');
  const icon = document.getElementById('eye-icon');
  if (!input || !icon) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
}

let html5QrCode = null;
function scanCloudQR() {
  const reader = document.getElementById('reader');
  if (!reader) return;
  
  document.getElementById('scanner-overlay').style.display = 'flex';
  html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
    document.getElementById('s-cloud-url').value = decodedText;
    localStorage.setItem('cloud_sheet_url', decodedText);
    showToast('Cloud URL updated via QR', 'success', 'check-circle');
    stopScanner();
    if (typeof renderCloudStatus === 'function') renderCloudStatus();
  }).catch(err => {
    console.error(err);
    stopScanner();
    showToast('Camera error or blocked', 'error', 'camera-off');
  });
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      document.getElementById('scanner-overlay').style.display = 'none';
    }).catch(() => {
      document.getElementById('scanner-overlay').style.display = 'none';
    });
  } else {
    document.getElementById('scanner-overlay').style.display = 'none';
  }
}

function showConnectionQR() {
  const url = localStorage.getItem('cloud_sheet_url');
  if (!url) {
    showToast('Setup Cloud Node first', 'error', 'alert-circle');
    return;
  }
  
  const qrDiv = document.getElementById('connection-qrcode');
  if (!qrDiv) return;
  
  qrDiv.innerHTML = '';
  new QRCode(qrDiv, {
    text: url,
    width: 256,
    height: 256,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
  
  document.getElementById('qr-display-overlay').style.display = 'flex';
}
