<template>
  <div class="view-content merchants-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Vendor & Toko</h1>
          <button class="icon-btn" @click="showSearch = true">
            <span class="material-symbols-rounded">search</span>
          </button>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Cari toko..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="merchant-list">
        <div v-for="m in filteredMerchants" :key="m.merchantID" @click="openModal(m)" class="merchant-item card-md3">
          <div class="merchant-icon-box" :style="{ backgroundColor: getInitColor(m.merchantName) + '15', color: getInitColor(m.merchantName) }">
            {{ String(m.merchantName || 'M')[0].toUpperCase() }}
          </div>
          <div class="merchant-info">
            <span class="merchant-name">{{ m.merchantName }}</span>
            <span class="merchant-meta">{{ m.category || 'Umum' }} • {{ m.address || 'Tanpa lokasi' }}</span>
          </div>
          <span class="status-chip">{{ m.status }}</span>
        </div>

        <div v-if="filteredMerchants.length === 0" class="empty-state">
          <span class="material-symbols-rounded">storefront</span>
          <p>No vendor signatures detected.</p>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button @click="openModal(null)" class="fab">
      <span class="material-symbols-rounded">add</span>
    </button>

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Informasi Vendor</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <!-- MODE: ANALYSIS -->
                <div v-if="modalMode === 'analysis' && editingMerchant.merchantID" class="analysis-view">
                   <div class="analysis-hero">
                      <div class="hero-avatar card-md3">
                         <img v-if="editingMerchant.merchantImage" :src="editingMerchant.merchantImage" class="hero-img">
                         <span v-else class="hero-initial">{{ String(editingMerchant.merchantName)[0] }}</span>
                      </div>
                      <div class="hero-text">
                         <h2 class="hero-title">{{ editingMerchant.merchantName }}</h2>
                         <span class="hero-site">{{ editingMerchant.website || 'No digital link' }}</span>
                      </div>
                   </div>

                   <div class="analytics-grid">
                      <div class="stat-card card-md3 tonal">
                         <span class="stat-label">TOTAL BELANJA</span>
                         <span class="stat-value error">Rp {{ (merchantAnalysis.totalSpend || 0).toLocaleString('id-ID') }}</span>
                      </div>
                      <div class="stat-card card-md3">
                         <span class="stat-label">JUMLAH TRANSAKSI</span>
                         <span class="stat-value">{{ merchantAnalysis.txCount }}</span>
                      </div>
                   </div>

                   <p v-if="merchantAnalysis.insight" class="insight-text">
                      <span class="material-symbols-rounded">bolt</span>
                      {{ merchantAnalysis.insight }}
                   </p>

                   <div v-if="merchantAnalysis.topItems.length > 0" class="items-section">
                      <span class="section-label">PAYLOAD FREQUENCY</span>
                      <div class="tag-cloud">
                         <div v-for="item in merchantAnalysis.topItems" :key="item.name" class="tag-chip">
                            {{ item.name }} <span class="tag-count">x{{ item.count }}</span>
                         </div>
                      </div>
                   </div>

                   <!-- History List -->
                   <div class="history-section">
                      <span class="section-label">CHRONOLOGICAL LOGS</span>
                      <div class="mini-logs">
                         <div v-for="t in merchantAnalysis.recentTxs" :key="t.transactionID" class="mini-log-item">
                            <div class="log-left">
                               <span class="log-title">{{ t.itemName }}</span>
                               <span class="log-sub">{{ t.date }}</span>
                            </div>
                            <span class="log-amount">-Rp {{ (t.total || 0).toLocaleString('id-ID') }}</span>
                         </div>
                      </div>
                   </div>

                   <div class="action-grid">
                      <button @click="modalMode = 'edit'" class="tonal-btn-lg">
                         <span class="material-symbols-rounded">edit</span>
                         UBAH
                      </button>
                      <button @click="isModalOpen = false" class="outline-btn-lg">TUTUP</button>
                   </div>
                </div>

                <!-- MODE: EDIT -->
                <div v-else class="edit-view">
                   <div class="form-grid">
                      <div class="form-group full"><label>Nama Toko/Vendor</label><input type="text" v-model="formData.merchantName" class="md-input"></div>
                      <div class="form-group"><label>Kategori</label><input type="text" v-model="formData.category" class="md-input"></div>
                      <div class="form-group">
                         <label>Status</label>
                         <select v-model="formData.status" class="md-input">
                            <option>Active</option><option>Inactive</option>
                         </select>
                      </div>
                      <div class="form-group"><label>Telepon</label><input type="text" v-model="formData.phone" class="md-input"></div>
                      <div class="form-group"><label>Email</label><input type="email" v-model="formData.email" class="md-input"></div>
                      <div class="form-group full"><label>Alamat</label><textarea v-model="formData.address" class="md-textarea"></textarea></div>
                      <div class="form-group full"><label>Situs Web</label><input type="text" v-model="formData.website" class="md-input"></div>
                      <div class="form-group full"><label>URL Logo</label><input type="text" v-model="formData.merchantImage" class="md-input"></div>
                      <div class="form-group full"><label>Catatan</label><textarea v-model="formData.notes" class="md-textarea"></textarea></div>
                   </div>

                   <div class="modal-actions">
                      <button @click="saveMerchant" class="filled-btn-lg">
                         <span class="material-symbols-rounded">save</span>
                         SAVE VENDOR
                      </button>
                      <div v-if="editingMerchant.merchantID" class="secondary-actions">
                         <button @click="handleDuplicate" class="tonal-btn">Duplicate</button>
                         <button @click="handleMerge" class="tonal-btn">Merge</button>
                         <button @click="deleteMerchant" class="error-btn">Purge</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Merge Panel -->
    <Teleport to="body">
       <div v-if="isMergePanelOpen" class="modal-backdrop-full" @click.self="isMergePanelOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Consolidate Nodes</h3>
                <button @click="isMergePanelOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             <div class="sheet-content">
                <p class="sheet-tip">Select target provider for <b>{{ editingMerchant.merchantName }}</b> logs.</p>
                <div class="search-box card-md3">
                   <span class="material-symbols-rounded">search</span>
                   <input v-model="mergeTargetSearch" type="text" placeholder="Search target vendors...">
                </div>
                <div class="target-list">
                   <div v-for="t in filteredMergeTargets" :key="t.merchantID" @click="performMerge(t)" class="target-item card-md3">
                      <div class="target-avatar">{{ String(t.merchantName)[0] }}</div>
                      <span>{{ t.merchantName }}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const editingMerchant = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')
