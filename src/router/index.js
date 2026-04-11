import { createRouter, createWebHashHistory } from 'vue-router'
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
import Metadata from '../views/Metadata.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
    { path: '/receipts', name: 'receipts', component: Receipts },
    { path: '/metadata', name: 'metadata', component: Metadata },
    { path: '/audit', name: 'audit', component: () => import('../views/Audit.vue') },
    { path: '/setup', name: 'setup', component: () => import('../views/Setup.vue'), meta: { hideNav: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const hasCloudUrl = typeof localStorage !== 'undefined' ? !!localStorage.getItem('cloud_sheet_url') : false
  if (!hasCloudUrl && to.name !== 'setup') {
    next({ name: 'setup' })
  } else if (hasCloudUrl && to.name === 'setup') {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
