import { defineStore } from 'pinia'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
    accounts: JSON.parse(localStorage.getItem('accounts') || '[]'),
    budgets: JSON.parse(localStorage.getItem('budgets') || '[]'),
    goals: JSON.parse(localStorage.getItem('goals') || '[]')
  }),
  getters: {
    getAccountByName: (state) => (name) => {
      return state.accounts.find(a => (a.name || '').toLowerCase() === (name || '').toLowerCase())
    },
    getTransactionsByAccount: (state) => (accountName) => {
      const name = (accountName || '').toLowerCase()
      return state.transactions.filter(t => 
        (t.accountPayment || '').toLowerCase() === name || 
        (t.accountReceived || '').toLowerCase() === name
      )
    }
  },
  actions: {
    addAccount(account) {
      if (!account.id) account.id = Date.now()
      this.accounts.push(account)
      this.saveAccounts()
    },
    updateAccount(account) {
      const index = this.accounts.findIndex(a => a.id === account.id)
      if (index !== -1) {
        this.accounts[index] = account
        this.saveAccounts()
      }
    },
    deleteAccount(id) {
      this.accounts = this.accounts.filter(a => a.id !== id)
      this.saveAccounts()
    },
    saveAccounts() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    saveTransactions() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    }
  }
})
