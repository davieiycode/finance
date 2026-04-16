<template>
  <div class="view-content accounts-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Vaults</h1>
          <div class="app-bar-actions">
            <button class="icon-btn" @click="showSearch = true">
              <span class="material-symbols-rounded">search</span>
            </button>
            <button class="tonal-btn" @click="openModal(null)">
              <span class="material-symbols-rounded">add</span>
              New
            </button>
          </div>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Search archive..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="accounts-grid">
        <div v-for="acc in filteredAccounts" :key="acc.accountID" @click="openModal(acc)" class="vault-card" :style="{ '--vault-color': acc.cardColor || '#1e293b' }">
           <div class="vault-header">
              <div v-if="acc.accountImage" class="vault-logo">
                 <img :src="acc.accountImage">
              </div>
              <div v-else class="vault-icon-placeholder">
                 <span class="material-symbols-rounded">account_balance_wallet</span>
              </div>
              <span v-if="acc.accountType === 'Credit Card'" class="vault-badge">CREDIT</span>
           </div>
           
           <div class="vault-body">
              <span class="vault-name">{{ acc.accountName }}</span>
              <span class="vault-balance">Rp {{ (acc.currentBalance || 0).toLocaleString('id-ID') }}</span>
              
              <div class="vault-number">
                 {{ maskNumber(acc.cardNumber || acc.accountNumber) }}
              </div>
           </div>

           <div class="vault-footer">
              <span class="vault-type">{{ acc.accountType }}</span>
              <div v-if="acc.expiryDate" class="vault-expiry">
                 <span class="expiry-label">EXP</span>
                 <span class="expiry-value">{{ acc.expiryDate }}</span>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- MODAL / BOTTOM SHEET -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-backdrop-full">
       <div class="bottom-sheet">
          <div class="sheet-drag-handle"></div>
          <div class="sheet-header">
             <div class="sheet-title-group">
                <h3 class="sheet-title">{{ editingAcc.accountID ? (accountMode === 'analysis' ? 'Vault Intelligence' : 'Modify Vault') : 'New Vault' }}</h3>
             </div>
             <button @click="isModalOpen = false" class="icon-btn">
               <span class="material-symbols-rounded">close</span>
             </button>
          </div>

          <div class="sheet-content">
             <!-- MODE: ANALYSIS -->
             <div v-if="accountMode === 'analysis' && editingAcc.accountID" class="analysis-view">
                <!-- Mini Card Preview -->
                <div class="vault-card mini" :style="{ '--vault-color': editingAcc.cardColor || '#1e293b' }">
                   <div class="vault-body">
                      <span class="vault-name">{{ editingAcc.accountName }}</span>
                      <span class="vault-balance">Rp {{ (editingAcc.currentBalance || 0).toLocaleString('id-ID') }}</span>
                   </div>
                </div>

                <div class="metrics-grid">
                   <div class="metric-card success">
                      <span class="metric-value">Rp {{ (accAnalysis.inflow || 0).toLocaleString('id-ID') }}</span>
                      <span class="metric-label">Inflow</span>
                   </div>
                   <div class="metric-card danger">
                      <span class="metric-value">Rp {{ (accAnalysis.outflow || 0).toLocaleString('id-ID') }}</span>
                      <span class="metric-label">Outflow</span>
                   </div>
                </div>

                <div class="briefing-card">
                   <div class="briefing-header">
                      <span class="material-symbols-rounded">analytics</span>
                      <h3>Strategic Summary</h3>
                   </div>
                   <div class="net-drift">Rp {{ (accAnalysis.net || 0).toLocaleString('id-ID') }} <small>Net Drift</small></div>
                   <p v-if="accAnalysis.insight">{{ accAnalysis.insight }}</p>
                </div>

                <div class="chart-box">
                    <span class="chart-label">Flow Correlation</span>
                    <div id="acc-flow-chart" style="width: 100%; height: 180px;"></div>
                </div>

                <div class="recent-list">
                    <h3>Recent Log Entries</h3>
                    <div v-for="t in accAnalysis.recentTransactions" :key="t.transactionID" class="mini-tx-item">
                        <div class="mini-tx-icon" :style="{ color: t.type === 'Income' ? 'var(--green)' : 'var(--red)' }">
                            <span class="material-symbols-rounded">{{ t.type === 'Income' ? 'north_east' : 'south_west' }}</span>
                        </div>
                        <div class="mini-tx-info">
                            <span class="mini-tx-name">{{ t.merchant || t.itemName }}</span>
                            <span class="mini-tx-date">{{ t.date }}</span>
                        </div>
                        <span class="mini-tx-amount" :class="t.type === 'Income' ? 'text-success' : 'text-danger'">
                            {{ t.type === 'Income' ? '+' : '-' }}{{ (t.total || 0).toLocaleString('id-ID') }}
                        </span>
                    </div>
                </div>

                <div class="action-stack">
                   <button @click="accountMode = 'edit'" class="tonal-btn lg">
                      <span class="material-symbols-rounded">edit</span>
                      MODIFY PROTOCOL
                   </button>
                   <button @click="isModalOpen = false" class="text-btn">Return to List</button>
                </div>
             </div>

             <!-- MODE: EDIT -->
             <div v-else class="edit-view">
                <div class="form-group">
                   <span class="field-label">Vault Name</span>
                   <input type="text" v-model="formData.accountName" class="md-input" placeholder="e.g. Primary Bank">
                </div>

                <div class="form-row">
                   <div class="form-group">
                      <span class="field-label">Type</span>
                      <select v-model="formData.accountType" class="md-input">
                         <option>Bank</option>
                         <option>E-Wallet</option>
                         <option>Cash</option>
                         <option>Credit Card</option>
                         <option>Investment</option>
                      </select>
                   </div>
                   <div class="form-group">
                      <span class="field-label">Currency</span>
                      <input type="text" v-model="formData.currency" class="md-input">
                   </div>
                </div>

                <div class="form-row">
                   <div class="form-group">
                      <span class="field-label">Account No</span>
                      <input type="text" v-model="formData.accountNumber" class="md-input">
                   </div>
                   <div class="form-group">
                      <span class="field-label">Card No</span>
                      <input type="text" v-model="formData.cardNumber" class="md-input">
                   </div>
                </div>

                <div class="form-row">
                   <div class="form-group">
                      <span class="field-label">Opening Balance</span>
                      <input type="number" v-model.number="formData.openingBalance" class="md-input">
                   </div>
                   <div class="form-group">
                      <span class="field-label">Expiry (MM/YY)</span>
                      <input type="text" v-model="formData.expiryDate" class="md-input">
                   </div>
                </div>

                <div class="form-group">
                   <span class="field-label">Live State Balance</span>
                   <input type="number" v-model.number="formData.currentBalance" class="md-input">
                </div>

                <div class="form-row">
                   <div class="form-group">
                      <span class="field-label">Card Color</span>
                      <div class="color-input-wrapper">
                         <input type="color" v-model="formData.cardColor">
                         <span>{{ formData.cardColor }}</span>
                      </div>
                   </div>
                   <div class="form-group">
                      <span class="field-label">Status</span>
                      <select v-model="formData.status" class="md-input">
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                   </div>
                </div>

                <div class="form-group">
                   <span class="field-label">Logo URL</span>
                   <input type="text" v-model="formData.accountImage" class="md-input">
                </div>

                <div class="form-group">
                   <span class="field-label">Notes</span>
                   <textarea v-model="formData.notes" class="md-input" style="min-height: 80px;"></textarea>
                </div>

                <div class="action-grid">
                   <button @click="saveAcc" class="primary-btn full">
                      <span class="material-symbols-rounded">check</span>
                      SAVE VAULT
                   </button>
                   <button v-if="editingAcc.accountID" @click="handleDuplicate" class="outline-btn">
                      <span class="material-symbols-rounded">content_copy</span>
                      DUPE
                   </button>
                   <button v-if="editingAcc.accountID" @click="handleMerge" class="outline-btn">
                      <span class="material-symbols-rounded">merge</span>
                      MERGE
                   </button>
                   <button v-if="editingAcc.accountID" @click="deleteAcc" class="danger-btn full">
                      <span class="material-symbols-rounded">delete</span>
                      DELETE
                   </button>
                </div>
             </div>
          </div>
       </div>
      </div>
    </Teleport>

    <!-- Merge Selection Panel -->
    <Teleport to="body">
       <div v-if="isMergePanelOpen" class="modal-backdrop-full dark">
       <div class="bottom-sheet center">
          <div class="sheet-header">
             <h3 class="sheet-title">Consolidate</h3>
             <button @click="isMergePanelOpen = false" class="icon-btn">
               <span class="material-symbols-rounded">close</span>
             </button>
          </div>
          <p class="sheet-desc">Absorption target for <b>{{ editingAcc.accountName }}</b> logs.</p>
          
          <div class="search-box">
             <span class="material-symbols-rounded">search</span>
             <input type="text" v-model="mergeTargetSearch" placeholder="Search vaults...">
          </div>

          <div class="target-list">
             <div v-for="t in filteredMergeTargets" :key="t.accountID" @click="performMerge(t)" class="target-item">
                <div class="target-indicator" :style="{ backgroundColor: t.cardColor || 'var(--primary)' }"></div>
                <div class="target-info">
                   <span class="target-name">{{ t.accountName }}</span>
                   <span class="target-meta">{{ t.accountType }}</span>
                </div>
                <span class="material-symbols-rounded">chevron_right</span>
             </div>
             <div v-if="filteredMergeTargets.length === 0" class="empty-state">No valid vaults found.</div>
          </div>
          <button @click="isMergePanelOpen = false" class="outline-btn">Cancel Mission</button>
       </div>
      </div>
    </Teleport>
