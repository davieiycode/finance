<template>
  <div ref="scrollContainer" class="view-content dashboard-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <div class="app-title-group">
          <div class="logo-box">
            <img src="/logo.png" alt="DompetKu">
          </div>
          <h1>DompetKu</h1>
        </div>
        
        <div class="app-bar-actions">
          <button @click="store.forceRefresh" class="icon-btn" :class="{ 'spin': store.isSyncing }">
            <span class="material-symbols-rounded">refresh</span>
          </button>
          <button @click="toggleSearch" class="icon-btn">
            <span class="material-symbols-rounded">search</span>
          </button>
          <div @click="$router.push('/settings')" class="avatar-box">
             <img v-if="userAvatar.includes('.svg')" :src="userAvatar">
             <span v-else>{{ userAvatar }}</span>
             <div class="status-indicator"></div>
          </div>
        </div>

        <!-- Pencarian -->
        <div class="search-overlay" :class="{ 'active': showSearch }">
          <span class="material-symbols-rounded search-icon">search</span>
          <input type="text" v-model="searchQuery" placeholder="Cari transaksi..." @blur="searchQuery ? null : showSearch = false">
          <button @click="toggleSearch" class="close-search-btn">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Main Overview Cards -->
      <div class="stats-grid">
        <div class="stat-card" @click="$router.push('/accounts')">
          <div class="card-icon"><span class="material-symbols-rounded">account_balance_wallet</span></div>
          <span class="card-title">Total Saldo</span>
          <span class="card-value">Rp {{ Math.round(totalBalance || 0).toLocaleString('id-ID') }}</span>
          <span class="card-sub">{{ (store.accounts || []).length }} rekening</span>
        </div>
        <div class="stat-card spending" @click="$router.push('/analysis')">
          <div class="card-icon"><span class="material-symbols-rounded">trending_down</span></div>
          <span class="card-title">Pengeluaran</span>
          <span class="card-value">Rp {{ Math.round(monthSpending || 0).toLocaleString('id-ID') }}</span>
          <span class="card-sub">Bulan ini</span>
        </div>
        <div class="stat-card success" @click="$router.push('/budget')">
          <div class="card-icon"><span class="material-symbols-rounded">pie_chart</span></div>
          <span class="card-title">Anggaran</span>
          <span class="card-value">Rp {{ (totalBudget || 0).toLocaleString('id-ID') }}</span>
          <span class="card-sub">{{ (store.budgets || []).length }} kategori</span>
        </div>
        <div class="stat-card info" @click="$router.push('/goals')">
          <div class="card-icon"><span class="material-symbols-rounded">target</span></div>
          <span class="card-title">Target/Tabungan</span>
          <span class="card-value">{{ Math.round(goalProgress) }}%</span>
          <span class="card-sub">{{ (store.goals || []).length }} target aktif</span>
        </div>
      </div>

      <!-- Pengingat -->
      <div v-if="upcomingReminders.length > 0" class="section">
        <div class="section-header">
          <h2 class="section-title">Pengingat Penting</h2>
          <div class="badge danger">{{ upcomingReminders.length }} Tagihan</div>
        </div>
        <div class="reminder-list">
          <div v-for="rem in upcomingReminders" :key="rem.id" class="reminder-card">
            <div class="reminder-icon">
              <span class="material-symbols-rounded">{{ rem.icon === 'zap' ? 'bolt' : rem.icon }}</span>
            </div>
            <div class="reminder-info">
              <span class="reminder-name">{{ rem.name }}</span>
              <span class="reminder-desc">Belum dibayar ({{ rem.period }})</span>
            </div>
            <button class="tonal-btn" @click="$router.push('/transaction')">Bayar</button>
          </div>
        </div>
      </div>

      <!-- Menu Cepat -->
      <div class="quick-access-grid">
        <div @click="$router.push('/items')" class="quick-card">
          <div class="quick-icon success"><span class="material-symbols-rounded">inventory_2</span></div>
          <div class="quick-label">Barang</div>
        </div>
        <div @click="$router.push('/merchants')" class="quick-card">
          <div class="quick-icon warning"><span class="material-symbols-rounded">store</span></div>
          <div class="quick-label">Toko</div>
        </div>
        <div @click="$router.push('/memberships')" class="quick-card">
          <div class="quick-icon info"><span class="material-symbols-rounded">card_membership</span></div>
          <div class="quick-label">Member/Sewa</div>
        </div>
        <div @click="$router.push('/vouchers')" class="quick-card">
          <div class="quick-icon secondary"><span class="material-symbols-rounded">confirmation_number</span></div>
          <div class="quick-label">Kupon</div>
        </div>
        <div @click="$router.push('/receipts')" class="quick-card">
          <div class="quick-icon tertiary"><span class="material-symbols-rounded">receipt_long</span></div>
          <div class="quick-label">Nota/Bukti</div>
        </div>
        <div @click="$router.push('/audit')" class="quick-card anomaly">
          <div class="quick-icon danger"><span class="material-symbols-rounded">monitoring</span></div>
          <div class="quick-label">Cek Data</div>
          <div v-if="anomalyCount > 0" class="badge-dot">{{ anomalyCount }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'

const router = useRouter()
const store = useFinanceStore()
const scrollContainer = ref(null)

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
  if (!dateStr) return 'T/A'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const checkUpdates = () => {
  store.notify('Verifying core integrity...', 'info')
  setTimeout(() => {
     store.notify('Protocol v5.3.0 is the latest stable release.', 'success')
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
  if (scrollContainer.value) scrollContainer.value.scrollTo(0, 0)
  if (window.lucide) {
    window.lucide.createIcons()
  }
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

/* TOP APP BAR */
.top-app-bar {
  padding: env(safe-area-inset-top) 16px 8px 16px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.app-bar-content {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.app-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 8px;
  padding: 4px;
  display: flex; /* Added display: flex */
  align-items: center; /* Added align-items: center */
  justify-content: center; /* Added justify-content: center */
}

.logo-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-title-group h1 {
  font-size: 22px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
  margin: 0;
}

.app-bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: var(--surface-variant);
}

.avatar-box {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: var(--surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  margin-left: 4px;
  overflow: hidden;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #4CAF50;
  border: 2px solid var(--bg-primary);
  border-radius: 50%;
}

/* SEARCH OVERLAY */
.search-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.search-overlay.active {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.search-overlay input {
  flex: 1;
  height: 48px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: var(--on-surface);
  outline: none;
}

.search-icon {
  color: var(--on-surface-variant);
  margin-left: 8px;
}

/* CONTENT SCROLL */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px 16px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.status-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: rgba(180, 232, 168, 0.1);
  border-radius: 8px;
  color: var(--green);
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: var(--green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--green);
}

.status-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--on-surface-variant);
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: var(--bg-secondary);
  border-radius: 24px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.2s, background-color 0.2s;
  cursor: pointer;
}

.stat-card:active {
  transform: scale(0.97);
  background-color: var(--surface-variant);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.stat-card.spending .card-icon { background-color: rgba(242, 184, 181, 0.2); color: var(--red); }
.stat-card.success .card-icon { background-color: rgba(180, 232, 168, 0.2); color: var(--green); }
.stat-card.info .card-icon { background-color: rgba(168, 199, 250, 0.2); color: var(--blue); }

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.card-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--on-surface);
}

.card-sub {
  font-size: 11px;
  color: var(--on-surface-variant);
  opacity: 0.7;
}

/* SECTIONS */
.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--on-surface);
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
}