const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')

const merchantAnalysis = computed(() => {
  if (!editingMerchant.value.merchantID) return { totalSpend: 0, txCount: 0, topItems: [], recentTxs: [], members: [], vouchers: [], insight: '' }
  const name = editingMerchant.value.merchantName
  const txs = store.transactions.filter(t => t.merchant === name)
  const totalSpend = txs.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const txCount = txs.length
  const itemMap = txs.reduce((acc, t) => { acc[t.itemName] = (acc[t.itemName] || 0) + 1; return acc }, {})
  const topItems = Object.entries(itemMap).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
  const recentTxs = [...txs].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5)
  let insight = txCount > 10 ? 'Strategic partner node.' : 'Emerging operational node.'
  return { totalSpend, txCount, topItems, recentTxs, insight }
})

const filteredMerchants = computed(() => {
  if (!searchQuery.value) return store.merchants
  const q = searchQuery.value.toLowerCase()
  return store.merchants.filter(m => (m.merchantName || '').toLowerCase().includes(q))
})

const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.merchants.filter(m => m.merchantID !== editingMerchant.value.merchantID && (m.merchantName || '').toLowerCase().includes(q))
})

const openModal = (m) => {
  if (m) { editingMerchant.value = { ...m }; formData.value = { ...m }; modalMode.value = 'analysis' }
  else { editingMerchant.value = {}; formData.value = { merchantName: '', category: 'General', status: 'Active', phone: '', email: '', address: '', website: '', notes: '', merchantImage: '' }; modalMode.value = 'edit' }
  isModalOpen.value = true
}

const saveMerchant = () => {
  if (!formData.value.merchantName) return alert('Name required')
  if (editingMerchant.value.merchantID) store.updateMerchant({ ...formData.value })
  else store.addMerchant({ ...formData.value })
  isModalOpen.value = false
}

const deleteMerchant = () => { if (confirm('Purge this record?')) { store.deleteMerchant(editingMerchant.value.merchantID); isModalOpen.value = false } }
const handleDuplicate = () => { const data = { ...formData.value }; delete data.merchantID; editingMerchant.value = {}; formData.value = data }
const handleMerge = () => { isMergePanelOpen.value = true }

