import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Accounts from '../views/Accounts.vue'
import History from '../views/History.vue'
import Analysis from '../views/Analysis.vue'
import Settings from '../views/Settings.vue'
import Budget from '../views/Budget.vue'
import Goals from '../views/Goals.vue'
import Transaction from '../views/Transaction.vue'

import Items from '../views/Items.vue'
import Merchants from '../views/Merchants.vue'
import Memberships from '../views/Memberships.vue'
import Vouchers from '../views/Vouchers.vue'
import Receipts from '../views/Receipts.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/accounts', name: 'accounts', component: Accounts },
    { path: '/history', name: 'history', component: History },
    { path: '/analysis', name: 'analysis', component: Analysis },
    { path: '/settings', name: 'settings', component: Settings },
    { path: '/budget', name: 'budget', component: Budget },
    { path: '/goals', name: 'goals', component: Goals },
    { path: '/transaction', name: 'transaction', component: Transaction, meta: { hideNav: true } },
    { path: '/items', name: 'items', component: Items },
    { path: '/merchants', name: 'merchants', component: Merchants },
    { path: '/memberships', name: 'memberships', component: Memberships },
    { path: '/vouchers', name: 'vouchers', component: Vouchers },
    { path: '/receipts', name: 'receipts', component: Receipts }
  ]
})

export default router
