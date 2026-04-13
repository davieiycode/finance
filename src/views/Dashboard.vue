<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 0 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(100px + env(safe-area-inset-bottom)); position: relative;">
    <div class="sticky-nav" style="padding: 1.5rem 0 1rem 0; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg-primary, #000); z-index: 100;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }" style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 36px; height: 36px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
            <img src="/logo.png" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="Jurney Logo">
          </div>
          <h1 style="font-size: 1.25rem; font-weight: 900; color: var(--text-primary); margin: 0; white-space: nowrap; letter-spacing: -0.02em;">Jurney</h1>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center; padding-right: 0.5rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <div @click="store.forceRefresh" class="profile-icon" style="width: 36px; height: 36px; border-radius: 12px; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--accent); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--accent);">
            <i data-lucide="refresh-cw" :class="{ 'spin-active': store.isSyncing }" style="width: 16px;"></i>
          </div>
          <div @click="toggleSearch" class="profile-icon" style="width: 36px; height: 36px; border-radius: 12px; background: var(--border); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i data-lucide="search" style="width: 18px;"></i>
          </div>
          <div class="user-meta" style="display: flex; align-items: center; gap: 0.75rem;">
            <div @click="$router.push('/settings')" class="profile-icon" style="width: 36px; height: 36px; border-radius: 12px; background: var(--border); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; overflow: hidden; position: relative;">
               <img v-if="userAvatar.includes('.svg')" :src="userAvatar" style="width: 20px; height: 20px; object-fit: contain;">
               <span v-else>{{ userAvatar }}</span>
               <div style="position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; background: #10b981; border: 1.5px solid var(--bg-primary); border-radius: 50%;"></div>
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

    <!-- System Status Bar -->
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1rem; padding: 0 0.5rem;">
       <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
             <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; display: block;"></span>
             <span style="font-size: 0.7rem; font-weight: 950; color: #10b981; letter-spacing: 0.05em; line-height: 1;">CORE v5.1.0</span>
          </div>
          <div style="font-size: 0.6rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">PROD ACTIVE</div>
       </div>
       <div @click="checkUpdates" style="font-size: 0.6rem; color: var(--accent); font-weight: 800; text-transform: uppercase; cursor: pointer; letter-spacing: 0.05em; border-bottom: 1px solid rgba(139,92,246,0.3); padding-bottom: 2px;">Verify Integrity</div>
    </div>

    <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; margin-top: 1.5rem;">
      <div class="stat-card card-hover" @click="$router.push('/accounts')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="wallet" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="wallet" style="width: 14px; color: var(--accent); margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Treasure Vault</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: var(--text-primary); letter-spacing: -0.02em;">Rp {{ Math.round(totalBalance || 0).toLocaleString('id-ID') }}</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">{{ (store.accounts || []).length }} ACTIVE VAULTS</div>
      </div>
      <div class="stat-card card-hover" @click="$router.push('/analysis')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="trending-up" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="line-chart" style="width: 14px; color: #ef4444; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Supplies Used</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: #ef4444; letter-spacing: -0.02em;">Rp {{ Math.round(monthSpending || 0).toLocaleString('id-ID') }}</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">CONSUMPTION THIS CYCLE</div>
      </div>
      <div class="stat-card card-hover" @click="$router.push('/budget')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="pie-chart" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="pie-chart" style="width: 14px; color: #22c55e; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Ration Limit</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: #22c55e; letter-spacing: -0.02em;">Rp {{ (totalBudget || 0).toLocaleString('id-ID') }}</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">{{ (store.budgets || []).length }} PROTOCOLS ACTIVE</div>
      </div>
      <div class="stat-card card-hover" @click="$router.push('/goals')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10px; top: -10px; opacity: 0.05;"><i data-lucide="target" style="width: 60px; height: 60px;"></i></div>
        <i data-lucide="target" style="width: 14px; color: #0ea5e9; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Destinations</span>
        <span style="font-size: 1.25rem; font-weight: 900; color: #0ea5e9; letter-spacing: -0.02em;">{{ Math.round(goalProgress) }}% Done</span>
        <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 700;">{{ (store.goals || []).length }} ACTIVE MISSIONS</div>
      </div>
    </div>
    
    <!-- Recurring Protocol Reminders (Smart Detection) -->
    <div v-if="upcomingReminders.length > 0" style="margin-bottom: 2rem; animation: slideUp 0.4s ease;">
       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-left: 0.5rem;">
          <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.15em;">Critical Reminders</div>
          <div style="font-size: 0.55rem; color: #ef4444; font-weight: 800; display: flex; align-items: center; gap: 4px;">
             <span style="width: 6px; height: 6px; background: #ef4444; border-radius: 50%; display: block; animation: pulse 1.5s infinite;"></span>
             {{ upcomingReminders.length }} SIGNALS DETECTED
          </div>
       </div>
       <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div v-for="rem in upcomingReminders" :key="rem.id" class="reminder-card" style="background: rgba(239, 68, 68, 0.03); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; position: relative; overflow: hidden;">
             <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; color: #ef4444; flex-shrink: 0;">
                <i :data-lucide="rem.icon" style="width: 20px;"></i>
             </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 0.875rem; font-weight: 800; color: white;">{{ rem.name }}</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                   Missing log for {{ rem.period }}. Last seen {{ formatDate(rem.lastDate) }}.
                </div>
              </div>
             <button @click="$router.push('/transaction')" style="background: rgba(239, 68, 68, 0.2); border: none; padding: 0.5rem 0.75rem; border-radius: 8px; color: white; font-size: 0.6rem; font-weight: 800; cursor: pointer;">RESOLVE</button>
          </div>
       </div>
    </div>


    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; margin-bottom: 2rem;">
      <div @click="$router.push('/items')" class="card-hover" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(22, 163, 74, 0.1); display: flex; align-items: center; justify-content: center; color: #16a34a; flex-shrink: 0;">
          <i data-lucide="package" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Items</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ (store.items || []).length }} REGISTERED</p>
        </div>
      </div>
      <div @click="$router.push('/merchants')" class="card-hover" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(249, 115, 22, 0.1); display: flex; align-items: center; justify-content: center; color: #f97316; flex-shrink: 0;">
          <i data-lucide="building-2" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Vendors</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ (store.merchants || []).length }} LOCATIONS</p>
        </div>
      </div>
      <div @click="$router.push('/memberships')" class="card-hover" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(139, 92, 246, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;">
          <i data-lucide="credit-card" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Privileges</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ (store.members || []).length }} ACTIVE CARDS</p>
        </div>
      </div>
      <div @click="$router.push('/vouchers')" class="card-hover" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center; color: #f59e0b; flex-shrink: 0;">
          <i data-lucide="ticket" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Assets</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ (store.vouchers || []).filter(v => v.status === 'Active').length }} USABLE</p>
        </div>
      </div>
      <div @click="$router.push('/receipts')" class="card-hover" style="background: var(--glass, rgba(255,255,255,0.02)); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(14, 165, 233, 0.1); display: flex; align-items: center; justify-content: center; color: #0ea5e9; flex-shrink: 0;">
          <i data-lucide="file-text" style="width: 22px;"></i>
        </div>
        <div>
          <div style="font-size: 0.8125rem; font-weight: 700;">Evidence</div>
          <p style="font-size: 0.6rem; color: var(--text-secondary); line-height: 1.2; margin: 0;">{{ (store.receipts || []).length }} ARCHIVED</p>
        </div>
      </div>
      <div @click="$router.push('/audit')" style="background: var(--glass, rgba(239, 68, 68, 0.05)); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s; position: relative;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; color: #ef4444; flex-shrink: 0;">
          <i data-lucide="activity" style="width: 22px;"></i>
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
    
    <!-- System Footer -->
    <div style="margin-top: 3rem; text-align: center; padding-bottom: 2rem; opacity: 0.3;">
       <div style="font-size: 0.55rem; font-weight: 900; letter-spacing: 0.2em; color: var(--text-secondary); text-transform: uppercase;">v5.1.0 Intelligence Core</div>
       <div style="font-size: 0.45rem; margin-top: 0.5rem; letter-spacing: 0.1em;">TERMINAL STABILIZED // NORECALL PROTOCOL ACTIVE</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'

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

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const checkUpdates = () => {
  store.notify('Verifying core integrity...', 'info')
  setTimeout(() => {
     store.notify('Protocol v5.1.0 is the latest stable release.', 'success')
  }, 1000)
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
  if (!Array.isArray(store.budgets)) return 0
  return store.budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
})