const performMerge = (target) => {
  if (confirm(`Consolidate "${editingMerchant.value.merchantName}" into "${target.merchantName}"?`)) {
    store.mergeEntities('merchants', editingMerchant.value.merchantName, target.merchantName)
    isMergePanelOpen.value = false; isModalOpen.value = false
  }
}

const getInitColor = (name) => {
  const colors = ['#A8C7FA', '#BEC6DC', '#DEBCDF', '#B4E8A8', '#F2B8B5', '#82D3D0']
  return colors[String(name).length % colors.length]
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('merchants')
  else uiStore.unregisterModal('merchants')
})

onBeforeUnmount(() => { uiStore.unregisterModal('merchants') })
</script>

<style scoped>
.merchants-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.top-app-bar {
  padding-top: max(env(safe-area-inset-top), 16px);
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}
.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 22px; font-weight: 400; margin: 0; }
.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.search-input-field { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 16px; outline: none; }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 120px 16px; }
.merchant-list { display: flex; flex-direction: column; gap: 12px; }
.merchant-item { display: flex; align-items: center; gap: 16px; padding: 16px; cursor: pointer; }
.merchant-icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; }
.merchant-info { flex: 1; display: flex; flex-direction: column; }
.merchant-name { font-size: 16px; font-weight: 500; }
.merchant-meta { font-size: 12px; color: var(--on-surface-variant); }
.status-chip { font-size: 10px; padding: 2px 8px; border-radius: 12px; background: var(--surface-variant); color: var(--on-surface-variant); }

.fab { position: fixed; bottom: 32px; right: 32px; width: 56px; height: 56px; border-radius: 16px; background-color: var(--primary); color: var(--on-primary); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 1000; cursor: pointer; }

.modal-backdrop-full { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 4000; display: flex; align-items: flex-end; }
.bottom-sheet { width: 100%; background-color: var(--bg-primary); border-radius: 28px 28px 0 0; padding: 8px 16px 32px 16px; max-height: 90vh; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 24px; }

.analysis-view { display: flex; flex-direction: column; gap: 24px; }
.analysis-hero { display: flex; align-items: center; gap: 20px; }
.hero-avatar { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; background: var(--surface-variant); overflow: hidden; }
.hero-img { width: 100%; height: 100%; object-fit: contain; }
.hero-initial { font-size: 32px; font-weight: 800; color: var(--primary); }
.hero-title { font-size: 24px; font-weight: 600; margin: 0; }
.hero-site { font-size: 13px; color: var(--primary); font-weight: 500; }

.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-card { padding: 16px; display: flex; flex-direction: column; gap: 4px; }
.stat-card.tonal { background-color: var(--primary-container); color: var(--on-primary-container); border: none; }
.stat-label { font-size: 10px; font-weight: 700; opacity: 0.6; }
.stat-value { font-size: 18px; font-weight: 700; }
.stat-value.error { color: var(--error); }

.insight-text { font-size: 13px; color: var(--on-surface-variant); display: flex; align-items: center; gap: 8px; margin: 0; padding: 12px; background: var(--surface-variant); border-radius: 12px; }
.section-label { font-size: 11px; font-weight: 700; color: var(--primary); letter-spacing: 1px; margin-bottom: 12px; display: block; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-chip { padding: 6px 12px; background: var(--surface-variant); border-radius: 8px; font-size: 13px; }
.tag-count { opacity: 0.5; margin-left: 4px; }

.mini-logs { display: flex; flex-direction: column; gap: 8px; }
.mini-log-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(0,0,0,0.1); border-radius: 12px; }
.log-left { display: flex; flex-direction: column; }
.log-title { font-size: 14px; font-weight: 600; }
.log-sub { font-size: 11px; opacity: 0.5; }
.log-amount { font-size: 14px; font-weight: 700; color: var(--error); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }
.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.modal-actions { display: flex; flex-direction: column; gap: 16px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; width: 100%; }
.tonal-btn-lg { background-color: var(--primary-container); color: var(--on-primary-container); border: none; border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; }
.outline-btn-lg { background-color: transparent; border: 1px solid var(--outline); color: var(--on-surface); border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.target-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.target-item { display: flex; align-items: center; gap: 12px; padding: 12px; cursor: pointer; }
.target-avatar { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-container); color: var(--on-primary-container); display: flex; align-items: center; justify-content: center; font-weight: 700; }
.search-box { display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 48px; margin-bottom: 12px; }
.search-box input { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 14px; outline: none; }
.sheet-tip { font-size: 12px; color: var(--on-surface-variant); margin-bottom: 16px; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
