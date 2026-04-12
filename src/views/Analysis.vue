<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(70px + 2rem); position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">Cartography</h1>
        </div>
        <div style="display: flex; background: rgba(255,255,255,0.05); border-radius: 20px; padding: 0.2rem; border: 1px solid var(--border); position: relative; width: 170px; height: 36px; align-items: center;">
          <div :style="{ left: analysisMode === 'monthly' ? '0.2rem' : '50%', width: 'calc(50% - 0.2rem)' }" style="position: absolute; top: 0.2rem; bottom: 0.2rem; background: var(--accent); border-radius: 16px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 1; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);"></div>
          <button @click="analysisMode = 'monthly'" :style="{ color: analysisMode === 'monthly' ? 'white' : 'var(--text-secondary)' }" style="flex: 1; border: none; background: none; font-size: 0.65rem; font-weight: 900; z-index: 2; cursor: pointer; transition: color 0.3s; height: 100%; position: relative; letter-spacing: 0.05em;">MONTHLY</button>
          <button @click="analysisMode = 'yearly'" :style="{ color: analysisMode === 'yearly' ? 'white' : 'var(--text-secondary)' }" style="flex: 1; border: none; background: none; font-size: 0.65rem; font-weight: 900; z-index: 2; cursor: pointer; transition: color 0.3s; height: 100%; position: relative; letter-spacing: 0.05em;">YEARLY</button>
        </div>
      </header>
    </div>

    <!-- Period Navigator -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin: 1.5rem 0; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 1.25rem; padding: 0.75rem 1rem;">
      <button @click="changePeriod(-1)" style="width: 36px; height: 36px; border-radius: 18px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: white; cursor: pointer;"><i data-lucide="chevron-left" style="width: 18px;"></i></button>
      <div style="text-align: center;">
        <div style="font-weight: 800; color: var(--text-primary); font-size: 1.125rem;">{{ displayPeriod }}</div>
        <div style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-top: 0.1rem;">Exploration Cycle</div>
      </div>
      <button @click="changePeriod(1)" style="width: 36px; height: 36px; border-radius: 18px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: white; cursor: pointer;"><i data-lucide="chevron-right" style="width: 18px;"></i></button>
    </div>

    <!-- Metrics Grid -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div class="stat-card card-hover" @click="showModal('category', 'Income', 'Total Income')" style="border-left: 4px solid #10b981; cursor: pointer;">
        <span style="font-size: 1.1rem; font-weight: 800; color: #10b981;">Rp {{ (metrics.income || 0).toLocaleString('id-ID') }}</span>
        <span style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-top: 0.2rem;">Total Discovery</span>
      </div>
      <div class="stat-card card-hover" @click="showModal('category', 'Expense', 'Total Expense')" style="border-left: 4px solid #ef4444; cursor: pointer;">
        <span style="font-size: 1.1rem; font-weight: 800; color: #ef4444;">Rp {{ (metrics.expense || 0).toLocaleString('id-ID') }}</span>
        <span style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-top: 0.2rem;">Total Consumption</span>
      </div>
      <div class="stat-card card-hover" style="border-left: 4px solid var(--accent);">
        <span style="font-size: 1.1rem; font-weight: 800; color: white;">Rp {{ (metrics.profit || 0).toLocaleString('id-ID') }}</span>
        <span style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-top: 0.2rem;">Net Cashflow</span>
      </div>
      <div class="stat-card card-hover" style="border-left: 4px solid #f59e0b;">
        <span style="font-size: 1.1rem; font-weight: 800; color: #f59e0b;">{{ metrics.savingRate }}%</span>
        <span style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-top: 0.2rem;">Preservation Rate</span>
      </div>
    </div>

    <!-- Explorer's Insight Card -->
    <div class="insight-card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.02)); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 2rem; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -20px; right: -20px; opacity: 0.05;"><i data-lucide="zap" style="width: 120px; height: 120px;"></i></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div style="background: var(--accent); width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="sparkles" style="width: 16px; color: white;"></i>
        </div>
        <h3 style="font-size: 0.875rem; font-weight: 800; color: var(--text-primary); margin:0;">Intelligence Briefing</h3>
      </div>
      <p style="font-size: 0.8125rem; line-height: 1.6; color: var(--text-secondary); margin: 0; font-weight: 500;">
        {{ insightText }}
      </p>
    </div>

    <!-- Tabbed Analysis -->
    <div style="margin-bottom: 2rem;">
      <div class="tabs-scroll" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: none;">
         <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id" :class="{ active: activeTab === t.id }" class="tab-pill">
            <i :data-lucide="t.icon" style="width: 14px;"></i>
            {{ t.label }}
         </button>
      </div>

      <div class="tab-content" style="min-height: 400px; animation: fadeIn 0.4s ease;">
         <div v-show="activeTab === 'cashflow'">
            <div class="chart-box">
               <h3 class="chart-title">Expedition Cashflow Linkage</h3>
               <div id="cashflow-sankey" style="width: 100%; height: 400px;"></div>
            </div>
         </div>

         <div v-show="activeTab === 'income'">
            <div class="chart-box">
               <h3 class="chart-title">Discovery Distribution</h3>
               <div id="income-treemap" style="width: 100%; height: 350px;"></div>
            </div>
            <div class="ranking-list">
               <div v-for="(item, i) in categoryIncome" :key="item.name" @click="showModal('category', 'Income', item.name)" class="rank-card card-hover" style="cursor: pointer; margin-bottom: 0.5rem; padding: 0.75rem; border-radius: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                     <span style="font-weight: 800; font-size: 0.875rem;">{{ item.name }}</span>
                     <span style="font-weight: 900; font-size: 0.875rem; color: #10b981;">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="bar-container"><div class="bar-fill" :style="{ width: (item.value/metrics.income*100) + '%', background: colors[i % colors.length] }"></div></div>
               </div>
            </div>
         </div>

         <div v-show="activeTab === 'spend'">
            <div class="chart-box">
               <h3 class="chart-title">Consumption Distribution</h3>
               <div id="spend-treemap" style="width: 100%; height: 350px;"></div>
            </div>
            <div class="ranking-list">
               <div v-for="(item, i) in categorySpending" :key="item.name" @click="showModal('category', 'Expense', item.name)" class="rank-card card-hover" style="cursor: pointer; margin-bottom: 0.5rem; padding: 0.75rem; border-radius: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                     <span style="font-weight: 800; font-size: 0.875rem;">{{ item.name }}</span>
                     <span style="font-weight: 900; font-size: 0.875rem; color: #ef4444;">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="bar-container"><div class="bar-fill" :style="{ width: (item.value/metrics.expense*100) + '%', background: colors[i % colors.length] }"></div></div>
               </div>
            </div>
         </div>

         <div v-show="activeTab === 'tag'">
            <div class="chart-box">
               <h3 class="chart-title">Tag Density Radar</h3>
               <div id="tag-cloud" style="width: 100%; height: 350px;"></div>
            </div>
            <div class="ranking-list">
               <div v-for="(item, i) in tagAnalysis" :key="item.name" @click="showModal('tag', null, item.name)" class="rank-card" style="cursor: pointer;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                     <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="hash" style="width: 12px; opacity: 0.5;"></i>
                        <span style="font-weight: 800; font-size: 0.875rem;">{{ item.name }}</span>
                     </div>
                     <span style="font-weight: 900; font-size: 0.875rem;">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="bar-container"><div class="bar-fill" :style="{ width: (item.value / maxTagValue * 100) + '%', background: colors[i % colors.length] }"></div></div>
               </div>
            </div>
         </div>

         <div v-show="activeTab === 'project'">
            <div class="chart-box">
               <h3 class="chart-title">Mission Distribution</h3>
               <div id="project-pie" style="width: 100%; height: 350px;"></div>
            </div>
            <div class="ranking-list" style="margin-top: 1rem;">
               <div v-for="(item, i) in projectAnalysis" :key="item.name" @click="showModal('project', null, item.name)" class="rank-card" style="cursor: pointer;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                     <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="layers" style="width: 12px; opacity: 0.5;"></i>
                        <span style="font-weight: 800; font-size: 0.875rem;">{{ item.name || 'Standalone' }}</span>
                     </div>
                     <span style="font-weight: 900; font-size: 0.875rem;">Rp {{ (item.value || 0).toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="bar-container"><div class="bar-fill" :style="{ width: (item.value / maxProjectValue * 100) + '%', background: colors[i % colors.length] }"></div></div>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- LIST MODAL -->
    <div v-if="modalData" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: flex-end; justify-content: center;">
       <div style="background: var(--bg-primary, #000); width: 100%; max-width: 600px; height: 85vh; border-radius: 2rem 2rem 0 0; padding: 1.5rem; display: flex; flex-direction: column; border-top: 1px solid var(--border); animation: slideUp 0.3s ease-out;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
             <div>
                <h3 style="font-size: 1.125rem; font-weight: 800; margin: 0;">{{ modalData.title }}</h3>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0.25rem 0 0 0;">{{ filteredList.length }} Expeditions Found</p>
             </div>
             <button @click="modalData = null" style="width: 36px; height: 36px; border-radius: 18px; background: rgba(255,255,255,0.05); border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
          </div>
          
          <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-bottom: 2rem;">
             <div v-for="t in filteredList" :key="t.transactionID" @click="selectedTx = t" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--border);" :style="{ color: getTxColor(t.type) }">
                   <i v-if="t.type === 'Income'" data-lucide="arrow-down-left" style="width: 20px;" stroke-width="1.5"></i>
                   <i v-else-if="t.type === 'Internal Transfer' || t.type === 'Transfer'" data-lucide="repeat" style="width: 18px;" stroke-width="1.5"></i>
                   <i v-else-if="t.type === 'Savings'" data-lucide="piggy-bank" style="width: 20px;" stroke-width="1.5"></i>
                   <i v-else-if="t.type === 'Investment'" data-lucide="trending-up" style="width: 20px;" stroke-width="1.5"></i>
                   <i v-else data-lucide="shopping-cart" style="width: 18px;" stroke-width="1.5"></i>
                </div>
                <div style="flex: 1;">
                   <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary);">{{ t.itemName || t.merchant || 'Unknown' }}</div>
                   <div style="font-size: 0.7rem; color: var(--text-secondary);">{{ t.date }} • {{ t.category }}</div>
                </div>
                <div style="text-align: right; font-weight: 700; font-size: 0.875rem;" :style="{ color: getTxColor(t.type) }">
                   {{ getTxSign(t.type) }}Rp {{ (t.total || 0).toLocaleString('id-ID') }}
                </div>
             </div>
          </div>
       </div>
    </div>

    <TransactionModal v-if="selectedTx" :tx="selectedTx" @close="selectedTx = null" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'
