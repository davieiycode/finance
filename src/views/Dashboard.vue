<template>
  <div ref="scrollContainer" class="view-content dashboard-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar glass-panel">
      <div class="app-bar-content">
        <div class="app-title-group">
          <div class="logo-box">
            <img src="/logo.png" alt="DompetKu">
          </div>
          <h1>Jurney</h1>
        </div>
        
          <button @click="togglePrivacy(); uiStore.haptic('light')" class="icon-btn">
            <span class="material-symbols-rounded">{{ isPrivate ? 'visibility_off' : 'visibility' }}</span>
          </button>
          <button @click="toggleSearch(); uiStore.haptic('light')" class="icon-btn">
            <span class="material-symbols-rounded">search</span>
          </button>
          <div @click="$router.push('/settings'); uiStore.haptic('light')" class="avatar-box">
             <img v-if="userAvatar.includes('.svg')" :src="userAvatar">
             <span v-else>{{ userAvatar }}</span>
             <div class="status-indicator"></div>
          </div>

        <!-- Pencarian -->
        <div class="search-overlay" :class="{ 'active': showSearch }">
          <div class="search-bar-container">
            <span class="material-symbols-rounded" style="opacity: 0.6">search</span>
            <input type="text" v-model="searchQuery" placeholder="Cari transaksi..." class="search-bar-input" @keyup.esc="toggleSearch">
            <button @click="toggleSearch(); uiStore.haptic('light')" class="icon-btn" style="color: inherit">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Subscription Alert Briefing -->
      <div v-if="upcomingSubscriptions.length > 0" class="briefing-card card-md3 stagger-1" @click="$router.push('/subscriptions'); uiStore.haptic('medium')">
         <div class="briefing-icon warning"><span class="material-symbols-rounded">notifications_active</span></div>
         <div class="briefing-text">
            <span class="briefing-label">Tagihan Mendatang</span>
            <p v-for="s in upcomingSubscriptions" :key="s.subscriptionID">
               {{ s.name }} (Rp {{ (Number(s.amount)||0).toLocaleString('id-ID') }}) jatuh tempo dalam {{ getDaysLeft(s.nextBillDate) }} hari.
            </p>
         </div>
         <span class="material-symbols-rounded" style="opacity: 0.3">chevron_right</span>
      </div>

      <!-- Main Overview Cards -->
      <div class="stats-grid">
        <div class="stat-card stagger-1" @click="$router.push('/accounts'); uiStore.haptic('light')">
          <div class="card-icon"><span class="material-symbols-rounded">account_balance_wallet</span></div>
          <span class="card-title">Total Saldo</span>
          <span class="card-value">{{ isPrivate ? '••••••' : 'Rp ' + Math.round(totalBalance || 0).toLocaleString('id-ID') }}</span>
          <span class="card-sub">{{ (store.accounts || []).length }} rekening</span>
        </div>
        <div class="stat-card spending stagger-2" @click="$router.push('/analysis'); uiStore.haptic('light')">
          <div class="card-icon"><span class="material-symbols-rounded">trending_down</span></div>
          <span class="card-title">Pengeluaran</span>
          <span class="card-value">{{ isPrivate ? '••••••' : 'Rp ' + Math.round(monthSpending || 0).toLocaleString('id-ID') }}</span>
          <span class="card-sub">Bulan ini</span>
        </div>
        <div class="stat-card success stagger-3" @click="$router.push('/budget'); uiStore.haptic('light')">
          <div class="card-icon"><span class="material-symbols-rounded">pie_chart</span></div>
          <span class="card-title">Anggaran</span>
          <span class="card-value">{{ isPrivate ? '••••••' : 'Rp ' + (totalBudget || 0).toLocaleString('id-ID') }}</span>
          <span class="card-sub">{{ (store.budgets || []).length }} kategori</span>
        </div>
        <div class="stat-card info stagger-4" @click="$router.push('/goals'); uiStore.haptic('light')">
          <div class="card-icon"><span class="material-symbols-rounded">target</span></div>
          <span class="card-title">Target</span>
          <span class="card-value">{{ Math.round(goalProgress) }}%</span>
          <span class="card-sub">{{ (store.goals || []).length }} target aktif</span>
        </div>
      </div>



      <!-- Menu Cepat -->
      <div class="quick-access-grid stagger-5">
        <div @click="$router.push('/items'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon success"><span class="material-symbols-rounded">inventory_2</span></div>
          <div class="quick-label">Barang</div>
        </div>
        <div @click="$router.push('/merchants'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon warning"><span class="material-symbols-rounded">store</span></div>
          <div class="quick-label">Toko</div>
        </div>
        <div @click="$router.push('/memberships'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon info"><span class="material-symbols-rounded">groups</span></div>
          <div class="quick-label">Anggota</div>
        </div>
        <div @click="$router.push('/vouchers'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon secondary"><span class="material-symbols-rounded">confirmation_number</span></div>
          <div class="quick-label">Kupon</div>
        </div>
        <div @click="$router.push('/receipts'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon tertiary"><span class="material-symbols-rounded">receipt_long</span></div>
          <div class="quick-label">Nota</div>
        </div>
        <div @click="$router.push('/audit'); uiStore.haptic('light')" class="quick-card anomaly">
          <div class="quick-icon danger"><span class="material-symbols-rounded">monitoring</span></div>
          <div class="quick-label">Audit</div>
          <div v-if="anomalyCount > 0" class="badge-dot">{{ anomalyCount }}</div>
        </div>
        <div @click="$router.push('/subscriptions'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon primary"><span class="material-symbols-rounded">event_repeat</span></div>
          <div class="quick-label">Langganan</div>
          <div v-if="upcomingSubscriptions.length > 0" class="badge-dot warning">{{ upcomingSubscriptions.length }}</div>
        </div>
        <div @click="$router.push('/debts'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon secondary"><span class="material-symbols-rounded">account_balance</span></div>
          <div class="quick-label">Hutang</div>
        </div>
        <div @click="$router.push('/shopping-list'); uiStore.haptic('light')" class="quick-card">
          <div class="quick-icon warning"><span class="material-symbols-rounded">shopping_cart</span></div>
          <div class="quick-label">Belanja</div>
          <div v-if="store.shoppingList.length > 0" class="badge-dot info">{{ store.shoppingList.length }}</div>
        </div>
      </div>

      <div class="app-footer stagger-5">
        <div class="footer-core">JURNEY CORE v6.0.0</div>
        <div class="footer-status">PREMIUM STABLE RELEASE</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const store = useFinanceStore()
