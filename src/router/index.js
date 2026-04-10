import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Accounts from '../views/Accounts.vue'
import History from '../views/History.vue'
import Analysis from '../views/Analysis.vue'
import Settings from '../views/Settings.vue'
import Budget from '../views/Budget.vue'
import Goals from '../views/Goals.vue'
import Transaction from '../views/Transaction.vue'

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
    { path: '/transaction', name: 'transaction', component: Transaction, meta: { hideNav: true } }
  ]
})

export default router
