<template>
  <div class="view-content budget-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Anggaran</h1>
          <div class="app-bar-actions">
            <button class="icon-btn" @click="showSearch = true">
              <span class="material-symbols-rounded">search</span>
            </button>
            <button class="tonal-btn" @click="openModal(null)">
              <span class="material-symbols-rounded">add</span>
              Baru
            </button>
          </div>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Cari anggaran..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="budget-list">
        <div class="wealth-card">
          <span class="wealth-label">TOTAL ANGGARAN</span>
          <h2 class="wealth-amount">Rp {{ totalBudget.toLocaleString('id-ID') }}</h2>
          <span class="wealth-sub">{{ (store.budgets || []).length }} kategori aktif</span>
        </div>
        <div v-for="b in filteredBudgets" :key="b.budgetID" @click="openModal(b)" class="budget-card card-md3">
           <div class="card-head">
              <div class="head-left">
                 <span class="budget-meta">{{ b.period }} • {{ b.category }}</span>
                 <h2 class="budget-amount">{{ b.currency }} {{ (b.amount || 0).toLocaleString('id-ID') }}</h2>
              </div>
              <span class="status-badge" :class="b.status.toLowerCase()">{{ b.status }}</span>
           </div>
           
           <div class="progress-section">
              <div class="progress-track">
                 <div class="progress-fill" :style="{ width: calculateProgress(b) + '%', backgroundColor: getProgressColor(b) }"></div>
              </div>
              <div class="budget-progress-info">
                 <span class="spent-text">Terpakai Rp {{ getSpent(b).toLocaleString('id-ID') }}</span>
                 <span class="percent-text">{{ calculateProgress(b) }}%</span>
              </div>
           </div>
           <div class="budget-status">
              <span v-if="getSpent(b) < b.amount" class="status-chip safe">Aman</span>
              <span v-else class="status-chip danger">Melebihi Batas</span>
           </div>
        </div>
      </div>

      <div v-if="filteredBudgets.length === 0" class="empty-state">
        <span class="material-symbols-rounded">pie_chart</span>
        <p>Belum ada anggaran yang diatur.</p>
      </div>
    </div>

    <!-- FAB Removed -->

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ editingBud.budgetID ? 'Ubah Anggaran' : 'Tambah Anggaran' }}</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <div class="form-grid">
                   <div class="form-group full">
                      <label>Kategori</label>
                      <input type="text" v-model="formData.category" list="cat-list" class="md-input">
                   </div>
                   <div class="form-group full">
                      <label>Periode</label>
                      <select v-model="formData.period" class="md-input">
                         <option>Bulanan</option><option>Mingguan</option><option>Tahunan</option><option>Proyek Khusus</option>
                      </select>
                   </div>
                   <div class="form-group"><label>Alokasi</label><input type="number" v-model.number="formData.amount" class="md-input"></div>
                   <div class="form-group"><label>Mata Uang</label><input type="text" v-model="formData.currency" class="md-input"></div>
                   <div class="form-group full">
                      <label>Status</label>
                      <select v-model="formData.status" class="md-input">
                         <option>Aktif</option><option>Jeda</option><option>Selesai</option>
                      </select>
                   </div>
                   <div class="form-group full"><label>Catatan</label><textarea v-model="formData.notes" class="md-textarea"></textarea></div>
                </div>

                <div class="modal-actions">
                   <button @click="saveBud" class="filled-btn-lg">
                      <span class="material-symbols-rounded">save</span>
                      SIMPAN ANGGARAN
                   </button>
                   <div v-if="editingBud.budgetID" class="secondary-actions">
                      <button @click="handleDuplicate" class="tonal-btn">Duplikat</button>
                      <button @click="handleMerge" class="tonal-btn">Gabung</button>
                      <button @click="deleteBud" class="error-btn">Hapus</button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Merge Layer -->
    <Teleport to="body">
       <div v-if="isMergePanelOpen" class="modal-backdrop-full" @click.self="isMergePanelOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Gabungkan Anggaran</h3>
                <button @click="isMergePanelOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             <div class="sheet-content">
                <div class="search-box card-md3">
                   <span class="material-symbols-rounded">search</span>
                   <input v-model="mergeTargetSearch" type="text" placeholder="Cari kategori anggaran...">
                </div>
                <div class="target-list">
                   <div v-for="t in filteredMergeTargets" :key="t.budgetID" @click="performMerge(t)" class="target-item card-md3">
                      <span class="material-symbols-rounded">account_balance</span>
                      <div class="target-info">
                         <span class="name">{{ t.category }}</span>
                         <span class="sub">{{ t.period }} • Rp {{ (t.amount || 0).toLocaleString('id-ID') }}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <datalist id="cat-list">
       <option v-for="c in store.categories" :key="c.categoryID" :value="c.category" />
    </datalist>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const editingBud = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')
