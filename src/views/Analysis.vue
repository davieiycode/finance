<template>
  <div class="view-content analysis-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar glass-panel">
      <div class="app-bar-content">
        <div class="app-bar-actions left">
           <button @click="$router.back(); uiStore.haptic('light')" class="icon-btn">
             <span class="material-symbols-rounded">arrow_back</span>
           </button>
        </div>
        <div class="app-title-group">
          <h1>Analisis Keuangan</h1>
        </div>
        <div class="app-bar-actions">
           <button @click="printReport(); uiStore.haptic('medium')" class="icon-btn">
             <span class="material-symbols-rounded">print</span>
           </button>
           <button @click="toggleExport(); uiStore.haptic('light')" class="icon-btn">
             <span class="material-symbols-rounded">share</span>
           </button>
        </div>
      </div>
    </div>

    <!-- Segmented Button Switcher -->
    <div class="segmented-button no-print">
      <button @click="analysisMode = 'monthly'" :class="{ active: analysisMode === 'monthly' }">Bulanan</button>
      <button @click="analysisMode = 'yearly'" :class="{ active: analysisMode === 'yearly' }">Tahunan</button>
    </div>

    <div class="content-scroll">
      <div class="print-only report-header">
         <h2>Laporan Keuangan Jurney</h2>
         <p>Periode: {{ displayPeriod }}</p>
         <p>Dicetak pada: {{ new Date().toLocaleString('id-ID') }}</p>
      </div>

      <!-- Period Navigator -->
      <div class="period-navigator glass-panel stagger-1">
        <button @click="prevPeriod(); uiStore.haptic('light')" class="icon-btn sm">
          <span class="material-symbols-rounded">chevron_left</span>
        </button>
        <div class="period-display">
           <span class="period-label">{{ analysisMode === 'yearly' ? 'Tahun' : 'Bulan' }}</span>
           <span class="period-value">{{ periodDisplay }}</span>
        </div>
        <button @click="nextPeriod(); uiStore.haptic('light')" class="icon-btn sm">
          <span class="material-symbols-rounded">chevron_right</span>
        </button>
      </div>

      <!-- MoM Briefing -->
      <div v-if="momInsight" class="briefing-card card-md3 no-print">
         <div class="briefing-icon"><span class="material-symbols-rounded">lightbulb</span></div>
         <div class="briefing-content">
            <span class="briefing-label">Wawasan Bulan Ini</span>
            <p class="briefing-text">{{ momInsight }}</p>
         </div>
      </div>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card income" @click="showModal('category', 'Income', 'Total Income')">
          <span class="metric-value">Rp {{ (metrics.income || 0).toLocaleString('id-ID') }}</span>
          <span class="metric-label">Pemasukan</span>
        </div>
        <div class="metric-card expense" @click="showModal('category', 'Expense', 'Total Expense')">
          <span class="metric-value">Rp {{ (metrics.expense || 0).toLocaleString('id-ID') }}</span>
          <span class="metric-label">Pengeluaran</span>
        </div>
        <div class="metric-card primary">
          <span class="metric-value">Rp {{ (metrics.profit || 0).toLocaleString('id-ID') }}</span>
          <span class="metric-label">Arus Kas Bersih</span>
        </div>
        <div class="metric-card warning">
          <span class="metric-value">{{ metrics.savingRate }}%</span>
          <span class="metric-label">Tingkat Tabungan</span>
        </div>
      </div>

      <!-- Intelligence Briefing -->
      <div class="briefing-card">
        <div class="briefing-header">
          <span class="material-symbols-rounded">auto_awesome</span>
          <h3>Ringkasan Analisis</h3>
        </div>
        <p>{{ insightText }}</p>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div v-show="activeTab === 'cashflow'" class="chart-container">
          <h3 class="chart-title">Aliran Kas</h3>
          <div id="cashflow-sankey" style="width: 100%; height: 400px;"></div>
        </div>

        <div v-show="activeTab === 'trend'" class="chart-container">
          <h3 class="chart-title">Tren Pengeluaran Harian</h3>
          <div id="trend-line" style="width: 100%; height: 350px;"></div>
        </div>

        <div v-show="activeTab === 'networth'" class="chart-container">
          <h3 class="chart-title">Struktur Kekayaan Bersih</h3>
          <div class="networth-hero">
             <span class="nw-label">Kekayaan Bersih Saat Ini</span>
             <h2 class="nw-value" :class="{ 'pos': netWorthData.total >= 0, 'neg': netWorthData.total < 0 }">
                Rp {{ netWorthData.total.toLocaleString('id-ID') }}
             </h2>
          </div>
          <div class="nw-breakdown">
             <div class="nw-row">
                <div class="nw-info">
                   <span class="material-symbols-rounded text-success">payments</span>
                   <span>Total Saldo Akun</span>
                </div>
                <span class="nw-amount">Rp {{ netWorthData.accounts.toLocaleString('id-ID') }}</span>
             </div>
             <div class="nw-row">
                <div class="nw-info">
                   <span class="material-symbols-rounded text-success">call_made</span>
                   <span>Total Piutang (Aset)</span>
                </div>
                <span class="nw-amount">Rp {{ netWorthData.lending.toLocaleString('id-ID') }}</span>
             </div>
             <div class="nw-row debt-row">
                <div class="nw-info">
                   <span class="material-symbols-rounded text-danger">call_received</span>
                   <span>Total Hutang (Beban)</span>
                </div>
                <span class="nw-amount text-danger">-Rp {{ netWorthData.debt.toLocaleString('id-ID') }}</span>
             </div>
          </div>
          <div id="networth-pie" style="width: 100%; height: 300px;"></div>
        </div>

        <div v-show="activeTab === 'income'" class="chart-container">
          <h3 class="chart-title">Kategori Pemasukan</h3>
          <div id="income-treemap" style="width: 100%; height: 350px;"></div>
          <div class="ranking-list">
            <div v-for="(item, i) in categoryIncome" :key="item.name" @click="showModal('category', 'Income', item.name)" class="rank-item">
              <div class="rank-header">
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-value text-success">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
              </div>
              <div class="rank-bar"><div class="rank-fill" :style="{ width: (item.value/metrics.income*100) + '%', background: colors[i % colors.length] }"></div></div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'spend'" class="chart-container">
          <h3 class="chart-title">Kategori Pengeluaran</h3>
          <div id="spend-treemap" style="width: 100%; height: 350px;"></div>
          <div class="ranking-list">
            <div v-for="(item, i) in categorySpending" :key="item.name" @click="showModal('category', 'Expense', item.name)" class="rank-item">
              <div class="rank-header">
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-value text-danger">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
              </div>
              <div class="rank-bar"><div class="rank-fill" :style="{ width: (item.value/metrics.expense*100) + '%', background: colors[i % colors.length] }"></div></div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'budget'" class="chart-container">
          <h3 class="chart-title">Monitor Anggaran Kategori</h3>
          <div class="ranking-list">
             <div v-for="b in budgetAnalysis" :key="b.name" class="rank-item budget-item" @click="showModal('category', 'Expense', b.name)">
                <div class="rank-header">
                   <div class="rank-name-group">
                      <span class="rank-name">{{ b.name }}</span>
                      <span class="budget-sub">{{ b.percent.toFixed(0) }}% terpakai</span>
                   </div>
                   <div class="rank-value-group">
                      <span class="rank-value">Rp {{ b.spent.toLocaleString('id-ID') }}</span>
                      <span class="budget-total">/ {{ b.limit.toLocaleString('id-ID') }}</span>
                   </div>
                </div>
                <div class="rank-bar">
                   <div class="rank-fill" :style="{ width: Math.min(b.percent, 100) + '%', background: getBudgetColor(b.percent) }"></div>
                </div>
                <div class="budget-footer">
                   <span :class="{ 'over-budget': b.remaining < 0 }">
                      {{ b.remaining < 0 ? 'Lebih: Rp ' + Math.abs(b.remaining).toLocaleString('id-ID') : 'Sisa: Rp ' + b.remaining.toLocaleString('id-ID') }}
                   </span>
                </div>
             </div>
             <div v-if="budgetAnalysis.length === 0" class="empty-state">
                <p>Belum ada anggaran yang disetel untuk bulan ini.</p>
                <button @click="$router.push('/budget')" class="tonal-btn sm">Setel Anggaran</button>
             </div>
          </div>
        </div>

        <div v-show="activeTab === 'merchant'" class="chart-container">
          <h3 class="chart-title">Analisis Toko & Vendor</h3>
          <div id="merchant-treemap" style="width: 100%; height: 350px;"></div>
          <div class="ranking-list">
            <div v-for="(item, i) in merchantAnalysis" :key="item.name" @click="showModal('merchant', 'Expense', item.name)" class="rank-item">
              <div class="rank-header">
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-value">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
              </div>
              <div class="rank-bar"><div class="rank-fill" :style="{ width: (item.value/maxMerchantValue*100) + '%', background: colors[i % colors.length] }"></div></div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'tag'" class="chart-container">
          <h3 class="chart-title">Kepadatan Tag</h3>
          <div id="tag-cloud" style="width: 100%; height: 350px;"></div>
          <div class="ranking-list">
             <div v-for="(item, i) in tagAnalysis" :key="item.name" @click="showModal('tag', null, item.name)" class="rank-item">
                <div class="rank-header">
                  <span class="rank-name">#{{ item.name }}</span>
                  <span class="rank-value">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="rank-bar"><div class="rank-fill" :style="{ width: (item.value / maxTagValue * 100) + '%', background: colors[i % colors.length] }"></div></div>
             </div>
          </div>
        </div>

        <div v-show="activeTab === 'project'" class="chart-container">
          <h3 class="chart-title">Distribusi Proyek</h3>
          <div id="project-pie" style="width: 100%; height: 350px;"></div>
          <div class="ranking-list">
             <div v-for="(item, i) in projectAnalysis" :key="item.name" @click="showModal('project', null, item.name)" class="rank-item">
                <div class="rank-header">
                  <span class="rank-name">{{ item.name || 'Lainnya' }}</span>
                  <span class="rank-value">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="rank-bar"><div class="rank-fill" :style="{ width: (item.value / maxProjectValue * 100) + '%', background: colors[i % colors.length] }"></div></div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Analysis Navigation -->
    <Teleport to="body">
       <transition name="pop">
         <div v-if="!isModalOpen && !selectedTx" class="floating-tabs glass-panel">
            <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id; uiStore.haptic('medium')" :class="{ active: activeTab === t.id }" class="tab-chip">
               <span class="material-symbols-rounded">{{ t.icon }}</span>
               <span class="tab-label">{{ t.label }}</span>
            </button>
         </div>
       </transition>
    </Teleport>

    <!-- LIST MODAL -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-backdrop-full">
       <div class="bottom-sheet">
          <div class="sheet-drag-handle"></div>
          <div class="sheet-header">
             <div class="sheet-title-group">
                <h3 class="sheet-title">{{ modalData.title }}</h3>
                <p class="sheet-subtitle">{{ filteredList.length }} Transaksi</p>
             </div>
             <button @click="modalData = null" class="icon-btn">
               <span class="material-symbols-rounded">close</span>
             </button>
          </div>
          
          <div class="sheet-content">
             <div v-for="t in filteredList" :key="t.transactionID" @click="selectedTx = t" class="tx-list-item">
                <div class="tx-icon" :style="{ backgroundColor: getTxColor(t.type) + '20', color: getTxColor(t.type) }">
                   <span class="material-symbols-rounded">
                      {{ store.resolveIcon(t.category, t.type) }}
                   </span>
                </div>
                <div class="tx-info">
                   <span class="tx-name">{{ t.itemName || t.merchant || 'Tidak Diketahui' }}</span>
                   <span class="tx-meta">{{ formatDate(t.date) }} • {{ t.category }}</span>
                </div>
                <div class="tx-amount" :style="{ color: getTxColor(t.type) }">
                   {{ getTxSign(t.type) }}Rp {{ (t.total || 0).toLocaleString('id-ID') }}
                </div>
             </div>
          </div>
       </div>
      </div>
    </Teleport>

    <TransactionModal v-if="selectedTx" :tx="selectedTx" @close="selectedTx = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'