const uiStore = useUIStore()
const scrollContainer = ref(null)

const showSearch = ref(false)
const isPrivate = ref(localStorage.getItem('privacy_mode') === 'true')
const searchQuery = ref('')

const togglePrivacy = () => {
  isPrivate.value = !isPrivate.value
  localStorage.setItem('privacy_mode', isPrivate.value)
}
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
  if (!dateStr) return 'T/A'
  
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  if (match) {
     return `${match[3]} ${months[parseInt(match[2]) - 1]} ${match[1]}`
  }

  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const totalBalance = computed(() => {
  if (!Array.isArray(store.accounts)) return 0
  return store.accounts.reduce((sum, acc) => sum + (Number(acc.currentBalance) || 0), 0)
})

const monthSpending = computed(() => {
  if (!Array.isArray(store.transactions)) return 0
  const now = new Date()
  const month = now.toISOString().substring(0, 7)
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


const anomalyCount = computed(() => {
  let count = 0
  count += (store.transactions || []).filter(t => t.cleared === 'no' || !t.cleared).length
  const groups = {}
  ;(store.transactions || []).forEach(t => {
    const sig = `${t.date}_${t.merchant}_${t.total}_${t.itemName}`
    if (!groups[sig]) groups[sig] = []
    groups[sig].push(t)
  })
  count += Object.values(groups).filter(g => (g || []).length > 1).length
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

const upcomingSubscriptions = computed(() => {
  return (store.subscriptions || []).filter(s => {
    const diff = new Date(s.nextBillDate) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 3
  })
})

const getDaysLeft = (dateStr) => {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

onMounted(() => {
  if (scrollContainer.value) scrollContainer.value.scrollTo(0, 0)
})
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--on-surface);
  overflow: hidden;
}

.top-app-bar {
  background-color: rgba(10, 10, 11, 0.8) !important;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border);
}

.app-bar-content {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}

.app-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.app-title-group h1 {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0;
  color: var(--on-surface);
  font-family: 'Outfit', sans-serif;
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary), var(--primary-container));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(168, 199, 250, 0.3);
}

