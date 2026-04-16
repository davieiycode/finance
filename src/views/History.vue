<template>
  <div class="view-content history-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Riwayat</h1>
          <div class="app-bar-actions">
            <button class="icon-btn" @click="showSearch = true">
              <span class="material-symbols-rounded">search</span>
            </button>
            <button class="icon-btn" @click="showFilter = !showFilter" :class="{ 'active': isFilterActive }">
              <span class="material-symbols-rounded">filter_list</span>
            </button>
          </div>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Cari riwayat..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll" ref="scrollContainer">
      <!-- Filter Panel (MD3 style) -->
      <div v-if="showFilter" class="filter-panel card-md3">
         <div class="filter-grid">
            <div class="filter-group">
               <span class="filter-label">Mulai Tanggal</span>
               <input type="date" v-model="filter.from" class="md-input">
            </div>
            <div class="filter-group">
               <span class="filter-label">Sampai Tanggal</span>
               <input type="date" v-model="filter.to" class="md-input">
            </div>
            <div class="filter-group">
               <span class="filter-label">Jenis Transaksi</span>
               <select v-model="filter.type" class="md-input">
                  <option value="">Semua Jenis</option>
                  <option value="Expense">Pengeluaran</option>
                  <option value="Income">Pemasukan</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Investment">Investasi</option>
                  <option value="Savings">Tabungan</option>
               </select>
            </div>
            <div class="filter-group">
               <span class="filter-label">Status Cek</span>
               <select v-model="filter.status" class="md-input">
                  <option value="">Semua Status</option>
                  <option value="yes">Sudah Dicek</option>
                  <option value="no">Belum Dicek</option>
               </select>
            </div>
         </div>
         <div class="filter-actions">
            <button @click="resetFilter" class="text-btn">Atur Ulang</button>
            <button @click="showFilter = false" class="tonal-btn">Terapkan</button>
         </div>
      </div>

      <!-- Log List -->
      <div class="log-list">
         <template v-for="(group, dateRaw) in groupedTransactions" :key="dateRaw">
            <div class="date-header">
               <span class="date-label">{{ group.dateFormatted }}</span>
               <div class="date-line"></div>
               <div class="date-net" :class="{ 'pos': group.net > 0, 'neg': group.net < 0 }">
                  {{ group.net > 0 ? '+' : (group.net < 0 ? '-' : '') }}Rp {{ Math.abs(group.net).toLocaleString('id-ID') }}
               </div>
            </div>
            
            <div v-for="t in group.items" :key="t.transactionID" @click="openTx(t)" class="log-item card-md3">
               <div class="log-icon-box" :style="{ backgroundColor: getTxColor(t.type) + '15', color: getTxColor(t.type) }">
                  <span class="material-symbols-rounded">{{ getTxIcon(t.type, t.category) }}</span>
               </div>
               <div class="log-info">
                  <span class="log-title">{{ t.itemName || t.merchant || 'Tanpa Nama' }}</span>
                  <span class="log-meta">{{ t.merchant ? t.merchant + ' • ' : '' }}{{ t.category || 'Umum' }} • {{ formatTime(t.time) }}</span>
               </div>
               <div class="log-amount" :style="{ color: getTxColor(t.type) }">
                  {{ getTxSign(t.type) }}Rp {{ (Number(t.total) || 0).toLocaleString('id-ID') }}
               </div>
            </div>
         </template>

         <div v-if="Object.keys(groupedTransactions).length === 0" class="empty-state">
            <span class="material-symbols-rounded">search_off</span>
            <p>Tidak ada catatan transaksi ditemukan.</p>
         </div>
      </div>
    </div>

    <TransactionModal v-if="selectedTx" :tx="selectedTx" @close="selectedTx = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '../stores/finance'
import TransactionModal from '../components/TransactionModal.vue'

const store = useFinanceStore()
const scrollContainer = ref(null)
const showSearch = ref(false)
const showFilter = ref(false)
const searchQuery = ref('')
const filter = ref({ from: '', to: '', type: '', status: '' })
const selectedTx = ref(null)

const isFilterActive = computed(() => !!(filter.value.from || filter.value.to || filter.value.type || filter.value.status))