<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const accountMode = ref('analysis') // 'analysis' or 'edit'
const editingAcc = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const accAnalysis = computed(() => {
  if (!editingAcc.value.accountID) return { inflow: 0, outflow: 0, net: 0, recentTransactions: [], insight: '' }
  const name = editingAcc.value.accountName
  const inTx = store.transactions.filter(t => t.beneficiaryAccount === name)
  const outTx = store.transactions.filter(t => t.paymentSourceAccount === name)
  
  const inflow = inTx.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const outflow = outTx.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  
  const allRelated = [...inTx, ...outTx].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  let insight = ''
  if (outflow > inflow * 2 && inflow > 0) insight = 'Critical alert: Outflow exceeds inflow by 100%. Protocol recalibration recommended.'
  else if (inflow > outflow && outflow > 0) insight = 'Optimal resonance: Inflow is outpacing consumption. Core strength increasing.'
  else if (allRelated.length > 3) {
      const topCat = allRelated.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc }, {})
      const favorite = Object.keys(topCat).reduce((a, b) => topCat[a] > topCat[b] ? a : b)
      insight = `Frequent mission vector identified: "${favorite}". Monitor consumption patterns.`
  } else {
      insight = 'Insufficient mission local logs to generate predictive intelligence.'
  }

  return { inflow, outflow, net: inflow - outflow, recentTransactions: allRelated, insight }
})

