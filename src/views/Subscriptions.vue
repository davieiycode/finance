<template>
  <div class="view-content subscriptions-container">
    <!-- Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.push('/')">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>Langganan</h1>
        <div class="app-bar-actions">
          <button class="tonal-btn" @click="openAddModal">
            <span class="material-symbols-rounded">add</span>
            Baru
          </button>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Summary Card -->
      <div class="summary-card card-md3">
        <div class="summary-info">
          <span class="summary-label">Total Pengeluaran Rutin</span>
          <h2 class="summary-value">Rp {{ totalMonthlyCost.toLocaleString('id-ID') }}</h2>
          <span class="summary-sub">per bulan dari {{ store.subscriptions.length }} layanan</span>
        </div>
        <div class="summary-icon">
          <span class="material-symbols-rounded">event_repeat</span>
        </div>
      </div>

      <!-- Subscription List -->
      <div class="sub-list">
        <div v-for="s in sortedSubscriptions" :key="s.subscriptionID" class="sub-item card-md3" @click="openEditModal(s)">
          <div class="sub-main">
            <div class="sub-icon-box" :style="{ background: getStatusColor(s.nextBillDate) + '15', color: getStatusColor(s.nextBillDate) }">
              <span class="material-symbols-rounded">{{ getCategoryIcon(s.category) }}</span>
            </div>
            <div class="sub-info">
              <span class="sub-name">{{ s.name }}</span>
              <span class="sub-meta">{{ s.category }} • Tagihan {{ formatDate(s.nextBillDate) }}</span>
            </div>
            <div class="sub-amount">
              <span class="amount-val">Rp {{ (Number(s.amount) || 0).toLocaleString('id-ID') }}</span>
              <span class="amount-freq">/bln</span>
            </div>
          </div>
          <div class="sub-status-bar">
             <div class="status-chip" :style="{ backgroundColor: getStatusColor(s.nextBillDate) + '20', color: getStatusColor(s.nextBillDate) }">
                <span class="material-symbols-rounded" style="font-size: 14px;">{{ getDaysLeft(s.nextBillDate) <= 3 ? 'warning' : 'schedule' }}</span>
                {{ getStatusText(s.nextBillDate) }}
             </div>
             <div class="progress-bg"><div class="progress-fill" :style="{ width: getProgressWidth(s.nextBillDate) + '%', backgroundColor: getStatusColor(s.nextBillDate) }"></div></div>
          </div>
        </div>

        <div v-if="store.subscriptions.length === 0" class="empty-state">
          <span class="material-symbols-rounded">subscriptions</span>
          <p>Belum ada daftar langganan rutin.</p>
          <button @click="openAddModal" class="tonal-btn">Tambah Langganan</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
       <div v-if="showModal" class="modal-backdrop-full" @click.self="showModal = false">
          <div class="bottom-sheet sub-modal">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ isEditing ? 'Ubah Langganan' : 'Tambah Langganan Baru' }}</h3>
                <button @click="showModal = false" class="icon-btn">
                   <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="form-grid">
                <div class="form-group full">
                   <label>Nama Layanan</label>
                   <input type="text" v-model="formData.name" placeholder="Misal: Netflix, Spotify, Gym..." class="md-input">
                </div>
                <div class="form-group">
                   <label>Kategori</label>
                   <select v-model="formData.category" class="md-input">
                      <option v-for="cat in subCategories" :key="cat" :value="cat">{{ cat }}</option>
                   </select>
                </div>
                <div class="form-group">
                   <label>Biaya (Rp)</label>
                   <input type="number" v-model="formData.amount" placeholder="0" class="md-input">
                </div>
                <div class="form-group full">
                   <label>Tanggal Tagihan Berikutnya</label>
                   <input type="date" v-model="formData.nextBillDate" class="md-input">
                </div>
             </div>

             <div class="modal-actions mt-24">
                <button v-if="isEditing" @click="deleteSub" class="danger-btn">Hapus</button>
                <div class="flex-spacer"></div>
                <button @click="saveSub" class="primary-btn">{{ isEditing ? 'Simpan Perubahan' : 'Tambahkan' }}</button>
             </div>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const showModal = ref(false)