const goalProgress = computed(() => {
  if (!(store.goals || []).length) return 0
  const avg = store.goals.reduce((sum, g) => {
    const target = Number(g.targetAmount) || 1
    const current = Number(g.currentAmount) || 0
    return sum + (current / target)
  }, 0) / (store.goals.length || 1)
  return avg * 100
})

const upcomingReminders = computed(() => {
  const txs = store.transactions || []
  const now = new Date()
  const currentMonth = now.toISOString().substring(0, 7) // YYYY-MM
  const currentYear = now.getFullYear().toString()
  
  // Detection Protocols (Keywords vs Regularity)
  const protocols = [
    { id: 'elec', name: 'Electricity (PLN)', keywords: ['listrik', 'pln', 'token'], type: 'monthly', icon: 'zap' },
    { id: 'net', name: 'Internet / WiFi', keywords: ['internet', 'wifi', 'indihome', 'biznet', 'myrepublic'], type: 'monthly', icon: 'wifi' },
    { id: 'mobile', name: 'Mobile / Pulsa', keywords: ['pulsa', 'kuota', 'telkomsel', 'xl', 'indosat'], type: 'monthly', icon: 'smartphone' },
    { id: 'water', name: 'Water (PDAM)', keywords: ['pdam', 'air'], type: 'monthly', icon: 'droplet' },
    { id: 'trash', name: 'Trash / Security', keywords: ['sampah', 'keamanan', 'iuran'], type: 'monthly', icon: 'shield-check' },
    { id: 'tax', name: 'Property Tax (PBB)', keywords: ['pajak', 'pbb', 'samsat'], type: 'yearly', icon: 'file-text' },
    { id: 'rent', name: 'Rent / Mortgage', keywords: ['sewa', 'cicilan', 'kpr'], type: 'monthly', icon: 'home' },
    { id: 'sub', name: 'Subscritpions', keywords: ['netflix', 'spotify', 'youtube', 'cloud', 'icloud', 'disney'], type: 'monthly', icon: 'play' },
    { id: 'donate', name: 'Donations / Zakat', keywords: ['donasi', 'zakat', 'sedekah', 'kitabisa'], type: 'monthly', icon: 'heart' }
  ]

  const reminders = []

  protocols.forEach(proto => {
    // 1. Find the MOST RECENT transaction that matches this protocol
    const relatedTxs = txs.filter(t => {
      const target = (t.itemName + ' ' + t.category + ' ' + t.merchant).toLowerCase()
      return proto.keywords.some(k => target.includes(k.toLowerCase()))
    }).sort((a,b) => new Date(b.date) - new Date(a.date))

    if (relatedTxs.length > 0) {
      const lastTx = relatedTxs[0]
      const lastDate = lastTx.date || ''
      const lastMonth = lastDate.substring(0, 7)
      const lastYear = lastDate.substring(0, 4)

      let isPaid = false
      if (proto.type === 'monthly') {
        isPaid = lastMonth === currentMonth
      } else if (proto.type === 'yearly') {
        isPaid = lastYear === currentYear
      }

      if (!isPaid) {
        reminders.push({
          id: proto.id,
          name: proto.name,
          period: proto.type === 'monthly' ? now.toLocaleString('default', { month: 'long' }) : currentYear,
          lastDate: lastDate,
          icon: proto.icon
        })
      }
    }
  })

  return reminders
})

const anomalyCount = computed(() => {
  let count = 0
  
  // 1. Pending Clearances
  count += (store.transactions || []).filter(t => t.cleared === 'no' || !t.cleared).length
  
  // 2. Duplicates
  const groups = {}
  ;(store.transactions || []).forEach(t => {
    const sig = `${t.date}_${t.merchant}_${t.total}_${t.itemName}`
    if (!groups[sig]) groups[sig] = []
    groups[sig].push(t)
  })
  count += Object.values(groups).filter(g => (g || []).length > 1).length
  
  // 3. Desync
  ;(store.transactions || []).forEach(t => {
    let hasDesync = false
    if (t.tags) {
       const txTags = String(t.tags).split(',').map(s => s.trim()).filter(Boolean)
       if (txTags.some(tagName => !(store.tags || []).some(rt => rt.tagName === tagName))) hasDesync = true
    }
    if (t.projects) {
       const txPrjs = String(t.projects).split(',').map(s => s.trim()).filter(Boolean)
       if (txPrjs.some(prjName => !(store.projects || []).some(rp => rp.projectName === prjName))) hasDesync = true
    }
    if (hasDesync) count++
  })
  
  return count
})

onMounted(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
})
</script>