const filteredAccounts = computed(() => {
  if (!searchQuery.value) return store.accounts
  const q = searchQuery.value.toLowerCase()
  return store.accounts.filter(a => 
    (a.accountName || '').toLowerCase().includes(q) ||
    (a.accountType || '').toLowerCase().includes(q) ||
    (a.accountNumber || '').toLowerCase().includes(q)
  )
})

const openModal = (acc) => {
  if (acc) {
    editingAcc.value = { ...acc }
    formData.value = { 
      ...acc,
      openingBalance: Number(acc.openingBalance) || 0,
      currentBalance: Number(acc.currentBalance) || 0,
      cardNumber: acc.cardNumber || '',
      expiryDate: acc.expiryDate || ''
    }
    accountMode.value = 'analysis'
  } else {
    editingAcc.value = {}
    formData.value = { accountName: '', accountType: 'Bank', currency: 'IDR', openingBalance: 0, currentBalance: 0, cardColor: '#1e293b', status: 'Active', notes: '', accountNumber: '', cardNumber: '', expiryDate: '', accountImage: '' }
    accountMode.value = 'edit'
  }
  isModalOpen.value = true
}

let flowChart = null
const initAnalysisChart = () => {
    const chartDom = document.getElementById('acc-flow-chart')
    if (!chartDom) return
    if (flowChart) flowChart.dispose()
    flowChart = window.echarts.init(chartDom, 'dark')
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: '#1C1B1F', borderColor: '#49454F', textStyle: { color: '#E6E1E5' } },
        grid: { top: '10%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['Inflow', 'Outflow'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#CAC4D0', fontSize: 10 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { show: false } },
        series: [
            {
                data: [
                    { value: accAnalysis.value.inflow, itemStyle: { color: '#B4E8A8', borderRadius: [8, 8, 0, 0] } },
                    { value: accAnalysis.value.outflow, itemStyle: { color: '#F2B8B5', borderRadius: [8, 8, 0, 0] } }
                ],
                type: 'bar',
                barWidth: '40%',
                label: { show: true, position: 'top', formatter: (p) => 'Rp ' + (p.value / 1000).toFixed(0) + 'k', color: '#CAC4D0', fontSize: 10, fontWeight: 'bold' }
            }
        ]
    }
    flowChart.setOption(option)
}