const groupedTransactions = computed(() => {
  let list = [...store.transactions]
  const q = searchQuery.value.toLowerCase()
  if (q) {
    list = list.filter(t => 
      (t.itemName || '').toLowerCase().includes(q) || 
      (t.merchant || '').toLowerCase().includes(q) || 
      (t.category || '').toLowerCase().includes(q)
    )
  }
  if (filter.value.from) list = list.filter(t => t.date >= filter.value.from)
  if (filter.value.to) list = list.filter(t => t.date <= filter.value.to)
  if (filter.value.type) list = list.filter(t => t.type === filter.value.type)
  if (filter.value.status) list = list.filter(t => t.cleared === filter.value.status)

  list.sort((a,b) => (b.date + (b.time||'')).localeCompare(a.date + (a.time||'')))

  const groups = {}
  list.forEach(t => {
    const amount = Number(t.total) || 0
    const type = (t.type || '').toLowerCase()
    
    if (!groups[t.date]) {
       let label = t.date
       try {
         const d = new Date(t.date)
         if (!isNaN(d)) {
           label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
         }
       } catch (e) {}
       groups[t.date] = { dateFormatted: label, net: 0, items: [] }
    }
    
    if (type === 'income') groups[t.date].net += amount
    else groups[t.date].net -= amount
    
    groups[t.date].items.push(t)
  })
  return groups
})

const openTx = (t) => { selectedTx.value = t }
const getTxColor = (type) => {
  if (type === 'Income') return 'var(--green)'
  if (type === 'Expense') return 'var(--red)'
  return 'var(--blue)'
}

const getTxIcon = (type, cat) => {
  if (type === 'Income') return 'north_east'
  if (type === 'Expense') {
     const c = (cat || '').toLowerCase()
     if (c.includes('food') || c.includes('makan')) return 'restaurant'
     if (c.includes('transport')) return 'directions_car'
     if (c.includes('shop')) return 'shopping_bag'
     return 'south_west'
  }
  if (type === 'Transfer') return 'sync'
  if (type === 'Savings') return 'savings'
  if (type === 'Investment') return 'trending_up'
  return 'receipt_long'
}

const formatTime = (time) => {
  if (!time) return '00:00'
  const t = String(time)
  return t.length > 5 ? t.substring(0, 5) : t
}

const getTxSign = (type) => {
  if (type === 'Income') return '+'
  if (type === 'Expense') return '-'
  return ''
}

const resetFilter = () => {
  filter.value = { from: '', to: '', type: '', status: '' }
}

onMounted(() => { 
  if (scrollContainer.value) scrollContainer.value.scrollTo(0, 0)
})
</script>

<style scoped>
.history-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.top-app-bar {
  padding-top: max(env(safe-area-inset-top), 16px);
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.app-bar-content {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-bar-content h1 {
  flex: 1;
  font-size: 22px;
  font-weight: 500;
  margin: 0;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn.active {
  color: var(--primary);
  background-color: var(--primary-container);
}

.search-input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--on-surface);
  font-size: 16px;
  outline: none;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px 16px;
}

.card-md3 {
  background-color: var(--bg-secondary);
  border-radius: 24px;
  border: 1px solid var(--border);
}

.filter-panel {
  padding: 16px;
  margin-bottom: 24px;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--on-surface-variant);
  margin-left: 4px;
}

.md-input {
  background: var(--surface-variant);
  border: 1px solid var(--outline-variant);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--on-surface);
  font-size: 14px;
  outline: none;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.tonal-btn {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border: none;
  border-radius: 20px;
  padding: 8px 24px;
  font-weight: 500;
  cursor: pointer;
}

.text-btn {
  background: transparent;
  border: none;
  color: var(--primary);
  font-weight: 500;
  cursor: pointer;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 8px 8px 8px;
}

.date-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-line {
  flex: 1;
  height: 1px;
  background: var(--border);
  opacity: 0.5;
}

.date-net {
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--surface-variant);
}

.date-net.pos { color: var(--green); }
.date-net.neg { color: var(--red); }

.log-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.log-item:active { transform: scale(0.98); }

.log-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.log-title {
  font-size: 16px;
  font-weight: 500;
}

.log-meta {
  font-size: 12px;
  color: var(--on-surface-variant);
}

.log-amount {
  font-size: 16px;
  font-weight: 700;
}

.empty-state {
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0.5;
}

.empty-state .material-symbols-rounded { font-size: 48px; }
</style>
