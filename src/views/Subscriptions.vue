<template>
  <div class="view-content subscriptions-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.back()">
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
      <div class="summary-hero card-md3">
        <div class="hero-glow"></div>
        <div class="hero-content">
           <span class="hero-label">TOTAL PENGELUARAN RUTIN</span>
           <h2 class="hero-value">Rp {{ totalMonthlyCost.toLocaleString('id-ID') }}</h2>
           <span class="hero-sub">Mencakup {{ store.subscriptions.length }} layanan aktif per bulan</span>
        </div>
        <div class="hero-icon-box">
           <span class="material-symbols-rounded">event_repeat</span>
        </div>
      </div>

        <!-- Subscription List -->
      <div class="sub-list">
        <div v-for="s in sortedSubscriptions" :key="s.subscriptionID" class="sub-card card-md3" @click="openEditModal(s)">
          <div class="card-main">
            <div class="sub-icon-box" :style="{ backgroundColor: getStatusColor(s.nextBillDate) + '15', color: getStatusColor(s.nextBillDate) }">
              <span class="material-symbols-rounded">{{ getCategoryIcon(s.category) }}</span>
            </div>
            <div class="sub-details">
              <span class="sub-name">{{ s.name }}</span>
              <span class="sub-meta">{{ s.category }} • {{ formatDate(s.nextBillDate) }}</span>
            </div>
            <div class="sub-price">
              <span class="price-val">Rp {{ (Number(s.amount) || 0).toLocaleString('id-ID') }}</span>
              <span class="price-freq">per bulan</span>
            </div>
          </div>
          <div class="card-footer">
             <div class="status-indicator">
                <div class="status-badge" :style="{ backgroundColor: getStatusColor(s.nextBillDate) + '20', color: getStatusColor(s.nextBillDate) }">
                   <span class="dot" :style="{ backgroundColor: getStatusColor(s.nextBillDate) }"></span>
                   {{ getStatusText(s.nextBillDate) }}
                </div>
                <span class="days-count">{{ getDaysLeft(s.nextBillDate) }} hari lagi</span>
             </div>
             <div class="bill-progress">
                <div class="progress-track"><div class="progress-bar" :style="{ width: getProgressWidth(s.nextBillDate) + '%', backgroundColor: getStatusColor(s.nextBillDate) }"></div></div>
             </div>
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
.subscriptions-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 120px 16px; }

.summary-hero {
  padding: 32px 24px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  margin-bottom: 24px;
}
.hero-glow { position: absolute; top: -50%; right: -20%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); }
.hero-content { position: relative; z-index: 1; color: white; }
.hero-label { font-size: 10px; font-weight: 800; letter-spacing: 2px; opacity: 0.8; }
.hero-value { font-size: 32px; font-weight: 800; margin: 4px 0; font-family: 'Outfit', sans-serif; }
.hero-sub { font-size: 11px; opacity: 0.7; }
.hero-icon-box { position: relative; z-index: 1; width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; backdrop-filter: blur(4px); }

.sub-list { display: flex; flex-direction: column; gap: 16px; }
.sub-card { 
  padding: 20px; 
  cursor: pointer; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
}
.sub-card:active { transform: scale(0.98); }

.card-main { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.sub-icon-box { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.sub-details { flex: 1; display: flex; flex-direction: column; }
.sub-name { font-size: 17px; font-weight: 600; color: var(--on-surface); }
.sub-meta { font-size: 12px; color: var(--on-surface-variant); opacity: 0.7; }
.sub-price { text-align: right; }
.price-val { display: block; font-size: 16px; font-weight: 800; color: var(--primary); }
.price-freq { font-size: 10px; font-weight: 600; opacity: 0.5; text-transform: uppercase; }

.card-footer { display: flex; flex-direction: column; gap: 12px; }
.status-indicator { display: flex; justify-content: space-between; align-items: center; }
.status-badge { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
.dot { width: 6px; height: 6px; border-radius: 3px; }
.days-count { font-size: 11px; font-weight: 600; opacity: 0.5; }

.bill-progress { height: 6px; }
.progress-track { height: 6px; background: var(--surface-variant); border-radius: 3px; overflow: hidden; }
.progress-bar { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }

.sub-modal { background: var(--bg-primary); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 8px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 800; color: var(--primary); display: block; margin-bottom: 8px; margin-left: 4px; }
.md-input { background: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 14px; height: 52px; padding: 0 16px; color: var(--on-surface); font-size: 15px; outline: none; transition: border-color 0.2s; }
.md-input:focus { border-color: var(--primary); }

.modal-actions { display: flex; gap: 12px; align-items: center; }
.flex-spacer { flex: 1; }
.mt-24 { margin-top: 24px; }

.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
.empty-state .material-symbols-rounded { font-size: 64px; }
</style>