watch([accountMode, isModalOpen], ([mode, open]) => {
    if (mode === 'analysis' && open) {
        nextTick(() => initAnalysisChart())
    }
})

const saveAcc = () => {
  if (!formData.value.accountName) return alert('Name required')
  if (editingAcc.value.accountID) store.updateAccount({ ...formData.value })
  else store.addAccount({ ...formData.value })
  isModalOpen.value = false
}

const deleteAcc = () => { if (confirm('Delete this account?')) { store.deleteAccount(editingAcc.value.accountID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.accountID
  editingAcc.value = {}
  formData.value = data
}

const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.accounts.filter(a => 
    a.accountID !== editingAcc.value.accountID &&
    (a.accountName || '').toLowerCase().includes(q)
  )
})

const handleMerge = () => { isMergePanelOpen.value = true }

const performMerge = (target) => {
  const sourceName = editingAcc.value.accountName
  const targetName = target.accountName
  if (!confirm(`Relocate ALL logs from vault "${sourceName}" to "${targetName}"?`)) return
  store.mergeEntities('accounts', sourceName, targetName)
  store.deleteAccount(editingAcc.value.accountID)
  isMergePanelOpen.value = false
  isModalOpen.value = false
}

const maskNumber = (n) => {
  if (!n) return ''
  const s = String(n).replace(/\s/g, '')
  if (s.length < 8) return s
  return s.substring(0, 4) + ' •••' + s.substring(s.length - 4)
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('accounts')
  else uiStore.unregisterModal('accounts')
})

onMounted(() => {
  window.addEventListener('resize', () => flowChart && flowChart.resize())
})

onBeforeUnmount(() => {
  uiStore.unregisterModal('accounts')
})
</script>

<style scoped>
.accounts-container {
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

.app-bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input-field {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 16px;
  color: var(--on-surface);
  outline: none;
}

/* CONTENT SCROLL */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px 16px;
}

/* CARDS */
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.vault-card {
  background-color: var(--vault-color);
  padding: 24px;
  border-radius: 28px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s;
}

.vault-card:active { transform: scale(0.98); }

.vault-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 150px;
  height: 150px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
}

.vault-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.vault-logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: white;
  border-radius: 8px;
  padding: 4px;
}

.vault-icon-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.vault-badge {
  background: rgba(255,255,255,0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  color: white;
}

.vault-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vault-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; }
.vault-balance { font-size: 24px; font-weight: 700; color: white; }
.vault-number { font-family: monospace; font-size: 14px; color: rgba(255,255,255,0.5); letter-spacing: 2px; }

.vault-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.vault-type { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); }

.vault-expiry { display: flex; flex-direction: column; align-items: flex-end; }
.expiry-label { font-size: 8px; color: rgba(255,255,255,0.4); }
.expiry-value { font-size: 12px; font-weight: 600; color: white; }

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
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.sheet-title { font-size: 22px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; }