import TransactionModal from '../components/TransactionModal.vue'

const store = useFinanceStore()
const uiStore = useUIStore()
const analysisMode = ref('monthly')
const activeDate = ref(new Date())
const activeTab = ref('cashflow')
const selectedTx = ref(null)
const modalData = ref(null)
const isModalOpen = computed(() => !!modalData.value)

const printReport = () => {
   window.print()
}

const toggleExport = () => { /* Export logic */ }

const tabs = [
  { id: 'cashflow', label: 'Aliran', icon: 'conversion_path' },
  { id: 'trend', label: 'Tren', icon: 'trending_up' },
  { id: 'networth', label: 'Kekayaan', icon: 'account_balance' },
  { id: 'income', label: 'Pemasukan', icon: 'download' },
  { id: 'spend', label: 'Pengeluaran', icon: 'shopping_basket' },
  { id: 'budget', label: 'Anggaran', icon: 'pie_chart' },
  { id: 'merchant', label: 'Toko', icon: 'store' },
  { id: 'tag', label: 'Tag', icon: 'tag' },
  { id: 'project', label: 'Proyek', icon: 'layers' }
]

const colors = ['#D0BCFF', '#A8C7FA', '#B4E8A8', '#FFD98C', '#F2B8B5', '#7FCFFF', '#6DD5FA', '#CCC2DC', '#EFB8C8']