import TransactionModal from '../components/TransactionModal.vue'

const store = useFinanceStore()
const analysisMode = ref('monthly')
const activeDate = ref(new Date())
const activeTab = ref('cashflow')
const selectedTx = ref(null)
const modalData = ref(null)

const tabs = [
  { id: 'cashflow', label: 'Cashflow', icon: 'git-pull-request' },
  { id: 'income', label: 'Income', icon: 'arrow-down-left' },
  { id: 'spend', label: 'Spend', icon: 'shopping-cart' },
  { id: 'tag', label: 'Tag', icon: 'hash' },
  { id: 'project', label: 'Project', icon: 'layers' }
]

const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#06b6d4', '#ec4899', '#84cc16']

const displayPeriod = computed(() => {
  if (analysisMode.value === 'monthly') {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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
      const tags = (t[key] || '').split(/[, ]+/).filter(x => x.trim())
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
      list = list.filter(t => (t.tags || '').toLowerCase().includes(filterValue.toLowerCase()))
   } else if (filterType === 'project') {
      list = list.filter(t => (t.projects || 'Standalone') === filterValue)
   }
   
   return list.sort((a,b) => (b.total || 0) - (a.total || 0))
})

const showModal = (filterType, type, filterValue) => {
   modalData.value = { filterType, type, filterValue, title: filterValue }
   nextTick(() => { if (window.lucide) window.lucide.createIcons() })
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
  const darkTheme = { backgroundColor: 'transparent', textStyle: { fontFamily: 'inherit' } }

  const sankeyEl = document.getElementById('cashflow-sankey')
  if (sankeyEl && activeTab.value === 'cashflow') {
    if (!charts.cf) charts.cf = window.echarts.init(sankeyEl, 'dark')
    
    // Sankey requires unique names. We'll use IDs and labels to prevent collisions.
    const nodes = [
      { name: '__INTERNAL_INFLOW__', label: { formatter: 'Income' }, itemStyle: { color: '#10b981' } }, 
      { name: '__INTERNAL_VAULT__', label: { formatter: 'Vault (Net)' }, itemStyle: { color: '#3b82f6' } }
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
          label: { color: '#94a3b8', fontSize: 10, fontWeight: 700, formatter: (p) => p.data.label?.formatter || p.name } 
        }] 
      })
      
      charts.cf.off('click')
      charts.cf.on('click', (p) => { 
         // Extract clean name from node ID
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
    charts[key].setOption({ ...darkTheme, series: [{ type: 'treemap', data: coloredData, breadcrumb: { show: false }, itemStyle: { borderColor: '#000', borderWidth: 2, gapWidth: 2 }, label: { show: true, fontSize: 10, fontWeight: 900 } }] })
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
    charts.proj.setOption({ ...darkTheme, series: [{ type: 'pie', radius: '60%', data: projectAnalysis.value, label: { color: '#94a3b8', formatter: '{b} ({d}%)' } }]})
    charts.proj.off('click')
    charts.proj.on('click', (p) => showModal('project', null, p.name))
  }
}