const isEditing = ref(false)
const formData = ref({ subscriptionID: '', name: '', amount: 0, category: 'Entertainment', nextBillDate: '' })

const subCategories = ['Entertainment', 'Productivity', 'Gym/Health', 'Internet', 'Utilities', 'Lainnya']

const totalMonthlyCost = computed(() => {
  return store.subscriptions.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
})

const sortedSubscriptions = computed(() => {
  return [...store.subscriptions].sort((a,b) => new Date(a.nextBillDate) - new Date(b.nextBillDate))
})

const openAddModal = () => {
  isEditing.value = false
  formData.value = { subscriptionID: '', name: '', amount: 0, category: 'Entertainment', nextBillDate: new Date().toISOString().split('T')[0] }
  showModal.value = true
}

const openEditModal = (s) => {
  isEditing.value = true
  formData.value = { ...s }
  showModal.value = true
}

const saveSub = () => {
  if (!formData.value.name || !formData.value.amount) return
  if (isEditing.value) store.updateSubscription(formData.value)
  else store.addSubscription(formData.value)
  showModal.value = false
}

const deleteSub = () => {
  if (confirm('Hapus data langganan ini?')) {
    store.deleteSubscription(formData.value.subscriptionID)
    showModal.value = false
  }
}

const getDaysLeft = (dateStr) => {
  if (!dateStr) return 0
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getStatusColor = (dateStr) => {
  const days = getDaysLeft(dateStr)
  if (days <= 3) return 'var(--red)'
  if (days <= 7) return 'var(--amber)'
  return 'var(--green)'
}

const getStatusText = (dateStr) => {
  const days = getDaysLeft(dateStr)
  if (days < 0) return 'Sudah Lewat'
  if (days === 0) return 'Tagihan Hari Ini'
  return `${days} hari lagi`
}

const getProgressWidth = (dateStr) => {
  const days = getDaysLeft(dateStr)
  if (days < 0) return 100
  if (days > 30) return 0
  return ((30 - days) / 30) * 100
}

const getCategoryIcon = (cat) => {
  const map = {
    'Entertainment': 'movie',
    'Productivity': 'auto_stories',
    'Gym/Health': 'fitness_center',
    'Internet': 'wifi',
    'Utilities': 'bolt',
    'Lainnya': 'more_horiz'
  }
  return map[cat] || 'subscriptions'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.subscriptions-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px 16px;
}

.summary-card {
  padding: 24px;
  background: linear-gradient(135deg, var(--secondary-container), var(--bg-secondary));
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.summary-label { font-size: 12px; font-weight: 600; color: var(--primary); opacity: 0.8; text-transform: uppercase; }
.summary-value { font-size: 28px; font-weight: 700; margin: 4px 0; font-family: 'Outfit', sans-serif; }
.summary-sub { font-size: 11px; opacity: 0.6; }
.summary-icon { width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

.sub-list { display: flex; flex-direction: column; gap: 12px; }
.sub-item { padding: 16px; cursor: pointer; transition: transform 0.2s; }
.sub-item:active { transform: scale(0.98); }

.sub-main { display: flex; align-items: center; gap: 12px; }
.sub-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.sub-info { flex: 1; display: flex; flex-direction: column; }
.sub-name { font-size: 16px; font-weight: 600; }
.sub-meta { font-size: 11px; opacity: 0.6; }
.sub-amount { text-align: right; }
.amount-val { display: block; font-size: 15px; font-weight: 700; }
.amount-freq { font-size: 10px; opacity: 0.5; }

.sub-status-bar { margin-top: 12px; display: flex; align-items: center; gap: 12px; }
.status-chip { display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 8px; }
.progress-bg { flex: 1; height: 4px; background: var(--surface-variant); border-radius: 2px; }
.progress-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }

.sub-modal { background: var(--bg-primary); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 8px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--on-surface-variant); display: block; margin-bottom: 6px; }

.modal-actions { display: flex; gap: 12px; }
.flex-spacer { flex: 1; }
.mt-24 { margin-top: 24px; }
</style>