const displayPeriod = computed(() => {
  if (analysisMode.value === 'monthly') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return `${months[activeDate.value.getMonth()]} ${activeDate.value.getFullYear()}`
  }
  return `${activeDate.value.getFullYear()}`
})

const periodDisplay = computed(() => displayPeriod.value)

const filteredTransactions = computed(() => {
  const filterStr = analysisMode.value === 'monthly' 
    ? `${activeDate.value.getFullYear()}-${String(activeDate.value.getMonth() + 1).padStart(2, '0')}`
    : `${activeDate.value.getFullYear()}`
  return (store.transactions || []).filter(t => (t.date || '').startsWith(filterStr))
})

const metrics = computed(() => {
  const txs = filteredTransactions.value || []
  const income = txs.filter(t => t.type === 'Income').reduce((s, t) => s + (t.total || 0), 0)
  const expense = txs.filter(t => t.type === 'Expense').reduce((s, t) => s + (t.total || 0), 0)
  const profit = income - expense
  const savingRate = income > 0 ? Math.round((profit / income) * 100) : 0
  return { income, expense, profit, savingRate }
})

const processData = (list, key, isTag = false) => {
  const map = {}
  list.forEach(t => {
    const val = t.total || 0
    if (isTag) {
      const tagVal = t[key]
      const tags = (typeof tagVal === 'string' ? tagVal : (Array.isArray(tagVal) ? tagVal.join(', ') : '')).split(/[, ]+/).filter(x => x.trim())
      tags.forEach(tag => map[tag] = (map[tag] || 0) + val)
    } else {
      const name = t[key] || (key === 'projects' ? 'Mandiri' : 'Tanpa Kategori')
      map[name] = (map[name] || 0) + val
    }
  })
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)
}

