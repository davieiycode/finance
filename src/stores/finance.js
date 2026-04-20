import { defineStore } from 'pinia'

// Schema Alignment: Internal state now uses EXACT Vault Ledger column names
const isSafe = typeof localStorage !== 'undefined'
const safeList = (key) => {
  if (!isSafe) return []
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

const initTransactions = () => {
  const txs = safeList('transactions')
  if (txs.length === 0 && isSafe) {
    const defaultTx = [
      { 
        transactionID: 'TX-1711200001', 
        date: '2024-03-24', 
        time: '13:26', 
        category: 'Makanan & Minuman', 
        merchant: 'Indomaret', 
        itemName: 'Mie Telur 3 Ayam', 
        amountPerUnit: 5300, 
        quantity: 2, 
        unitScale: 'pcs', 
        type: 'Expense', 
        cleared: 'yes', 
        paymentSourceAccount: 'Cash', 
        beneficiaryAccount: '', 
        receipt: '', 
        membershipID: '',
        voucherID: '',
        localPhoto: '',
        tags: 'harian, belanja', 
        projects: '', 
        author: 'Alex', 
        discount: 0, 
        fee: 0, 
        total: 10600, 
        description: 'Beli mie telur', 
        currency: 'IDR', 
        exchangeRate: 1 
      }
    ]
    localStorage.setItem('transactions', JSON.stringify(defaultTx))
    return defaultTx
  }
  return txs
}

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: initTransactions(),
    accounts: safeList('accounts'),
    merchants: safeList('merchants'),
    items: safeList('items'),
    members: safeList('members'),
    vouchers: safeList('vouchers'),
    budgets: safeList('budgets'),
    goals: safeList('goals'),
    receipts: safeList('receipts'),
    categories: safeList('categories'),
    unitScales: safeList('unitScales'),
    tags: safeList('tags'),
    projects: safeList('projects'),
    authors: safeList('authors'),
    // Notification & Progress State
    notifications: [],
    syncProgress: 0,
    isSyncing: false
  }),
  actions: {
    notify(message, type = 'info') {
      const id = Date.now()
      this.notifications.push({ id, message, type })
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id)
      }, 3000)
    },
    setSyncProgress(val) {
      this.syncProgress = val
    },
    resolveIcon(categoryName, txType) {
      if (!categoryName || !categoryName.trim()) return this.getTypeFallbackIcon(txType)
      const target = categoryName.trim().toLowerCase()
      const cat = this.categories.find(c => (c.category || '').trim().toLowerCase() === target)
      return this.sanitizeIcon(cat?.icon) || this.getTypeFallbackIcon(txType)
    },

    sanitizeIcon(iconName) {
      if (!iconName || !iconName.trim()) return null
      let name = iconName.trim().toLowerCase().replace(/-/g, '_')
      const mapping = {
        'piggy_bank': 'savings',
        'banknote': 'payments',
        'moving_stats': 'monitoring',
        'file_text': 'description',
        'user_check': 'person_check',
        'shopping_bag': 'shopping_basket',
        'credit_card': 'credit_card',
        'briefcase': 'work'
      }
      return mapping[name] || name
    },

    getAccount(name) {
      if (!name) return null
      return this.accounts.find(a => (a.accountName || '').toLowerCase() === name.toLowerCase())
    },

    getTypeFallbackIcon(txType) {
      if (txType === 'Income') return 'payments'
      if (txType === 'Transfer' || txType === 'Internal Transfer' || txType === 'Internal') return 'sync'
      if (txType === 'Investment') return 'trending_up'
      if (txType === 'Savings') return 'savings'
      return 'shopping_cart'
    },

    // Generic Save methods
    saveAll() {
      if (!isSafe) return
      try {
        localStorage.setItem('transactions', JSON.stringify(this.transactions))
        localStorage.setItem('accounts', JSON.stringify(this.accounts))
        localStorage.setItem('merchants', JSON.stringify(this.merchants))
        localStorage.setItem('items', JSON.stringify(this.items))
        localStorage.setItem('members', JSON.stringify(this.members))
        localStorage.setItem('vouchers', JSON.stringify(this.vouchers))
        localStorage.setItem('budgets', JSON.stringify(this.budgets))
        localStorage.setItem('goals', JSON.stringify(this.goals))
        localStorage.setItem('receipts', JSON.stringify(this.receipts))
        localStorage.setItem('categories', JSON.stringify(this.categories))
        localStorage.setItem('unitScales', JSON.stringify(this.unitScales))
        localStorage.setItem('tags', JSON.stringify(this.tags))
        localStorage.setItem('projects', JSON.stringify(this.projects))
        localStorage.setItem('authors', JSON.stringify(this.authors))
      } catch (e) {
        console.error('Storage stabilization failed:', e)
        this.notify('Kapasitas Brankas Penuh (Penyimpanan Penuh)', 'error')
      }
    },

    // Transaction Actions
    addTransaction(tx) {
      if (!tx.transactionID) tx.transactionID = 'TX-' + Date.now()
      this.transactions.push(tx)
      this.saveAll()
      this.handleVoucherUsage(tx)
      this.notify('Catatan Transaksi Berhasil Disimpan', 'success')
    },
    updateTransaction(tx) {
      const idx = this.transactions.findIndex(t => t.transactionID === tx.transactionID)
      if (idx !== -1) {
        this.transactions[idx] = tx
        this.saveAll()
      }
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(t => t.transactionID !== id)
      this.saveAll()
    },

    handleVoucherUsage(tx) {
      if (!tx.voucherID) return
      const vIdx = this.vouchers.findIndex(v => v.voucherName === tx.voucherID || v.voucherID === tx.voucherID)
      if (vIdx !== -1) {
        const v = this.vouchers[vIdx]
        if (v.isSingleUse) {
           v.status = 'Terpakai'
        } else if (v.balance > 0) {
           v.balance -= (tx.discount || 0)
           if (v.balance <= 0) { v.balance = 0; v.status = 'Habis' }
        }
        this.saveAll()
      }
    },

    // Universal CRUD helpers...
    addAccount(acc) { 
      if (!acc.accountID) acc.accountID = 'ACC-' + Date.now()
      acc.updateTime = new Date().toISOString()
      this.accounts.push(acc)
      this.saveAll()
      this.pushToCloud()
      this.notify('Rekening Berhasil Ditambahkan', 'success')
    },
    updateAccount(acc) { 
      const idx = this.accounts.findIndex(a => a.accountID === acc.accountID)
      if (idx !== -1) { 
        acc.updateTime = new Date().toISOString()
        this.accounts[idx] = acc
        this.saveAll()
        this.pushToCloud()
        this.notify('Rekening Diperbarui', 'info')
      } 
    },
    deleteAccount(id) { 
      this.accounts = this.accounts.filter(a => a.accountID !== id)
      this.saveAll()
      this.pushToCloud()
      this.notify('Rekening Dihapus', 'warning')
    },

    addItem(item) { if (!item.itemID) item.itemID = 'ITEM-' + Date.now(); item.updateTime = new Date().toISOString(); this.items.push(item); this.saveAll(); this.pushToCloud(); this.notify('Barang Berhasil Didaftarkan', 'success') },
    updateItem(item) { const idx = this.items.findIndex(i => i.itemID === item.itemID); if (idx !== -1) { item.updateTime = new Date().toISOString(); this.items[idx] = item; this.saveAll(); this.pushToCloud(); this.notify('Barang Diperbarui', 'info') } },
    deleteItem(id) { this.items = this.items.filter(i => i.itemID !== id); this.saveAll(); this.pushToCloud(); this.notify('Barang Dihapus', 'warning') },

    addMerchant(m) { if (!m.merchantID) m.merchantID = 'MCH-' + Date.now(); m.updateTime = new Date().toISOString(); this.merchants.push(m); this.saveAll(); this.pushToCloud(); this.notify('Vendor Aktif', 'success') },
    updateMerchant(m) { const idx = this.merchants.findIndex(i => i.merchantID === m.merchantID); if (idx !== -1) { m.updateTime = new Date().toISOString(); this.merchants[idx] = m; this.saveAll(); this.pushToCloud(); this.notify('Vendor Diperbarui', 'info') } },
    deleteMerchant(id) { this.merchants = this.merchants.filter(i => i.merchantID !== id); this.saveAll(); this.pushToCloud(); this.notify('Vendor Dinonaktifkan', 'warning') },

    addMember(m) { if (!m.memberID) m.memberID = 'MEM-' + Date.now(); this.members.push(m); this.saveAll(); this.pushToCloud(); this.notify('Member Terdaftar', 'success') },
    updateMember(m) { const idx = this.members.findIndex(i => i.memberID === m.memberID); if (idx !== -1) { this.members[idx] = m; this.saveAll(); this.pushToCloud(); this.notify('Profil Member Diperbarui', 'info') } },
    deleteMember(id) { this.members = this.members.filter(i => i.memberID !== id); this.saveAll(); this.pushToCloud(); this.notify('Profil Member Dihapus', 'warning') },

    addVoucher(v) { if (!v.voucherID) v.voucherID = 'VOU-' + Date.now(); v.updateTime = new Date().toISOString(); this.vouchers.push(v); this.saveAll(); this.pushToCloud(); this.notify('Voucher Diterbitkan', 'success') },
    updateVoucher(v) { const idx = this.vouchers.findIndex(i => i.voucherID === v.voucherID); if (idx !== -1) { v.updateTime = new Date().toISOString(); this.vouchers[idx] = v; this.saveAll(); this.pushToCloud(); this.notify('Voucher Diatur Ulang', 'info') } },
    deleteVoucher(id) { this.vouchers = this.vouchers.filter(i => i.voucherID !== id); this.saveAll(); this.pushToCloud(); this.notify('Voucher Dinonaktifkan', 'warning') },

    addBudget(b) { if (!b.budgetID) b.budgetID = 'BUD-' + Date.now(); b.updateTime = new Date().toISOString(); this.budgets.push(b); this.saveAll(); this.pushToCloud(); this.notify('Strategi Anggaran Disimpan', 'success') },
    updateBudget(b) { const idx = this.budgets.findIndex(i => i.budgetID === b.budgetID); if (idx !== -1) { b.updateTime = new Date().toISOString(); this.budgets[idx] = b; this.saveAll(); this.pushToCloud(); this.notify('Anggaran Dikonfigurasi Ulang', 'info') } },
    deleteBudget(id) { this.budgets = this.budgets.filter(i => i.budgetID !== id); this.saveAll(); this.pushToCloud(); this.notify('Anggaran Dihapus', 'warning') },

    addGoal(g) { if (!g.goalID) g.goalID = 'GOA-' + Date.now(); g.updateTime = new Date().toISOString(); this.goals.push(g); this.saveAll(); this.pushToCloud(); this.notify('Target Ditetapkan', 'success') },
    updateGoal(g) { const idx = this.goals.findIndex(i => i.goalID === g.goalID); if (idx !== -1) { g.updateTime = new Date().toISOString(); this.goals[idx] = g; this.saveAll(); this.pushToCloud(); this.notify('Target Diperbarui', 'info') } },
    deleteGoal(id) { this.goals = this.goals.filter(i => i.goalID !== id); this.saveAll(); this.pushToCloud(); this.notify('Target Dibatalkan', 'warning') },

    addReceipt(r) { if (!r.receiptID) r.receiptID = 'RCP-' + Date.now(); this.receipts.push(r); this.saveAll(); this.notify('Nota Berhasil Disimpan', 'success') },
    updateReceipt(r) { const idx = this.receipts.findIndex(i => i.receiptID === r.receiptID); if (idx !== -1) { this.receipts[idx] = r; this.saveAll(); this.notify('Nota Diperbarui', 'info') } },
    deleteReceipt(id) { this.receipts = this.receipts.filter(i => i.receiptID !== id); this.saveAll(); this.notify('Nota Dihapus', 'warning') },

    // Cloud Sync...
    async pullFromCloud(mode = 'overwrite') {
      const url = isSafe ? localStorage.getItem('cloud_sheet_url') : null
      if (!url) return false
      this.isSyncing = true
      this.syncProgress = 10
      try {
        const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}get=data`)
        this.syncProgress = 40
        const data = await res.json()
        this.syncProgress = 60
        if (data.status === 'success') {
          const entities = [
            { key: 'transaction', state: 'transactions', id: 'transactionID' },
            { key: 'receipt', state: 'receipts', id: 'receiptID' },
            { key: 'member', state: 'members', id: 'memberID' },
            { key: 'voucher', state: 'vouchers', id: 'voucherID' },
            { key: 'account', state: 'accounts', id: 'accountID' },
            { key: 'merchant', state: 'merchants', id: 'merchantID' },
            { key: 'item', state: 'items', id: 'itemID' },
            { key: 'category', state: 'categories', id: 'categoryID' },
            { key: 'unitScale', state: 'unitScales', id: 'unitScale' },
            { key: 'tag', state: 'tags', id: 'tagID' },
            { key: 'project', state: 'projects', id: 'projectID' },
            { key: 'budget', state: 'budgets', id: 'budgetID' },
            { key: 'goal', state: 'goals', id: 'goalID' },
            { key: 'author', state: 'authors', id: 'authorID' },
            { key: 'settings', state: 'settings', id: 'key' }
          ]

          const unwrapImage = (val) => {
            if (typeof val !== 'string') return val
            let url = val
            // Handle =IMAGE("url") or =IMAGE('url') with optional spaces or leading single quote
            const match = val.match(/^'?=\s*IMAGE\s*\(\s*["'](.+?)["']\s*\)/i)
            if (match) url = match[1]
            
            // Resolve Google Drive URLs to direct links
            if (url.includes('drive.google.com')) {
              const idMatch = url.match(/id=([^&]+)/) || url.match(/\/d\/([^/]+)/)
              if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?id=${idMatch[1]}&export=download`
              }
            }
            return url
          }

          const formatDate = (val) => {
            if (!val) return ''
            const s = String(val)
            // If it starts with YYYY-MM-DD, extract it directly to avoid timezone shifts
            const match = s.match(/^(\d{4}-\d{2}-\d{2})/)
            if (match) return match[1]
            
            const d = new Date(val)
            if (isNaN(d.getTime())) return val
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
          }

          entities.forEach((ent, i) => {
             const rawData = data[ent.key]
             if (!rawData || !Array.isArray(rawData)) return
             
              let incoming = data[ent.key] || []
              if (!Array.isArray(incoming)) return

              if (ent.key === 'transaction') {
                incoming = incoming.map(row => {
                  const r = { ...row }
                  
                  // Handle merged Date/Time columns (supporting 'dateTime', 'date', or 'time')
                  let t = r.time ? String(r.time) : ''
                  let dStr = (r.dateTime || r.date) ? String(r.dateTime || r.date) : ''

                  // Robust extraction: Detect if the incoming string is UTC/ISO or naive local 
                  // If it has 'Z' or a timezone offset, we MUST parse it via Date() to get local time
                  const isIso = dStr.includes('Z') || /[+-]\d{2}(:?\d{2})?$/.test(dStr)

                  if (isIso) {
                    const d = new Date(dStr)
                    if (!isNaN(d.getTime())) {
                      // Always prioritize dateTime for consistency across devices
                      r.date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
                      t = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
                    }
                  } else {
                    // Fallback to naive regex for local strings (like our own legacy format)
                    const isoMatch = dStr.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/)
                    if (isoMatch) {
                      r.date = isoMatch[1]
                      if (!t || t === 'undefined' || t === '00:00') {
                        t = isoMatch[2] || '00:00'
                      }
                    }
                  }
                  
                  // Final Time Sanitization
                  if (t.includes('T')) {
                    t = t.split('T')[1].substring(0, 5)
                  } else if (t.includes(':')) {
                    const parts = t.split(':')
                    t = parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0')
                  }
                  r.time = (t && t !== 'undefined') ? t : '00:00'
                  
                  // Ensure numeric types
                  if (r.total) r.total = Number(r.total)
                  if (r.quantity) r.quantity = Number(r.quantity)
                  if (r.amountPerUnit) r.amountPerUnit = Number(r.amountPerUnit)
                  if (r.discount) r.discount = Number(r.discount)
                  if (r.fee) r.fee = Number(r.fee)
                  
                  if (r.localPhoto) r.localPhoto = unwrapImage(r.localPhoto)
                  if (r.receipt && String(r.receipt).startsWith('=IMAGE')) r.receipt = unwrapImage(r.receipt)

                  return r
                })
              } else {
                 incoming = incoming.map(row => {
                    if (row.dateTime) row.date = formatDate(row.dateTime)
                    if (row.date) row.date = formatDate(row.date)
                    if (row.expiryDate) row.expiryDate = formatDate(row.expiryDate)
                    
                    if (ent.key === 'receipt' && row['foto/dokumen']) {
                      row['foto/dokumen'] = unwrapImage(row['foto/dokumen'])
                    }

                    return row
                 })
              }
             
              if (ent.key === 'settings') {
                 try {
                   const prefs = {}
                   incoming.forEach(s => {
                     try { prefs[s.key] = JSON.parse(s.value) } 
                     catch(e) { prefs[s.key] = s.value }
                   })
                    const currentPrefs = JSON.parse(localStorage.getItem('user_prefs') || '{}')
                    const newPrefs = { ...currentPrefs, ...prefs }
                    localStorage.setItem('user_prefs', JSON.stringify(newPrefs))
                 } catch(e) { console.error('Failed to parse settings', e) }
              } else if (mode === 'merge') {
                 incoming.forEach(inc => {
                    const exists = (this[ent.state] || []).some(cur => cur[ent.id] === inc[ent.id])
                    if (!exists) this[ent.state].push(inc)
                 })
              } else {
                 this[ent.state] = incoming
              }
             this.syncProgress = 60 + Math.floor((i / entities.length) * 35)
          })

          this.saveAll()
          this.syncProgress = 100
          setTimeout(() => { this.isSyncing = false; this.syncProgress = 0 }, 1000)
          this.notify('Data Utama Berhasil Diambil', 'success')
          return true
        }
      } catch (e) { 
        this.isSyncing = false
        this.syncProgress = 0
        this.notify('Kegagalan Sinkronisasi', 'error')
        console.error('Cloud pull failed', e)
        return false 
      }
    },

    forceRefresh() {
      this.isSyncing = true
      this.notify('Memulai Ulang Terminal...', 'info')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    },

    async pushToCloud() {
      const url = isSafe ? localStorage.getItem('cloud_sheet_url') : null
      if (!url) return false
      this.isSyncing = true
      this.syncProgress = 20
      
      const wrapImage = (val) => {
        if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('https'))) {
          return `=IMAGE("${val}")`
        }
        return val
      }
      
      let prefs = {}
      try {
        const raw = localStorage.getItem('user_prefs')
        if (raw) prefs = JSON.parse(raw)
      } catch (e) { console.error('Settings parse failed', e) }

      const payload = {
        transaction: this.transactions.map(t => {
          // Robustly combine date and time into a Date object to get an unambiguous ISO string
          let isoDateTime = ''
          let outDate = t.date
          let outTime = t.time
          try {
             // Create a local date object from the naive strings
             const d = new Date(`${t.date}T${t.time || '00:00'}:00`)
             if (!isNaN(d.getTime())) {
                isoDateTime = d.toISOString()
                // Format the individual Date and Time columns as UTC for spreadsheet consistency
                outDate = d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0')
                outTime = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0')
             } else {
                isoDateTime = `${t.date}T${t.time || '00:00'}:00`
             }
          } catch(e) {
             isoDateTime = `${t.date}T${t.time || '00:00'}:00`
          }

          return {
            ...t,
            date: outDate,
            time: outTime,
            dateTime: isoDateTime,
            localPhoto: wrapImage(t.localPhoto)
          }
        }),
        account: this.accounts,
        merchant: this.merchants,
        item: this.items,
        member: this.members,
        voucher: this.vouchers,
        budget: this.budgets,
        goal: this.goals,
        receipt: this.receipts.map(r => ({
          ...r,
          'foto/dokumen': wrapImage(r['foto/dokumen'])
        })),
        category: this.categories,
        unitScale: this.unitScales,
        tag: this.tags,
        project: this.projects,
        author: this.authors,
        settings: Object.entries(prefs || {}).map(([k, v]) => ({ key: k, value: typeof v === 'object' ? JSON.stringify(v) : v })),
        updateTime: new Date().toISOString()
      }
      this.syncProgress = 50
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        })
        this.syncProgress = 100
        setTimeout(() => { this.isSyncing = false; this.syncProgress = 0 }, 1000)
        this.notify('Catatan Berhasil Diunggah', 'success')
        return true
      } catch (e) { 
        this.isSyncing = false
        this.syncProgress = 0
        this.notify('Kegagalan Transmisi', 'error')
        console.error('Cloud push failed', e); 
        return false 
      }
    },

    // Metadata Actions
    addCategory(c) { if (!c.categoryID) c.categoryID = 'CAT-' + Date.now(); c.updateTime = new Date().toISOString(); this.categories.push(c); this.saveAll() },
    updateCategory(c) { const idx = this.categories.findIndex(i => i.categoryID === c.categoryID); if (idx !== -1) { c.updateTime = new Date().toISOString(); this.categories[idx] = c; this.saveAll() } },
    deleteCategory(id) { this.categories = this.categories.filter(i => i.categoryID !== id); this.saveAll() },

    addUnitScale(u) { if (!u.unitScale) return; this.unitScales.push(u); this.saveAll() },
    deleteUnitScale(val) { this.unitScales = this.unitScales.filter(i => i.unitScale !== val); this.saveAll() },

    addTag(t) { if (!t.tagID) t.tagID = 'TAG-' + Date.now(); t.updateTime = new Date().toISOString(); this.tags.push(t); this.saveAll() },
    updateTag(t) { const idx = this.tags.findIndex(i => i.tagID === t.tagID); if (idx !== -1) { t.updateTime = new Date().toISOString(); this.tags[idx] = t; this.saveAll() } },
    deleteTag(id) { this.tags = this.tags.filter(i => i.tagID !== id); this.saveAll() },

    addProject(p) { if (!p.projectID) p.projectID = 'PRJ-' + Date.now(); p.updateTime = new Date().toISOString(); this.projects.push(p); this.saveAll() },
    updateProject(p) { const idx = this.projects.findIndex(i => i.projectID === p.projectID); if (idx !== -1) { p.updateTime = new Date().toISOString(); this.projects[idx] = p; this.saveAll() } },
    deleteProject(id) { this.projects = this.projects.filter(i => i.projectID !== id); this.saveAll() },

    addAuthor(a) { if (!a.authorID) a.authorID = 'AUT-' + Date.now(); a.updateTime = new Date().toISOString(); this.authors.push(a); this.saveAll() },
    updateAuthor(a) { const idx = this.authors.findIndex(i => i.authorID === a.authorID); if (idx !== -1) { a.updateTime = new Date().toISOString(); this.authors[idx] = a; this.saveAll() } },
    deleteAuthor(id) { this.authors = this.authors.filter(i => i.authorID !== id); this.saveAll() },
    // Merge Engine
    mergeEntities(type, sourceName, targetName) {
      console.log(`Merging ${type}: ${sourceName} -> ${targetName}`)
      
      // 1. Update Transactions
      this.transactions.forEach(t => {
        if (type === 'categories' && t.category === sourceName) t.category = targetName
        if (type === 'items' && t.itemName === sourceName) t.itemName = targetName
        if (type === 'merchants' && t.merchant === sourceName) t.merchant = targetName
        if (type === 'accounts') {
          if (t.paymentSourceAccount === sourceName) t.paymentSourceAccount = targetName
          if (t.beneficiaryAccount === sourceName) t.beneficiaryAccount = targetName
        }
        if (type === 'tags') {
          const tags = t.tags ? String(t.tags).split(',').map(s => s.trim()) : []
          if (tags.includes(sourceName)) {
            const idx = tags.indexOf(sourceName)
            if (!tags.includes(targetName)) tags[idx] = targetName
            else tags.splice(idx, 1)
            t.tags = tags.join(', ')
          }
        }
        if (type === 'projects') {
          const prjs = t.projects ? String(t.projects).split(',').map(s => s.trim()) : []
          if (prjs.includes(sourceName)) {
            const idx = prjs.indexOf(sourceName)
            if (!prjs.includes(targetName)) prjs[idx] = targetName
            else prjs.splice(idx, 1)
            t.projects = prjs.join(', ')
          }
        }
        if (type === 'authors' && t.author === sourceName) t.author = targetName
        if (type === 'unitScales' && t.unitScale === sourceName) t.unitScale = targetName
      })

      // 2. Update Metadata References in other catalogs
      this.items.forEach(i => {
        if (type === 'categories' && i.itemCategory === sourceName) i.itemCategory = targetName
        if (type === 'unitScales' && i.unitScale === sourceName) i.unitScale = targetName
      })
      this.budgets.forEach(b => {
        if (type === 'categories' && b.category === sourceName) b.category = targetName
      })
      this.goals.forEach(g => {
        if (type === 'categories' && g.category === sourceName) g.category = targetName
      })

      // 3. Remove source record from its own catalog
      if (type === 'items') this.items = this.items.filter(i => i.itemName !== sourceName)
      if (type === 'merchants') this.merchants = this.merchants.filter(m => m.merchantName !== sourceName)
      if (type === 'accounts') this.accounts = this.accounts.filter(a => a.accountName !== sourceName)
      if (type === 'tags') this.tags = this.tags.filter(t => t.tagName !== sourceName)
      if (type === 'projects') this.projects = this.projects.filter(p => p.projectName !== sourceName)
      if (type === 'categories') this.categories = this.categories.filter(c => c.category !== sourceName)
      if (type === 'authors') this.authors = this.authors.filter(a => a.authorName !== sourceName)
      if (type === 'unitScales') this.unitScales = this.unitScales.filter(u => u.unitScale !== sourceName)

      this.saveAll()
      this.notify(`Penggabungan Berhasil: ${sourceName} digabung ke ${targetName}`, 'success')
    },
  }
})
