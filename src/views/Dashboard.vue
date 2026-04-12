<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }" style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="/logo.png" style="height: 32px; width: 32px; border-radius: 8px; object-fit: contain;" alt="Jurney Logo">
          <h1 style="font-size: 1.25rem; font-weight: 900; color: var(--text-primary); margin: 0; white-space: nowrap; letter-spacing: -0.02em;">Jurney</h1>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <div @click="store.forceRefresh" class="profile-icon" style="width: 40px; height: 40px; border-radius: 20px; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--accent); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--accent);">
            <i data-lucide="refresh-cw" :class="{ 'spin-active': store.isSyncing }" style="width: 18px;"></i>
          </div>
          <div @click="toggleSearch" class="profile-icon" style="width: 40px; height: 40px; border-radius: 20px; background: var(--border); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i data-lucide="search" style="width: 20px;"></i>
          </div>
          <div class="user-meta" style="display: flex; align-items: center; gap: 0.75rem;">
            <div @click="$router.push('/settings')" class="profile-icon" style="width: 40px; height: 40px; border-radius: 20px; background: var(--border); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.25rem;">
              {{ userAvatar }}
            </div>
          </div>
        </div>

        <!-- Expanding Search Bar -->
        <div :style="{ width: showSearch ? '100%' : '0px', opacity: showSearch ? 1 : 0, pointerEvents: showSearch ? 'auto' : 'none' }" style="position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: flex-end; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
           <div style="position: relative; width: 100%; height: 40px; display: flex; align-items: center; min-width: 250px;">
              <i data-lucide="search" style="position: absolute; left: 1rem; width: 18px; color: var(--text-secondary);"></i>
              <input type="text" v-model="searchQuery" placeholder="Scan expeditions..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 20px; padding: 0 2.5rem 0 3rem; color: var(--text-primary); outline: none; font-size: 0.875rem;">
              <button @click="toggleSearch" style="position: absolute; right: 0.75rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; margin-top: 1.5rem;">
      <div class="stat-card" @click="$router.push('/accounts')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="wallet" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="wallet" style="width: 14px; color: var(--accent); margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Treasure Vault</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: var(--text-primary); letter-spacing: -0.02em;">Rp {{ (totalBalance || 0).toLocaleString('id-ID') }}</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">{{ store.accounts.length }} ACTIVE VAULTS</div>
      </div>
      <div class="stat-card" @click="$router.push('/analysis')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="trending-up" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="line-chart" style="width: 14px; color: #ef4444; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Supplies Used</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: #ef4444; letter-spacing: -0.02em;">Rp {{ (monthSpending || 0).toLocaleString('id-ID') }}</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">CONSUMPTION THIS CYCLE</div>
      </div>
      <div class="stat-card" @click="$router.push('/budget')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="pie-chart" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="pie-chart" style="width: 14px; color: #22c55e; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Ration Limit</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: #22c55e; letter-spacing: -0.02em;">Rp {{ (totalBudget || 0).toLocaleString('id-ID') }}</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">{{ store.budget.length }} PROTOCOLS ACTIVE</div>
      </div>
      <div class="stat-card" @click="$router.push('/goals')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="target" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="target" style="width: 14px; color: #0ea5e9; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Destinations</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: #0ea5e9; letter-spacing: -0.02em;">{{ Math.round(goalProgress) }}% Done</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">{{ store.goals.length }} ACTIVE MISSIONS</div>
      </div>
    </div>

    <section v-if="recentTransactions.length > 0">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-size: 1rem; font-weight: 700;">Recent Expeditions</h3>
        <a @click.prevent="$router.push('/history')" style="font-size: 0.75rem; color: var(--accent); font-weight: 600; cursor: pointer;">See All</a>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
         <div v-for="t in recentTransactions" :key="t.id || t.date + t.name" @click="openTx(t)" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: 0.8rem; cursor: pointer; transition: 0.2s;">
           <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--border);" :style="{ color: getTxColor(t.type) }">
             <i v-if="t.type === 'Income'" data-lucide="arrow-down-left" style="width: 20px;" stroke-width="1.5"></i>
             <i v-else-if="t.type === 'Internal Transfer' || t.type === 'Transfer'" data-lucide="repeat" style="width: 18px;" stroke-width="1.5"></i>
             <i v-else-if="t.type === 'Savings'" data-lucide="piggy-bank" style="width: 20px;" stroke-width="1.5"></i>
             <i v-else-if="t.type === 'Investment'" data-lucide="trending-up" style="width: 20px;" stroke-width="1.5"></i>
             <i v-else data-lucide="shopping-cart" style="width: 18px;" stroke-width="1.5"></i>
           </div>
           <div style="flex: 1;">
             <div style="font-weight: 600; font-size: 0.9375rem; color: var(--text-primary);">{{ t.merchant || t.itemName }}</div>
             <div style="font-size: 0.75rem; color: var(--text-secondary);">{{ t.date }} • {{ t.paymentSourceAccount || t.beneficiaryAccount || 'Cash' }}</div>
           </div>
           <div style="text-align: right; font-weight: 700; font-size: 0.9375rem;" :style="{ color: getTxColor(t.type) }">
             {{ getTxSign(t.type) }} Rp {{ (t.total || 0).toLocaleString('id-ID') }}
           </div>
         </div>
      </div>
    </section>
    
    <section v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-size: 1rem; font-weight: 700;">Recent Expeditions</h3>
        <a @click.prevent="$router.push('/history')" style="font-size: 0.75rem; color: var(--accent); font-weight: 600; cursor: pointer;">See All</a>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 2rem; background: rgba(255,255,255,0.02); border-radius: 1rem;">
        No transactions recorded yet.
      </div>
    </section>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; margin-bottom: 2rem;">
      <div @click="$router.push('/items')" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(22, 163, 74, 0.1); display: flex; align-items: center; justify-content: center; color: #16a34a; flex-shrink: 0;">
          <i data-lucide="package" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Items</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ store.items.length }} REGISTERED</p>
        </div>
      </div>
      <div @click="$router.push('/merchants')" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(249, 115, 22, 0.1); display: flex; align-items: center; justify-content: center; color: #f97316; flex-shrink: 0;">
          <i data-lucide="building-2" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Vendors</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ store.merchants.length }} LOCATIONS</p>
        </div>
      </div>
      <div @click="$router.push('/memberships')" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(139, 92, 246, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;">
          <i data-lucide="credit-card" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Privileges</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ store.memberships.length }} ACTIVE CARDS</p>
        </div>
      </div>
      <div @click="$router.push('/vouchers')" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center; color: #f59e0b; flex-shrink: 0;">
          <i data-lucide="ticket" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Assets</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ store.vouchers.filter(v => v.status === 'Active').length }} USABLE</p>
        </div>
      </div>
      <div @click="$router.push('/receipts')" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(14, 165, 233, 0.1); display: flex; align-items: center; justify-content: center; color: #0ea5e9; flex-shrink: 0;">
          <i data-lucide="file-text" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Evidence</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ store.receipts.length }} ARCHIVED</p>
        </div>
      </div>
      <div @click="$router.push('/audit')" style="background: var(--glass, rgba(239, 68, 68, 0.05)); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s; position: relative;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; color: #ef4444; flex-shrink: 0;">
          <i data-lucide="activity-heart" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700; color: #ef4444;">Intel Audit</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ anomalyCount }} Anomalies</p>
        </div>
        <div v-if="anomalyCount > 0" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; font-size: 0.6rem; font-weight: 950; padding: 2px 6px; border-radius: 10px; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);">
          {{ anomalyCount }}
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button @click="$router.push('/transaction')" class="fab" style="position: fixed; bottom: 2rem; right: 2rem; width: 56px; height: 56px; border-radius: 28px; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; border: none; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4); cursor: pointer; z-index: 100;">
      <i data-lucide="plus"></i>
    </button>
    
    <TransactionModal v-if="selectedTx" :tx="selectedTx" @close="selectedTx = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import TransactionModal from '../components/TransactionModal.vue'