const categorySpending = computed(() => processData(filteredTransactions.value.filter(t => t.type === 'Expense'), 'category'))
const categoryIncome = computed(() => processData(filteredTransactions.value.filter(t => t.type === 'Income'), 'category'))
const merchantAnalysis = computed(() => processData(filteredTransactions.value.filter(t => t.type === 'Expense'), 'merchant'))
const tagAnalysis = computed(() => processData(filteredTransactions.value, 'tags', true))
const projectAnalysis = computed(() => processData(filteredTransactions.value, 'projects'))

const netWorthData = computed(() => {
  const accountsTotal = (store.accounts || []).reduce((sum, a) => sum + (Number(a.currentBalance) || 0), 0)
  const lendingTotal = (store.debts || []).filter(d => d.type === 'piutang').reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0)
  const debtTotal = (store.debts || []).filter(d => d.type === 'hutang').reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0)
  
  return {
    accounts: accountsTotal,
    lending: lendingTotal,
    debt: debtTotal,
    total: accountsTotal + lendingTotal - debtTotal
  }
})

const budgetAnalysis = computed(() => {
  const results = []
  const budgets = store.budgets || []
  budgets.forEach(b => {
    const spent = categorySpending.value.find(c => c.name === b.category)?.value || 0
    const limit = Number(b.amount) || 0
    const percent = limit > 0 ? (spent / limit) * 100 : 0
    results.push({
      name: b.category,
      spent,
      limit,
      percent,
      remaining: limit - spent
    })
  })
  return results.sort((a,b) => b.percent - a.percent)
})

