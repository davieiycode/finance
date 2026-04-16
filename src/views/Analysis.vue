<template>
  <div class="view-content analysis-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.push('/')">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>Analisis</h1>
        
        <!-- Segmented Button Switcher -->
        <div class="segmented-button">
          <button @click="analysisMode = 'monthly'" :class="{ active: analysisMode === 'monthly' }">Bulanan</button>
          <button @click="analysisMode = 'yearly'" :class="{ active: analysisMode === 'yearly' }">Tahunan</button>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Period Navigator -->
      <div class="period-navigator">
        <button class="icon-btn sm" @click="changePeriod(-1)">
          <span class="material-symbols-rounded">chevron_left</span>
        </button>
        <div class="period-info">
          <span class="period-label">{{ displayPeriod }}</span>
          <span class="period-sub">Analisis Periode</span>
        </div>
        <button class="icon-btn sm" @click="changePeriod(1)">
          <span class="material-symbols-rounded">chevron_right</span>
        </button>
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
       <div v-if="!isModalOpen && !selectedTx" class="floating-tabs">
          <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id" :class="{ active: activeTab === t.id }" class="tab-chip">
             <span class="material-symbols-rounded">{{ t.icon === 'git-pull-request' ? 'conversion_path' : (t.icon === 'arrow-down-left' ? 'download' : (t.icon === 'shopping-cart' ? 'shopping_basket' : (t.icon === 'hash' ? 'tag' : 'layers'))) }}</span>
             <span class="tab-label">{{ t.label }}</span>
          </button>
       </div>
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
                      {{ t.type === 'Income' ? 'north_east' : (t.type.includes('Transfer') ? 'sync' : (t.type === 'Savings' ? 'savings' : (t.type === 'Investment' ? 'trending_up' : 'shopping_cart'))) }}
                   </span>
                </div>
                <div class="tx-info">
                   <span class="tx-name">{{ t.itemName || t.merchant || 'Tidak Diketahui' }}</span>
                   <span class="tx-meta">{{ t.date }} • {{ t.category }}</span>
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

const tabs = [
  { id: 'cashflow', label: 'Aliran', icon: 'git-pull-request' },
  { id: 'income', label: 'Pemasukan', icon: 'download' },
  { id: 'spend', label: 'Pengeluaran', icon: 'shopping_basket' },
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

const filteredTransactions = computed(() => {
  const filterStr = analysisMode.value === 'monthly' 
    ? `${activeDate.value.getFullYear()}-${String(activeDate.value.getMonth() + 1).padStart(2, '0')}`
    : `${activeDate.value.getFullYear()}`
  return (store.transactions || []).filter(t => (t.date || '').startsWith(filterStr))
})

const metrics = computed(() => {
  const income = filteredTransactions.value.filter(t => t.type === 'Income').reduce((s, t) => s + (t.total || 0), 0)
  const expense = filteredTransactions.value.filter(t => t.type === 'Expense').reduce((s, t) => s + (t.total || 0), 0)
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
      const name = t[key] || (key === 'projects' ? 'Standalone' : 'Unclassified')
      map[name] = (map[name] || 0) + val
    }
  })
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)
}

const categorySpending = computed(() => processData(filteredTransactions.value.filter(t => t.type === 'Expense'), 'category'))
const categoryIncome = computed(() => processData(filteredTransactions.value.filter(t => t.type === 'Income'), 'category'))
const tagAnalysis = computed(() => processData(filteredTransactions.value, 'tags', true))
const projectAnalysis = computed(() => processData(filteredTransactions.value, 'projects'))

const maxTagValue = computed(() => Math.max(...tagAnalysis.value.map(t => t.value), 1))
const maxProjectValue = computed(() => Math.max(...projectAnalysis.value.map(t => t.value), 1))

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
         const prjVal = t.projects || 'Standalone'
         const prjStr = typeof prjVal === 'string' ? prjVal : (Array.isArray(prjVal) ? prjVal.join(', ') : '')
         return prjStr === filterValue
      })
   }
   
   return list.sort((a,b) => (b.total || 0) - (a.total || 0))
})

const showModal = (filterType, type, filterValue) => {
   modalData.value = { filterType, type, filterValue, title: filterValue }
}