const router = useRouter()
const store = useFinanceStore()

const showSearch = ref(false)
const searchQuery = ref('')
const userAvatar = computed(() => {
  if (typeof localStorage === 'undefined') return '👤'
  const prefs = JSON.parse(localStorage.getItem('user_prefs') || '{}')
  return prefs.avatar || '👤'
})

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}

const totalBalance = computed(() => {
  if (!Array.isArray(store.accounts)) return 0
  return store.accounts.reduce((sum, acc) => sum + (Number(acc.currentBalance) || 0), 0)
})

const monthSpending = computed(() => {
  if (!Array.isArray(store.transactions)) return 0
  const now = new Date()
  const month = now.toISOString().substring(0, 7) // YYYY-MM
  return store.transactions
    .filter(t => t.type === 'Expense' && (t.date || '').startsWith(month))
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0)
})

const totalBudget = computed(() => {
  if (!Array.isArray(store.budget)) return 0
  return store.budget.reduce((sum, b) => sum + (Number(b.budgetAmount) || 0), 0)
})

const goalProgress = computed(() => {
  if (store.goals.length === 0) return 0
  const avg = store.goals.reduce((sum, g) => {
    const target = Number(g.targetAmount) || 1
    const current = Number(g.currentAmount) || 0
    return sum + (current / target)
  }, 0) / store.goals.length
  return avg * 100
})

const selectedTx = ref(null)

const openTx = (t) => {
  selectedTx.value = t
}

const anomalyCount = computed(() => {
  let count = 0
  
  // 1. Pending Clearances
  count += store.transactions.filter(t => t.cleared === 'no' || !t.cleared).length
  
  // 2. Duplicates
  const groups = {}
  store.transactions.forEach(t => {
    const sig = `${t.date}_${t.merchant}_${t.total}_${t.itemName}`
    if (!groups[sig]) groups[sig] = []
    groups[sig].push(t)
  })
  count += Object.values(groups).filter(g => g.length > 1).length
  
  // 3. Desync
  store.transactions.forEach(t => {
    let hasDesync = false
    if (t.tags) {
       const txTags = t.tags.split(',').map(s => s.trim()).filter(Boolean)
       if (txTags.some(tagName => !store.tags.some(rt => rt.tagName === tagName))) hasDesync = true
    }
    if (t.projects) {
       const txPrjs = t.projects.split(',').map(s => s.trim()).filter(Boolean)
       if (txPrjs.some(prjName => !store.projects.some(rp => rp.projectName === prjName))) hasDesync = true
    }
    if (hasDesync) count++
  })
  
  return count
})

const recentTransactions = computed(() => {
  if (!Array.isArray(store.transactions)) return []
  // Show up to 5 most recent transactions
  return [...store.transactions].reverse().slice(0, 5)
})

const getTxColor = (type) => {
  if (type === 'Income') return '#10b981'
  if (type === 'Expense') return '#ef4444'
  return '#3b82f6' // Transfer, Investment, Savings
}

const getTxSign = (type) => {
  if (type === 'Income') return '+'
  if (type === 'Expense') return '-'
  return ''
}

onMounted(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
})
</script>