const getBudgetColor = (p) => {
  if (p >= 100) return 'var(--red)'
  if (p >= 80) return 'var(--amber)'
  return 'var(--green)'
}

const lastMonthSpending = computed(() => {
  const prevDate = new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() - 1, 1)
  const monthStr = prevDate.toISOString().substring(0, 7)
  return store.transactions
    .filter(t => t.type === 'Expense' && (t.date || '').startsWith(monthStr))
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0)
})

const momInsight = computed(() => {
  const current = categorySpending.value.reduce((sum, c) => sum + c.value, 0)
  const prev = lastMonthSpending.value
  if (prev === 0 || current === 0) return null
  
  const diff = ((current - prev) / prev) * 100
  if (diff > 5) return `Pengeluaran naik ${diff.toFixed(0)}% dari bulan lalu.`
  if (diff < -5) return `Hebat! Anda hemat ${Math.abs(diff).toFixed(0)}% dari bulan lalu.`
  return `Pengeluaran Anda stabil.`
})

const trendAnalysis = computed(() => {
  const map = {}
  filteredTransactions.value.filter(t => t.type === 'Expense').forEach(t => {
    const d = t.date || ''
    map[d] = (map[d] || 0) + (t.total || 0)
  })
  
  const result = []
  const daysInMonth = new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 1, 0).getDate()
  const year = activeDate.value.getFullYear()
  const month = activeDate.value.getMonth()
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    result.push({ date: dStr, value: map[dStr] || 0 })
  }
  return result
})

const maxTagValue = computed(() => Math.max(...tagAnalysis.value.map(t => t.value), 1))
const maxProjectValue = computed(() => Math.max(...projectAnalysis.value.map(t => t.value), 1))
const maxMerchantValue = computed(() => Math.max(...merchantAnalysis.value.map(t => t.value), 1))

const filteredList = computed(() => {
   if (!modalData.value) return []
   const { type: mType, filterType, filterValue } = modalData.value
   let list = [...filteredTransactions.value]
   
   if (filterType === 'category') {
      if (filterValue !== 'Total Income' && filterValue !== 'Total Expense') {
         list = list.filter(t => t.category === filterValue && t.type === mType)
      } else {
         list = list.filter(t => t.type === mType)
      }
   } else if (filterType === 'tag') {
      list = list.filter(t => {
         const tagVal = t.tags || ''
         const tagStr = typeof tagVal === 'string' ? tagVal : (Array.isArray(tagVal) ? tagVal.join(', ') : '')
         return tagStr.toLowerCase().includes(filterValue.toLowerCase())
      })
   } else if (filterType === 'project') {
      list = list.filter(t => {
         const prjVal = t.projects || 'Mandiri'
         const prjStr = typeof prjVal === 'string' ? prjVal : (Array.isArray(prjVal) ? prjVal.join(', ') : '')
         return prjStr === filterValue
      })
   } else if (filterType === 'merchant') {
      list = list.filter(t => t.merchant === filterValue && t.type === mType)
   }
   
   return list.sort((a,b) => (b.total || 0) - (a.total || 0))
})

const showModal = (filterType, type, filterValue) => {
   modalData.value = { filterType, type, filterValue, title: filterValue }
}

const insightText = computed(() => {
  const { income, expense, savingRate } = metrics.value
  if (income === 0 && expense === 0) return 'Mulai mencatat untuk menghasilkan laporan analisis.'
  if (expense > income) return 'Peringatan: Pengeluaran melebihi pemasukan.'
  if (savingRate > 60) return 'Logistik Teladan.'
  return 'Performa Normal.'
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const parts = String(dateStr).split('-')
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }
    return dateStr
  } catch (e) { return dateStr }
}

