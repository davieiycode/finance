
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

const APP_VERSION = 'v2.6.0';
const BUILD_DATE = 'Apr 02, 2026 00:12';

if (typeof window.SyncHub === 'undefined') {
    window.SyncHub = {
        start: (title, status) => console.log('SyncHub Start:', title, status),
        update: (percent, status) => console.log('SyncHub Update:', percent, status),
        finish: (msg) => alert(msg)
    };
}

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
      'p-view-import-mapping': 'Matrix Mapping'
    };
    const vId = prevId.replace('p-view-', '');
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

  sheets.forEach(sh => {
    const name = sh.getName().toLowerCase().trim();
    const data = sh.getDataRange().getValues();
    if (data.length < 2) { response[name + 's'] = []; return; }

    const headers = data.shift();
    const records = data.map(row => {
      let r = {};
      headers.forEach((h, i) => {
        let v = row[i];
        let hName = (h || '').toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!hName) return;

        // Normalization Mapping
        if (hName === 'accountid' || hName === 'itemid' || hName === 'merchantid' || hName === 'transactionid') r.id = v;
        else if (hName === 'accountname' || hName === 'itemname' || hName === 'merchantname') r.name = v;
        else if (hName === 'accounttype' || hName === 'type' || (hName === 'category' && name === 'merchant')) r.type = v;
        else if (hName === 'provider') r.provider = v;
        else if (hName === 'currentbalance' || hName === 'balance') r.balance = parseFloat(v) || 0;
        else if (hName === 'status') r.status = v;
        else if (hName === 'itemcategory' || hName === 'category') r.category = v;
        else if (hName === 'manufacturer') r.manu = v;
        else if (hName === 'model') r.model = v;
        else if (hName === 'stockkeepingunit' || hName === 'sku') r.sku = v;
        else if (hName === 'defaultunitprice' || hName === 'price') r.price = parseFloat(v) || 0;
        else if (hName === 'unit') r.unit = v;
        else if (hName === 'warrantyexpirydate' || hName === 'expirydate' || hName === 'expiry') r.expiry = v;
        else if (hName === 'notes') r.notes = v;
        
        // Transaction Specific Mapping
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
          else if (hName === 'category') r.category = v;
          else if (hName === 'type') r.type = v;
          else if (hName === 'description') r.description = v;
          else if (hName === 'amountperunit') r.amount = parseFloat(v) || 0;
          else if (hName === 'quantity') r.qty = parseFloat(v) || 1;
          else if (hName === 'paymentsourceaccount') r.accountPayment = v;
          else if (hName === 'beneficiaryaccount') r.accountReceived = v;
          else if (hName === 'total') r.total = parseFloat(v) || 0;
        }
      });
      return r;
    });

    // Match app's expected keys
    let finalKey = name + 's'; 
    if (name === 'transaction') finalKey = 'transactions';
    if (name === 'membership') finalKey = 'membership_cards';
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
        'Transaction ID', 'Date', 'Time', 'Category', 'Category Group', 
        'Merchant', 'Item Name', 'Description', 'Amount (per Unit)', 'Currency', 
        'Exchange Rate', 'Quantity', 'Unit Scale', 'Type', 'Cleared', 
        'Payment Source Account', 'Beneficiary Account', 'Receipt', 'Analytics Tags', 'Associated Project', 
        'Author', 'Discount', 'Additional Fee', 'Total', 'Budget Amount', 'Budget Period', 'Flow', 'Year', 'Month', 'Update Time', 'XP'
      ]},
      { key: 'accounts', sheetName: 'account', headers: [
        'Account ID', 'Account Name', 'Account Type', 'Provider', 'Currency', 
        'Opening Balance', 'Opening Date', 'Current Balance', 'Status', 'Owner', 
        'Account Number / ID', 'Branch / Location', 'Notes', 'Account Image', 'Update Time'
      ]},
      { key: 'merchants', sheetName: 'merchant', headers: [
        'Merchant ID', 'Merchant Name', 'Category', 'Primary Contact Name', 'Phone Number', 
        'Email', 'Website', 'Physical Address', 'City', 'Country', 
        'Preferred Payment Method', 'Bank Account Details', 'Notes', 'Status', 'Update Time'
      ]},
      { key: 'items', sheetName: 'item', headers: [
        'Item ID', 'Item Name', 'Item Category', 'Item Category Group', 'Item Image', 
        'Manufacturer', 'Model', 'Unit', 'Default Unit Price', 'Currency', 
        'Warranty / Expiry Date', 'Stock Keeping Unit', 'Notes', 'Status', 'Update Time'
      ]},
      { key: 'membership_cards', sheetName: 'membership', headers: ['ID', 'Name', 'Code', 'Expiry', 'Since', 'Notes', 'Type', 'Color'] }
    ];

    entities.forEach(ent => {
      const data = contents[ent.key];
      if (!data) return;
      
      let sheet = ss.getSheetByName(ent.sheetName);
      if (!sheet) { sheet = ss.insertSheet(ent.sheetName); }
      
      const rows = [ent.headers];
      data.forEach(item => {
        const row = ent.headers.map(h => {
          const hNorm = h.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          if (hNorm === 'accountid' || hNorm === 'itemid' || hNorm === 'merchantid' || hNorm === 'transactionid') return item.id;
          if (hNorm === 'accountname' || hNorm === 'itemname' || hNorm === 'merchantname') return item.name;
          if (hNorm === 'currentbalance') return item.balance || 0;
          if (hNorm === 'defaultunitprice') return item.price || 0;
          if (hNorm === 'stockkeepingunit') return item.sku || '';
          if (hNorm === 'warrantyexpirydate') return item.expiry || '';
          if (hNorm === 'manufacturer') return item.manu || '';
          if (hNorm === 'itemcategory') return item.category || '';
          if (hNorm === 'updatetime') return Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm");
          
          if (ent.key === 'merchants' && hNorm === 'category') return item.type || '';
          
          if (ent.key === 'transactions') {
            if (h === 'Payment Source Account') return item.accountPayment || '';
            if (h === 'Beneficiary Account') return item.accountReceived || '';
            if (h === 'Amount (per Unit)') return item.amount || 0;
            if (h === 'Analytics Tags') return (item.tags || []).join(', ');
            if (h === 'Associated Project') return (item.projects || []).join(', ');
            if (h === 'Cleared') return item.cleared ? 'Yes' : 'No';
            if (h === 'Flow') return item.type === 'Income' ? 'IN' : 'OUT';
            if (h === 'Year' && item.date) return item.date.split('-')[0];
            if (h === 'Month' && item.date) return item.date.split('-')[1];
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
}`;
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
  if (window.triggerCloudSync && mode === 'pull') {
      window.triggerCloudSync(mode);
  } else if (window.triggerCloudPush && mode === 'push') {
      window.triggerCloudPush();
  }
};

window.updateApp = () => {
    if (confirm('Clear cache and reload the application?')) {
        location.reload(true);
    }
};

document.addEventListener('DOMContentLoaded', initSettings);