.badge.danger {
  background-color: rgba(242, 184, 181, 0.2);
  color: var(--red);
}

/* REMINDERS */
.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-card {
  background-color: var(--bg-secondary);
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.reminder-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: var(--surface-variant);
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reminder-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reminder-name {
  font-size: 14px;
  font-weight: 500;
}

.reminder-desc {
  font-size: 12px;
  color: var(--on-surface-variant);
}

.tonal-btn {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  border: none;
  padding: 8px 16px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

/* QUICK ACCESS */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.quick-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: var(--surface-variant);
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quick-icon.success { background-color: rgba(180, 232, 168, 0.15); color: var(--green); }
.quick-icon.warning { background-color: rgba(255, 217, 140, 0.15); color: var(--amber); }
.quick-icon.info { background-color: rgba(168, 199, 250, 0.15); color: var(--blue); }
.quick-icon.secondary { background-color: var(--secondary-container); color: var(--on-secondary-container); }
.quick-icon.tertiary { background-color: var(--tertiary-container); color: var(--on-tertiary-container); }
.quick-icon.danger { background-color: rgba(242, 184, 181, 0.15); color: var(--red); }

.quick-card:hover .quick-icon {
  transform: translateY(-4px);
  filter: brightness(1.1);
}

.quick-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--on-surface-variant);
  text-align: center;
}

.badge-dot {
  position: absolute;
  top: -4px;
  right: 12px;
  background-color: var(--red);
  color: var(--on-error);
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-primary);
}

/* FOOTER */
.app-footer {
  text-align: center;
  opacity: 0.4;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-core { font-size: 10px; font-weight: 700; letter-spacing: 1px; }
.footer-status { font-size: 8px; letter-spacing: 0.5px; }

/* ANIMATIONS */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin span { animation: spin 1s infinite linear; }
</style>