const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')

const totalBudget = computed(() => {
  if (!Array.isArray(store.budgets)) return 0
  return store.budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
})

const filteredBudgets = computed(() => {
  if (!searchQuery.value) return store.budgets
  const q = searchQuery.value.toLowerCase()
  return store.budgets.filter(b => (b.category || '').toLowerCase().includes(q))
})

const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.budgets.filter(b => b.budgetID !== editingBud.value.budgetID && (b.category || '').toLowerCase().includes(q))
})

const openModal = (b) => {
  if (b) { editingBud.value = { ...b }; formData.value = { ...b, amount: Number(b.amount) || 0 } }
  else { editingBud.value = {}; formData.value = { category: '', period: 'Bulanan', amount: 0, currency: 'IDR', status: 'Aktif', notes: '' } }
  isModalOpen.value = true
}

const saveBud = () => {
  if (!formData.value.category) return alert('Kategori wajib diisi')
  if (editingBud.value.budgetID) store.updateBudget({ ...formData.value })
  else store.addBudget({ ...formData.value })
  isModalOpen.value = false
}

const deleteBud = () => { if (confirm('Hapus anggaran ini?')) { store.deleteBudget(editingBud.value.budgetID); isModalOpen.value = false } }
const handleDuplicate = () => { const data = { ...formData.value }; delete data.budgetID; editingBud.value = {}; formData.value = data }
const handleMerge = () => isMergePanelOpen.value = true

const performMerge = (target) => {
  if (!confirm(`Tambahkan alokasi "${editingBud.value.category}" ke "${target.category}"?`)) return
  const updatedTarget = { ...target, amount: (Number(target.amount) || 0) + (Number(editingBud.value.amount) || 0) }
  store.updateBudget(updatedTarget); store.deleteBudget(editingBud.value.budgetID)
  isMergePanelOpen.value = false; isModalOpen.value = false
}

const getSpent = (b) => store.transactions.filter(t => t.category === b.category && t.type === 'Expense').reduce((acc, t) => acc + (t.total || 0), 0)
const calculateProgress = (b) => b.amount ? Math.min(Math.round((getSpent(b) / b.amount) * 100), 100) : 0
const getProgressColor = (b) => { const p = calculateProgress(b); if (p > 90) return 'var(--error)'; if (p > 70) return '#f59e0b'; return 'var(--primary)'; }

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('budget')
  else uiStore.unregisterModal('budget')
})

onBeforeUnmount(() => { uiStore.unregisterModal('budget') })
</script>

<style scoped>
.budget-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
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

.budget-list { display: flex; flex-direction: column; gap: 16px; }
.budget-card { padding: 20px; cursor: pointer; }
.card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.budget-meta { font-size: 10px; font-weight: 700; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 1px; }
.budget-amount { font-size: 22px; font-weight: 500; margin: 4px 0 0 0; }
.status-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; }
.status-badge.active { background: rgba(180, 232, 168, 0.2); color: var(--green); }

.progress-section { display: flex; flex-direction: column; gap: 8px; }
.progress-track { height: 8px; background: var(--surface-variant); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
.progress-labels { display: flex; justify-content: space-between; font-size: 11px; font-weight: 500; opacity: 0.6; }

.fab { position: fixed; bottom: 32px; right: 32px; width: 56px; height: 56px; border-radius: 16px; background-color: var(--primary); color: var(--on-primary); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 1000; cursor: pointer; }

.modal-backdrop-full { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 4000; display: flex; align-items: flex-end; }
.bottom-sheet { width: 100%; background-color: var(--bg-primary); border-radius: 28px 28px 0 0; padding: 8px 16px 32px 16px; max-height: 90vh; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 24px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }
.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.modal-actions { display: flex; flex-direction: column; gap: 16px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }

.search-box { display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px; margin-bottom: 12px; }
.search-box input { flex: 1; background: transparent; border: none; color: white; outline: none; }
.target-list { display: flex; flex-direction: column; gap: 8px; }
.target-item { display: flex; align-items: center; gap: 16px; padding: 12px; cursor: pointer; }
.target-info { display: flex; flex-direction: column; }
.name { font-size: 14px; font-weight: 600; }
.sub { font-size: 11px; opacity: 0.5; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
