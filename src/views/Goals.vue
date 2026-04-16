<template>
  <div class="view-content goals-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Target</h1>
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
          <input type="text" v-model="searchQuery" placeholder="Cari target..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="goals-list">
        <div v-for="g in filteredGoals" :key="g.goalID" @click="openModal(g)" class="goal-card card-md3">
           <div class="card-head">
              <div class="head-left">
                 <h2 class="goal-name">{{ g.goalName }}</h2>
                 <span class="goal-deadline">Batas Waktu: {{ g.deadline || 'Tidak ada' }}</span>
              </div>
              <div class="head-right">
                 <span class="goal-status">{{ g.status }}</span>
                 <span class="goal-target">Rp {{ (g.targetAmount || 0).toLocaleString('id-ID') }}</span>
              </div>
           </div>
           
           <div class="progress-container">
              <div class="progress-info">
                 <span class="percentage">{{ calculateProgress(g) }}%</span>
                 <span class="saved">Rp {{ (g.currentAmount || 0).toLocaleString('id-ID') }} terkumpul</span>
              </div>
              <div class="progress-bar">
                 <div class="bar-fill" :style="{ width: calculateProgress(g) + '%' }">
                    <div class="sweep-effect"></div>
                 </div>
              </div>
           </div>
           
           <div v-if="g.deadline" class="card-foot">
              <span class="material-symbols-rounded timer-icon">schedule</span>
              <span>{{ calculateDaysLeft(g.deadline) }} hari tersisa</span>
           </div>
        </div>
      </div>

      <div v-if="filteredGoals.length === 0" class="empty-state">
        <span class="material-symbols-rounded">target</span>
        <p>Belum ada target tabungan yang dibuat.</p>
      </div>
    </div>

    <!-- FAB Removed -->

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ editingGoal.goalID ? 'Ubah Target' : 'Tambah Target Baru' }}</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <div class="form-grid">
                   <div class="form-group full">
                      <label>Nama Target</label>
                      <input type="text" v-model="formData.goalName" class="md-input" placeholder="Contoh: Beli Laptop">
                   </div>
                   <div class="form-group">
                      <label>Jumlah Target (Rp)</label>
                      <input type="number" v-model.number="formData.targetAmount" class="md-input">
                   </div>
                   <div class="form-group">
                      <label>Sudah Ada (Rp)</label>
                      <input type="number" v-model.number="formData.currentAmount" class="md-input">
                   </div>
                   <div class="form-group">
                      <label>Batas Waktu</label>
                      <input type="date" v-model="formData.deadline" class="md-input">
                   </div>
                   <div class="form-group">
                      <label>Status</label>
                      <select v-model="formData.status" class="md-input">
                         <option>Berjalan</option><option>Ditunda</option><option>Selesai</option><option>Dibatalkan</option>
                      </select>
                   </div>
                   <div class="form-group full"><label>Catatan</label><textarea v-model="formData.notes" class="md-textarea"></textarea></div>
                </div>

                <div class="modal-actions">
                   <button @click="saveGoal" class="filled-btn-lg">
                      <span class="material-symbols-rounded">save</span>
                      SIMPAN TARGET
                   </button>
                   <div v-if="editingGoal.goalID" class="secondary-actions">
                      <button @click="deleteGoal" class="error-btn">Hapus</button>
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const editingGoal = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')

const filteredGoals = computed(() => {
  if (!searchQuery.value) return store.goals
  const q = searchQuery.value.toLowerCase()
  return store.goals.filter(g => (g.goalName || '').toLowerCase().includes(q))
})

const openModal = (g) => {
  if (g) { editingGoal.value = { ...g }; formData.value = { ...g, targetAmount: Number(g.targetAmount) || 0, currentAmount: Number(g.currentAmount) || 0 } }
  else { editingGoal.value = {}; formData.value = { goalName: '', category: 'General', targetAmount: 0, currentAmount: 0, deadline: '', notes: '' } }
  isModalOpen.value = true
}

const saveGoal = () => {
  if (!formData.value.goalName) return alert('Name required')
  if (editingGoal.value.goalID) store.updateGoal({ ...formData.value })
  else store.addGoal({ ...formData.value })
  isModalOpen.value = false
}

const deleteGoal = () => { if (confirm('Hapus target ini secara permanen?')) { store.deleteGoal(editingGoal.value.goalID); isModalOpen.value = false } }
const handleDuplicate = () => { const data = { ...formData.value }; delete data.goalID; editingGoal.value = {}; formData.value = data }

const calculateProgress = (g) => g.targetAmount ? Math.min(Math.round(((g.currentAmount || 0) / g.targetAmount) * 100), 100) : 0
const calculateDaysLeft = (deadline) => deadline ? Math.max(Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)), 0) : 0

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('goals')
  else uiStore.unregisterModal('goals')
})

onBeforeUnmount(() => { uiStore.unregisterModal('goals') })
</script>

<style scoped>
.goals-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.top-app-bar { padding: env(safe-area-inset-top) 16px 8px 16px; background-color: var(--bg-primary); border-bottom: 1px solid var(--border); z-index: 100; }
.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 22px; font-weight: 400; margin: 0; }
.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.search-input-field { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 16px; outline: none; }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px; }

.goals-list { display: flex; flex-direction: column; gap: 16px; }
.goal-card { padding: 24px; cursor: pointer; display: flex; flex-direction: column; gap: 20px; }

.card-head { display: flex; justify-content: space-between; align-items: flex-start; }
.head-left { display: flex; flex-direction: column; gap: 4px; }
.goal-name { font-size: 18px; font-weight: 600; margin: 0; }
.goal-deadline { font-size: 11px; color: var(--on-surface-variant); }

.head-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.goal-status { font-size: 9px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
.goal-target { font-size: 15px; font-weight: 700; }

.progress-container { display: flex; flex-direction: column; gap: 8px; }
.progress-info { display: flex; justify-content: space-between; align-items: flex-end; }
.percentage { font-size: 24px; font-weight: 800; color: var(--on-surface); }
.saved { font-size: 11px; font-weight: 500; opacity: 0.6; }

.progress-bar { height: 12px; background: var(--surface-variant); border-radius: 6px; overflow: hidden; border: 1px solid var(--outline-variant); }
.bar-fill { height: 100%; background: var(--primary); position: relative; border-radius: 6px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
.sweep-effect { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: sweep 2s infinite; }

.card-foot { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; opacity: 0.4; justify-content: center; }
.timer-icon { font-size: 14px; }

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
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }

@keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