.logo-box img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.avatar-box {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background-color: var(--surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1.5px solid var(--border);
  transition: all 0.3s var(--spring-easing);
}

.avatar-box:active { transform: scale(0.9); }

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background-color: var(--green);
  border: 2px solid var(--bg-primary);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--green);
}

/* SEARCH OVERLAY */
.search-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-20px);
  transition: all 0.4s var(--spring-easing);
}

.search-overlay.active {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* CONTENT SCROLL */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 140px 20px;
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: var(--bg-secondary);
  border-radius: var(--card-radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.3s var(--spring-easing);
  cursor: pointer;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: var(--primary);
  opacity: 0.5;
}

.stat-card:active {
  transform: scale(0.95);
  background-color: var(--surface-variant);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 24px;
}

.stat-card.spending .card-icon { background: rgba(242, 184, 181, 0.15); color: var(--red); }
.stat-card.spending::after { background: var(--red); }
.stat-card.success .card-icon { background: rgba(180, 232, 168, 0.15); color: var(--green); }
.stat-card.success::after { background: var(--green); }
.stat-card.info .card-icon { background: rgba(168, 199, 250, 0.15); color: var(--blue); }
.stat-card.info::after { background: var(--blue); }

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--on-surface);
  font-family: 'Outfit', sans-serif;
}

.card-sub {
  font-size: 11px;
  color: var(--on-surface-variant);
  opacity: 0.6;
}

/* QUICK ACCESS */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s var(--spring-easing);
}

.quick-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s var(--spring-easing);
}

.quick-icon.success { background: rgba(180, 232, 168, 0.08); color: var(--green); }
.quick-icon.warning { background: rgba(255, 217, 140, 0.08); color: var(--amber); }
.quick-icon.info { background: rgba(168, 199, 250, 0.08); color: var(--blue); }
.quick-icon.secondary { background: var(--secondary-container); color: var(--on-secondary-container); }
.quick-icon.tertiary { background: var(--tertiary-container); color: var(--on-tertiary-container); }
.quick-icon.danger { background: rgba(242, 184, 181, 0.08); color: var(--red); }

.quick-card:hover .quick-icon {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  border-color: var(--primary);
}

.quick-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-align: center;
}

/* BRIEFING CARD */
.briefing-card {
  margin-bottom: 32px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--card-radius);
  cursor: pointer;
  transition: all 0.3s var(--spring-easing);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.briefing-card:active { transform: scale(0.98); }

.briefing-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.briefing-icon.warning { background: rgba(255, 217, 140, 0.15); color: var(--amber); }

.briefing-text { flex: 1; }
.briefing-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--amber); opacity: 0.9; }
.briefing-text p { margin: 4px 0 0 0; font-size: 14px; font-weight: 500; line-height: 1.5; color: var(--on-surface); }

.app-footer {
  margin-top: 40px;
  text-align: center;
  padding-bottom: 20px;
  opacity: 0.3;
}
.footer-core { font-size: 10px; font-weight: 900; letter-spacing: 2px; }
.footer-status { font-size: 8px; font-weight: 500; margin-top: 4px; }

.version-briefing {
  border: 1px solid var(--green) !important;
  background: rgba(180, 232, 168, 0.05) !important;
}

</style>