const prevPeriod = () => changePeriod(-1)
const nextPeriod = () => changePeriod(1)

const changePeriod = (delta) => {
  const d = new Date(activeDate.value)
  if (analysisMode.value === 'monthly') d.setMonth(d.getMonth() + delta)
  else d.setFullYear(d.getFullYear() + delta)
  activeDate.value = d
}

let charts = {}

const initCharts = () => {
  if (!window.echarts) return
  const darkTheme = { backgroundColor: 'transparent', textStyle: { fontFamily: 'inherit', color: '#CAC4D0' } }
  const chartColors = ['#A8C7FA', '#B4E8A8', '#F2B8B5', '#FFD98C', '#D0BCFF', '#C4C6D0', '#7FCFFF', '#6DD5FA']

  // Helper to dispose and re-init
  const refreshChart = (id, chartKey, option) => {
    const el = document.getElementById(id)
    if (el && activeTab.value === chartKey) {
       if (charts[chartKey]) charts[chartKey].dispose()
       charts[chartKey] = window.echarts.init(el, 'dark')
       charts[chartKey].setOption({ ...darkTheme, ...option })
    }
  }

  // 1. CASHFLOW (Sankey)
  if (activeTab.value === 'cashflow') {
     const nodes = []
     const links = []
     const { income, expense } = metrics.value

     // Unique nodes set to avoid duplicates
     const nodesMap = new Set()
     const addNode = (name, color) => {
        if (!nodesMap.has(name)) {
           nodes.push({ name, itemStyle: { color } })
           nodesMap.add(name)
        }
     }

     // Sources
     categoryIncome.value.forEach(c => {
        addNode(c.name, '#B4E8A8')
        links.push({ source: c.name, target: 'Pemasukan', value: c.value })
     })
     
     if (nodes.length > 0 || expense > 0) {
        addNode('Pemasukan', '#81C784')
        addNode('Pengeluaran', '#E57373')
        
        if (income > 0 && expense > 0) {
           links.push({ source: 'Pemasukan', target: 'Pengeluaran', value: Math.min(income, expense) })
        }
        
        if (income > expense) {
           addNode('Tabungan', '#A8C7FA')
           links.push({ source: 'Pemasukan', target: 'Tabungan', value: income - expense })
        }

        categorySpending.value.forEach(c => {
           addNode(c.name, '#F2B8B5')
           links.push({ source: 'Pengeluaran', target: c.name, value: c.value })
        })

        refreshChart('cashflow-sankey', 'cashflow', {
           tooltip: { trigger: 'item', triggerOn: 'mousemove' },
           series: [{
              type: 'sankey',
              data: nodes,
              links: links.filter(l => l.value > 0),
              emphasis: { focus: 'adjacency' },
              lineStyle: { color: 'gradient', curveness: 0.5 },
              label: { color: '#fff', fontSize: 10 }
           }]
        })
     }
  }

  // 2. TREND
  refreshChart('trend-line', 'trend', {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendAnalysis.value.map(d => d.date.split('-')[2]) },
    yAxis: { type: 'value' },
    series: [{ 
      data: trendAnalysis.value.map(d => d.value), 
      type: 'bar', 
      itemStyle: { color: '#F2B8B5', borderRadius: [4, 4, 0, 0] } 
    }]
  })

  // 3. NETWORTH
  refreshChart('networth-pie', 'networth', {
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: netWorthData.value.accounts, name: 'Tunai', itemStyle: { color: '#B4E8A8' } },
        { value: netWorthData.value.lending, name: 'Piutang', itemStyle: { color: '#A8C7FA' } },
        { value: netWorthData.value.debt, name: 'Hutang', itemStyle: { color: '#F2B8B5' } }
      ],
      label: { show: false }
    }]
  })

  // 4. INCOME TREEMAP
  refreshChart('income-treemap', 'income', {
    series: [{
      type: 'treemap',
      data: categoryIncome.value.map((c, i) => ({ name: c.name, value: c.value, itemStyle: { color: chartColors[i % chartColors.length] } })),
      breadcrumb: { show: false }
    }]
  })

  // 5. SPEND TREEMAP
  refreshChart('spend-treemap', 'spend', {
    series: [{
      type: 'treemap',
      data: categorySpending.value.map((c, i) => ({ name: c.name, value: c.value, itemStyle: { color: chartColors[i % chartColors.length] } })),
      breadcrumb: { show: false }
    }]
  })

  // 6. MERCHANT TREEMAP
  refreshChart('merchant-treemap', 'merchant', {
    series: [{
      type: 'treemap',
      data: merchantAnalysis.value.map((c, i) => ({ name: c.name, value: c.value, itemStyle: { color: chartColors[i % chartColors.length] } })),
      breadcrumb: { show: false }
    }]
  })

  // 7. TAG CLOUD
  refreshChart('tag-cloud', 'tag', {
    series: [{
      type: 'treemap',
      data: tagAnalysis.value.map((c, i) => ({ name: '#' + c.name, value: c.value, itemStyle: { color: chartColors[i % chartColors.length] } })),
      breadcrumb: { show: false }
    }]
  })

  // 8. PROJECT PIE
  refreshChart('project-pie', 'project', {
    series: [{
      type: 'pie',
      radius: '60%',
      data: projectAnalysis.value.map((c, i) => ({ name: c.name || 'Mandiri', value: c.value, itemStyle: { color: chartColors[i % chartColors.length] } })),
      label: { color: '#fff', fontSize: 10 }
    }]
  })
}

