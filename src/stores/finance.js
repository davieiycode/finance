import { defineStore } from 'pinia'

// Schema Alignment: Internal state now uses EXACT spreadsheet column names
const isSafe = typeof localStorage !== 'undefined'
const initTransactions = () => {
  if (!isSafe) return []
  let txs = JSON.parse(localStorage.getItem('transactions') || '[]')
  if (txs.length === 0) {
    txs = [
      { 
        transactionID: 'TX-1711200001', 
        date: '2024-03-24', 
        time: '13:26', 
        category: 'Food & Beverage', 
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
        tags: 'daily, groceries', 
        projects: '', 
        author: 'Alex', 
        discount: 0, 
        fee: 0, 
        total: 10600, 
        updateTime: new Date().toISOString(), 
        description: 'Beli mie telur', 
        currency: 'IDR', 
        exchangeRate: 1 
      }
    ]
    localStorage.setItem('transactions', JSON.stringify(txs))
  }
  return txs
}

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: initTransactions(),
    accounts: isSafe ? JSON.parse(localStorage.getItem('accounts') || '[]') : [],
    merchants: isSafe ? JSON.parse(localStorage.getItem('merchants') || '[]') : [],
    items: isSafe ? JSON.parse(localStorage.getItem('items') || '[]') : [],
    members: isSafe ? JSON.parse(localStorage.getItem('members') || '[]') : [],
    vouchers: isSafe ? JSON.parse(localStorage.getItem('vouchers') || '[]') : [],
    budgets: isSafe ? JSON.parse(localStorage.getItem('budgets') || '[]') : [],
    goals: isSafe ? JSON.parse(localStorage.getItem('goals') || '[]') : [],
    receipts: isSafe ? JSON.parse(localStorage.getItem('receipts') || '[]') : [],
    categories: isSafe ? JSON.parse(localStorage.getItem('categories') || '[]') : [],
    unitScales: isSafe ? JSON.parse(localStorage.getItem('unitScales') || '[]') : [],
    tags: isSafe ? JSON.parse(localStorage.getItem('tags') || '[]') : [],
    projects: isSafe ? JSON.parse(localStorage.getItem('projects') || '[]') : [],
    authors: isSafe ? JSON.parse(localStorage.getItem('authors') || '[]') : [],
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
    // Generic Save methods
    saveAll() {
      if (!isSafe) return
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
    },

    // Transaction Actions
    addTransaction(tx) {
      if (!tx.transactionID) tx.transactionID = 'TX-' + Date.now()
      tx.updateTime = new Date().toISOString()
      this.transactions.push(tx)
      this.saveAll()
      this.handleVoucherUsage(tx)
      this.notify('Expedition Log Stabilized', 'success')
    },
    updateTransaction(tx) {
      const idx = this.transactions.findIndex(t => t.transactionID === tx.transactionID)
      if (idx !== -1) {
        tx.updateTime = new Date().toISOString()
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
           v.status = 'Used'
        } else if (v.balance > 0) {
           v.balance -= (tx.discount || 0)
           if (v.balance <= 0) { v.balance = 0; v.status = 'Exhausted' }
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
      this.notify('Account Authorized', 'success')
    },
    updateAccount(acc) { 
      const idx = this.accounts.findIndex(a => a.accountID === acc.accountID)
      if (idx !== -1) { 
        acc.updateTime = new Date().toISOString()
        this.accounts[idx] = acc
        this.saveAll()
        this.pushToCloud()
        this.notify('Account Updated', 'info')
      } 
    },
    deleteAccount(id) { 
      this.accounts = this.accounts.filter(a => a.accountID !== id)
      this.saveAll()
      this.pushToCloud()
      this.notify('Account Purged', 'warning')
    },

    addItem(item) { if (!item.itemID) item.itemID = 'ITEM-' + Date.now(); item.updateTime = new Date().toISOString(); this.items.push(item); this.saveAll(); this.pushToCloud(); this.notify('Item Registered', 'success') },
    updateItem(item) { const idx = this.items.findIndex(i => i.itemID === item.itemID); if (idx !== -1) { item.updateTime = new Date().toISOString(); this.items[idx] = item; this.saveAll(); this.pushToCloud(); this.notify('Item Updated', 'info') } },
    deleteItem(id) { this.items = this.items.filter(i => i.itemID !== id); this.saveAll(); this.pushToCloud(); this.notify('Item Removed', 'warning') },

    addMerchant(m) { if (!m.merchantID) m.merchantID = 'MCH-' + Date.now(); m.updateTime = new Date().toISOString(); this.merchants.push(m); this.saveAll(); this.pushToCloud(); this.notify('Vendor Activated', 'success') },
    updateMerchant(m) { const idx = this.merchants.findIndex(i => i.merchantID === m.merchantID); if (idx !== -1) { m.updateTime = new Date().toISOString(); this.merchants[idx] = m; this.saveAll(); this.pushToCloud(); this.notify('Vendor Updated', 'info') } },
    deleteMerchant(id) { this.merchants = this.merchants.filter(i => i.merchantID !== id); this.saveAll(); this.pushToCloud(); this.notify('Vendor Deactivated', 'warning') },

    addMember(m) { if (!m.memberID) m.memberID = 'MEM-' + Date.now(); this.members.push(m); this.saveAll(); this.pushToCloud(); this.notify('Member Enrolled', 'success') },
    updateMember(m) { const idx = this.members.findIndex(i => i.memberID === m.memberID); if (idx !== -1) { this.members[idx] = m; this.saveAll(); this.pushToCloud(); this.notify('Member Profile Updated', 'info') } },
    deleteMember(id) { this.members = this.members.filter(i => i.memberID !== id); this.saveAll(); this.pushToCloud(); this.notify('Member Profile Purged', 'warning') },

    addVoucher(v) { if (!v.voucherID) v.voucherID = 'VOU-' + Date.now(); v.updateTime = new Date().toISOString(); this.vouchers.push(v); this.saveAll(); this.pushToCloud(); this.notify('Voucher Issued', 'success') },
    updateVoucher(v) { const idx = this.vouchers.findIndex(i => i.voucherID === v.voucherID); if (idx !== -1) { v.updateTime = new Date().toISOString(); this.vouchers[idx] = v; this.saveAll(); this.pushToCloud(); this.notify('Voucher Redeployed', 'info') } },
    deleteVoucher(id) { this.vouchers = this.vouchers.filter(i => i.voucherID !== id); this.saveAll(); this.pushToCloud(); this.notify('Voucher Invalidated', 'warning') },

    addBudget(b) { if (!b.budgetID) b.budgetID = 'BUD-' + Date.now(); b.updateTime = new Date().toISOString(); this.budgets.push(b); this.saveAll(); this.pushToCloud(); this.notify('Budget Strategy Saved', 'success') },
    updateBudget(b) { const idx = this.budgets.findIndex(i => i.budgetID === b.budgetID); if (idx !== -1) { b.updateTime = new Date().toISOString(); this.budgets[idx] = b; this.saveAll(); this.pushToCloud(); this.notify('Budget Reconfigured', 'info') } },
    deleteBudget(id) { this.budgets = this.budgets.filter(i => i.budgetID !== id); this.saveAll(); this.pushToCloud(); this.notify('Budget Abolished', 'warning') },

    addGoal(g) { if (!g.goalID) g.goalID = 'GOA-' + Date.now(); g.updateTime = new Date().toISOString(); this.goals.push(g); this.saveAll(); this.pushToCloud(); this.notify('Target Set', 'success') },
    updateGoal(g) { const idx = this.goals.findIndex(i => i.goalID === g.goalID); if (idx !== -1) { g.updateTime = new Date().toISOString(); this.goals[idx] = g; this.saveAll(); this.pushToCloud(); this.notify('Target Refined', 'info') } },
    deleteGoal(id) { this.goals = this.goals.filter(i => i.goalID !== id); this.saveAll(); this.pushToCloud(); this.notify('Target Abandoned', 'warning') },

    addReceipt(r) { if (!r.receiptID) r.receiptID = 'RCP-' + Date.now(); this.receipts.push(r); this.saveAll(); this.notify('Artifact Vaulted', 'success') },
    updateReceipt(r) { const idx = this.receipts.findIndex(i => i.receiptID === r.receiptID); if (idx !== -1) { this.receipts[idx] = r; this.saveAll(); this.notify('Artifact Re-Indexed', 'info') } },
    deleteReceipt(id) { this.receipts = this.receipts.filter(i => i.receiptID !== id); this.saveAll(); this.notify('Artifact Redacted', 'warning') },

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
            { key: 'account', state: 'accounts', id: 'accountID' },
            { key: 'merchant', state: 'merchants', id: 'merchantID' },
            { key: 'item', state: 'items', id: 'itemID' },
            { key: 'member', state: 'members', id: 'memberID' },
            { key: 'voucher', state: 'vouchers', id: 'voucherID' },
            { key: 'budget', state: 'budgets', id: 'budgetID' },
            { key: 'goal', state: 'goals', id: 'goalID' },
            { key: 'receipt', state: 'receipts', id: 'receiptID' },
            { key: 'category', state: 'categories', id: 'categoryID' },
            { key: 'unitScale', state: 'unitScales', id: 'unitScale' },
            { key: 'tag', state: 'tags', id: 'tagID' },
            { key: 'project', state: 'projects', id: 'projectID' },
            { key: 'author', state: 'authors', id: 'authorID' }
          ]

          const formatDate = (val) => {
            if (!val) return ''
            const d = new Date(val)
            if (isNaN(d.getTime())) return val
            return d.toISOString().split('T')[0]
          }

          entities.forEach((ent, i) => {
             if (!data[ent.key]) return
             const incoming = data[ent.key].map(row => {
                if (row.date) row.date = formatDate(row.date)
                if (row.expiryDate) row.expiryDate = formatDate(row.expiryDate)
                return row
             })
             if (mode === 'merge') {
                incoming.forEach(inc => {
                   const exists = this[ent.state].some(cur => cur[ent.id] === inc[ent.id])
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
          this.notify('Core Chronicle Ingested', 'success')
          return true
        }
      } catch (e) { 
        this.isSyncing = false
        this.syncProgress = 0
        this.notify('Resonance Failure', 'error')
        console.error('Cloud pull failed', e)
        return false 
      }
    },

    forceRefresh() {
      this.isSyncing = true
      this.notify('Re-initializing Terminal...', 'info')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    },

    async pushToCloud() {
      const url = isSafe ? localStorage.getItem('cloud_sheet_url') : null
      if (!url) return false
      this.isSyncing = true
      this.syncProgress = 20
      const payload = {
        // ... same payload ...
        transaction: this.transactions,
        account: this.accounts,
        merchant: this.merchants,
        item: this.items,
        member: this.members,
        voucher: this.vouchers,
        budget: this.budgets,
        goal: this.goals,
        receipt: this.receipts,
        category: this.categories,
        unitScale: this.unitScales,
        tag: this.tags,
        project: this.projects,
        author: this.authors,
        updateTime: new Date().toISOString()
      }
      this.syncProgress = 50
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        this.syncProgress = 100
        setTimeout(() => { this.isSyncing = false; this.syncProgress = 0 }, 1000)
        this.notify('Current Logs Ascended', 'success')
        return true
      } catch (e) { 
        this.isSyncing = false
        this.syncProgress = 0
        this.notify('Transmission Failure', 'error')
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
    deleteAuthor(id) { this.authors = this.authors.filter(i => i.authorID !== id); this.saveAll() }
  }
})