const insightText = computed(() => {
  const { income, expense, savingRate } = metrics.value
  if (income === 0 && expense === 0) return 'No data detected in this cycle. Begin your exploration to generate intelligence reports.'
  if (expense > income) return 'Warning: Resource consumption exceeds discovery. Your reserves are depleting. Audit your supply lines immediately.'
  if (savingRate > 60) return 'Exemplary logistics. You are securing over 60% of resources in the Vault. Mission success is highly probable.'
  if (savingRate > 30) return 'Nominal performance. Supply levels are stable and the preservation rate is within expected parameters.'
  return 'Slight turbulence in resource management. Preservation rate is below 30%. Consider optimizing mission costs.'
})

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

  const sankeyEl = document.getElementById('cashflow-sankey')
  if (sankeyEl && activeTab.value === 'cashflow') {
    if (!charts.cf) charts.cf = window.echarts.init(sankeyEl, 'dark')
    
    const nodes = [
      { name: '__INTERNAL_INFLOW__', label: { formatter: 'Income' }, itemStyle: { color: '#B4E8A8' } }, 
      { name: '__INTERNAL_VAULT__', label: { formatter: 'Vault (Net)' }, itemStyle: { color: '#D0BCFF' } }
    ]
    const links = []
    
    categoryIncome.value.forEach(i => {
      const nodeId = `INC_${i.name}`
      nodes.push({ name: nodeId, label: { formatter: i.name } })
      links.push({ source: nodeId, target: '__INTERNAL_INFLOW__', value: i.value })
    })
    
    categorySpending.value.forEach(s => {
      const nodeId = `EXP_${s.name}`
      nodes.push({ name: nodeId, label: { formatter: s.name } })
      links.push({ source: '__INTERNAL_INFLOW__', target: nodeId, value: s.value })
    })
    
    if (metrics.value.profit > 0) {
      links.push({ source: '__INTERNAL_INFLOW__', target: '__INTERNAL_VAULT__', value: metrics.value.profit })
    }

    if (links.length > 0) {
      charts.cf.setOption({ 
        ...darkTheme, 
        series: [{ 
          type: 'sankey', 
          layout: 'none', 
          data: nodes, 
          links: links, 
          label: { color: '#CAC4D0', fontSize: 10, fontWeight: 500, formatter: (p) => p.data.label?.formatter || p.name } 
        }] 
      })
      
      charts.cf.off('click')
      charts.cf.on('click', (p) => { 
         const cleanName = p.name.replace(/^(INC_|EXP_)/, '')
         if (p.name.startsWith('INC_')) showModal('category', 'Income', cleanName)
         else if (p.name.startsWith('EXP_')) showModal('category', 'Expense', cleanName)
      })
    } else {
      charts.cf.clear()
    }
  }

  const renderTM = (id, data, key, type) => {
    const el = document.getElementById(id)
    if (!el || activeTab.value !== key) return
    if (!charts[key]) charts[key] = window.echarts.init(el, 'dark')
    const coloredData = (data || []).map((d, i) => ({ ...d, itemStyle: { color: colors[i % colors.length] } }))
    charts[key].setOption({ ...darkTheme, series: [{ type: 'treemap', data: coloredData, breadcrumb: { show: false }, itemStyle: { borderColor: '#1C1B1F', borderWidth: 2, gapWidth: 2 }, label: { show: true, fontSize: 10, fontWeight: 500 } }] })
    charts[key].off('click')
    charts[key].on('click', (p) => { showModal('category', type, p.name) })
  }
  renderTM('income-treemap', categoryIncome.value, 'income', 'Income')
  renderTM('spend-treemap', categorySpending.value, 'spend', 'Expense')

  const tagEl = document.getElementById('tag-cloud')
  if (tagEl && activeTab.value === 'tag') {
    if (!charts.tag) charts.tag = window.echarts.init(tagEl, 'dark')
    charts.tag.setOption({ ...darkTheme, series: [{ type: 'pie', radius: ['40%', '70%'], roseType: 'radius', data: tagAnalysis.value, label: { show: false }, itemStyle: { borderRadius: 8 } }] })
    charts.tag.off('click')
    charts.tag.on('click', (p) => showModal('tag', null, p.name))
  }

  const projEl = document.getElementById('project-pie')
  if (projEl && activeTab.value === 'project') {
    if (!charts.proj) charts.proj = window.echarts.init(projEl, 'dark')
    charts.proj.setOption({ ...darkTheme, series: [{ type: 'pie', radius: '60%', data: projectAnalysis.value, label: { color: '#CAC4D0', formatter: '{b} ({d}%)' } }]})
    charts.proj.off('click')
    charts.proj.on('click', (p) => showModal('project', null, p.name))
  }
}

const getTxColor = (type) => {
  if (type === 'Income') return '#B4E8A8'
  if (type === 'Expense') return '#F2B8B5'
  return '#A8C7FA'
}

const getTxSign = (type) => {
  if (type === 'Income') return '+'
  if (type === 'Expense') return '-'
  return ''
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('analysis')
  else uiStore.unregisterModal('analysis')
})

onBeforeUnmount(() => {
  uiStore.unregisterModal('analysis')
})

watch([filteredTransactions, activeTab, analysisMode], () => { nextTick(() => initCharts()) })

onMounted(() => {
  if (filteredTransactions.value.length === 0 && store.transactions.length > 0) {
    const lastTx = [...store.transactions].sort((a,b) => new Date(b.date) - new Date(a.date))[0]
    if (lastTx && lastTx.date) {
      activeDate.value = new Date(lastTx.date)
    }
  }

  initCharts()
  window.addEventListener('resize', () => Object.values(charts).forEach(c => c && c.resize()))
})

watch(analysisMode, (newMode) => {
  if (newMode === 'yearly' && filteredTransactions.value.length === 0 && store.transactions.length > 0) {
    const lastTx = [...store.transactions].sort((a,b) => new Date(b.date) - new Date(a.date))[0]
    if (lastTx && lastTx.date) {
      activeDate.value = new Date(lastTx.date)
    }
  }
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
  gap: 12px;
}

.app-bar-content h1 {
  flex: 1;
  font-size: 22px;
  font-weight: 400;
  font-family: 'Outfit', sans-serif;
  margin: 0;
}

.segmented-button {
  display: flex;
  background-color: var(--surface-variant);
  border-radius: 20px;
  padding: 4px;
}

.segmented-button button {
  padding: 6px 16px;
  border-radius: 16px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.segmented-button button.active {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
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
}

.icon-btn.sm { width: 32px; height: 32px; }

/* CONTENT SCROLL */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px 16px;
}

/* PERIOD NAVIGATOR */
.period-navigator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: 24px;
  margin-bottom: 24px;
}

.period-info {
  text-align: center;
  display: flex;
  flex-direction: column;
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
  bottom: 88px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background-color: var(--bg-secondary);
  padding: 8px;
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  z-index: 1000;
  max-width: 95vw;
  overflow-x: auto;
  scrollbar-width: none;
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

.text-success { color: var(--green); }
.text-danger { color: var(--red); }
</style>