const getTxColor = (type) => (type === 'Income' ? '#B4E8A8' : type === 'Expense' ? '#F2B8B5' : '#A8C7FA')
const getTxSign = (type) => (type === 'Income' ? '+' : type === 'Expense' ? '-' : '')

watch([filteredTransactions, activeTab, analysisMode], () => { 
  nextTick(() => initCharts()) 
})

onMounted(() => {
  initCharts()
  window.addEventListener('resize', () => Object.values(charts).forEach(c => c && c.resize()))
})

onBeforeUnmount(() => { 
  uiStore.unregisterModal('analysis') 
  Object.values(charts).forEach(c => c && c.dispose())
})
</script>

<style scoped>
.analysis-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--on-surface);
  overflow: hidden;
}

.glass-panel {
  background: rgba(var(--surface-rgb), 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.app-bar-content {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.app-title-group h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.segmented-button {
  display: flex;
  background-color: var(--surface-variant);
  border-radius: 20px;
  padding: 4px;
  margin: 16px;
}

.segmented-button button {
  flex: 1;
  padding: 8px;
  border-radius: 16px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.segmented-button button.active {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 120px 16px;
}

.period-navigator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 24px;
}

.period-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.period-label {
  font-size: 18px;
  font-weight: 500;
}

.period-sub {
  font-size: 11px;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* METRICS GRID */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: var(--bg-secondary);
  padding: 16px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.metric-card.income { border-bottom: 3px solid var(--green); }
.metric-card.expense { border-bottom: 3px solid var(--red); }
.metric-card.primary { border-bottom: 3px solid var(--primary); }
.metric-card.warning { border-bottom: 3px solid var(--amber); }

.metric-value {
  font-size: 16px;
  font-weight: 700;
}

.metric-label {
  font-size: 11px;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  font-weight: 500;
}

/* BRIEFING */
.briefing-card {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  padding: 16px;
  border-radius: 24px;
  margin-bottom: 24px;
}

.briefing-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.briefing-header h3 {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.briefing-card p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
}

/* CHARTS */
.chart-container {
  background-color: var(--bg-secondary);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface-variant);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* RANKING */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.rank-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-name { font-size: 14px; font-weight: 500; }
.rank-value { font-size: 14px; font-weight: 500; }

.rank-bar {
  height: 8px;
  background-color: var(--surface-variant);
  border-radius: 4px;
  overflow: hidden;
}

.rank-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

/* FLOATING TABS */
.floating-tabs {
  position: fixed;
  bottom: 104px; /* Higher to avoid BottomNav */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(22, 22, 24, 0.7) !important;
  backdrop-filter: blur(20px);
  padding: 6px;
  border-radius: 32px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  z-index: 1500;
  max-width: 90vw;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: floatingIn 0.5s var(--spring-easing) both;
}

@keyframes floatingIn {
  from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

.floating-tabs::-webkit-scrollbar { display: none; }

.tab-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-chip.active {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.tab-label {
  font-size: 12px;
  font-weight: 500;
}

/* BOTTOM SHEET */
.modal-backdrop-full {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  z-index: 4000;
  display: flex;
  align-items: flex-end;
}

.bottom-sheet {
  width: 100%;
  background-color: var(--bg-primary);
  border-radius: 28px 28px 0 0;
  padding: 8px 16px 32px 16px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.sheet-drag-handle {
  width: 32px;
  height: 4px;
  background-color: var(--outline);
  border-radius: 2px;
  margin: 0 auto 16px auto;
  opacity: 0.4;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.sheet-title { font-size: 22px; font-weight: 400; margin: 0; }
.sheet-subtitle { font-size: 14px; color: var(--on-surface-variant); margin: 4px 0 0 0; }

.sheet-content {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tx-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 16px;
  background-color: var(--bg-secondary);
  cursor: pointer;
}

.tx-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tx-name { font-size: 16px; font-weight: 500; }
.tx-meta { font-size: 12px; color: var(--on-surface-variant); }

.tx-amount { font-size: 16px; font-weight: 500; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.networth-hero { text-align: center; padding: 24px 0; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
.nw-label { font-size: 12px; font-weight: 600; color: var(--on-surface-variant); opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
.nw-value { font-size: 32px; font-weight: 700; margin-top: 8px; font-family: 'Outfit', sans-serif; }
.nw-value.pos { color: var(--green); }
.nw-value.neg { color: var(--red); }
.nw-breakdown { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.nw-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
.nw-info { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; }
.nw-info .material-symbols-rounded { font-size: 20px; }
.nw-amount { font-weight: 700; font-size: 14px; }
.debt-row { border-top: 1px dashed var(--border); padding-top: 12px; }

.briefing-card {
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-container), var(--bg-secondary));
  border: 1px solid var(--primary);
}
.briefing-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.briefing-content { flex: 1; }
.briefing-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); display: block; margin-bottom: 2px; }
.briefing-text { font-size: 13px; font-weight: 500; line-height: 1.4; margin: 0; }

.rank-item.budget-item { padding: 16px; border-bottom: 1px solid var(--border); }
.rank-name-group { display: flex; flex-direction: column; gap: 2px; }
.budget-sub { font-size: 11px; color: var(--on-surface-variant); opacity: 0.7; }
.rank-value-group { text-align: right; }
.budget-total { font-size: 11px; opacity: 0.5; display: block; }
.budget-footer { display: flex; justify-content: flex-end; margin-top: 8px; font-size: 12px; font-weight: 600; }
.over-budget { color: var(--red); }
.tonal-btn.sm { padding: 6px 12px; font-size: 12px; height: 32px; margin-top: 12px; }

.text-success { color: var(--green); }
.text-danger { color: var(--red); }

/* PRINT STYLES */
@media print {
  .no-print, .top-app-bar, .floating-tabs, .icon-btn, .period-navigator, .segmented-button { display: none !important; }
  .analysis-container { background-color: white !important; color: black !important; height: auto !important; overflow: visible !important; }
  .content-scroll { overflow: visible !important; padding: 0 !important; }
  .metric-card, .briefing-card, .chart-container { 
    background-color: white !important; 
    border: 1px solid #eee !important; 
    color: black !important; 
    break-inside: avoid; 
    box-shadow: none !important;
  }
  .metric-value, .rank-name, .rank-value { color: black !important; }
  .print-only { display: block !important; }
  .report-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
  .report-header h2 { margin: 0; font-family: 'Outfit', sans-serif; }
  .report-header p { margin: 5px 0; font-size: 12px; color: #666; }
  .metrics-grid { display: grid !important; grid-template-columns: 1fr 1fr 1fr 1fr !important; gap: 10px !important; }
  .metric-card { padding: 10px !important; }
  .chart-container { margin-bottom: 40px !important; }
}

.print-only { display: none; }
</style>