const getTxColor = (type) => {
  if (type === 'Income') return '#10b981'
  if (type === 'Expense') return '#ef4444'
  return '#3b82f6'
}

const getTxSign = (type) => {
  if (type === 'Income') return '+'
  if (type === 'Expense') return '-'
  return ''
}

watch([filteredTransactions, activeTab, analysisMode], () => { nextTick(() => initCharts()) })
onMounted(() => {
  // If current month has no data, check if there's any data at all to set initial view
  if (filteredTransactions.value.length === 0 && store.transactions.length > 0) {
    const lastTx = [...store.transactions].sort((a,b) => new Date(b.date) - new Date(a.date))[0]
    if (lastTx && lastTx.date) {
      activeDate.value = new Date(lastTx.date)
    }
  }

  nextTick(() => {
    if (window.lucide) window.lucide.createIcons()
    initCharts()
  })
  window.addEventListener('resize', () => Object.values(charts).forEach(c => c && c.resize()))
})

// If user switches to yearly, and current year is empty, try to find a year with data
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
.stat-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; flex-direction: column; }
.tab-pill { flex-shrink: 0; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 0.6rem 1.25rem; color: var(--text-secondary); font-size: 0.75rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
.tab-pill.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }

.chart-box { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1rem; }
.chart-title { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; opacity: 0.6; margin-bottom: 1rem; }

.rank-card { background: rgba(255,255,255,0.01); padding: 0.75rem; border-radius: 1rem; margin-bottom: 0.5rem; border: 1px solid transparent; transition: 0.2s; }
.rank-card:active { background: rgba(255,255,255,0.05); border-color: var(--border); }
.bar-container { height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
.bar-fill { height: 100%; transition: width 1s cubic-bezier(0.19, 1, 0.22, 1); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