/* ANALYSIS VIEW */
.vault-card.mini { min-height: 100px; padding: 16px; margin-bottom: 24px; }
.metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.metric-card { background-color: var(--bg-secondary); padding: 16px; border-radius: 20px; display: flex; flex-direction: column; }
.metric-card.success { border-bottom: 3px solid var(--green); }
.metric-card.danger { border-bottom: 3px solid var(--red); }
.metric-value { font-size: 16px; font-weight: 700; }
.metric-label { font-size: 11px; color: var(--on-surface-variant); text-transform: uppercase; }

.briefing-card { background-color: var(--primary-container); color: var(--on-primary-container); padding: 16px; border-radius: 24px; margin-bottom: 24px; }
.briefing-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.briefing-header h3 { font-size: 14px; font-weight: 500; margin: 0; }
.net-drift { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.briefing-card p { font-size: 13px; opacity: 0.9; margin: 0; }

.chart-box { background-color: var(--bg-secondary); border-radius: 24px; padding: 16px; margin-bottom: 24px; }
.chart-label { font-size: 11px; color: var(--on-surface-variant); text-transform: uppercase; display: block; margin-bottom: 12px; }

.recent-list h3 { font-size: 14px; font-weight: 500; margin-bottom: 16px; color: var(--on-surface-variant); }
.mini-tx-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: var(--bg-secondary); margin-bottom: 8px; }
.mini-tx-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px; }
.mini-tx-info { flex: 1; display: flex; flex-direction: column; }
.mini-tx-name { font-size: 14px; font-weight: 500; }
.mini-tx-date { font-size: 11px; color: var(--on-surface-variant); }
.mini-tx-amount { font-size: 14px; font-weight: 700; }

.action-stack { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }

/* FORM */
.form-group { margin-bottom: 16px; }
.field-label { display: block; font-size: 12px; font-weight: 500; color: var(--on-surface-variant); margin-bottom: 8px; margin-left: 4px; }
.md-input { width: 100%; background: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px 16px; color: var(--on-surface); outline: none; transition: border-color 0.2s; }
.md-input:focus { border-color: var(--primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.color-input-wrapper { display: flex; align-items: center; gap: 12px; background: var(--surface-variant); border-radius: 12px; padding: 8px 16px; }
.color-input-wrapper input { width: 32px; height: 32px; border: none; background: none; }

.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
.full { grid-column: span 2; }

/* MD3 BUTTONS */
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 20px; padding: 8px 16px; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; cursor: pointer; }
.tonal-btn.lg { border-radius: 28px; padding: 16px; justify-content: center; }
.primary-btn { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 28px; padding: 16px; display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; justify-content: center; }
.outline-btn { background: transparent; border: 1px solid var(--outline); color: var(--primary); border-radius: 28px; padding: 16px; display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; justify-content: center; }
.danger-btn { background: rgba(242, 184, 181, 0.1); border: 1px solid var(--red); color: var(--red); border-radius: 28px; padding: 16px; display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; justify-content: center; }
.text-btn { background: transparent; border: none; color: var(--primary); font-weight: 500; padding: 8px; cursor: pointer; }

.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }

/* MERGE */
.dark { background-color: rgba(0,0,0,0.8); }
.center { width: calc(100% - 32px); max-width: 400px; margin: auto auto 32px auto; border-radius: 28px; }
.sheet-desc { font-size: 14px; color: var(--on-surface-variant); margin-bottom: 24px; }
.search-box { display: flex; align-items: center; gap: 12px; background: var(--surface-variant); padding: 12px 16px; border-radius: 28px; margin-bottom: 16px; }
.search-box input { background: transparent; border: none; outline: none; color: var(--on-surface); flex: 1; }
.target-list { margin-bottom: 24px; max-height: 250px; overflow-y: auto; }
.target-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; cursor: pointer; }
.target-item:active { background: var(--surface-variant); }
.target-indicator { width: 12px; height: 12px; border-radius: 6px; }
.target-info { flex: 1; display: flex; flex-direction: column; }
.target-name { font-size: 16px; font-weight: 500; }
.target-meta { font-size: 12px; color: var(--on-surface-variant); }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.text-success { color: var(--green); }
.text-danger { color: var(--red); }
</style>
